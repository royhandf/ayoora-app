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
          position: "absolute",
          bottom: 0,
          left: 16,
          right: 16,
          height: 72,
          elevation: 0,
          backgroundColor: theme.colors.background,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          borderTopWidth: 0,
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
          title: "Summary",
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
          title: "Add",
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
          title: "History",
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
