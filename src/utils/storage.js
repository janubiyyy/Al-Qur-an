import AsyncStorage from "@react-native-async-storage/async-storage";
export const saveData = (k, v) => AsyncStorage.setItem(k, JSON.stringify(v));
export const loadData = (k) =>
  AsyncStorage.getItem(k).then((j) => (j ? JSON.parse(j) : null));
