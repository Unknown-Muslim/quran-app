// --- Initial Setup and Data Imports ---
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO, startOfDay, addDays, differenceInSeconds } from 'date-fns';
// Import Vercel Analytics component for web analytics
import { Analytics } from '@vercel/analytics/react';

// --- COMPLETE QURAN DATA (All 114 Surahs) ---
// This data provides metadata for each Surah of the Quran.
// It includes Arabic and English names, and the number of verses.
const quranData = {
  surahs: [
    { id: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', numberOfVerses: 7 },
    { id: 2, name: 'البقرة', englishName: 'Al-Baqarah', numberOfVerses: 286 },
    { id: 3, name: 'آل عمران', englishName: 'Al-Imran', numberOfVerses: 200 },
    { id: 4, name: 'النساء', englishName: 'An-Nisa', numberOfVerses: 176 },
    { id: 5, name: 'المائدة', englishName: 'Al-Maidah', numberOfVerses: 120 },
    { id: 6, name: 'الأنعام', englishName: 'Al-Anam', numberOfVerses: 165 },
    { id: 7, name: 'الأعراف', englishName: 'Al-Araf', numberOfVerses: 206 },
    { id: 8, name: 'الأنفال', englishName: 'Al-Anfal', numberOfVerses: 75 },
    { id: 9, name: 'التوبة', englishName: 'At-Tawbah', numberOfVerses: 129 },
    { id: 10, name: 'يونس', englishName: 'Yunus', numberOfVerses: 109 },
    { id: 11, name: 'هود', englishName: 'Hud', numberOfVerses: 123 },
    { id: 12, name: 'يوسف', englishName: 'Yusuf', numberOfVerses: 111 },
    { id: 13, name: 'الرعد', englishName: 'Ar-Rad', numberOfVerses: 43 },
    { id: 14, name: 'ابراهيم', englishName: 'Ibrahim', numberOfVerses: 52 },
    { id: 15, name: 'الحجر', englishName: 'Al-Hijr', numberOfVerses: 99 },
    { id: 16, name: 'النحل', englishName: 'An-Nahl', numberOfVerses: 128 },
    { id: 17, name: 'الإسراء', englishName: 'Al-Isra', numberOfVerses: 111 },
    { id: 18, name: 'الكهف', englishName: 'Al-Kahf', numberOfVerses: 110 },
    { id: 19, name: 'مريم', englishName: 'Maryam', numberOfVerses: 98 },
    { id: 20, name: 'طه', englishName: 'Taha', numberOfVerses: 135 },
    { id: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', numberOfVerses: 112 },
    { id: 22, name: 'الحج', englishName: 'Al-Hajj', numberOfVerses: 78 },
    { id: 23, name: 'المؤمنون', englishName: 'Al-Muminun', numberOfVerses: 118 },
    { id: 24, name: 'النور', englishName: 'An-Nur', numberOfVerses: 64 },
    { id: 25, name: 'الفرقان', englishName: 'Al-Furqan', numberOfVerses: 77 },
    { id: 26, name: 'الشعراء', englishName: 'Ash-Shuara', numberOfVerses: 227 },
    { id: 27, name: 'النمل', englishName: 'An-Naml', numberOfVerses: 93 },
    { id: 28, name: 'القصص', englishName: 'Al-Qasas', numberOfVerses: 88 },
    { id: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', numberOfVerses: 69 },
    { id: 30, name: 'الروم', englishName: 'Ar-Rum', numberOfVerses: 60 },
    { id: 31, name: 'لقمان', englishName: 'Luqman', numberOfVerses: 34 },
    { id: 32, name: 'السجدة', englishName: 'As-Sajda', numberOfVerses: 30 },
    { id: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', numberOfVerses: 73 },
    { id: 34, name: 'سبأ', englishName: 'Saba', numberOfVerses: 54 },
    { id: 35, name: 'فاطر', englishName: 'Fatir', numberOfVerses: 45 },
    { id: 36, name: 'يس', englishName: 'Ya-Sin', numberOfVerses: 83 },
    { id: 37, name: 'الصافات', englishName: 'As-Saffat', numberOfVerses: 182 },
    { id: 38, name: 'ص', englishName: 'Sad', numberOfVerses: 88 },
    { id: 39, name: 'الزمر', englishName: 'Az-Zumar', numberOfVerses: 75 },
    { id: 40, name: 'غافر', englishName: 'Ghafir', numberOfVerses: 85 },
    { id: 41, name: 'فصلت', englishName: 'Fussilat', numberOfVerses: 54 },
    { id: 42, name: 'الشورى', englishName: 'Ash-Shuraa', numberOfVerses: 53 },
    { id: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', numberOfVerses: 89 },
    { id: 44, name: 'الدخان', englishName: 'Ad-Dukhan', numberOfVerses: 59 },
    { id: 45, name: 'الجاثية', englishName: 'Al-Jathiya', numberOfVerses: 37 },
    { id: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', numberOfVerses: 35 },
    { id: 47, name: 'محمد', englishName: 'Muhammad', numberOfVerses: 38 },
    { id: 48, name: 'الفتح', englishName: 'Al-Fath', numberOfVerses: 29 },
    { id: 49, name: 'الحجرات', englishName: 'Al-Hujurat', numberOfVerses: 18 },
    { id: 50, name: 'ق', englishName: 'Qaf', numberOfVerses: 45 },
    { id: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', numberOfVerses: 60 },
    { id: 52, name: 'الطور', englishName: 'At-Tur', numberOfVerses: 49 },
    { id: 53, name: 'النجم', englishName: 'An-Najm', numberOfVerses: 62 },
    { id: 54, name: 'القمر', englishName: 'Al-Qamar', numberOfVerses: 55 },
    { id: 55, name: 'الرحمن', englishName: 'Ar-Rahman', numberOfVerses: 78 },
    { id: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', numberOfVerses: 96 },
    { id: 57, name: 'الحديد', englishName: 'Al-Hadid', numberOfVerses: 29 },
    { id: 58, name: 'المجادلة', englishName: 'Al-Mujadila', numberOfVerses: 22 },
    { id: 59, name: 'الحشر', englishName: 'Al-Hashr', numberOfVerses: 24 },
    { id: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', numberOfVerses: 13 },
    { id: 61, name: 'الصف', englishName: 'As-Saff', numberOfVerses: 14 },
    { id: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', numberOfVerses: 11 },
    { id: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', numberOfVerses: 11 },
    { id: 64, name: 'التغابن', englishName: 'At-Taghabun', numberOfVerses: 18 },
    { id: 65, name: 'الطلاق', englishName: 'At-Talaq', numberOfVerses: 12 },
    { id: 66, name: 'التحريم', englishName: 'At-Tahrim', numberOfVerses: 12 },
    { id: 67, name: 'الملك', englishName: 'Al-Mulk', numberOfVerses: 30 },
    { id: 68, name: 'القلم', englishName: 'Al-Qalam', numberOfVerses: 52 },
    { id: 69, name: 'الحاقة', englishName: 'Al-Haqqah', numberOfVerses: 52 },
    { id: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', numberOfVerses: 44 },
    { id: 71, name: 'نوح', englishName: 'Nuh', numberOfVerses: 28 },
    { id: 72, name: 'الجن', englishName: 'Al-Jinn', numberOfVerses: 28 },
    { id: 73, name: 'المزمل', englishName: 'Al-Muzzammil', numberOfVerses: 20 },
    { id: 74, name: 'المدثر', englishName: 'Al-Muddaththir', numberOfVerses: 56 },
    { id: 75, name: 'القيامة', englishName: 'Al-Qiyamah', numberOfVerses: 40 },
    { id: 76, name: 'الإنسان', englishName: 'Al-Insan', numberOfVerses: 31 },
    { id: 77, name: 'المرسلات', englishName: 'Al-Mursalat', numberOfVerses: 50 },
    { id: 78, name: 'النبأ', englishName: 'An-Naba', numberOfVerses: 40 },
    { id: 79, name: 'النازعات', englishName: 'An-Nazi\'at', numberOfVerses: 46 },
    { id: 80, name: 'عبس', englishName: 'Abasa', numberOfVerses: 42 },
    { id: 81, name: 'التكوير', englishName: 'At-Takwir', numberOfVerses: 29 },
    { id: 82, name: 'الإنفطار', englishName: 'Al-Infitar', numberOfVerses: 19 },
    { id: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', numberOfVerses: 36 },
    { id: 84, name: 'الإنشقاق', englishName: 'Al-Inshiqaq', numberOfVerses: 25 },
    { id: 85, name: 'البروج', englishName: 'Al-Buruj', numberOfVerses: 22 },
    { id: 86, name: 'الطارق', englishName: 'At-Tariq', numberOfVerses: 17 },
    { id: 87, name: 'الأعلى', englishName: 'Al-A\'la', numberOfVerses: 19 },
    { id: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', numberOfVerses: 26 },
    { id: 89, name: 'الفجر', englishName: 'Al-Fajr', numberOfVerses: 30 },
    { id: 90, name: 'البلد', englishName: 'Al-Balad', numberOfVerses: 20 },
    { id: 91, name: 'الشمس', englishName: 'Ash-Shams', numberOfVerses: 15 },
    { id: 92, name: 'الليل', englishName: 'Al-Layl', numberOfVerses: 21 },
    { id: 93, name: 'الضحى', englishName: 'Ad-Duhaa', numberOfVerses: 11 },
    { id: 94, name: 'الشرح', englishName: 'Ash-Sharh', numberOfVerses: 8 },
    { id: 95, name: 'التين', englishName: 'At-Tin', numberOfVerses: 8 },
    { id: 96, name: 'العلق', englishName: 'Al-Alaq', numberOfVerses: 19 },
    { id: 97, name: 'القدر', englishName: 'Al-Qadr', numberOfVerses: 5 },
    { id: 98, name: 'البينة', englishName: 'Al-Bayyinah', numberOfVerses: 8 },
    { id: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', numberOfVerses: 8 },
    { id: 100, name: 'العاديات', englishName: 'Al-Adiyat', numberOfVerses: 11 },
    { id: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', numberOfVerses: 11 },
    { id: 102, name: 'التكاثر', englishName: 'At-Takathur', numberOfVerses: 8 },
    { id: 103, name: 'العصر', englishName: 'Al-Asr', numberOfVerses: 3 },
    { id: 104, name: 'الهمزة', englishName: 'Al-Humazah', numberOfVerses: 9 },
    { id: 105, name: 'الفيل', englishName: 'Al-Fil', numberOfVerses: 5 },
    { id: 106, name: 'قريش', englishName: 'Quraish', numberOfVerses: 4 },
    { id: 107, name: 'الماعون', englishName: 'Al-Ma\'un', numberOfVerses: 7 },
    { id: 108, name: 'الكوثر', englishName: 'Al-Kawthar', numberOfVerses: 3 },
    { id: 109, name: 'الكافرون', englishName: 'Al-Kafirun', numberOfVerses: 6 },
    { id: 110, name: 'النصر', englishName: 'An-Nasr', numberOfVerses: 3 },
    { id: 111, name: 'المسد', englishName: 'Al-Masad', numberOfVerses: 5 },
    { id: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', numberOfVerses: 4 },
    { id: 113, name: 'الفلق', englishName: 'Al-Falaq', numberOfVerses: 5 },
    { id: 114, name: 'الناس', englishName: 'An-Nas', numberOfVerses: 6 }
  ],
  verseOfTheDay: {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'And whoever fears Allah – He will make for him a way out.',
  }
};

// Reciter data, all set to unlocked for simplicity as per previous request.
const recitersData = {
  featured: [
    { id: 'alafasy', name: 'مشاري العفاسي', englishName: 'Mishary Al-Afasy', imageUrl: 'https://placehold.co/80x80/6EE7B7/047857?text=M.A', alquranCloudId: 'ar.alafasy', cost: 0, unlocked: true },
    { id: 'abdulbaset', name: 'عبد الباسط عبد الصمد', englishName: 'Abdul Basit Abdus Samad', imageUrl: 'https://placehold.co/80x80/6EE7B7/047857?text=A.B.S', alquranCloudId: 'ar.abdulbasit', cost: 0, unlocked: true },
  ],
  free: [
    { id: 'minshawi', name: 'محمد صديق المنشاوي', englishName: 'Muhammad al-Minshawi', imageUrl: 'https://placehold.co/80x80/6EE7B7/047857?text=M.M', alquranCloudId: 'ar.minshawi', cost: 0, unlocked: true },
    { id: 'shuraim', name: 'سعود الشريم', englishName: 'Saud Al-Shuraim', imageUrl: 'https://placehold.co/80x80/6EE7B7/047857?text=S.S', alquranCloudId: 'ar.shuraim', cost: 0, unlocked: true },
  ]
};

// Achievement definitions for user progress tracking.
const achievementsData = [
  { id: 'first-read', title: 'First Read', description: 'Complete your first reading session', icon: '✨', achieved: false },
  { id: 'first-week', title: 'Daily Reader', description: 'Maintain a 7-day reading streak', icon: '📅', achieved: false },
  { id: 'practice-master', title: 'Practice Master', description: 'Complete 100 practice sessions', icon: '🎤', achieved: false },
  { id: 'quiz-whiz', title: 'Quiz Whiz', description: 'Score over 500 points in quizzes', icon: '❓', achieved: false },
];

// --- Quiz Data ---
// Comprehensive quiz questions covering various topics and question types.
const quizQuestions = [
  {
    id: 1,
    type: 'translation',
    question: "What is the English translation of Surah Al-Fatiha, Verse 1:\n\"بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\"",
    correctAnswer: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    choices: [
      "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      "All praise is due to Allah, Lord of the worlds.",
      "The Most Gracious, the Most Merciful.",
      "Master of the Day of Judgment."
    ],
    category: "Short Surahs",
    surahId: 1,
    verseId: 1
  },
  {
    id: 2,
    type: 'next-verse',
    question: "Which verse comes AFTER Surah Al-Ikhlas, Verse 1:\n\"قُلْ هُوَ ٱللَّهُ أَحَدٌ\"",
    correctAnswer: "ٱللَّهُ ٱلصَّمَدُ",
    choices: [
      "ٱللَّهُ ٱلصَّمَدُ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
      "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ"
    ],
    category: "Short Surahs",
    surahId: 112,
    verseId: 1
  },
  {
    id: 3,
    type: 'translation',
    question: "What is the English translation of Surah An-Nas, Verse 1:\n\"قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ\"",
    correctAnswer: "Say, 'I seek refuge in the Lord of mankind,'",
    choices: [
      "Say, 'I seek refuge in the Lord of mankind,'",
      "The King of mankind,",
      "The God of mankind,",
      "From the evil of the whisperer who withdraws."
    ],
    category: "Short Surahs",
    surahId: 114,
    verseId: 1
  },
  {
    id: 4,
    type: 'general',
    question: "Which Surah is known as 'The Opening'?",
    correctAnswer: "Al-Fatiha",
    choices: ["Al-Baqarah", "Al-Fatiha", "An-Nas", "Al-Ikhlas"],
    category: "General",
    surahId: 1,
  },
  {
    id: 5,
    type: 'general',
    question: "How many verses are there in Surah Al-Ikhlas?",
    correctAnswer: "4",
    choices: ["3", "4", "5", "6"],
    category: "General",
    surahId: 112,
  },
  {
    id: 6,
    type: 'prophets',
    question: "Which prophet's story is prominently featured in Surah Yusuf?",
    correctAnswer: "Yusuf (Joseph)",
    choices: ["Musa (Moses)", "Isa (Jesus)", "Yusuf (Joseph)", "Ibrahim (Abraham)"],
    category: "Prophets",
    surahId: 12,
  },
  {
    id: 7,
    type: 'general',
    question: "What is the longest Surah in the Quran?",
    correctAnswer: "Al-Baqarah",
    choices: ["Al-Imran", "An-Nisa", "Al-Baqarah", "Al-Maidah"],
    category: "General",
    surahId: 2,
  },
  {
    id: 8,
    type: 'short-surahs',
    question: "Which Surah begins with 'Say, He is Allah, [the] One,'?",
    correctAnswer: "Al-Ikhlas",
    choices: ["Al-Kafirun", "Al-Falaq", "An-Nas", "Al-Ikhlas"],
    category: "Short Surahs",
    surahId: 112,
  },
  {
    id: 9,
    type: 'stories',
    question: "What is the name of the cave mentioned in Surah Al-Kahf?",
    correctAnswer: "Al-Kahf (The Cave)",
    choices: ["Hira", "Thawr", "Al-Kahf (The Cave)", "Uhud"],
    category: "Stories",
    surahId: 18,
  },
  {
    id: 10,
    type: 'general',
    question: "Which Surah is also known as 'The Spider'?",
    correctAnswer: "Al-Ankabut",
    choices: ["Al-Ankabut", "An-Nahl", "Al-Naml", "Al-Fil"],
    category: "General",
    surahId: 29,
  },
  {
    id: 11,
    type: 'history',
    question: "The first revelation came down in which month?",
    correctAnswer: "Ramadan",
    choices: ["Shawwal", "Rabi' al-Awwal", "Ramadan", "Muharram"],
    category: "History",
  },
  {
    id: 12,
    type: 'general',
    question: "Which angel delivered the revelation to Prophet Muhammad (PBUH)?",
    correctAnswer: "Jibreel (Gabriel)",
    choices: ["Israfil", "Mikail", "Jibreel (Gabriel)", "Azrael"],
    category: "General",
  },
  {
    id: 13,
    type: 'short-surahs',
    question: "What is the meaning of 'Al-Fatiha'?",
    correctAnswer: "The Opening",
    choices: ["The Cow", "The Opening", "The Chapter", "The People"],
    category: "Short Surahs",
    surahId: 1,
  },
  // You can add many more quiz questions here following this structure.
];

// Categories available for the quiz, including a 'Combined' option.
const quizCategories = [
    "Combined", // For a mix of all questions
    "General",
    "Prophets",
    "Short Surahs",
    "Stories",
    "History"
    // Add more categories as you add more questions
];

// Define available font families for the Quran reader, with Tailwind CSS class names.
const fontFamilies = [
    { name: 'Quranic (Default)', className: 'font-arabic' }, // Assumes 'font-arabic' is defined in global CSS
    { name: 'Serif', className: 'font-serif' },
    { name: 'Sans-serif', className: 'font-sans' },
    { name: 'Monospace', className: 'font-mono' }
];

// Define available font sizes for the Quran reader, with Tailwind CSS class names.
const fontSizes = [
  { name: 'Small', className: 'text-lg' },
  { name: 'Medium', className: 'text-xl' },
  { name: 'Large', className: 'text-2xl' },
  { name: 'Extra Large', className: 'text-3xl' },
  { name: 'Huge', className: 'text-4xl' },
];


// Utility for basic prayer time calculation (Hanafi for Asr).
// This uses mock data and does not perform actual astronomical calculations.
function getPrayerTimes(latitude, longitude, date = new Date()) {
  const times = {
    Fajr: null,
    Sunrise: null,
    Dhuhr: null,
    Asr: null, // Hanafi method for Asr
    Maghrib: null,
    Isha: null,
  };

  const now = new Date(date);
  now.setSeconds(0);
  now.setMilliseconds(0);

  // Mock times for a typical day to ensure functionality
  const fajrTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0);
  const sunriseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 30);
  const dhuhrTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0);
  const asrTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0); // Hanafi later Asr
  const maghribTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 30);
  const ishaTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0);

  times.Fajr = fajrTime;
  times.Sunrise = sunriseTime;
  times.Dhuhr = dhuhrTime;
  times.Asr = asrTime;
  times.Maghrib = maghribTime;
  times.Isha = ishaTime;

  const prayerArray = [
    { name: 'Fajr', time: times.Fajr, icon: '🌅' },
    { name: 'Sunrise', time: times.Sunrise, icon: '☀️' },
    { name: 'Dhuhr', time: times.Dhuhr, icon: '🏙️' },
    { name: 'Asr', time: times.Asr, icon: '🌇' },
    { name: 'Maghrib', time: times.Maghrib, icon: '🌆' },
    { name: 'Isha', time: times.Isha, icon: '🌃' },
  ];

  let nextPrayer = null;
  let timeToNextPrayer = '';

  // Determine the next upcoming prayer time
  for (let i = 0; i < prayerArray.length; i++) {
    const prayer = prayerArray[i];
    if (now < prayer.time) {
      nextPrayer = prayer;
      const diffSeconds = differenceInSeconds(prayer.time, now);
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;
      timeToNextPrayer = `${hours}h ${minutes}m ${seconds}s`;
      break;
    }
  }

  // If all prayers for today have passed, set next prayer to Fajr of next day
  if (!nextPrayer && prayerArray.length > 0) {
      const tomorrowFajr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, prayerArray[0].time.getHours(), prayerArray[0].time.getMinutes());
      nextPrayer = { ...prayerArray[0], time: tomorrowFajr };
      const diffSeconds = differenceInSeconds(nextPrayer.time, now);
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;
      timeToNextPrayer = `${hours}h ${minutes}m ${seconds}s`;
  }

  return {
    times: prayerArray,
    nextPrayer,
    timeToNextPrayer,
  };
}

// NotificationMessage component for displaying temporary messages to the user.
const NotificationMessage = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const textColor = 'text-white';
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-xl flex items-center space-x-3 transition-all duration-300 transform animate-fade-in-up z-50 ${bgColor} ${textColor}`}>
      <span className="text-2xl">{icon}</span>
      <p className="font-semibold">{message}</p>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// --- Reusable UI Components ---

// Card component for navigation and feature display on the dashboard.
const Card = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-green-700 hover:bg-green-600 text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center transition-all transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
  >
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-xl font-semibold mb-1">{title}</h3>
    <p className="text-sm opacity-90">{description}</p>
  </button>
);

// ReciterCard component to display individual reciter information.
const ReciterCard = ({ reciter, onSelectReciter, isSelected }) => {
  const handleAction = () => {
    if (onSelectReciter) {
      onSelectReciter(reciter.id, reciter.alquranCloudId);
    }
  };

  return (
    <div className={`bg-green-700 p-4 rounded-xl shadow-sm flex flex-col items-center text-center relative hover:shadow-md transition-shadow duration-200 ${isSelected ? 'border-4 border-yellow-400' : ''}`}>
      <img
        src={reciter.imageUrl}
        alt={reciter.englishName}
        className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-green-400 shadow-sm"
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/cccccc/333333?text=Reciter"; }} // Fallback image
      />
      <p className="font-arabic text-lg text-green-50">{reciter.name}</p>
      <p className="text-sm text-green-200 mb-3">{reciter.englishName}</p>
      <button
        onClick={handleAction}
        className={`mt-2 py-2 px-4 rounded-full font-semibold transition duration-300 flex items-center shadow-md ${
          isSelected ? 'bg-yellow-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400'
        }`}
      >
        {isSelected ? (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.75 13.5a.75.75 0 0 1-1.127.075L4.5 12.25a.75.75 0 0 1 1.06-1.06l4.227 4.227 9.157-12.704a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
                </svg>
                Selected
            </>
        ) : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.75 13.5a.75.75 0 0 1-1.127.075L4.5 12.25a.75.75 0 0 1 1.06-1.06l4.227 4.227 9.157-12.704a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
                </svg>
                Select
            </>
        )}
      </button>
    </div>
  );
};

// ProgressCard component to display individual user progress metrics.
const ProgressCard = ({ title, value, unit, icon, progressBar, progressPercent, milestoneText }) => (
  <div className="bg-green-700 p-4 rounded-xl shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200">
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-xl font-semibold text-green-50 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-green-200">{value}</p>
    <p className="text-sm text-green-300">{unit}</p>
    {progressBar && (
      <div className="w-full mt-3">
        <div className="h-2.5 bg-green-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-green-300 mt-1">{milestoneText}</p>
      </div>
    )}
  </div>
);

// AchievementsCard component to display unlocked and pending achievements.
const AchievementsCard = ({ achievements }) => (
  <div className="bg-green-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <h3 className="text-xl font-bold text-green-50 mb-3 flex items-center">
      <span className="text-3xl mr-2">🏆</span> Achievements
    </h3>
    <ul className="space-y-2">
      {achievements.map((achievement) => (
        <li key={achievement.id} className={`flex items-center ${achievement.achieved ? 'text-green-300' : 'text-green-400'}`}>
          <span className="text-lg mr-2">{achievement.icon}</span>
          <div>
            <p className="font-medium">{achievement.title}</p>
            <p className="text-xs">{achievement.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// HomeDashboard component, serving as the main landing page of the app.
const HomeDashboard = ({ setCurrentView, points, userProgress, unlockedReciters, handleUnlockReciter, showNotification, lastReadPosition, onContinueReading, selectedReciterId, onSelectReciter }) => {
  const [verseOfTheDay, setVerseOfTheDay] = useState(quranData.verseOfTheDay);

  return (
    <div className="space-y-8">
      {/* Top Navigation Cards for main features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card icon="📖" title="Read Quran" description="Browse surahs and verses" onClick={() => setCurrentView('surah-selector')} />
        <Card icon="🎧" title="Listen" description="Beautiful recitations" onClick={() => setCurrentView('listen')} />
        <Card icon="🎤" title="Practice" description="Record & improve" onClick={() => setCurrentView('practice')} />
        <Card icon="⏰" title="Prayer Times" description="Hanafi calculations" onClick={() => setCurrentView('prayer-times')} />
      </div>

      {/* NEW: Tasbeeh Counter & Qibla Finder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card icon="📿" title="Tasbeeh Counter" description="Keep track of your dhikr" onClick={() => setCurrentView('tasbeeh-counter')} />
        <Card icon="🕋" title="Qibla Finder" description="Find direction to Kaaba" onClick={() => setCurrentView('qibla-finder')} />
      </div>


      {/* Dynamic Verse of the Day display */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 rounded-xl shadow-lg text-white text-center transform hover:scale-105 transition-transform duration-300">
        <p className="text-lg md:text-xl mb-3 font-semibold">Verse of the Day</p>
        <p className="font-arabic text-3xl md:text-4xl mb-4 leading-relaxed">
          {verseOfTheDay.arabic}
        </p>
        <p className="text-sm italic mb-4 opacity-90">At-Talaq (65:2)</p> {/* Hardcoded for now, can be dynamic */}
        <p className="text-base md:text-lg">"{verseOfTheDay.translation}"</p>
        <div className="mt-5">
          <button className="bg-white bg-opacity-30 p-3 rounded-full hover:bg-opacity-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.715 1.295 2.565 0 3.28l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* NEW: Continue Reading Section - visible only if a last read position exists */}
      {lastReadPosition && (
          <div
              className="bg-gradient-to-r from-blue-800 to-blue-700 p-6 rounded-xl shadow-lg text-white text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={onContinueReading}
          >
              <p className="text-lg md:text-xl mb-3 font-semibold">Continue Reading</p>
              <p className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
                  Surah {quranData.surahs.find(s => s.id === lastReadPosition.surahId)?.englishName || 'Unknown'}
              </p>
              <p className="text-base md:text-lg opacity-90">
                  From Verse {lastReadPosition.verseId}
              </p>
              <div className="mt-5">
                  <button className="bg-white bg-opacity-30 p-3 rounded-full hover:bg-opacity-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                          <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                  </button>
              </div>
          </div>
      )}

      {/* Display of available reciters */}
      <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
        <h2 className="text-2xl font-bold mb-5">Available Reciters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...recitersData.featured, ...recitersData.free].map((reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              onSelectReciter={onSelectReciter}
              isSelected={selectedReciterId === reciter.id}
            />
          ))}
        </div>
      </div>

      {/* User Progress Summary section */}
      <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
        <h2 className="text-2xl font-bold mb-5">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressCard
            title="Daily Streak"
            value={userProgress.dailyStreak}
            unit="Days in a row"
            icon="🔥"
            progressBar={false}
          />
          <ProgressCard
            title="Verses Read"
            value={userProgress.versesRead}
            unit="verses"
            icon="📖"
            progressBar={true}
            progressPercent={(userProgress.versesRead % 100) / 100 * 100}
            milestoneText={`${100 - (userProgress.versesRead % 100)}% to next milestone`}
          />
          <AchievementsCard achievements={userProgress.achievements} />
        </div>
      </div>

      {/* Bookmarked Verses & Quiz Cards - arranged in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card icon="⭐" title="Bookmarked Verses" description="Access your saved verses" onClick={() => setCurrentView('bookmarks')} />
        <Card icon="❓" title="Quiz Me!" description="Test your Quran knowledge" onClick={() => setCurrentView('quiz')} />
      </div>
    </div>
  );
};

// SurahSelector component for Browse and selecting Quranic Surahs.
const SurahSelector = ({ onSelectSurah }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter surahs based on search term (English name, Arabic name, or ID).
  const filteredSurahs = quranData.surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.includes(searchTerm) ||
    surah.id.toString().includes(searchTerm)
  );

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
      <h2 className="text-2xl font-bold mb-5 text-center">Select a Surah</h2>
      <input
        type="text"
        placeholder="Search Surah by name or number..."
        className="w-full p-3 mb-5 rounded-lg bg-green-700 text-green-50 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <li key={surah.id}>
              <button
                onClick={() => onSelectSurah(surah.id)}
                className="w-full text-left p-4 bg-green-700 hover:bg-green-600 rounded-lg transition-colors duration-200 flex justify-between items-center text-green-50 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <div>
                  <p className="font-semibold text-lg">{surah.englishName}</p>
                  <p className="font-arabic text-xl text-green-200">{surah.name}</p>
                </div>
                <span className="text-sm text-green-300">{surah.numberOfVerses} Verses</span>
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-green-300 col-span-full">No surahs found matching your search.</p>
        )}
      </ul>
    </div>
  );
};

// QuranReader component for displaying and interacting with Quranic verses.
const QuranReader = ({ selectedSurahId, onBackToSurahList, onSurahChange, onVerseRead, onToggleBookmark, bookmarkedVerses, onVerseAudioPlay }) => {
  const [surahVerses, setSurahVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedVerseId, setHighlightedVerseId] = useState(null);
  const [selectedFont, setSelectedFont] = useState('Quranic (Default)'); // Default font family
  const [fontSize, setFontSize] = useState('text-xl'); // Default Tailwind font size class

  const audioRef = useRef(new Audio());
  audioRef.current.volume = 0.8; // Set default audio volume

  const selectedSurahMeta = quranData.surahs.find(s => s.id === selectedSurahId);

  // Effect to fetch surah verses from the API when selectedSurahId changes.
  useEffect(() => {
    const fetchSurah = async () => {
      setIsLoading(true);
      setError(null);
      setSurahVerses([]);
      setHighlightedVerseId(null);

      if (!selectedSurahId) {
        setError("No Surah selected.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch Arabic and English translation of the surah.
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahId}/editions/quran-simple,en.sahih`);
        const data = await response.json();

        if (data.code === 200 && data.data && data.data[0] && data.data[1]) {
          const arabicVerses = data.data[0].ayahs;
          const translationVerses = data.data[1] ? data.data[1].ayahs : []; // Handle potential missing translation edition

          // Combine Arabic text, translation, and audio URL for each verse.
          const combinedVerses = arabicVerses.map((arabicAyah, index) => ({
            id: arabicAyah.numberInSurah,
            arabic: arabicAyah.text,
            translation: translationVerses[index] ? translationVerses[index].text : 'Translation not available.',
            audio: arabicAyah.audio,
          }));
          setSurahVerses(combinedVerses); // Corrected typo here
        } else {
          setError("Failed to load Surah verses. Please try again.");
          console.error("API Error:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not connect to Quran API. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurah();
  }, [selectedSurahId]);

  // Effect to manage audio playback and reset highlighted verse.
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setHighlightedVerseId(null); // Clear highlight when audio ends.
    };
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause(); // Pause any playing audio when component unmounts or re-renders.
      audio.src = ''; // Clear audio source.
    };
  }, []);

  // Callback to play verse audio and update last read position.
  const playVerseAudio = useCallback((verseId, audioUrl) => {
    setHighlightedVerseId(verseId); // Highlight the currently playing verse.
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    onVerseAudioPlay(selectedSurahId, verseId); // Inform parent about audio play for last read tracking.
  }, [onVerseAudioPlay, selectedSurahId]);

  // Handler for navigating to the previous surah.
  const handlePrevSurah = () => {
    if (selectedSurahId > 1) {
      onSurahChange(selectedSurahId - 1); // Navigate to previous surah.
      audioRef.current.pause(); // Pause current audio.
      setHighlightedVerseId(null); // Clear highlight.
    }
  };

  // Handler for navigating to the next surah.
  const handleNextSurah = () => {
    if (selectedSurahId < quranData.surahs.length) {
      onSurahChange(selectedSurahId + 1); // Navigate to next surah.
      audioRef.current.pause(); // Pause current audio.
      setHighlightedVerseId(null); // Clear highlight.
    }
  };

  // Handler for changing font size.
  const handleFontSizeChange = (action) => {
    // Defines a list of Tailwind CSS text size classes.
    const currentSizes = fontSizes.map(f => f.className);
    const currentIndex = currentSizes.indexOf(fontSize);
    let newIndex = currentIndex;

    if (action === 'increase' && currentIndex < currentSizes.length - 1) {
        newIndex = currentIndex + 1;
    } else if (action === 'decrease' && currentIndex > 0) {
        newIndex = currentIndex - 1;
    }
    setFontSize(currentSizes[newIndex]); // Update font size state.
  };

  // Handler for changing font family.
  const handleFontFamilyChange = (fontName) => {
    setSelectedFont(fontName); // Update font family state.
  };

  // Loading state display.
  if (isLoading) {
    return <p className="text-center text-green-200 p-8">Loading Surah...</p>;
  }

  // Error state display.
  if (error) {
    return (
      <div className="text-center text-red-300 p-8 bg-red-900 rounded-xl shadow-md">
        <p>Error: {error}</p>
        <button onClick={onBackToSurahList} className="mt-4 bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-full transition duration-300">
          Back to Surah List
        </button>
      </div>
    );
  }

  // No verses found state display.
  if (!surahVerses.length) {
    return <p className="text-center text-green-200 p-8">No verses found for this Surah.</p>;
  }

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
      <div className="flex justify-between items-center mb-4 border-b pb-4 border-green-700">
        <button
          onClick={onBackToSurahList}
          className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
          </svg>
          Back to Surahs
        </button>
        <h2 className="text-3xl font-bold text-green-50 text-center">{selectedSurahMeta?.englishName}</h2>
        <div className="flex items-center space-x-2">
          {/* Font Size Controls */}
          <button
            onClick={() => handleFontSizeChange('decrease')}
            className="bg-green-700 text-green-50 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            A-
          </button>
          <button
            onClick={() => handleFontSizeChange('increase')}
            className="bg-green-700 text-green-50 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            A+
          </button>
          {/* Font Family Dropdown */}
          <select
            value={selectedFont}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="bg-green-700 text-green-50 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {fontFamilies.map(font => (
                <option key={font.name} value={font.name}>{font.name}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xl text-green-200 text-center mt-3 mb-6 font-semibold">
        {selectedSurahMeta?.name} ({selectedSurahMeta?.numberOfVerses} Verses)
      </p>

      <div className="space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar p-3">
        {surahVerses.map((verse) => {
          const isBookmarked = bookmarkedVerses.some(b => b.surahId === selectedSurahId && b.verseId === verse.id);
          return (
            <div
              key={verse.id}
              className={`p-4 rounded-lg transition-all duration-300 border border-green-700 ${
                highlightedVerseId === verse.id ? 'bg-green-700 shadow-lg scale-[1.01]' : 'hover:bg-green-700 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-base font-medium text-green-300 bg-green-900 px-3 py-1 rounded-full">Verse {verse.id}</span>
                <div className="flex items-center space-x-2">
                  {verse.audio && (
                    <button
                      onClick={() => playVerseAudio(verse.id, verse.audio)}
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      title={`Play Verse ${verse.id}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => onToggleBookmark({
                      surahId: selectedSurahId,
                      surahName: selectedSurahMeta.englishName,
                      verseId: verse.id,
                      verseArabic: verse.arabic,
                      verseTranslation: verse.translation
                    })}
                    className={`p-2 rounded-full transition-colors flex items-center justify-center text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 ${
                      isBookmarked ? 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400' : 'bg-green-600 hover:bg-green-500 text-white focus:ring-green-400'
                    }`}
                    title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 2.5a5.5 5.5 0 0 0-5.5 5.5c0 1.637.525 3.197 1.396 4.542L10 17.5l4.104-5.458C14.975 11.197 15.5 9.637 15.5 8A5.5 5.5 0 0 0 10 2.5ZM8.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Dynamic Arabic Font and Size */}
              <p className={`${fontFamilies.find(f => f.name === selectedFont)?.className || 'font-arabic'} ${fontSize} text-right mb-2 leading-relaxed`}>
                {verse.arabic}
              </p>
              {/* Translation with a slightly smaller relative size */}
              <p className={`text-base text-green-200 text-left`}>
                {verse.translation}
              </p>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons for previous/next surah */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevSurah}
          disabled={selectedSurahId === 1}
          className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
          </svg>
          Previous Surah
        </button>
        <button
          onClick={handleNextSurah}
          disabled={selectedSurahId === quranData.surahs.length}
          className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Next Surah
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-2">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// BookmarkedVerses component to display and manage saved verses.
const BookmarkedVerses = ({ bookmarkedVerses, onRemoveBookmark, onReadBookmarkedSurah, onBackToDashboard }) => {
    return (
        <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
            <div className="flex justify-between items-center mb-4 border-b pb-4 border-green-700">
                <button
                    onClick={onBackToDashboard}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="text-3xl font-bold text-green-50 text-center">Bookmarked Verses</h2>
                <div></div> {/* Placeholder for alignment */}
            </div>

            {bookmarkedVerses.length === 0 ? (
                <p className="text-center text-green-300 p-8">You have no bookmarked verses yet.</p>
            ) : (
                <ul className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-3">
                    {bookmarkedVerses.map((bookmark, index) => (
                        <li key={index} className="bg-green-700 p-4 rounded-lg shadow-sm flex flex-col hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-lg text-green-50">
                                    {bookmark.surahName}: Verse {bookmark.verseId}
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onReadBookmarkedSurah(bookmark.surahId)}
                                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        title="Go to Surah"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path d="M10 2a.75.75 0 0 1 .75.75V10h7.25a.75.75 0 0 1 0 1.5H10.75V19a.75.75 0 0 1-1.5 0v-7.25H2.75a.75.75 0 0 1 0-1.5H9.25V2.75A.75.75 0 0 1 10 2Z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onRemoveBookmark(bookmark)}
                                        className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                        title="Remove Bookmark"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M8.79 3.828a.75.75 0 0 0-1.58 0L.982 13.086A.75.75 0 0 0 1.67 14.25h16.66a.75.75 0 0 0 .689-1.164L8.79 3.828ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p className="font-arabic text-2xl text-right mb-2 text-green-100">
                                {bookmark.verseArabic}
                            </p>
                            <p className="text-sm text-green-200 text-left">
                                {bookmark.verseTranslation}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// PrayerTimesDisplay component to show mock prayer times and countdown.
const PrayerTimesDisplay = () => {
    const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes());
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time and recalculate prayer times every second.
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            setPrayerTimes(getPrayerTimes());
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on component unmount.
    }, []);

    return (
        <div className="bg-green-700 p-6 rounded-xl shadow-lg text-green-50">
            <h3 className="text-2xl font-bold mb-4 text-center">Today's Prayer Times</h3>
            <p className="text-center text-lg mb-6">Current Time: {format(currentTime, 'p')}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {prayerTimes.times.map(p => (
                    <div key={p.name} className="flex items-center justify-between bg-green-600 p-3 rounded-lg shadow-sm">
                        <span className="text-xl mr-2">{p.icon}</span>
                        <span className="font-semibold text-lg">{p.name}</span>
                        <span className="text-lg">{format(p.time, 'p')}</span>
                    </div>
                ))}
            </div>
            {prayerTimes.nextPrayer && (
                <div className="text-center bg-green-600 p-4 rounded-lg shadow-md mt-4">
                    <p className="text-xl font-bold text-green-200">Next Prayer: {prayerTimes.nextPrayer.name}</p>
                    <p className="text-xl text-green-100">Time until: {prayerTimes.timeToNextPrayer}</p>
                </div>
            )}
        </div>
    );
};


// Quiz component for interactive multiple-choice questions.
const Quiz = ({ onBackToDashboard, onEarnPoints, showNotification, quranData }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Combined");
    const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);

    // Effect to reset and shuffle questions when category changes or quiz restarts.
    useEffect(() => {
        let questionsToUse = [];
        if (selectedCategory === "Combined") {
            questionsToUse = [...quizQuestions]; // Use all questions
        } else {
            questionsToUse = quizQuestions.filter(q => q.category === selectedCategory);
        }
        // Shuffle questions randomly.
        setCurrentQuizQuestions(questionsToUse.sort(() => 0.5 - Math.random()));
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResults(false);
    }, [selectedCategory, quizStarted]); // Dependencies: category or quiz start trigger.

    // Handler for selecting an answer.
    const handleAnswerSelect = (answer) => {
        if (selectedAnswer === null) { // Prevent changing answer after selection.
            setSelectedAnswer(answer);
            if (answer === currentQuizQuestions[currentQuestionIndex].correctAnswer) {
                setScore(score + 1);
                onEarnPoints(10); // Award points for correct answer.
                showNotification("Correct! +10 points!", "success");
            } else {
                showNotification("Incorrect. Try again!", "error");
            }
        }
    };

    // Handler for moving to the next question or showing results.
    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentQuizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null); // Reset selected answer for next question.
        } else {
            setShowResults(true); // Show results when all questions are answered.
        }
    };

    // Handler for restarting the quiz.
    const handleRestartQuiz = () => {
        setQuizStarted(false); // Go back to category selection.
        setSelectedCategory("Combined"); // Reset to combined category.
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResults(false);
    };

    // Render quiz category selection screen.
    if (!quizStarted) {
        return (
            <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50 text-center">
                <h2 className="text-3xl font-bold mb-6">Test Your Knowledge!</h2>
                <p className="text-lg mb-4">Choose a quiz category to begin:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {quizCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setQuizStarted(true);
                            }}
                            className={`p-4 rounded-lg font-semibold transition duration-300 ${
                                selectedCategory === category
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-green-700 hover:bg-green-600 text-green-100 shadow-md'
                            } focus:outline-none focus:ring-2 focus:ring-green-400`}
                        >
                            {category === "Combined" ? "All Topics" : category}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onBackToDashboard}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full mt-4 flex items-center justify-center mx-auto transition duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // Render message if no questions are available for the selected category.
    if (currentQuizQuestions.length === 0 && quizStarted) {
        return (
            <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50 text-center">
                <h2 className="text-3xl font-bold mb-6">No Questions Available</h2>
                <p className="text-lg mb-4">There are no questions for the selected category. Please choose another.</p>
                <button
                    onClick={handleRestartQuiz}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-6 rounded-full transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Choose Another Category
                </button>
                <button
                    onClick={onBackToDashboard}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full mt-4 flex items-center justify-center mx-auto transition duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    // Find surah metadata if the question is surah-specific.
    const surahMeta = currentQuestion.surahId ? quranData.surahs.find(s => s.id === currentQuestion.surahId) : null;

    return (
        <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
            <div className="flex justify-between items-center mb-4 border-b pb-4 border-green-700">
                <button
                    onClick={onBackToDashboard}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="text-3xl font-bold text-green-50 text-center">Quiz Time!</h2>
                <span className="text-xl font-bold">Score: {score}</span>
            </div>

            {showResults ? (
                // Display quiz results when finished.
                <div className="text-center p-8">
                    <h3 className="text-4xl font-bold text-green-300 mb-4">Quiz Complete!</h3>
                    <p className="text-2xl text-green-100 mb-6">You scored {score} out of {currentQuizQuestions.length}!</p>
                    <button
                        onClick={handleRestartQuiz}
                        className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-3 px-8 rounded-full transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                // Display current question and choices.
                <div>
                    <p className="text-lg text-green-200 mb-2">Question {currentQuestionIndex + 1} of {currentQuizQuestions.length}</p>
                    {surahMeta && <p className="text-md text-green-300 italic mb-4">Category: {currentQuestion.category} - From Surah {surahMeta.englishName}</p>}
                    {!surahMeta && <p className="text-md text-green-300 italic mb-4">Category: {currentQuestion.category}</p>}
                    <h3 className="text-2xl md:text-3xl font-semibold mb-6 leading-relaxed">
                        {currentQuestion.question}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.choices.map((choice, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(choice)}
                                className={`p-4 rounded-lg text-left font-medium transition duration-300 ${
                                    selectedAnswer === choice
                                        ? (choice === currentQuestion.correctAnswer ? 'bg-green-600 text-white shadow-lg border border-green-400' : 'bg-red-600 text-white shadow-lg border border-red-400')
                                        : 'bg-green-700 hover:bg-green-600 text-green-100 shadow-md hover:shadow-lg'
                                } ${selectedAnswer !== null && 'cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-green-400`}
                                disabled={selectedAnswer !== null} // Disable buttons after an answer is selected.
                            >
                                {choice}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === null} // Enable "Next" button only after an answer.
                            className={`py-3 px-8 rounded-full font-semibold transition duration-300 shadow-md ${
                                selectedAnswer !== null
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            }`}
                        >
                            {currentQuestionIndex < currentQuizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- NEW COMPONENT: TasbeehCounter ---
const TasbeehCounter = ({ onBackToDashboard, showNotification, onEarnPoints }) => {
    const [count, setCount] = useState(0); // This count will persist as long as the component is mounted
    const [target, setTarget] = useState(0);
    const [showTargetInput, setShowTargetInput] = useState(false);
    const targetInputRef = useRef(null);
    const lastAwardedThousand = useRef(0); // To track points for every 1000 counts

    const increment = () => {
        setCount(prevCount => {
            const newCount = prevCount + 1;

            // Check for target reached
            if (target > 0 && newCount >= target) {
                showNotification(`Target of ${target} reached! Alhamdulillah! 🎉`, 'success');
                setTarget(0); // Reset target after reaching it
            }

            // Award points for every 1000 counts
            const currentThousand = Math.floor(newCount / 1000);
            if (currentThousand > lastAwardedThousand.current) {
                onEarnPoints(10); // Award 10 points
                showNotification(`Tasbeeh milestone! +10 points for ${currentThousand * 1000} counts!`, 'success');
                lastAwardedThousand.current = currentThousand;
            }

            return newCount;
        });
    };

    const reset = () => {
        setCount(0);
        setTarget(0); // Reset target on full reset
        lastAwardedThousand.current = 0; // Reset point tracking
        showNotification('Tasbeeh counter reset.', 'info');
    };

    const handleSetTarget = () => {
        setShowTargetInput(true);
    };

    const confirmSetTarget = () => {
        const newTarget = parseInt(targetInputRef.current.value, 10);
        if (!isNaN(newTarget) && newTarget > 0) {
            setTarget(newTarget);
            showNotification(`Target set to ${newTarget}`, 'success');
        } else {
            showNotification('Please enter a valid target number.', 'error');
        }
        setShowTargetInput(false);
    };

    const cancelSetTarget = () => {
        setShowTargetInput(false);
    };

    return (
        <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50 text-center flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-4 border-b pb-4 border-green-700">
                <button
                    onClick={onBackToDashboard}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="text-3xl font-bold text-green-50">Tasbeeh Counter</h2>
                <div className="w-12"></div> {/* Placeholder for alignment */}
            </div>

            <div className="my-8">
                <p className="text-xl text-green-200">Current Count:</p>
                <p className="text-8xl md:text-9xl font-extrabold text-green-100">{count}</p>
                {target > 0 && <p className="text-2xl text-green-300 mt-2">Target: {target}</p>}
            </div>

            <button
                onClick={increment}
                className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-6xl md:text-8xl font-bold flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400"
            >
                +
            </button>

            <div className="mt-8 flex space-x-4">
                <button
                    onClick={reset}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Reset
                </button>
                <button
                    onClick={handleSetTarget}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Set Target
                </button>
            </div>

            {showTargetInput && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-green-700 p-8 rounded-xl shadow-lg text-center">
                        <h3 className="text-2xl font-bold mb-4">Set Tasbeeh Target</h3>
                        <input
                            type="number"
                            ref={targetInputRef}
                            placeholder="e.g., 33, 100, 1000"
                            className="w-full p-3 rounded-lg bg-green-600 text-green-50 placeholder-green-200 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                            min="1"
                        />
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmSetTarget}
                                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-5 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={cancelSetTarget}
                                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-5 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- NEW COMPONENT: QiblaFinder ---
const QiblaFinder = ({ onBackToDashboard, showNotification }) => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [heading, setHeading] = useState(null); // Device's current magnetic heading (0-360, North=0)
    const [qiblaDirection, setQiblaDirection] = useState(null); // Angle from North to Qibla
    const [error, setError] = useState('');
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);

    // Mecca coordinates
    const MECCA_LAT = 21.4225; // N
    const MECCA_LON = 39.8262; // E

    // Function to request device orientation permission for iOS 13+
    const requestDeviceOrientationPermission = async () => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                setIsRequestingPermission(true);
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState === 'granted') {
                    setPermissionGranted(true);
                    setError('');
                    showNotification('Device orientation permission granted!', 'success');
                } else {
                    setPermissionGranted(false);
                    setError('Device orientation permission denied. Qibla finder may not work.');
                    showNotification('Device orientation permission denied.', 'error');
                }
            } catch (err) {
                setError('Error requesting device orientation permission.');
                showNotification('Error requesting device orientation permission.', 'error');
                console.error(err);
            } finally {
                setIsRequestingPermission(false);
            }
        } else {
            // For Android or older iOS, permission is usually granted by default
            setPermissionGranted(true);
            setError('');
        }
    };

    // Calculate Qibla direction (bearing) using Haversine-like formula
    const calculateQiblaDirection = useCallback((userLat, userLon) => {
        const latRad = userLat * Math.PI / 180;
        const lonRad = userLon * Math.PI / 180;
        const meccaLatRad = MECCA_LAT * Math.PI / 180;
        const meccaLonRad = MECCA_LON * Math.PI / 180;

        const deltaLon = meccaLonRad - lonRad;

        const y = Math.sin(deltaLon);
        const x = Math.cos(latRad) * Math.tan(meccaLatRad) - Math.sin(latRad) * Math.cos(deltaLon);

        let bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        setQiblaDirection(bearing);
    }, []);

    // Effect to get geolocation and listen for device orientation
    useEffect(() => {
        // Get Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    calculateQiblaDirection(position.coords.latitude, position.coords.longitude);
                    setError('');
                },
                (geoError) => {
                    setError(`Geolocation error: ${geoError.message}. Please enable location services.`);
                    showNotification(`Geolocation error: ${geoError.message}.`, 'error');
                    console.error("Geolocation error:", geoError);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
            showNotification('Geolocation not supported.', 'error');
        }

        // Device Orientation Listener
        const handleDeviceOrientation = (event) => {
            // `alpha` is the compass heading relative to North (0-360 degrees)
            // `webkitCompassHeading` is for older iOS versions
            let currentHeading = event.alpha || event.webkitCompassHeading;
            if (currentHeading !== null) {
                setHeading(currentHeading);
            }
        };

        if (permissionGranted) {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [permissionGranted, calculateQiblaDirection, showNotification]);

    // Calculate the rotation needed for the compass arrow
    const arrowRotation = heading !== null && qiblaDirection !== null
        ? qiblaDirection - heading
        : 0; // Default to 0 if no data

    return (
        <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50 text-center flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-4 border-b pb-4 border-green-700">
                <button
                    onClick={onBackToDashboard}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="text-3xl font-bold text-green-50">Qibla Finder</h2>
                <div className="w-12"></div> {/* Placeholder for alignment */}
            </div>

            {error && <p className="text-red-400 mb-4">{error}</p>}

            {!permissionGranted && (
                <div className="p-4 bg-green-700 rounded-lg shadow-md mb-6">
                    <p className="text-lg mb-3">To use the Qibla Finder, please grant permission for device motion and location.</p>
                    <button
                        onClick={requestDeviceOrientationPermission}
                        disabled={isRequestingPermission}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRequestingPermission ? 'Requesting...' : 'Grant Permissions'}
                    </button>
                </div>
            )}

            {latitude && longitude && (
                <div className="mb-6 text-lg">
                    <p>Your Location:</p>
                    <p>Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}</p>
                </div>
            )}

            <div className="relative w-48 h-48 bg-green-700 rounded-full flex items-center justify-center mb-8 shadow-xl">
                <div className="absolute text-green-300 text-xl font-bold" style={{ top: '-1.5rem' }}>N</div>
                <div className="absolute text-green-300 text-xl font-bold" style={{ bottom: '-1.5rem' }}>S</div>
                <div className="absolute text-green-300 text-xl font-bold" style={{ left: '-1.5rem' }}>W</div>
                <div className="absolute text-green-300 text-xl font-bold" style={{ right: '-1.5rem' }}>E</div>

                {/* Compass Needle */}
                <div
                    className="absolute w-2 h-24 bg-red-500 rounded-b-full origin-bottom"
                    style={{
                        transform: `translateY(-50%) rotate(${heading !== null ? -heading : 0}deg)`,
                        transformOrigin: 'bottom center',
                        transition: 'transform 0.5s ease-out',
                    }}
                >
                    <div className="w-full h-1/2 bg-red-700 rounded-t-full"></div> {/* Red tip */}
                </div>

                {/* Qibla Indicator (Kaaba icon) */}
                {qiblaDirection !== null && (
                    <div
                        className="absolute text-4xl text-yellow-400 transition-transform duration-500 ease-out"
                        style={{
                            transform: `translate(-50%, -50%) rotate(${arrowRotation}deg) translateY(-60px)`, // Position at top, rotate
                            transformOrigin: '50% 50%',
                            left: '50%',
                            top: '50%',
                        }}
                    >
                        🕋
                    </div>
                )}
            </div>

            {heading !== null && (
                <p className="text-xl mb-2">Your Current Heading: {heading.toFixed(1)}°</p>
            )}
            {qiblaDirection !== null && (
                <p className="text-xl mb-2">Qibla Direction: {qiblaDirection.toFixed(1)}° from North</p>
            )}
            {heading !== null && qiblaDirection !== null && (
                <p className="text-xl font-semibold text-green-200 mt-4">
                    Rotate your device until the 🕋 icon points directly upwards.
                </p>
            )}
            {!latitude || !longitude && <p className="text-green-300">Awaiting location data...</p>}
            {!heading && permissionGranted && <p className="text-green-300">Awaiting device orientation data...</p>}

        </div>
    );
};

// --- NEW COMPONENT: ListenView for Full Surah Audio ---
const ListenView = ({ onBackToDashboard, selectedReciter, showNotification, quranData }) => {
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const audioRef = useRef(new Audio());
    audioRef.current.volume = 0.8; // Default volume

    // Effect to clean up audio when component unmounts or reciter/surah changes
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Effect to fetch and play audio when selectedSurah or selectedReciter changes
    useEffect(() => {
        const fetchAndPlayAudio = async () => {
            if (selectedSurah && selectedReciter) {
                setIsLoading(true);
                setError('');
                setAudioUrl('');
                audioRef.current.pause(); // Pause any currently playing audio

                try {
                    // Construct the audio URL for the full surah
                    // Example: https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/1
                    // For full surah, the API expects /v1/surah/{surah_number}/ar.{reciter_id}
                    const fullSurahAudioUrl = `https://api.alquran.cloud/v1/surah/${selectedSurah.id}/ar.${selectedReciter.alquranCloudId}`;
                    const response = await fetch(fullSurahAudioUrl);
                    const data = await response.json();

                    if (data.code === 200 && data.data && data.data.audio) {
                        setAudioUrl(data.data.audio);
                        audioRef.current.src = data.data.audio;
                        audioRef.current.play().catch(e => {
                            console.error("Error playing audio:", e);
                            setError("Failed to play audio. Please try again.");
                            showNotification("Failed to play audio. Browser might block autoplay.", "error");
                        });
                        showNotification(`Playing Surah ${selectedSurah.englishName} by ${selectedReciter.englishName}`, 'info');
                    } else {
                        setError('Failed to fetch full surah audio. Please try another surah or reciter.');
                        showNotification('Failed to fetch audio.', 'error');
                        console.error("API Error fetching full surah audio:", data);
                    }
                } catch (err) {
                    console.error("Fetch error for full surah audio:", err);
                    setError('Could not connect to audio API. Check your internet connection.');
                    showNotification('Network error fetching audio.', 'error');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchAndPlayAudio();
    }, [selectedSurah, selectedReciter, showNotification]);

    const handleSurahSelect = (surahId) => {
        const surah = quranData.surahs.find(s => s.id === surahId);
        setSelectedSurah(surah);
    };

    const togglePlayPause = () => {
        if (audioRef.current.paused) {
            audioRef.current.play().catch(e => {
                console.error("Error resuming audio:", e);
                showNotification("Failed to resume audio. Browser might block autoplay.", "error");
            });
        } else {
            audioRef.current.pause();
        }
    };

    const stopAudio = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioUrl(''); // Clear URL to reset state
        setSelectedSurah(null); // Clear selected surah
        showNotification('Audio stopped.', 'info');
    };

    // Combine all reciters for display
    const allReciters = [...recitersData.featured, ...recitersData.free];

    if (!selectedReciter) {
        return (
            <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50 text-center">
                <h2 className="text-3xl font-bold mb-6">Listen to Quran</h2>
                <p className="text-lg mb-4">Please select a reciter from the Home Dashboard first.</p>
                <button
                    onClick={onBackToDashboard}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full mt-4 flex items-center justify-center mx-auto transition duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
            <div className="flex justify-between items-center mb-4 border-b pb-4 border-green-700">
                <button
                    onClick={onBackToDashboard}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
                <h2 className="text-3xl font-bold text-green-50">Listen to Quran</h2>
                <div className="w-12"></div> {/* Placeholder for alignment */}
            </div>

            <p className="text-center text-xl mb-4">Selected Reciter: <span className="font-semibold text-yellow-300">{selectedReciter.englishName}</span></p>

            <div className="mb-6">
                <label htmlFor="surah-select" className="block text-lg font-semibold mb-2">Select Surah:</label>
                <select
                    id="surah-select"
                    onChange={(e) => handleSurahSelect(parseInt(e.target.value))}
                    value={selectedSurah ? selectedSurah.id : ''}
                    className="w-full p-3 rounded-lg bg-green-700 text-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    <option value="">-- Choose a Surah --</option>
                    {quranData.surahs.map(surah => (
                        <option key={surah.id} value={surah.id}>
                            {surah.englishName} ({surah.name})
                        </option>
                    ))}
                </select>
            </div>

            {isLoading && <p className="text-center text-green-300">Loading audio...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}

            {selectedSurah && audioUrl && !isLoading && (
                <div className="mt-8 text-center">
                    <p className="text-2xl font-bold mb-4">Now Playing: {selectedSurah.englishName}</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={togglePlayPause}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            title={audioRef.current.paused ? 'Play' : 'Pause'}
                        >
                            {audioRef.current.paused ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.715 1.295 2.565 0 3.28l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75H16.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={stopAudio}
                            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                            title="Stop"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                <path fillRule="evenodd" d="M6.75 5.25A.75.75 0 0 1 7.5 4.5h9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- Main App Component ---
// This is the root component of the application, managing global state and routing.
export default function App() {
  const [currentView, setCurrentView] = useState('home'); // Controls which main section is displayed.
  const [selectedSurahId, setSelectedSurahId] = useState(null); // Stores the ID of the currently selected Surah for QuranReader.
  const [notification, setNotification] = useState(null); // Manages notification messages.

  // State for user points, initialized with a default. Data will reset on refresh.
  const [points, setPoints] = useState(0);

  // State for tracking the last read position, initialized with a default or a random verse.
  const [lastReadPosition, setLastReadPosition] = useState(() => {
    // This function runs only once during initial render
    // If there's no saved last read position, pick a random one
    const randomSurahIndex = Math.floor(Math.random() * quranData.surahs.length);
    const randomSurah = quranData.surahs[randomSurahIndex];
    const randomVerseId = Math.floor(Math.random() * randomSurah.numberOfVerses) + 1;
    return {
        surahId: randomSurah.id,
        verseId: randomVerseId
    };
  });

  // State for overall user progress (streak, verses read, achievements), initialized with defaults. Data will reset on refresh.
  const [userProgress, setUserProgress] = useState({
    dailyStreak: 0,
    lastReadDate: null,
    versesRead: 0,
    achievements: achievementsData.map(a => ({ ...a })), // Deep copy to allow individual achievement modification.
  });

  // State for bookmarked verses, initialized with a default. Data will reset on refresh.
  const [bookmarkedVerses, setBookmarkedVerses] = useState([]);

  // State for selected reciter for audio playback
  const [selectedReciter, setSelectedReciter] = useState(recitersData.featured[0]); // Default to Al-Afasy


  // Callback function to display a notification message.
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null); // Clear notification after 3 seconds.
    }, 3000);
    return () => clearTimeout(timer); // Cleanup timer.
  }, []);

  // Callback for selecting a reciter for audio playback
  const handleSelectReciter = useCallback((reciterId, alquranCloudId) => {
    const reciter = [...recitersData.featured, ...recitersData.free].find(r => r.id === reciterId);
    if (reciter) {
      setSelectedReciter(reciter);
      showNotification(`Reciter selected: ${reciter.englishName}`, 'info');
    }
  }, [showNotification]);


  // Callback for adding or removing a bookmark.
  const handleToggleBookmark = useCallback((verseInfo) => {
    setBookmarkedVerses(prevBookmarks => { // Use direct setter
      const isBookmarked = prevBookmarks.some(b => b.surahId === verseInfo.surahId && b.verseId === verseInfo.verseId);
      if (isBookmarked) {
        showNotification('Bookmark removed!', 'info');
        return prevBookmarks.filter(b => !(b.surahId === verseInfo.surahId && b.verseId === verseInfo.verseId));
      } else {
        showNotification('Verse bookmarked!', 'success');
        return [...prevBookmarks, verseInfo];
      }
    });
  }, [showNotification]); // Dependency updated to setBookmarkedVerses

  // Callback to update user progress when a verse is read (or audio is played).
  const handleVerseRead = useCallback(() => {
    setUserProgress(prev => { // Use direct setter
        const newVersesRead = prev.versesRead + 1;
        const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
        const lastRead = prev.lastReadDate;
        let newStreak = prev.dailyStreak;

        // Logic for daily streak calculation.
        if (!lastRead) {
            newStreak = 1;
        } else {
            const lastDate = parseISO(lastRead);
            const tomorrow = addDays(lastDate, 1);
            if (format(startOfDay(new Date()), 'yyyy-MM-dd') === format(startOfDay(tomorrow), 'yyyy-MM-dd')) {
                newStreak += 1;
            } else if (format(startOfDay(new Date()), 'yyyy-MM-dd') !== format(startOfDay(lastDate), 'yyyy-MM-dd')) {
                newStreak = 1; // Streak broken if not today or yesterday.
            }
        }

        let updatedAchievements = [...prev.achievements]; // Create a mutable copy.
        let achievementUnlocked = false; // Flag to check if any achievement was unlocked.

        // Check for 'Daily Reader' achievement.
        if (newStreak >= 7 && !updatedAchievements.find(a => a.id === 'first-week')?.achieved) {
            updatedAchievements = updatedAchievements.map(a =>
                a.id === 'first-week' ? { ...a, achieved: true } : a
            );
            showNotification("Achievement Unlocked: Daily Reader! 📅", "success");
            setPoints(currentPoints => currentPoints + 50); // Award points for achievement.
            achievementUnlocked = true;
        }

        // Check for 'First Read' achievement.
        if (newVersesRead >= 1 && !updatedAchievements.find(a => a.id === 'first-read')?.achieved) {
            updatedAchievements = updatedAchievements.map(a =>
                a.id === 'first-read' ? { ...a, achieved: true } : a
            );
            showNotification("Achievement Unlocked: First Read! ✨", "success");
            setPoints(currentPoints => currentPoints + 20); // Award points for achievement.
            achievementUnlocked = true;
        }

        return { ...prev, versesRead: newVersesRead, dailyStreak: newStreak, lastReadDate: today, achievements: updatedAchievements };
    });
  }, [showNotification, setPoints]); // Dependency updated to setPoints

  // Callback to handle selection of a surah from the selector.
  const handleSelectSurah = useCallback((surahId) => {
    setSelectedSurahId(surahId);
    setCurrentView('quran-reader');
    setLastReadPosition({ surahId: surahId, verseId: 1 }); // Use direct setter
  }, []);

  // Callback to handle changing surah within the reader.
  const handleSurahChange = useCallback((newSurahId) => {
    setSelectedSurahId(newSurahId);
    setLastReadPosition({ surahId: newSurahId, verseId: 1 }); // Use direct setter
  }, []);

  // Callback specifically for when a verse's audio starts playing.
  const handleVerseAudioPlay = useCallback((surahId, verseId) => {
    setLastReadPosition({ surahId: surahId, verseId: verseId }); // Use direct setter
    handleVerseRead(); // Also count this as a "read" for progress tracking.
  }, [handleVerseRead]);

  // Callback for earning points, typically from quizzes.
  const handleEarnPoints = useCallback((amount) => {
      setPoints(prevPoints => { // Use direct setter
          const newPoints = prevPoints + amount;
          // Check for 'Quiz Whiz' achievement when points increase.
          if (newPoints >= 500 && !userProgress.achievements.find(a => a.id === 'quiz-whiz')?.achieved) {
              setUserProgress(prev => ({ // Use direct setter
                  ...prev,
                  achievements: prev.achievements.map(a =>
                      a.id === 'quiz-whiz' ? { ...a, achieved: true } : a
                  )
              }));
              showNotification("Achievement Unlocked: Quiz Whiz! ❓", "success");
              return newPoints + 100; // Award extra points for achievement.
          }
          return newPoints;
      });
  }, [showNotification, userProgress.achievements]); // Dependencies updated to direct setters


  // No loading screen needed as there's no external data to fetch on mount for user state.

  return (
    <div className="min-h-screen bg-green-900 text-green-50 font-sans"> {/* Applied general font-sans */}
      <header className="bg-green-800 p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-50">Quran App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xl font-semibold">🌟 {points} Points</span>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-green-700 hover:bg-green-600 text-green-50 p-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a1.5 1.5 0 0 1 0 2.12l-5.15 5.15a1.5 1.5 0 0 1-2.12 0L2.84 12.53a.75.75 0 0 1 0-1.06l8.69-8.69Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8">
        {/* Conditional rendering based on currentView state */}
        {currentView === 'home' && (
          <HomeDashboard
            setCurrentView={setCurrentView}
            points={points}
            userProgress={userProgress}
            unlockedReciters={unlockedReciters}
            handleUnlockReciter={() => {}} // No unlock logic needed as all are free
            showNotification={showNotification}
            lastReadPosition={lastReadPosition}
            onContinueReading={() => {
                if (lastReadPosition) {
                    setSelectedSurahId(lastReadPosition.surahId);
                    setCurrentView('quran-reader');
                } else {
                    // This case should ideally not be hit with the new initial state logic,
                    // but keeping it as a fallback.
                    showNotification("No previous reading found!", "info");
                }
            }}
            selectedReciterId={selectedReciter.id}
            onSelectReciter={handleSelectReciter}
          />
        )}
        {currentView === 'surah-selector' && (
          <SurahSelector onSelectSurah={handleSelectSurah} />
        )}
        {currentView === 'quran-reader' && selectedSurahId && (
          <QuranReader
            selectedSurahId={selectedSurahId}
            onBackToSurahList={() => setCurrentView('surah-selector')}
            onSurahChange={handleSurahChange}
            onVerseRead={handleVerseRead} // Still used for streak/general read count.
            onToggleBookmark={handleToggleBookmark}
            bookmarkedVerses={bookmarkedVerses}
            onVerseAudioPlay={handleVerseAudioPlay} // Prop to update last read position on audio play.
          />
        )}
        {currentView === 'listen' && (
          <ListenView
            onBackToDashboard={() => setCurrentView('home')}
            selectedReciter={selectedReciter}
            showNotification={showNotification}
            quranData={quranData}
          />
        )}
        {currentView === 'practice' && (
            <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
                <h2 className="text-2xl font-bold mb-5 text-center">Practice Recitation (Coming Soon!)</h2>
                <p className="text-center text-green-200">
                    This section will allow you to record your recitation and compare it.
                </p>
                 <button
                    onClick={() => setCurrentView('home')}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full mt-4 flex items-center justify-center mx-auto transition duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
        )}
        {currentView === 'prayer-times' && (
            <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
                <h2 className="text-2xl font-bold mb-5 text-center">Prayer Times</h2>
                <PrayerTimesDisplay />
                 <button
                    onClick={() => setCurrentView('home')}
                    className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full mt-4 flex items-center justify-center mx-auto transition duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
        )}
        {currentView === 'bookmarks' && (
            <BookmarkedVerses
                bookmarkedVerses={bookmarkedVerses}
                onRemoveBookmark={handleToggleBookmark}
                onReadBookmarkedSurah={handleSelectSurah}
                onBackToDashboard={() => setCurrentView('home')}
            />
        )}
        {currentView === 'quiz' && (
            <Quiz
                onBackToDashboard={() => setCurrentView('home')}
                onEarnPoints={handleEarnPoints}
                showNotification={showNotification}
                quranData={quranData}
            />
        )}
        {/* NEW VIEWS */}
        {currentView === 'tasbeeh-counter' && (
            <TasbeehCounter
                onBackToDashboard={() => setCurrentView('home')}
                showNotification={showNotification}
                onEarnPoints={handleEarnPoints}
            />
        )}
        {currentView === 'qibla-finder' && (
            <QiblaFinder
                onBackToDashboard={() => setCurrentView('home')}
                showNotification={showNotification}
            />
        )}
      </main>

      {/* Notification display area */}
      {notification && (
        <NotificationMessage
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Vercel Analytics Component - placed at the root level for global tracking */}
      <Analytics />
    </div>
  );
}
