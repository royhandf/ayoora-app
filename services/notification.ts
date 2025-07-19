import * as Notifications from "expo-notifications";

const { SchedulableTriggerInputTypes } = Notifications;

const DAILY_REMINDER_ID = "daily-activity-reminder";
const WEEKLY_REMINDER_ID = "weekly-summary-reminder";

Notifications.setNotificationHandler({
  handleNotification:
    async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
});

/**
 *
 * @returns {Promise<Notifications.PermissionStatus>} Status izin ('granted', 'denied', atau 'undetermined').
 */
export async function getNotificationPermissionsStatus() {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

/**
 *
 * @returns {Promise<Notifications.PermissionStatus>} Status izin baru setelah pengguna memilih.
 */
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  await cancelDailyReminder();
  console.log(`Menjadwalkan notifikasi harian untuk jam ${hour}:${minute}`);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Jangan Lupa Catat Kegiatanmu! 💡",
      body: "Ayo, catat apa saja yang sudah kamu lakukan hari ini.",
      sound: "default",
    },
    trigger: {
      type: SchedulableTriggerInputTypes.CALENDAR,
      hour: hour,
      minute: minute,
      repeats: true,
    },
    identifier: DAILY_REMINDER_ID,
  });
}

export async function cancelDailyReminder() {
  console.log("Membatalkan notifikasi harian.");
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
}
export async function scheduleWeeklyReminder(
  weekday: number,
  hour: number,
  minute: number
) {
  await cancelWeeklyReminder();
  console.log(
    `Menjadwalkan notifikasi mingguan untuk hari ${weekday} jam ${hour}:${minute}`
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Ringkasan Mingguanmu Sudah Siap! 🇮🇩",
      body: "Lihat pencapaian dan progres kegiatanmu selama seminggu terakhir.",
      sound: "default",
    },
    trigger: {
      type: SchedulableTriggerInputTypes.CALENDAR,
      weekday: weekday,
      hour: hour,
      minute: minute,
      repeats: true,
    },
    identifier: WEEKLY_REMINDER_ID,
  });
}

export async function cancelWeeklyReminder() {
  console.log("Membatalkan notifikasi mingguan.");
  await Notifications.cancelScheduledNotificationAsync(WEEKLY_REMINDER_ID);
}
