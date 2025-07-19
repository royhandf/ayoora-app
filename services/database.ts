import * as SQLite from "expo-sqlite";

export type Activity = {
  id: number;
  kategori: string;
  waktu: string;
  deskripsi: string;
  tanggal: string;
};

const getDb = (() => {
  let dbInstance: SQLite.SQLiteDatabase | null = null;
  return async (): Promise<SQLite.SQLiteDatabase> => {
    if (dbInstance) {
      return dbInstance;
    }
    dbInstance = await SQLite.openDatabaseAsync("ayoora.db");
    return dbInstance;
  };
})();

export const initDB = async () => {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY NOT NULL,
      kategori TEXT NOT NULL,
      waktu TEXT NOT NULL,
      deskripsi TEXT,
      tanggal TEXT NOT NULL
    );
  `);
};

export const addActivities = async (activities: Omit<Activity, "id">[]) => {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    for (const activity of activities) {
      const existingActivity = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM activities WHERE tanggal = ? AND waktu = ?",
        [activity.tanggal, activity.waktu]
      );

      if (existingActivity && existingActivity.count > 0) {
        throw new Error(
          `Jadwal bentrok! Anda sudah memiliki kegiatan pada jam ${activity.waktu}.`
        );
      }

      await db.runAsync(
        "INSERT INTO activities (kategori, waktu, deskripsi, tanggal) VALUES (?, ?, ?, ?);",
        [
          activity.kategori,
          activity.waktu,
          activity.deskripsi,
          activity.tanggal,
        ]
      );
    }
  });
};

export const getActivitiesForDate = async (
  date: string
): Promise<Activity[]> => {
  const db = await getDb();
  return await db.getAllAsync<Activity>(
    "SELECT * FROM activities WHERE tanggal = ? ORDER BY waktu ASC;",
    [date]
  );
};

export const getWeeklySummary = async (): Promise<
  { day: string; count: number }[]
> => {
  const db = await getDb();

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);

  const activities = await db.getAllAsync<Pick<Activity, "tanggal">>(
    "SELECT tanggal FROM activities WHERE tanggal BETWEEN ? AND ?",
    [formatDate(startDate), formatDate(endDate)]
  );

  const countsByDate: { [key: string]: number } = {};
  activities.forEach((activity) => {
    countsByDate[activity.tanggal] = (countsByDate[activity.tanggal] || 0) + 1;
  });

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const result: { day: string; count: number }[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(endDate.getDate() - (6 - i));

    const formattedDate = formatDate(date);
    const dayName = dayNames[date.getDay()];

    result.push({
      day: dayName,
      count: countsByDate[formattedDate] || 0,
    });
  }

  return result;
};

export const getFirstActivityDate = async (): Promise<string | null> => {
  const db = await getDb();
  const result = await db.getFirstAsync<{ tanggal: string }>(
    "SELECT tanggal FROM activities ORDER BY tanggal ASC LIMIT 1"
  );
  return result ? result.tanggal : null;
};
