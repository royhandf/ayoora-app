import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppTheme } from "../../context/ThemeProvider";

const SettingItem = ({
  iconName,
  title,
  subtitle,
  styles,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  styles: any;
}) => {
  return (
    <View style={styles.settingItem}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={styles.settingTitle.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const SettingsScreen = () => {
  const { theme: appTheme, toggleTheme } = useAppTheme();
  const theme = useTheme();
  const isDarkMode = appTheme === "dark";

  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferensi</Text>
          <Link href="/notification" asChild>
            <TouchableOpacity>
              <SettingItem
                iconName="notifications-outline"
                title="Notifikasi"
                subtitle="Kelola notifikasi Anda"
                styles={styles}
              />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={toggleTheme}>
            <SettingItem
              iconName={isDarkMode ? "moon-outline" : "sunny-outline"}
              title="Tema Aplikasi"
              subtitle={isDarkMode ? "Mode Gelap" : "Mode Terang"}
              styles={styles}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang App</Text>
          <Link href="/faq" asChild>
            <TouchableOpacity>
              <SettingItem
                iconName="help-circle-outline"
                title="FAQ"
                subtitle="Dapatkan bantuan"
                styles={styles}
              />
            </TouchableOpacity>
          </Link>
          <Link href="/version" asChild>
            <TouchableOpacity>
              <SettingItem
                iconName="information-circle-outline"
                title="Tentang Aplikasi"
                subtitle="Versi dan informasi lainnya"
                styles={styles}
              />
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: "SplineSans",
      fontWeight: "bold",
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: theme.colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    settingTitle: {
      color: theme.colors.text,
      fontSize: 17,
      fontFamily: "SplineSans",
      fontWeight: "600",
    },
    settingSubtitle: {
      color: "gray",
      fontSize: 14,
      fontFamily: "SplineSans",
      marginTop: 2,
    },
  });

export default SettingsScreen;
