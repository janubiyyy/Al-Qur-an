import React, { memo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import BacaQuranScreen from "../screens/BacaQuranScreen";
import DetailSurahScreen from "../screens/DetailSurahScreen";
import JadwalSholatScreen from "../screens/JadwalSholatScreen";
import LastReadScreen from "../screens/LastReadScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "start" }}>
      {/* Ganti name menjadi unik, misal "HomeMain" */}
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "Selamat Datang 👋" }}
      />
    </Stack.Navigator>
  );
}

function QuranStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "start" }}>
      <Stack.Screen
        name="BacaQuran"
        component={BacaQuranScreen}
        options={{ title: "Baca Quran" }}
      />
      <Stack.Screen
        name="DetailSurah"
        component={DetailSurahScreen}
        options={({ route }) => ({ title: route.params.namaLatin })}
      />
    </Stack.Navigator>
  );
}

function LastReadStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "start" }}>
      <Stack.Screen
        name="LastRead"
        component={LastReadScreen}
        options={{ title: "Terakhir Dibaca" }}
      />
      <Stack.Screen
        name="DetailSurah"
        component={DetailSurahScreen}
        options={({ route }) => ({ title: route.params.namaLatin })}
      />
    </Stack.Navigator>
  );
}
function JadwalSholatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "start" }}>
      <Stack.Screen
        name="JadwalSholat"
        component={JadwalSholatScreen}
        options={{ title: "Jadwal Sholat" }}
      />
    </Stack.Navigator>
  );
}

export default memo(function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home-outline",
            BacaQuran: "book-outline",
            LastRead: "bookmarks-outline",
            JadwalSholat: "time-outline",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      {/* Tab.Screen name tetap "Home" */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="BacaQuran"
        component={QuranStack}
        options={{ title: "Baca Quran" }}
      />
      <Tab.Screen
        name="LastRead"
        component={LastReadStack}
        options={{ title: "Terakhir Dibaca" }}
      />
      <Tab.Screen
        name="JadwalSholat"
        component={JadwalSholatStack}
        options={{ title: "Jadwal Sholat" }}
      />
    </Tab.Navigator>
  );
});
