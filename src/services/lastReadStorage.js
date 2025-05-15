import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "lastRead";

export const saveLastRead = async (surah, ayat) => {
  try {
    const data = JSON.stringify({
      surah,
      ayat,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem(KEY, data);
    console.log("Last read saved:", data);
  } catch (error) {
    console.error("Failed to save last read:", error);
  }
};

export const getLastRead = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error("Failed to get last read:", error);
    return null;
  }
};

export const clearLastRead = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
    console.log("Last read cleared.");
  } catch (error) {
    console.error("Failed to clear last read:", error);
  }
};
