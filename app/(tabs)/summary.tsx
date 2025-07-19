import { getWeeklySummary } from "@/services/database";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type WeeklyActivity = {
  day: string;
  count: number;
};

const MOTIVATIONAL_QUOTE =
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.";

const BarChart = ({
  data,
  styles,
  selectedDay,
  onSelectDay,
  maxValue,
}: {
  data: WeeklyActivity[];
  styles: any;
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
  maxValue: number;
}) => (
  <View style={styles.barChartContainer}>
    {data.map((item) => {
      const isSelected = selectedDay === item.day;
      const barHeight = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
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

const SummaryScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [weeklyData, setWeeklyData] = useState<WeeklyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchSummary = async () => {
        try {
          setIsLoading(true);
          const summaryData = await getWeeklySummary();
          setWeeklyData(summaryData);
        } catch (error) {
          console.error("Gagal memuat ringkasan mingguan:", error);
          Alert.alert("Error", "Gagal memuat data ringkasan.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSummary();
    }, [])
  );

  const totalActivities = useMemo(
    () => weeklyData.reduce((sum, item) => sum + item.count, 0),
    [weeklyData]
  );
  const maxValue = useMemo(
    () => Math.max(...weeklyData.map((d) => d.count), 1),
    [weeklyData]
  );

  const onShare = async () => {
    try {
      const messageToShare = `Ringkasan Mingguan Saya di Ayoora:\n\n- Total Kegiatan: ${totalActivities}\n- Motivasi: "${MOTIVATIONAL_QUOTE}"\n\nJadilah produktif bersama Ayoora!`;
      await Share.share({
        message: messageToShare,
        title: "Ayoora Weekly Summary",
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FDB100" />
        <Text style={styles.loadingText}>Memuat Ringkasan...</Text>
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aktivitas Minggu Ini</Text>
          <Text style={styles.largeNumber}>{totalActivities}</Text>
          <Text style={styles.subtitle}>7 Hari Terakhir</Text>
          <BarChart
            data={weeklyData}
            styles={styles}
            selectedDay={selectedDay}
            onSelectDay={(day) =>
              setSelectedDay(day === selectedDay ? null : day)
            }
            maxValue={maxValue}
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
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.colors.text,
    },
  });

export default SummaryScreen;
