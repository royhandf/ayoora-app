import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Activity = {
  id: string;
  kategori: string;
  waktu: string;
  deskripsi: string;
};

const CATEGORIES = ["Olahraga", "Belajar", "Pekerjaan", "Hobi", "Lainnya"];

const CategoryPickerModal = ({
  visible,
  onClose,
  onSelect,
  currentValue,
  styles,
}: any) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalBackdrop}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Kategori</Text>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.optionItem}
                onPress={() => onSelect(category)}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentValue === category && styles.optionTextSelected,
                  ]}
                >
                  {category}
                </Text>
                {currentValue === category && (
                  <Ionicons name="checkmark-circle" size={24} color="#FDB100" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const AddScreen: React.FC = () => {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: String(Date.now()),
      kategori: "Olahraga",
      waktu: "07:00",
      deskripsi: "",
    },
  ]);

  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );
  const [isCategoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState(new Date());

  const handleActivityChange = (
    id: string,
    field: keyof Omit<Activity, "id">,
    value: string
  ) => {
    setActivities((acts) =>
      acts.map((act) => (act.id === id ? { ...act, [field]: value } : act))
    );
  };

  const addActivityForm = () =>
    setActivities((acts) => [
      ...acts,
      {
        id: String(Date.now() + Math.random()),
        kategori: "Belajar",
        waktu: "09:00",
        deskripsi: "",
      },
    ]);

  const removeActivityForm = (id: string) =>
    setActivities((acts) => acts.filter((act) => act.id !== id));

  const openCategoryPicker = (id: string) => {
    setEditingActivityId(id);
    setCategoryPickerVisible(true);
  };

  const showTimePicker = (activity: Activity) => {
    setEditingActivityId(activity.id);
    const [hours, minutes] = activity.waktu.split(":").map(Number);
    const currentDate = new Date();
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    setTimePickerValue(currentDate);
    setTimePickerVisible(true);
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setTimePickerVisible(Platform.OS === "ios");

    if (event.type === "set" && selectedDate && editingActivityId) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;
      handleActivityChange(editingActivityId, "waktu", formattedTime);
    }
  };

  const currentActivityForCategory = activities.find(
    (act) => act.id === editingActivityId
  );

  const handleSave = () => {
    router.push("/appreciation");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CategoryPickerModal
        visible={isCategoryPickerVisible}
        onClose={() => setCategoryPickerVisible(false)}
        onSelect={(category: string) => {
          if (editingActivityId)
            handleActivityChange(editingActivityId, "kategori", category);
          setCategoryPickerVisible(false);
        }}
        currentValue={currentActivityForCategory?.kategori}
        styles={styles}
      />
      {isTimePickerVisible && (
        <DateTimePicker
          value={timePickerValue}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activities.map((activity, index) => (
          <View key={activity.id} style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Kegiatan {index + 1}</Text>
              {activities.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeActivityForm(activity.id)}
                >
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.label}>Kategori</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => openCategoryPicker(activity.id)}
            >
              <Text style={styles.inputText}>{activity.kategori}</Text>
              <Ionicons name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>
            <Text style={styles.label}>Waktu</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => showTimePicker(activity)}
            >
              <Text style={styles.inputText}>{activity.waktu}</Text>
              <Ionicons name="time-outline" size={20} color="gray" />
            </TouchableOpacity>
            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Deskripsi singkat..."
              placeholderTextColor="gray"
              value={activity.deskripsi}
              onChangeText={(text) =>
                handleActivityChange(activity.id, "deskripsi", text)
              }
              multiline
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addActivityForm}>
          <Ionicons name="add-circle-outline" size={24} color={"#FDB100"} />
          <Text style={styles.addButtonText}>Tambah Kegiatan Lain</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 120,
    },
    formCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: 10,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", color: theme.colors.text },
    label: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      fontWeight: "500",
    },
    input: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 50,
      marginBottom: 16,
    },
    inputText: { fontSize: 16, color: theme.colors.text },
    multilineInput: {
      height: 100,
      textAlignVertical: "top",
      paddingVertical: 12,
      alignItems: "flex-start",
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#FDB100",
      borderStyle: "dashed",
    },
    addButtonText: {
      color: "#FDB100",
      fontSize: 16,
      marginLeft: 8,
      fontWeight: "bold",
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      paddingBottom: 30,
      backgroundColor: theme.colors.background,
    },
    saveButton: {
      backgroundColor: "#FDB100",
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    saveButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
    modalBackdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      width: "85%",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 20,
      maxHeight: "70%",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 10,
      paddingBottom: 10,
      textAlign: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    optionItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
    },
    optionText: { fontSize: 16, color: theme.colors.text },
    optionTextSelected: { color: "#FDB100", fontWeight: "bold" },
  });

export default AddScreen;
