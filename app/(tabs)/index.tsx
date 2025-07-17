import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const INSPIRATIONAL_QUOTES = [
  {
    text: "Setiap hari adalah kesempatan baru untuk menjadi versi terbaik dari diri kita.",
    author: "Maya Angelou",
  },
  {
    text: "Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang Anda lakukan.",
    author: "Steve Jobs",
  },
  {
    text: "Percayalah Anda bisa dan Anda sudah setengah jalan.",
    author: "Theodore Roosevelt",
  },
];

const ActivityItem = ({
  title,
  time,
  styles,
}: {
  title: string;
  time: string;
  styles: any;
}) => (
  <TouchableOpacity style={styles.activityItem}>
    <View style={styles.textContainer}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const [currentQuote, setCurrentQuote] = useState(INSPIRATIONAL_QUOTES[0]);

  const getNewQuote = () => {
    let newQuote;
    do {
      const randomIndex = Math.floor(
        Math.random() * INSPIRATIONAL_QUOTES.length
      );
      newQuote = INSPIRATIONAL_QUOTES[randomIndex];
    } while (newQuote.text === currentQuote.text);
    setCurrentQuote(newQuote);
  };

  useEffect(() => {
    getNewQuote();
  }, []);

  const imageUrl =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";

  const gradientColors = theme.dark
    ? (["rgba(50, 50, 50, 0.7)", "rgba(253, 177, 0, 0.7)"] as const)
    : (["rgba(253, 177, 0, 0.8)", "rgba(255, 126, 95, 0.8)"] as const);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspirasi Harian</Text>
          <View style={styles.inspirationCard}>
            <ImageBackground
              source={{ uri: imageUrl }}
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 20 }}
            >
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientOverlay}
              >
                <Text style={styles.quoteText}>
                  &quot;{currentQuote.text}&quot;
                </Text>
                <Text style={styles.authorText}>- {currentQuote.author}</Text>
                <TouchableOpacity
                  style={styles.newQuoteButton}
                  onPress={getNewQuote}
                >
                  <Text style={styles.newQuoteButtonText}>Quote Baru</Text>
                </TouchableOpacity>
              </LinearGradient>
            </ImageBackground>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kegiatan Hari Ini</Text>
          <ActivityItem title="Meditasi Pagi" time="07:00" styles={styles} />
          <ActivityItem title="Menulis Jurnal" time="08:00" styles={styles} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { paddingHorizontal: 20, marginTop: 5 },
    section: { marginBottom: 20 },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
    },
    inspirationCard: {
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    imageBackground: {
      width: "100%",
      height: 250,
      borderRadius: 20,
      overflow: "hidden",
    },
    gradientOverlay: {
      flex: 1,
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    quoteText: {
      color: "white",
      fontSize: 22,
      fontWeight: "600",
      textAlign: "center",
      fontStyle: "italic",
      lineHeight: 30,
    },
    authorText: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: 16,
      marginTop: 12,
      textAlign: "center",
    },
    newQuoteButton: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 20,
      marginTop: 20,
    },
    newQuoteButtonText: { color: "white", fontWeight: "bold", fontSize: 14 },
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
  });

export default HomeScreen;
