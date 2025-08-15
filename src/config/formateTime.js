export default function formatArabicDate(date, options = {}) {
  const {
    hijri = false,
    time = true,
    seconds = false,
    weekday = false,
    monthName = true,
  } = options;

  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    return "تاريخ غير صالح";
  }

  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

  const toArabicNumbers = (num) => {
    return num
      .toString()
      .replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
  };

  const gregorianMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const hijriMonths = [
    "محرم",
    "صفر",
    "ربيع الأول",
    "ربيع الثاني",
    "جمادى الأولى",
    "جمادى الآخرة",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذو القعدة",
    "ذو الحجة",
  ];

  const weekdays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const formatTime = () => {
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "م" : "ص";

    hours = hours % 12;
    hours = hours ? hours : 12;

    let timeStr = `${toArabicNumbers(hours)}:${toArabicNumbers(
      minutes.toString().padStart(2, "0")
    )} ${ampm}`;

    if (seconds) {
      const secs = d.getSeconds();
      timeStr = `${toArabicNumbers(hours)}:${toArabicNumbers(
        minutes.toString().padStart(2, "0")
      )}:${toArabicNumbers(secs.toString().padStart(2, "0"))} ${ampm}`;
    }

    return timeStr;
  };

  // Format Gregorian date
  const formatGregorian = () => {
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    const weekdayNum = d.getDay();

    let dateStr = "";

    if (weekday) {
      dateStr += `${weekdays[weekdayNum]}، `;
    }

    dateStr += `${toArabicNumbers(day)} `;

    if (monthName) {
      dateStr += `${gregorianMonths[month]} `;
    } else {
      dateStr += `${toArabicNumbers(month + 1)}/`;
    }

    dateStr += toArabicNumbers(year);

    return dateStr;
  };

  const formatHijri = () => {
    const gregDate = new Date(d);
    const hijriDate = new Date(gregDate - 1.5e11); // Approx conversion

    const day = hijriDate.getDate();
    const month = hijriDate.getMonth();
    const year = hijriDate.getFullYear() - 579; // Approx difference
    const weekdayNum = hijriDate.getDay();

    let dateStr = "";

    if (weekday) {
      dateStr += `${weekdays[weekdayNum]}، `;
    }

    dateStr += `${toArabicNumbers(day)} `;

    if (monthName) {
      dateStr += `${hijriMonths[month]} `;
    } else {
      dateStr += `${toArabicNumbers(month + 1)}/`;
    }

    dateStr += toArabicNumbers(year);

    return dateStr + " هـ";
  };

  let formattedDate = hijri ? formatHijri() : formatGregorian();

  if (time) {
    formattedDate += ` - ${formatTime()}`;
  }

  return formattedDate;
}
