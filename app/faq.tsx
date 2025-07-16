import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutAnimation,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Definisi tipe (tidak ada perubahan)
type FAQItem = {
  question: string;
  answer: string;
};

type FAQData = {
  [key: string]: FAQItem[];
};

const faqData: FAQData = {
  "Mulai Cepat": [
    {
      question: "Bagaimana cara memulai?",
      answer:
        "Untuk memulai, unduh aplikasi Ayoora dari App Store. Setelah menginstal, buatlah akun Anda. Anda akan dipandu melalui proses pengaturan awal untuk menyesuaikan pengalaman Anda.",
    },
    {
      question: "Apa yang bisa saya lakukan dengan Ayoora?",
      answer:
        "Ayoora membantu Anda mengatur jadwal harian, melacak kebiasaan, dan mendapatkan tips produktivitas untuk meningkatkan fokus dan kesejahteraan Anda.",
    },
  ],
  "Fitur Utama": [
    {
      question: "Bagaimana cara mencatat kegiatan harian?",
      answer:
        "Di halaman Beranda, tekan tombol '+' untuk menambahkan kegiatan baru. Isi detail seperti nama, waktu, dan ikon kegiatan, lalu simpan.",
    },
    {
      question: "Bagaimana cara melihat rangkuman mingguan?",
      answer:
        'Buka tab "Summary" untuk melihat analisis lengkap dari semua kegiatan yang telah Anda selesaikan selama seminggu terakhir, disajikan dalam bentuk grafik yang mudah dipahami.',
    },
  ],
  "Pemecahan Masalah": [
    {
      question: "Aplikasi saya crash, apa yang harus saya lakukan?",
      answer:
        "Coba tutup paksa aplikasi dan buka kembali. Jika masalah berlanjut, pastikan aplikasi Anda sudah versi terbaru atau hubungi tim dukungan kami melalui email.",
    },
  ],
};

// Diubah: Menerima 'styles' dari parent agar dinamis
type AccordionItemProps = {
  question: string;
  answer: string;
  styles: any;
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  styles,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={toggleOpen} style={styles.accordionHeader}>
        <Text style={styles.questionText}>{question}</Text>
        <Ionicons
          name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color="gray"
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const FaqScreen: React.FC = () => {
  const theme = useTheme(); // Gunakan hook untuk mendapatkan tema aktif
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<FAQData>(faqData);

  // Buat styles menjadi dinamis, hanya di-render ulang saat tema berubah
  const styles = useMemo(() => getStyles(theme), [theme]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(faqData);
      return;
    }
    const newFilteredData: FAQData = {};
    const query = searchQuery.toLowerCase();
    for (const sectionTitle in faqData) {
      const items = faqData[sectionTitle];
      const filteredItems = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
      if (filteredItems.length > 0) {
        newFilteredData[sectionTitle] = filteredItems;
      }
    }
    setFilteredData(newFilteredData);
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Cari pertanyaan atau jawaban..."
            placeholderTextColor="gray"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {Object.entries(filteredData).map(([sectionTitle, items]) => (
          <View key={sectionTitle} style={styles.section}>
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
                styles={styles}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Diubah: Fungsi ini sekarang membuat style dinamis berdasarkan tema
const getStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      paddingHorizontal: 20,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginTop: 16,
      marginBottom: 24,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 48,
      color: theme.colors.text,
    },
    section: {
      marginBottom: 18,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
    },
    accordionContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    accordionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    questionText: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "bold",
      marginRight: 8,
    },
    answerContainer: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      marginTop: 8,
    },
    answerText: {
      color: "gray",
      fontSize: 14,
      lineHeight: 22,
    },
  });

export default FaqScreen;
