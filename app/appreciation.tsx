import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AppreciationScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const illustration = require("../assets/images/apresiasi.png");

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image source={illustration} style={styles.image} />

      <View style={styles.contentArea}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Fantastic job on finishing your workout! Your commitment is truly
            commendable.
          </Text>
          <Text style={styles.subtitle}>
            Your dedication to fitness is yielding great results. Keep up the
            excellent effort!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.card,
      justifyContent: "space-between",
    },
    image: {
      width: "100%",
      height: "45%",
      resizeMode: "cover",
    },
    contentArea: {
      flex: 1,
      justifyContent: "space-around",
      padding: 30,
    },
    textContainer: {
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.colors.text,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      color: "gray",
      lineHeight: 24,
    },
    button: {
      backgroundColor: "#FDB100",
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      width: "100%",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default AppreciationScreen;
