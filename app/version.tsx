import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const VersionScreen: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Ionicons name="rocket-outline" size={80} color={"#FDB100"} />
        <Text style={styles.appName}>Ayoora</Text>
        <Text style={styles.versionText}>Version 1.0.0 (Build 1)</Text>
        <Text style={styles.copyrightText}>
          © 2025 Ayoora. All Rights Reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    appName: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: 16,
    },
    versionText: {
      fontSize: 16,
      color: "gray",
      marginTop: 8,
    },
    copyrightText: {
      position: "absolute",
      bottom: 40,
      fontSize: 12,
      color: "gray",
    },
  });

export default VersionScreen;
