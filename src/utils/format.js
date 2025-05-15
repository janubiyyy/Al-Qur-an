export const toArabicNumber = (num) =>
  num
    .toString()
    .split("")
    .map((d) => ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"][d])
    .join("");
