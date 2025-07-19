import {
  cancelDailyReminder,
  cancelWeeklyReminder,
  getNotificationPermissionsStatus,
  requestNotificationPermissions,
  scheduleDailyReminder,
  scheduleWeeklyReminder,
} from "@/services/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Kunci untuk menyimpan data di AsyncStorage
const SETTINGS_KEY = "notification_settings";

const NotificationScreen = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  // State untuk status izin
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined" | null
  >(null);

  // State untuk pengaturan notifikasi
  const [isDailyEnabled, setIsDailyEnabled] = useState(false);
  const [dailyTime, setDailyTime] = useState(new Date());
  const [isWeeklyEnabled, setIsWeeklyEnabled] = useState(false);
  const [weeklyTime, setWeeklyTime] = useState(new Date());
  const [weeklyDay, setWeeklyDay] = useState(1); // 1 = Minggu

  // State untuk menampilkan picker
  const [showDailyPicker, setShowDailyPicker] = useState(false);
  const [showWeeklyPicker, setShowWeeklyPicker] = useState(false);

  // Cek izin dan muat pengaturan saat layar pertama kali dibuka
  useEffect(() => {
    const checkAndLoad = async () => {
      const status = await getNotificationPermissionsStatus();
      setPermissionStatus(status);

      if (status === "granted") {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
          const { daily, weekly } = JSON.parse(savedSettings);
          setIsDailyEnabled(daily.enabled);
          setDailyTime(new Date(daily.time));
          setIsWeeklyEnabled(weekly.enabled);
          setWeeklyTime(new Date(weekly.time));
          setWeeklyDay(weekly.day);
        }
      }
    };
    checkAndLoad();
  }, []);

  const handleRequestPermission = async () => {
    const newStatus = await requestNotificationPermissions();
    if (newStatus !== "granted") {
      Alert.alert(
        "Izin Dibutuhkan",
        "Anda perlu memberikan izin notifikasi di pengaturan HP untuk menggunakan fitur ini."
      );
    }
    // Set status agar UI bisa re-render, baik berhasil atau tidak
    setPermissionStatus(newStatus);
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const handleSave = async () => {
    try {
      // Logika Notifikasi Harian
      if (isDailyEnabled) {
        await scheduleDailyReminder(
          dailyTime.getHours(),
          dailyTime.getMinutes()
        );
      } else {
        await cancelDailyReminder();
      }

      // Logika Notifikasi Mingguan
      if (isWeeklyEnabled) {
        await scheduleWeeklyReminder(
          weeklyDay,
          weeklyTime.getHours(),
          weeklyTime.getMinutes()
        );
      } else {
        await cancelWeeklyReminder();
      }

      // Simpan pengaturan ke AsyncStorage
      const settingsToSave = {
        daily: { enabled: isDailyEnabled, time: dailyTime.toISOString() },
        weekly: {
          enabled: isWeeklyEnabled,
          time: weeklyTime.toISOString(),
          day: weeklyDay,
        },
      };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToSave));

      Alert.alert("Sukses ✅", "Pengaturan notifikasi berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan pengaturan:", error);
      Alert.alert("Error ❌", "Gagal menyimpan pengaturan notifikasi.");
    }
  };

  const onDailyTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDailyPicker(Platform.OS === "ios"); // Di iOS, picker tidak menutup otomatis
    if (selectedDate) {
      setDailyTime(selectedDate);
    }
  };

  const onWeeklyTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowWeeklyPicker(Platform.OS === "ios");
    if (selectedDate) {
      setWeeklyTime(selectedDate);
    }
  };

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // --- TAMPILAN KONDISIONAL BERDASARKAN IZIN ---

  if (permissionStatus === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (permissionStatus !== "granted") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Izin Notifikasi Dibutuhkan</Text>
          <Text style={styles.permissionText}>
            Untuk mengirim pengingat, aplikasi ini memerlukan izin untuk
            menampilkan notifikasi.
          </Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={
              permissionStatus === "denied"
                ? handleOpenSettings
                : handleRequestPermission
            }
          >
            <Text style={styles.saveButtonText}>
              {permissionStatus === "denied"
                ? "Buka Pengaturan HP"
                : "Izinkan Notifikasi"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- TAMPILAN UTAMA JIKA IZIN DIBERIKAN ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Notifikasi Harian */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Aktifkan Notifikasi Harian</Text>
              <Text style={styles.subtitle}>
                Pengingat untuk mencatat kegiatan harian
              </Text>
            </View>
            <Switch
              value={isDailyEnabled}
              onValueChange={setIsDailyEnabled}
              trackColor={{ false: "#767577", true: "#FDB100" }}
              thumbColor={"#f4f3f4"}
            />
          </View>
          {isDailyEnabled && (
            <TouchableOpacity
              onPress={() => setShowDailyPicker(true)}
              style={styles.timePickerContainer}
            >
              <Text style={styles.timePickerLabel}>Pilih Waktu:</Text>
              <Text style={styles.timeValue}>
                {dailyTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifikasi Mingguan */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Aktifkan Notifikasi Mingguan</Text>
              <Text style={styles.subtitle}>
                Pengingat untuk melihat ringkasan mingguan
              </Text>
            </View>
            <Switch
              value={isWeeklyEnabled}
              onValueChange={setIsWeeklyEnabled}
              trackColor={{ false: "#767577", true: "#FDB100" }}
              thumbColor={"#f4f3f4"}
            />
          </View>
          {isWeeklyEnabled && (
            <>
              <View style={styles.daySelector}>
                {days.map((day, index) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      weeklyDay === index + 1 && styles.dayButtonSelected,
                    ]}
                    onPress={() => setWeeklyDay(index + 1)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        weeklyDay === index + 1 && styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => setShowWeeklyPicker(true)}
                style={styles.timePickerContainer}
              >
                <Text style={styles.timePickerLabel}>Pilih Waktu:</Text>
                <Text style={styles.timeValue}>
                  {weeklyTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Picker yang tersembunyi */}
        {showDailyPicker && (
          <DateTimePicker
            value={dailyTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onDailyTimeChange}
          />
        )}
        {showWeeklyPicker && (
          <DateTimePicker
            value={weeklyTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onWeeklyTimeChange}
          />
        )}
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
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { paddingHorizontal: 20, paddingBottom: 20 },
    footer: {
      padding: 20,
      paddingTop: 0,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
    },
    section: {
      marginBottom: 18,
      backgroundColor: theme.dark ? "#2C2C2E" : "#FFFFFF",
      padding: 16,
      borderRadius: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textContainer: { flex: 1, marginRight: 16 },
    title: { fontSize: 17, fontWeight: "600", color: theme.colors.text },
    subtitle: { fontSize: 14, color: "gray", marginTop: 4 },
    timePickerContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    timePickerLabel: { fontSize: 16, color: theme.colors.text },
    timeValue: { fontSize: 18, fontWeight: "bold", color: "#FDB100" },
    daySelector: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    dayButton: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.card,
    },
    dayButtonSelected: { backgroundColor: "#FDB100" },
    dayText: { color: theme.colors.text },
    dayTextSelected: { color: "#FFFFFF", fontWeight: "bold" },
    saveButton: {
      backgroundColor: "#FDB100",
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
    },
    permissionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 15,
    },
    permissionText: {
      fontSize: 16,
      color: "gray",
      textAlign: "center",
      marginBottom: 25,
    },
  });

export default NotificationScreen;
