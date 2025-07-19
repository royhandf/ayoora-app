import { initDB } from "@/services/database";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import "react-native-reanimated";
import { CustomThemeProvider, useAppTheme } from "../context/ThemeProvider";

SplashScreen.preventAutoHideAsync();

const MyLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: "#FFFFFF",
    card: "#f5f5f5",
    text: "#1C1C1E",
    border: "#D1D1D6",
  },
};
const MyDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: "#1C1C1E",
    card: "#333333",
  },
};

function RootLayoutNav() {
  const { theme } = useAppTheme();
  const navigationTheme = theme === "dark" ? MyDarkTheme : MyLightTheme;

  const headerStyles = useMemo(
    () =>
      StyleSheet.create({
        noBorder: {
          backgroundColor: navigationTheme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }),
    [navigationTheme]
  );

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="notification"
          options={{
            title: "Notifikasi",
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: headerStyles.noBorder,
            headerTitleStyle: { fontSize: 19 },
            headerShadowVisible: false,
            headerTintColor: navigationTheme.colors.text,
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="faq"
          options={{
            title: "FAQ",
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: headerStyles.noBorder,
            headerTitleStyle: { fontSize: 19 },
            headerShadowVisible: false,
            headerTintColor: navigationTheme.colors.text,
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="version"
          options={{
            title: "Tentang Aplikasi",
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: headerStyles.noBorder,
            headerTitleStyle: { fontSize: 19 },
            headerShadowVisible: false,
            headerTintColor: navigationTheme.colors.text,
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="appreciation"
          options={{
            title: "Apresiasi",
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SplineSans: require("../assets/fonts/SplineSans-Regular.ttf"),
  });

  const [isDbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        console.log("✅ Database initialized successfully");
        setDbReady(true);
      } catch (e) {
        console.error("❌ Database init failed:", e);
      }
    };

    setup();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isDbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isDbReady]);

  if (!fontsLoaded || !isDbReady || fontError) {
    return null;
  }

  return (
    <CustomThemeProvider>
      <RootLayoutNav />
    </CustomThemeProvider>
  );
}
