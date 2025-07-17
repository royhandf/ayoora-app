import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Activity = {
  title: string;
  time: string;
};
const DUMMY_ACTIVITIES: { [key: string]: Activity[] } = {
  "2024-05-05": [
    { title: "Morning Meditation", time: "09:00" },
    { title: "Light Exercise", time: "10:00" },
    { title: "Healthy Lunch", time: "12:00" },
  ],
  "2024-05-10": [
    { title: "Team Meeting", time: "10:00" },
    { title: "Project Brainstorming", time: "11:00" },
  ],
  "2024-05-15": [{ title: "Reading a Book", time: "20:00" }],
};

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

  const [currentDate, setCurrentDate] = useState(new Date("2024-05-01"));
  const [selectedDate, setSelectedDate] = useState(new Date("2024-05-15"));

  const changeMonth = (amount: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderCalendar = () => {
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
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.calendarMonth}>{`${monthName} ${year}`}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.weekDays}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <Text key={day + index} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.daysGrid}>{days}</View>
      </View>
    );
  };

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const selectedDateString = `${year}-${month}-${day}`;
  const activitiesForSelectedDate = DUMMY_ACTIVITIES[selectedDateString] || [];

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
          {activitiesForSelectedDate.length > 0 ? (
            activitiesForSelectedDate.map((activity) => (
              <ActivityHistoryItem
                key={activity.title + activity.time}
                title={activity.title}
                time={activity.time}
                styles={styles}
              />
            ))
          ) : (
            <Text style={styles.noActivityText}>
              No activities recorded for this day.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
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
      marginTop: 20,
      fontSize: 16,
    },
  });

export default HistoryScreen;
