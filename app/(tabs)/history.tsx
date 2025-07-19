// File: (tabs)/history.tsx atau di mana pun HistoryScreen berada

import {
  Activity,
  getActivitiesForDate,
  getFirstActivityDate,
} from "@/services/database";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Komponen ActivityHistoryItem tetap sama
const ActivityHistoryItem = ({
  title,
  time,
  styles,
}: {
  title: string;
  time: string;
  styles: any;
}) => (
  <View style={styles.activityItem}>
    <View style={styles.textContainer}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </View>
);

const HistoryScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk menyimpan batas navigasi kalender
  const [firstActivityDate, setFirstActivityDate] = useState<Date | null>(null);

  // useEffect untuk mengambil data kegiatan berdasarkan tanggal yang dipilih
  useEffect(() => {
    const fetchActivities = async () => {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const selectedDateString = `${year}-${month}-${day}`;

      try {
        const data = await getActivitiesForDate(selectedDateString);
        setActivities(data);
      } catch (error) {
        console.error("Gagal mengambil kegiatan:", error);
      }
    };

    fetchActivities();
  }, [selectedDate]);

  // useEffect untuk mengambil tanggal pertama saat komponen dimuat
  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        const firstDateStr = await getFirstActivityDate();
        if (firstDateStr) {
          // Konversi YYYY-MM-DD ke objek Date dengan aman
          const [year, month, day] = firstDateStr.split("-").map(Number);
          setFirstActivityDate(new Date(year, month - 1, day));
        }
      } catch (error) {
        console.error("Gagal mengambil tanggal pertama:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoundaries();
  }, []);

  const changeMonth = (amount: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  // Logika untuk menonaktifkan tombol navigasi
  const canGoBack = useMemo(() => {
    if (!firstActivityDate) return true; // Jika tidak ada data, izinkan navigasi
    const firstMonth = new Date(
      firstActivityDate.getFullYear(),
      firstActivityDate.getMonth(),
      1
    );
    const currentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    return currentMonth > firstMonth;
  }, [currentDate, firstActivityDate]);

  const canGoForward = useMemo(() => {
    const today = new Date();
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    return nextMonth <= new Date(today.getFullYear(), today.getMonth() + 1, 1);
  }, [currentDate]);

  const renderCalendar = () => {
    // ... (logika render kalender tetap sama)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleString("id-ID", { month: "long" });

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      days.push(
        <TouchableOpacity
          key={day}
          style={styles.dayCell}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => canGoBack && changeMonth(-1)}
            disabled={!canGoBack}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={canGoBack ? theme.colors.text : "gray"}
            />
          </TouchableOpacity>
          <Text style={styles.calendarMonth}>{`${monthName} ${year}`}</Text>
          <TouchableOpacity
            onPress={() => canGoForward && changeMonth(1)}
            disabled={!canGoForward}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={canGoForward ? theme.colors.text : "gray"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.weekDays}>
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
            (day, index) => (
              <Text key={day + index} style={styles.weekDayText}>
                {day.slice(0, 1)}
              </Text>
            )
          )}
        </View>
        <View style={styles.daysGrid}>{days}</View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centeredLoader}>
        <ActivityIndicator size="large" color="#FDB100" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {renderCalendar()}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kegiatan</Text>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityHistoryItem
                key={activity.id}
                title={activity.kategori}
                time={activity.waktu}
                styles={styles}
              />
            ))
          ) : (
            <Text style={styles.noActivityText}>
              Tidak ada kegiatan tercatat pada tanggal ini.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    // ... (semua style lain tetap sama)
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { paddingHorizontal: 20 },
    section: { marginTop: 20 },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
    },
    calendarContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
      marginTop: 10,
    },
    calendarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    calendarMonth: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    weekDays: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 8,
    },
    weekDayText: {
      color: "gray",
      fontWeight: "bold",
      width: `${100 / 7}%`,
      textAlign: "center",
    },
    daysGrid: { flexDirection: "row", flexWrap: "wrap" },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    dayText: {
      color: theme.colors.text,
      fontSize: 16,
      width: 36,
      height: 36,
      textAlign: "center",
      textAlignVertical: "center",
      lineHeight: 36,
    },
    dayTextSelected: {
      backgroundColor: "#FDB100",
      color: "white",
      fontWeight: "bold",
      borderRadius: 18,
      overflow: "hidden",
    },
    activityItem: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    textContainer: { flex: 1 },
    activityTitle: {
      color: theme.colors.text,
      fontSize: 17,
      fontWeight: "bold",
    },
    activityTime: { color: "gray", fontSize: 14, marginTop: 4 },
    noActivityText: {
      textAlign: "center",
      color: "gray",
      fontSize: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    centeredLoader: { flex: 1, justifyContent: "center", alignItems: "center" },
  });

export default HistoryScreen;
