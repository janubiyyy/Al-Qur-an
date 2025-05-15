// src/hooks/usePrayerTimes.js
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { fetchJadwalSholat } from "../services/prayerService";

// urutan key sesuai API myquran
const PRAYER_ORDER = ["subuh", "dzuhur", "ashar", "maghrib", "isya"];

const getNextPrayer = (times) => {
  const now = new Date();
  for (let key of PRAYER_ORDER) {
    const [h, m] = times[key].split(":").map(Number);
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    if (t > now)
      return { key, name: key.charAt(0).toUpperCase() + key.slice(1), time: t };
  }
  // semua lewat → ambil subuh besok
  const [h0, m0] = times["subuh"].split(":").map(Number);
  return {
    key: "subuh",
    name: "Subuh",
    time: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      h0,
      m0
    ),
  };
};

export const getCountdown = (target) => {
  const diff = target - new Date();
  if (diff <= 0) return "00:00:00";
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export const usePrayerTimes = (cityCode = "1301") => {
  const [times, setTimes] = useState({});
  const [nextPrayer, setNextPrayer] = useState({ name: "", time: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // (opsional) pakai GPS utk cityCode dinamis
        // const loc = await Location.getCurrentPositionAsync();
        // cityCode = deriveCityCode(loc);
        const res = await fetchJadwalSholat(cityCode);
        const jadwal = res.data.jadwal;
        setTimes(jadwal);
        setNextPrayer(getNextPrayer(jadwal));
      } catch (e) {
        console.error("usePrayerTimes:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [cityCode]);

  return { times, nextPrayer, loading };
};
