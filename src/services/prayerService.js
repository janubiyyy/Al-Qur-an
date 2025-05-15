export const fetchPrayerTimes = async ({ latitude, longitude }) => {
  const todayUnix = Math.floor(Date.now() / 1000);
  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${todayUnix}?latitude=${latitude}&longitude=${longitude}&method=2`
  );
  return res.json();
};

export const fetchJadwalSholat = async (cityCode) => {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `https://api.myquran.com/v2/sholat/jadwal/${cityCode}/${today}`
  );
  return res.json();
};
