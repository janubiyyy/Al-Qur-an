import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLastRead = () => {
  const [lastRead, setLastRead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("lastRead")
      .then((json) => setLastRead(json ? JSON.parse(json) : null))
      .finally(() => setLoading(false));
  }, []);

  return { lastRead, loading };
};
