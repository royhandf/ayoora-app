import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const theme = useTheme();
  const inactiveColor = "grey";

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 19,
          color: theme.colors.text,
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: theme.colors.background,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ayoora",
          tabBarIcon: ({ focused }) => (
            <View
              style={{ alignItems: "center", paddingTop: 10, width: width / 5 }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={focused ? "#FDB100" : inactiveColor}
                size={24}
              />
              <Text
                style={{
                  color: focused ? "#FDB100" : inactiveColor,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Ringkasan Mingguan",
          tabBarIcon: ({ focused }) => (
            <View
              style={{ alignItems: "center", paddingTop: 10, width: width / 5 }}
            >
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
                color={focused ? "#FDB100" : inactiveColor}
                size={24}
              />
              <Text
                style={{
                  color: focused ? "#FDB100" : inactiveColor,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Summary
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Tambah Kegiatan",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 60,
                width: 60,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                backgroundColor: "#FDB100",
                marginBottom: 30,
              }}
            >
              <Ionicons name="add" color="white" size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Riwayat Kegiatan",
          tabBarIcon: ({ focused }) => (
            <View
              style={{ alignItems: "center", paddingTop: 10, width: width / 5 }}
            >
              <Ionicons
                name={focused ? "time" : "time-outline"}
                color={focused ? "#FDB100" : inactiveColor}
                size={24}
              />
              <Text
                style={{
                  color: focused ? "#FDB100" : inactiveColor,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                History
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "Pengaturan",
          tabBarIcon: ({ focused }) => (
            <View
              style={{ alignItems: "center", paddingTop: 10, width: width / 5 }}
            >
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                color={focused ? "#FDB100" : inactiveColor}
                size={24}
              />
              <Text
                style={{
                  color: focused ? "#FDB100" : inactiveColor,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Setting
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
