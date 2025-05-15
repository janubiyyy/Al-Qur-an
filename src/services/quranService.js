export const fetchSurahList = async () => {
  const res = await fetch("https://equran.id/api/surat");
  return res.json();
};

export const fetchSurahDetail = async (nomor) => {
  const res = await fetch(`https://equran.id/api/surat/${nomor}`);
  return res.json();
};
