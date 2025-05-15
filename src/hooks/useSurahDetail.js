import { useState, useEffect } from "react";
import { fetchSurahDetail } from "../services/quranService";

export const useSurahDetail = (nomor) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahDetail(nomor)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [nomor]);

  return { detail, loading };
};
