import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share, // 1. Import Share API
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- DATA DUMMY & TIPE (Tidak ada perubahan) ---
type WeeklyActivity = {
  day: string;
  count: number;
};
const WEEKLY_DATA: WeeklyActivity[] = [
  { day: "Senin", count: 8 },
  { day: "Selasa", count: 2 },
  { day: "Rabu", count: 5 },
  { day: "Kamis", count: 9 },
  { day: "Jumat", count: 10 },
  { day: "Sabtu", count: 9 },
  { day: "Minggu", count: 8 },
];
const maxValue = Math.max(...WEEKLY_DATA.map((d) => d.count), 1);
const MOTIVATIONAL_QUOTE =
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.";

// --- KOMPONEN KECIL (Tidak ada perubahan) ---
const BarChart = ({
  data,
  styles,
  selectedDay,
  onSelectDay,
}: {
  data: WeeklyActivity[];
  styles: any;
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
}) => (
  <View style={styles.barChartContainer}>
    {data.map((item) => {
      const isSelected = selectedDay === item.day;
      const barHeight = (item.count / maxValue) * 100;
      return (
        <TouchableOpacity
          key={item.day}
          style={styles.barWrapper}
          onPress={() => onSelectDay(item.day)}
          activeOpacity={0.8}
        >
          {isSelected && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{item.count}</Text>
            </View>
          )}
          <View
            style={[
              styles.bar,
              isSelected && styles.barSelected,
              { height: `${barHeight}%` },
            ]}
          />
          <Text
            style={[styles.barLabel, isSelected && styles.barLabelSelected]}
          >
            {item.day}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// --- KOMPONEN UTAMA ---
const SummaryScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const [selectedDay, setSelectedDay] = useState<string | null>("Wed");

  // 2. Perbarui fungsi onShare
  const onShare = async () => {
    try {
      // Siapkan pesan yang akan dibagikan
      const messageToShare = `My Weekly Summary on Ayoora:\n\n- Total Activities: ${WEEKLY_DATA.reduce(
        (sum, item) => sum + item.count,
        0
      )}\n- Motivation: "${MOTIVATIONAL_QUOTE}"\n\nGet productive with Ayoora!`;

      const result = await Share.share({
        message: messageToShare,
        title: "Ayoora Weekly Summary", // Opsional, untuk subjek email
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // dibagikan dengan activity type
          console.log("Shared with activity type:", result.activityType);
        } else {
          // dibagikan
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // dibatalkan
        console.log("Share dismissed");
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aktivitas Minggu Ini</Text>
          <Text style={styles.largeNumber}>
            {WEEKLY_DATA.reduce((sum, item) => sum + item.count, 0)}
          </Text>
          <Text style={styles.subtitle}>7 Hari Terakhir</Text>
          <BarChart
            data={WEEKLY_DATA}
            styles={styles}
            selectedDay={selectedDay}
            onSelectDay={(day) =>
              setSelectedDay(day === selectedDay ? null : day)
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivasi</Text>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>
              &quot;{MOTIVATIONAL_QUOTE}&quot;
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={20} color="white" />
          <Text style={styles.shareButtonText}>Bagikan Ringkasan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLESHEET (Tidak ada perubahan) ---
const getStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { paddingHorizontal: 20, paddingTop: 16 },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    cardTitle: { fontSize: 16, fontWeight: "600", color: "gray" },
    largeNumber: {
      fontSize: 48,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: 4,
    },
    subtitle: { fontSize: 14, color: "gray", marginBottom: 24 },
    section: { marginBottom: 20 },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    barChartContainer: {
      flexDirection: "row",
      height: 150,
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    barWrapper: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
    bar: {
      width: "60%",
      backgroundColor: "#FDB100",
      borderRadius: 6,
      minHeight: 4,
    },
    barSelected: { backgroundColor: "#fd8300ff" },
    barLabel: { marginTop: 8, fontSize: 12, color: "gray" },
    tooltip: {
      backgroundColor: "#333",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginBottom: 5,
    },
    tooltipText: { color: "white", fontWeight: "bold", fontSize: 12 },
    quoteContainer: {
      backgroundColor: theme.colors.card,
      padding: 20,
      borderRadius: 12,
    },
    quoteText: {
      fontSize: 16,
      color: theme.colors.text,
      fontStyle: "italic",
      lineHeight: 24,
    },
    shareButton: {
      flexDirection: "row",
      backgroundColor: "#FDB100",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
      borderRadius: 12,
      marginTop: 8,
    },
    shareButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
    },
  });

export default SummaryScreen;
