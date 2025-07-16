import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Komponen untuk satu baris pengaturan notifikasi (judul, subjudul, switch)
const NotificationSettingRow = ({
  title,
  subtitle,
  isEnabled,
  onToggle,
  styles,
}: {
  title: string;
  subtitle: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  styles: any;
}) => (
  <View style={styles.row}>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={isEnabled}
      onValueChange={onToggle}
      trackColor={{ false: "#767577", true: "#FDB100" }}
      thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
    />
  </View>
);

// Komponen utama untuk layar Notifikasi
const NotificationScreen = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  // State untuk mengelola status notifikasi
  const [dailyNotifications, setDailyNotifications] = useState(false);
  const [weeklyNotifications, setWeeklyNotifications] = useState(false);
  const [dailyTime, setDailyTime] = useState("1:00 PM");
  const [weeklyTime, setWeeklyTime] = useState("1:00 PM");

  const handleSave = () => {
    // Di sini Anda bisa menambahkan logika untuk menyimpan pengaturan
    console.log("Pengaturan disimpan:", {
      dailyNotifications,
      dailyTime,
      weeklyNotifications,
      weeklyTime,
    });
    // Mungkin kembali ke halaman sebelumnya atau menampilkan pesan sukses
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Notifikasi Harian */}
        <View style={styles.section}>
          <NotificationSettingRow
            title="Aktifkan Notifikasi Harian"
            subtitle="Pengingat untuk mencatat kegiatan harian"
            isEnabled={dailyNotifications}
            onToggle={setDailyNotifications}
            styles={styles}
          />
          {dailyNotifications && (
            <View style={styles.timePickerContainer}>
              <Text style={styles.timePickerLabel}>Pilih Waktu:</Text>
              <Text style={styles.timeValue}>{dailyTime}</Text>
            </View>
          )}
        </View>

        {/* Notifikasi Mingguan */}
        <View style={styles.section}>
          <NotificationSettingRow
            title="Aktifkan Notifikasi Mingguan"
            subtitle="Pengingat untuk melihat ringkasan mingguan"
            isEnabled={weeklyNotifications}
            onToggle={setWeeklyNotifications}
            styles={styles}
          />
          {weeklyNotifications && (
            <View style={styles.timePickerContainer}>
              <Text style={styles.timePickerLabel}>Pilih Waktu:</Text>
              <Text style={styles.timeValue}>{weeklyTime}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Tombol Simpan */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Stylesheet yang dinamis berdasarkan tema
const getStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      paddingHorizontal: 20,
    },
    footer: {
      padding: 20,
    },
    section: {
      marginTop: 20,
      backgroundColor: theme.dark ? "#333" : "#F0F0F0",
      padding: 16,
      borderRadius: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textContainer: {
      flex: 1,
      marginRight: 16,
    },
    title: {
      fontSize: 17,
      fontWeight: "600",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: "gray",
      marginTop: 4,
    },
    timePickerContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    timePickerLabel: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
    },
    timeValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FDB100",
    },
    saveButton: {
      backgroundColor: "#FDB100",
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    saveButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default NotificationScreen;
