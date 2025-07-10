// --- Initial Setup and Data Imports ---
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO, startOfDay, addDays, differenceInSeconds } from 'date-fns';
// NEW: Import Vercel Analytics component for web analytics
import { Analytics } from '@vercel/analytics/react';

// NEW: Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

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
    { id: 39, name: 'الزمر', englishName: 'Az-Zumar', 'numberOfVerses': 75 },
    { id: 40, name: 'غافر', englishName: 'Ghafir', 'numberOfVerses': 85 },
    { id: 41, 'name': 'فصلت', 'englishName': 'Fussilat', 'numberOfVerses': 54 },
    { id: 42, 'name': 'الشورى', 'englishName': 'Ash-Shuraa', 'numberOfVerses': 53 },
    { id: 43, 'name': 'الزخرف', 'englishName': 'Az-Zukhruf', 'numberOfVerses': 89 },
    { id: 44, 'name': 'الدخان', 'englishName': 'Ad-Dukhan', 'numberOfVerses': 59 },
    { id: 45, 'name': 'الجاثية', 'englishName': 'Al-Jathiya', 'numberOfVerses': 37 },
    { id: 46, 'name': 'الأحقاف', 'englishName': 'Al-Ahqaf', 'numberOfVerses': 35 },
    { id: 47, 'name': 'محمد', 'englishName': 'Muhammad', 'numberOfVerses': 38 },
    { id: 48, 'name': 'الفتح', 'englishName': 'Al-Fath', 'numberOfVerses': 29 },
    { id: 49, 'name': 'الحجرات', 'englishName': 'Al-Hujurat', 'numberOfVerses': 18 },
    { id: 50, 'name': 'ق', 'englishName': 'Qaf', 'numberOfVerses': 45 },
    { id: 51, 'name': 'الذاريات', 'englishName': 'Adh-Dhariyat', 'numberOfVerses': 60 },
    { id: 52, 'name': 'الطور', 'englishName': 'At-Tur', 'numberOfVerses': 49 },
    { id: 53, 'name': 'النجم', 'englishName': 'An-Najm', 'numberOfVerses': 62 },
    { id: 54, 'name': 'القمر', 'englishName': 'Al-Qamar', 'numberOfVerses': 55 },
    { id: 55, 'name': 'الرحمن', 'englishName': 'Ar-Rahman', 'numberOfVerses': 78 },
    { id: 56, 'name': 'الواقعة', 'englishName': 'Al-Waqi\'ah', 'numberOfVerses': 96 },
    { id: 57, 'name': 'الحديد', 'englishName': 'Al-Hadid', 'numberOfVerses': 29 },
    { id: 58, 'name': 'المجادلة', 'englishName': 'Al-Mujadila', 'numberOfVerses': 22 },
    { id: 59, 'name': 'الحشر', 'englishName': 'Al-Hashr', 'numberOfVerses': 24 },
    { id: 60, 'name': 'الممتحنة', 'englishName': 'Al-Mumtahanah', 'numberOfVerses': 13 },
    { id: 61, 'name': 'الصف', 'englishName': 'As-Saff', 'numberOfVerses': 14 },
    { id: 62, 'name': 'الجمعة', 'englishName': 'Al-Jumu\'ah', 'numberOfVerses': 11 },
    { id: 63, 'name': 'المنافقون', 'englishName': 'Al-Munafiqun', 'numberOfVerses': 11 },
    { id: 64, 'name': 'التغابن', 'englishName': 'At-Taghabun', 'numberOfVerses': 18 },
    { id: 65, 'name': 'الطلاق', 'englishName': 'At-Talaq', 'numberOfVerses': 12 },
    { id: 66, 'name': 'التحريم', 'englishName': 'At-Tahrim', 'numberOfVerses': 12 },
    { id: 67, 'name': 'الملك', 'englishName': 'Al-Mulk', 'numberOfVerses': 30 },
    { id: 68, 'name': 'القلم', 'englishName': 'Al-Qalam', 'numberOfVerses': 52 },
    { id: 69, 'name': 'الحاقة', 'englishName': 'Al-Haqqah', 'numberOfVerses': 52 },
    { id: 70, 'name': 'المعارج', 'englishName': 'Al-Ma\'arij', 'numberOfVerses': 44 },
    { id: 71, 'name': 'نوح', 'englishName': 'Nuh', 'numberOfVerses': 28 },
    { id: 72, 'name': 'الجن', 'englishName': 'Al-Jinn', 'numberOfVerses': 28 },
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
const ReciterCard = ({ reciter, onSelectReciter }) => {
  const handleAction = () => {
    // This action is simplified as all reciters are pre-unlocked.
    // In a real app, this might trigger playing audio or selecting the reciter.
    if (onSelectReciter) {
      onSelectReciter(reciter.id, reciter.name, reciter.englishName, reciter.alquranCloudId);
    }
  };

  return (
    <div className="bg-green-700 p-4 rounded-xl shadow-sm flex flex-col items-center text-center relative hover:shadow-md transition-shadow duration-200">
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
          onSelectReciter ? 'bg-green-600 hover:bg-green-500 text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400' : 'bg-green-800 text-green-300 cursor-default'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.75 13.5a.75.75 0 0 1-1.127.075L4.5 12.25a.75.75 0 0 1 1.06-1.06l4.227 4.227 9.157-12.704a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
        </svg>
        Listen
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
const HomeDashboard = ({ setCurrentView, points, userProgress, unlockedReciters, handleUnlockReciter, showNotification, lastReadPosition, onContinueReading }) => {
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
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.715 1.295 2.565 0 3.28l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Display of available reciters */}
      <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
        <h2 className="text-2xl font-bold mb-5">Available Reciters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...recitersData.featured, ...recitersData.free].map((reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              points={points} // Points are passed but not used for unlocking here
              isUnlocked={true} // All reciters are pre-unlocked
              onUnlock={() => {}} // No unlock action needed
              showNotification={showNotification}
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

      {/* NEW: Continue Reading Section - visible only if a last read position exists */}
      {lastReadPosition && (
          <Card
              icon="➡️"
              title="Continue Reading"
              description={`Resume Surah ${quranData.surahs.find(s => s.id === lastReadPosition.surahId)?.englishName || 'Unknown'} from Verse ${lastReadPosition.verseId}`}
              onClick={onContinueReading}
          />
      )}

      {/* Bookmarked Verses & Quiz Cards - arranged in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card icon="⭐" title="Bookmarked Verses" description="Access your saved verses" onClick={() => setCurrentView('bookmarks')} />
        <Card icon="❓" title="Quiz Me!" description="Test your Quran knowledge" onClick={() => setCurrentView('quiz')} />
      </div>
    </div>
  );
};

// SurahSelector component for browsing and selecting Quranic Surahs.
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
          const translationVerses = data.data[1] ? data.data[1].ayahs : []; // Ensure translationVerses is an array

          const combinedVerses = arabicVerses.map((arabicAyah, index) => ({
            id: arabicAyah.numberInSurah,
            arabic: arabicAyah.text,
            translation: translationVerses[index] ? translationVerses[index].text : 'Translation not available.',
            audio: arabicAyah.audio,
          }));
          setSurahVerses(combinedVerses);
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

    if (action === 'increase' && currentIndex < currentSizes.length - 1) {
      setFontSize(currentSizes[currentIndex + 1]);
    } else if (action === 'decrease' && currentIndex > 0) {
      setFontSize(currentSizes[currentIndex - 1]);
    }
  };

  // Function to check if a verse is bookmarked.
  const isBookmarked = (surahId, verseId) => {
    return bookmarkedVerses.some(b => b.surahId === surahId && b.verseId === verseId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-green-800 rounded-xl shadow-lg text-green-200 text-xl">
        <svg className="animate-spin h-8 w-8 mr-3 text-green-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading Surah {selectedSurahMeta?.englishName}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-800 p-6 rounded-xl shadow-lg text-red-100 text-center">
        <p className="text-xl font-semibold mb-3">Error Loading Surah</p>
        <p>{error}</p>
        <button
          onClick={onBackToSurahList}
          className="mt-4 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-full transition-colors duration-200"
        >
          Back to Surah List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToSurahList}
          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M11.03 4.47a.75.75 0 0 1 0 1.06L6.06 10.5H18.75a.75.75 0 0 1 0 1.5H6.06l4.97 4.97a.75.75 0 1 1-1.06 1.06l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center flex-grow">
          {selectedSurahMeta?.englishName} ({selectedSurahMeta?.name})
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevSurah}
            disabled={selectedSurahId === 1}
            className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={handleNextSurah}
            disabled={selectedSurahId === quranData.surahs.length}
            className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Font Controls */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <label htmlFor="font-family" className="text-green-200">Font:</label>
        <select
          id="font-family"
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          className="p-2 rounded-md bg-green-700 text-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {fontFamilies.map((font) => (
            <option key={font.name} value={font.name}>
              {font.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleFontSizeChange('decrease')}
          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full text-lg font-bold shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          A-
        </button>
        <button
          onClick={() => handleFontSizeChange('increase')}
          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full text-lg font-bold shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          A+
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
        {surahVerses.map((verse) => (
          <div
            key={verse.id}
            className={`mb-6 p-4 rounded-lg transition-all duration-300 ${highlightedVerseId === verse.id ? 'bg-green-600 shadow-lg' : 'bg-green-700 shadow-sm'}`}
            onMouseEnter={() => onVerseRead(selectedSurahId, verse.id)} // Track verse read on hover
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-green-300 text-sm font-semibold">Verse {verse.id}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => playVerseAudio(verse.id, verse.audio)}
                  className="text-green-300 hover:text-green-100 transition-colors duration-200 focus:outline-none"
                  title="Play Audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.715 1.295 2.565 0 3.28l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => onToggleBookmark(selectedSurahId, verse.id)}
                  className={`transition-colors duration-200 focus:outline-none ${isBookmarked(selectedSurahId, verse.id) ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-300 hover:text-green-100'}`}
                  title={isBookmarked(selectedSurahId, verse.id) ? 'Remove Bookmark' : 'Add Bookmark'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.47 1.454 2.47 2.917V21.01a.75.75 0 0 1-1.085.67L12 18.089l-7.705 3.593A.75.75 0 0 1 3.75 21.01V5.494c0-1.463.973-2.743 2.47-2.917Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p className={`font-arabic text-right leading-loose mb-3 ${selectedFont === 'Quranic (Default)' ? 'font-arabic' : selectedFont === 'Serif' ? 'font-serif' : selectedFont === 'Sans-serif' ? 'font-sans' : 'font-mono'} ${fontSize}`}>
              {verse.arabic}
            </p>
            <p className="text-green-200 text-left italic leading-relaxed">
              {verse.translation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Listen component for playing full Surah recitations.
const Listen = ({ selectedReciter, onSelectReciter, showNotification }) => {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(new Audio());

  // Set default volume
  audioRef.current.volume = 0.8;

  // Effect to clean up audio on component unmount or reciter/surah change.
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setIsPlaying(false);
      showNotification("Recitation finished!", "success");
    };
    const handleError = () => {
      setAudioError("Failed to load audio. Please try another reciter or Surah.");
      setIsLoadingAudio(false);
      setIsPlaying(false);
      showNotification("Audio error. Try again.", "error");
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = ''; // Clear source to prevent memory leaks
    };
  }, [showNotification]);

  // Function to play/pause audio.
  const togglePlayPause = async () => {
    if (!selectedReciter || !selectedSurah) {
      showNotification("Please select a reciter and a Surah first.", "error");
      return;
    }

    const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/${selectedReciter.alquranCloudId}/${selectedSurah.id}`;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingAudio(true);
      setAudioError(null);
      try {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        setIsPlaying(true);
        showNotification(`Playing ${selectedSurah.englishName} by ${selectedReciter.englishName}`, "success");
      } catch (error) {
        console.error("Audio playback error:", error);
        setAudioError("Could not play audio. Ensure a valid reciter and Surah are selected.");
        showNotification("Audio playback failed.", "error");
        setIsPlaying(false);
      } finally {
        setIsLoadingAudio(false);
      }
    }
  };

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
      <h2 className="text-2xl font-bold mb-5 text-center">Listen to Quran Recitations</h2>

      {/* Reciter Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Choose a Reciter:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...recitersData.featured, ...recitersData.free].map((reciter) => (
            <button
              key={reciter.id}
              onClick={() => onSelectReciter(reciter.id, reciter.name, reciter.englishName, reciter.alquranCloudId)}
              className={`p-3 rounded-xl flex flex-col items-center text-center transition-all duration-200 shadow-md
                ${selectedReciter && selectedReciter.id === reciter.id ? 'bg-green-600 ring-2 ring-green-400' : 'bg-green-700 hover:bg-green-600'}`}
            >
              <img
                src={reciter.imageUrl}
                alt={reciter.englishName}
                className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-green-400"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/cccccc/333333?text=R"; }}
              />
              <p className="font-arabic text-base">{reciter.name}</p>
              <p className="text-xs text-green-200">{reciter.englishName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Surah Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Select a Surah:</h3>
        <select
          value={selectedSurah ? selectedSurah.id : ''}
          onChange={(e) => setSelectedSurah(quranData.surahs.find(s => s.id === parseInt(e.target.value)))}
          className="w-full p-3 rounded-lg bg-green-700 text-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">-- Select Surah --</option>
          {quranData.surahs.map((surah) => (
            <option key={surah.id} value={surah.id}>
              {surah.englishName} ({surah.name})
            </option>
          ))}
        </select>
      </div>

      {/* Audio Controls */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {selectedReciter && selectedSurah && (
          <p className="text-lg text-green-200">
            Now playing: {selectedSurah.englishName} by {selectedReciter.englishName}
          </p>
        )}
        <button
          onClick={togglePlayPause}
          disabled={!selectedReciter || !selectedSurah || isLoadingAudio}
          className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center"
        >
          {isLoadingAudio ? (
            <svg className="animate-spin h-7 w-7 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-1.5Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM10.5 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0V8.25ZM14.25 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0V8.25Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        {audioError && <p className="text-red-300 text-sm mt-2">{audioError}</p>}
      </div>
    </div>
  );
};

// Practice component for recording and improving recitation.
const Practice = ({ showNotification }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null); // Ref for playback audio element

  // Function to start recording.
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        showNotification("Recording stopped.", "success");
      };

      recorder.start();
      setIsRecording(true);
      showNotification("Recording started...", "info");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      showNotification("Failed to access microphone. Please allow access.", "error");
    }
  };

  // Function to stop recording.
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Function to play back the recorded audio.
  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.error("Error playing recorded audio:", e));
        showNotification("Playing back your recording.", "info");
      }
    } else {
      showNotification("No recording available to play.", "error");
    }
  };

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50 text-center">
      <h2 className="text-2xl font-bold mb-5">Practice Your Recitation</h2>
      <p className="text-green-200 mb-6">
        Use your microphone to record your recitation and listen back to improve.
      </p>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`py-3 px-6 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-400'
              : 'bg-green-600 hover:bg-green-500 text-white focus:ring-green-400'
          } flex items-center`}
        >
          {isRecording ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.75 6.75 0 1 1-13.5 0v-1.5a.75.75 0 0 1 .75-.75Z" />
                <path d="M9.75 18a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75ZM14.25 18a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75Z" />
              </svg>
              Start Recording
            </>
          )}
        </button>

        <button
          onClick={playRecording}
          disabled={!audioBlob || isRecording}
          className="py-3 px-6 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM10.5 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0V8.25Z" clipRule="evenodd" />
          </svg>
          Play Recording
        </button>
      </div>

      {/* Audio element for playback */}
      <audio ref={audioRef} controls className="w-full mt-4 rounded-lg bg-green-700"></audio>
    </div>
  );
};

// PrayerTimes component for displaying and managing prayer times.
const PrayerTimes = ({ showNotification }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Effect to get user's current location.
  useEffect(() => {
    const getLocation = () => {
      setIsLoadingLocation(true);
      setLocationError(null);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setIsLoadingLocation(false);
            showNotification("Location retrieved successfully!", "success");
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocationError("Unable to retrieve location. Please enable location services or enter manually.");
            setIsLoadingLocation(false);
            showNotification("Location access denied or failed.", "error");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
        setIsLoadingLocation(false);
        showNotification("Geolocation not supported.", "error");
      }
    };

    getLocation(); // Attempt to get location on component mount.
  }, [showNotification]);

  // Effect to calculate prayer times when location changes.
  useEffect(() => {
    if (location.latitude && location.longitude) {
      const times = getPrayerTimes(location.latitude, location.longitude);
      setPrayerTimes(times);
    }
  }, [location]);

  // Effect to update countdown every second.
  useEffect(() => {
    let countdownInterval;
    if (prayerTimes && prayerTimes.nextPrayer) {
      countdownInterval = setInterval(() => {
        const now = new Date();
        const diffSeconds = differenceInSeconds(prayerTimes.nextPrayer.time, now);

        if (diffSeconds <= 0) {
          // If countdown reaches zero or less, recalculate prayer times for the next period.
          const updatedTimes = getPrayerTimes(location.latitude, location.longitude, addDays(now, diffSeconds < -60 ? 1 : 0)); // Recalculate for next day if already passed by a minute
          setPrayerTimes(updatedTimes);
          setNextPrayerCountdown(''); // Clear until new calculation
          showNotification(`It's ${prayerTimes.nextPrayer.name} time!`, "success");
        } else {
          const hours = Math.floor(diffSeconds / 3600);
          const minutes = Math.floor((diffSeconds % 3600) / 60);
          const seconds = diffSeconds % 60;
          setNextPrayerCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
    }

    return () => clearInterval(countdownInterval); // Clean up interval on unmount.
  }, [prayerTimes, location, showNotification]);

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50 text-center">
      <h2 className="text-2xl font-bold mb-5">Prayer Times (Hanafi Asr)</h2>

      {isLoadingLocation ? (
        <p className="text-green-300 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3 text-green-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Getting your location...
        </p>
      ) : locationError ? (
        <p className="text-red-300 mb-4">{locationError}</p>
      ) : (
        <p className="text-green-300 mb-4">
          Location: {location.latitude?.toFixed(2)}, {location.longitude?.toFixed(2)}
        </p>
      )}

      {prayerTimes && (
        <div className="mb-6">
          {prayerTimes.nextPrayer && (
            <div className="bg-green-700 p-4 rounded-lg shadow-md mb-4">
              <p className="text-xl font-semibold mb-2">Next Prayer: {prayerTimes.nextPrayer.name} {prayerTimes.nextPrayer.icon}</p>
              <p className="text-3xl font-bold text-green-200">{nextPrayerCountdown}</p>
              <p className="text-sm text-green-300 mt-1">at {format(prayerTimes.nextPrayer.time, 'p')}</p>
            </div>
          )}

          <ul className="space-y-3">
            {prayerTimes.times.map((prayer) => (
              <li key={prayer.name} className="flex justify-between items-center bg-green-700 p-3 rounded-lg shadow-sm">
                <span className="text-lg font-medium flex items-center">
                  {prayer.icon} <span className="ml-2">{prayer.name}</span>
                </span>
                <span className="text-green-200 text-lg font-semibold">{format(prayer.time, 'p')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => { /* Implement manual location input or refresh */ showNotification("Manual location input not yet implemented.", "info"); }}
        className="mt-4 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Refresh Prayer Times
      </button>
    </div>
  );
};

// Bookmarks component to display and manage bookmarked verses.
const Bookmarks = ({ bookmarkedVerses, onToggleBookmark, onSelectSurahAndVerse, showNotification }) => {
  if (bookmarkedVerses.length === 0) {
    return (
      <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50 text-center">
        <h2 className="text-2xl font-bold mb-5">Your Bookmarks</h2>
        <p className="text-green-300">You haven't bookmarked any verses yet.</p>
        <p className="text-green-300 mt-2">Go to "Read Quran" and click the star icon next to a verse to bookmark it!</p>
      </div>
    );
  }

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
      <h2 className="text-2xl font-bold mb-5 text-center">Your Bookmarks</h2>
      <ul className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
        {bookmarkedVerses.map((bookmark, index) => {
          const surah = quranData.surahs.find(s => s.id === bookmark.surahId);
          return (
            <li key={`${bookmark.surahId}-${bookmark.verseId}-${index}`} className="bg-green-700 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  {surah ? surah.englishName : `Surah ${bookmark.surahId}`} - Verse {bookmark.verseId}
                </p>
                <p className="text-sm text-green-200">Bookmarked on: {format(parseISO(bookmark.timestamp), 'PPP p')}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onSelectSurahAndVerse(bookmark.surahId, bookmark.verseId)}
                  className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                  title="Go to Verse"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => onToggleBookmark(bookmark.surahId, bookmark.verseId)}
                  className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full transition-colors duration-200 focus:outline-none"
                  title="Remove Bookmark"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.47 1.454 2.47 2.917V21.01a.75.75 0 0 1-1.085.67L12 18.089l-7.705 3.593A.75.75 0 0 1 3.75 21.01V5.494c0-1.463.973-2.743 2.47-2.917Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Quiz component for testing Quranic knowledge.
const Quiz = ({ showNotification, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCategory, setQuizCategory] = useState('Combined'); // Default category
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // Filter questions based on selected category.
  useEffect(() => {
    if (quizCategory === 'Combined') {
      setFilteredQuestions(quizQuestions);
    } else {
      setFilteredQuestions(quizQuestions.filter(q => q.category === quizCategory));
    }
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setFeedback('');
    setShowExplanation(false);
  }, [quizCategory]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Handler for selecting an answer.
  const handleAnswerSelect = (answer) => {
    if (selectedAnswer === null) { // Only allow selecting once per question
      setSelectedAnswer(answer);
      const isCorrect = answer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore(prevScore => prevScore + 10); // Award 10 points for correct answer.
        setFeedback('Correct! 🎉');
        showNotification("Correct answer!", "success");
      } else {
        setFeedback(`Wrong! Correct answer was: "${currentQuestion.correctAnswer}"`);
        showNotification("Incorrect answer.", "error");
      }
      setShowExplanation(true); // Show explanation/feedback
    }
  };

  // Handler for moving to the next question or finishing the quiz.
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback('');
    setShowExplanation(false);
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinished(true);
      onQuizComplete(score); // Pass final score to parent component.
      showNotification(`Quiz finished! Your score: ${score}`, "info");
    }
  };

  // Handler to restart the quiz.
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setFeedback('');
    setShowExplanation(false);
    setQuizCategory('Combined'); // Reset category to combined
  };

  if (!currentQuestion && filteredQuestions.length === 0) {
    return (
      <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50 text-center">
        <h2 className="text-2xl font-bold mb-5">Quiz</h2>
        <p className="text-green-300">No questions available for the selected category.</p>
        <button
          onClick={() => setQuizCategory('Combined')}
          className="mt-4 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-full shadow-md transition-colors duration-200"
        >
          Back to Combined Questions
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
      <h2 className="text-2xl font-bold mb-5 text-center">Quran Quiz</h2>

      {!quizFinished && (
        <div className="mb-6">
          <label htmlFor="quiz-category" className="block text-green-200 text-lg mb-2">Select Category:</label>
          <select
            id="quiz-category"
            value={quizCategory}
            onChange={(e) => setQuizCategory(e.target.value)}
            className="w-full p-3 rounded-lg bg-green-700 text-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {quizCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      )}

      {quizFinished ? (
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Quiz Complete!</h3>
          <p className="text-xl mb-4">Your final score: <span className="text-green-400">{score}</span> points</p>
          <button
            onClick={restartQuiz}
            className="bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <div>
          <p className="text-green-300 text-sm mb-2">Question {currentQuestionIndex + 1} of {filteredQuestions.length}</p>
          <p className="text-xl font-semibold mb-4">{currentQuestion.question}</p>

          <div className="grid grid-cols-1 gap-3 mb-4">
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(choice)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 shadow-md
                  ${selectedAnswer === choice
                    ? (choice === currentQuestion.correctAnswer ? 'bg-green-500 ring-2 ring-green-300' : 'bg-red-500 ring-2 ring-red-300')
                    : 'bg-green-700 hover:bg-green-600'
                  }
                  ${selectedAnswer !== null && choice === currentQuestion.correctAnswer && selectedAnswer !== choice ? 'ring-2 ring-green-300 border-2 border-green-300' : ''}
                  ${selectedAnswer !== null ? 'cursor-not-allowed' : ''}
                `}
              >
                {choice}
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className={`mt-4 p-3 rounded-lg ${feedback.includes('Correct') ? 'bg-green-600' : 'bg-red-600'} text-white`}>
              <p className="font-semibold">{feedback}</p>
              {showExplanation && currentQuestion.explanation && (
                <p className="text-sm mt-2">{currentQuestion.explanation}</p>
              )}
            </div>
          )}

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  // --- Firebase State and Initialization ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // New state to track auth readiness

  // --- App State Management ---
  const [currentView, setCurrentView] = useState('home'); // Controls which main section is displayed.
  const [selectedSurahId, setSelectedSurahId] = useState(null); // For QuranReader view.
  const [selectedVerseId, setSelectedVerseId] = useState(null); // For deep linking to a specific verse.
  const [selectedReciter, setSelectedReciter] = useState(recitersData.featured[0]); // Default reciter.
  const [notification, setNotification] = useState(null); // For showing temporary messages.

  // --- User Progress State (persisted via Firebase) ---
  const [userProgress, setUserProgress] = useState({
    points: 0,
    dailyStreak: 0,
    lastReadDate: null, // ISO string
    versesRead: 0,
    bookmarkedVerses: [], // Array of { surahId, verseId, timestamp }
    achievements: achievementsData, // Deep copy to allow modification
    lastReadPosition: null, // { surahId, verseId }
  });

  // --- Firebase Initialization and Authentication ---
  useEffect(() => {
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;

      if (!firebaseConfig) {
        console.error("Firebase config is not defined. Please set __firebase_config environment variable.");
        setNotification({ message: "Firebase not configured. Data persistence will not work.", type: "error" });
        return;
      }

      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // Sign in anonymously if no user is found
          try {
            if (typeof __initial_auth_token !== 'undefined') {
              await signInWithCustomToken(firebaseAuth, __initial_auth_token);
            } else {
              await signInAnonymously(firebaseAuth);
            }
            setUserId(firebaseAuth.currentUser?.uid || crypto.randomUUID()); // Fallback for anonymous
          } catch (error) {
            console.error("Error signing in anonymously:", error);
            setNotification({ message: "Failed to sign in. Data persistence may not work.", type: "error" });
            setUserId(crypto.randomUUID()); // Use a random ID if auth fails completely
          }
        }
        setIsAuthReady(true); // Mark auth as ready after initial check/sign-in
      });

      return () => unsubscribe(); // Cleanup auth listener
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setNotification({ message: "Failed to initialize Firebase. Check console for details.", type: "error" });
    }
  }, []); // Run only once on mount

  // --- Firebase Data Listener (onSnapshot) ---
  useEffect(() => {
    if (!db || !userId || !isAuthReady) {
      // Wait for db, userId, and auth readiness
      return;
    }

    const userDocRef = doc(db, `artifacts/${__app_id}/users/${userId}/progress`, 'userProgress');

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure all expected fields are present, provide defaults if missing
        setUserProgress({
          points: data.points || 0,
          dailyStreak: data.dailyStreak || 0,
          lastReadDate: data.lastReadDate || null,
          versesRead: data.versesRead || 0,
          bookmarkedVerses: data.bookmarkedVerses || [],
          achievements: data.achievements || achievementsData,
          lastReadPosition: data.lastReadPosition || null,
        });
        console.log("User progress loaded:", data);
      } else {
        // Initialize default progress if document doesn't exist
        console.log("No user progress found, initializing default.");
        // We use setDoc here to create the document if it doesn't exist
        setDoc(userDocRef, userProgress)
          .catch(error => console.error("Error setting initial user progress:", error));
      }
    }, (error) => {
      console.error("Error fetching user progress:", error);
      setNotification({ message: "Failed to load progress. Check console.", type: "error" });
    });

    return () => unsubscribe(); // Clean up the listener
  }, [db, userId, isAuthReady, __app_id]); // Re-run if db, userId, or auth status changes

  // --- Firebase Data Saver ---
  // Use a debounced effect to save user progress to Firestore
  useEffect(() => {
    if (!db || !userId || !isAuthReady) {
      return;
    }

    const userDocRef = doc(db, `artifacts/${__app_id}/users/${userId}/progress`, 'userProgress');

    // Debounce the save operation to avoid too many writes
    const handler = setTimeout(() => {
      setDoc(userDocRef, userProgress, { merge: true }) // Use merge to only update changed fields
        .then(() => console.log("User progress saved to Firestore."))
        .catch(error => console.error("Error saving user progress:", error));
    }, 500); // Save after 500ms of inactivity

    return () => {
      clearTimeout(handler); // Clear timeout if userProgress changes again quickly
    };
  }, [userProgress, db, userId, isAuthReady, __app_id]); // Dependency array for userProgress and Firebase states

  // --- Notification Management ---
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers for App Logic ---

  // Handle surah selection for QuranReader.
  const handleSelectSurah = (surahId) => {
    setSelectedSurahId(surahId);
    setSelectedVerseId(null); // Reset verse ID when changing surah
    setCurrentView('read-quran');
  };

  // Handle deep linking to a specific verse.
  const handleSelectSurahAndVerse = (surahId, verseId) => {
    setSelectedSurahId(surahId);
    setSelectedVerseId(verseId);
    setCurrentView('read-quran');
  };

  // Handle continuing from the last read position.
  const handleContinueReading = () => {
      if (userProgress.lastReadPosition) {
          handleSelectSurahAndVerse(userProgress.lastReadPosition.surahId, userProgress.lastReadPosition.verseId);
      } else {
          showNotification("No last read position found. Start reading from the beginning!", "info");
          setCurrentView('surah-selector');
      }
  };


  // Handle verse read tracking and daily streak.
  const handleVerseRead = useCallback((surahId, verseId) => {
    setUserProgress(prev => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastRead = prev.lastReadDate ? format(parseISO(prev.lastReadDate), 'yyyy-MM-dd') : null;
      let newDailyStreak = prev.dailyStreak;
      let newPoints = prev.points;

      // Update daily streak
      if (lastRead !== today) {
        if (lastRead === format(addDays(new Date(), -1), 'yyyy-MM-dd')) {
          newDailyStreak += 1;
          newPoints += 5; // Bonus points for streak
          showNotification(`Daily streak: ${newDailyStreak} days! +5 points`, "success");
        } else {
          newDailyStreak = 1; // Reset if not consecutive
          showNotification("New daily streak started!", "info");
        }
      }

      // Update verses read and points (only increment once per unique verse per session)
      const isVerseAlreadyCounted = prev.lastReadPosition && prev.lastReadPosition.surahId === surahId && prev.lastReadPosition.verseId === verseId;
      const newVersesRead = isVerseAlreadyCounted ? prev.versesRead : prev.versesRead + 1;
      if (!isVerseAlreadyCounted) {
          newPoints += 1; // 1 point per new verse read
      }


      // Check for achievements
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'first-read' && !ach.achieved && newVersesRead > 0) {
          showNotification("Achievement Unlocked: First Read! ✨", "success");
          return { ...ach, achieved: true };
        }
        if (ach.id === 'first-week' && !ach.achieved && newDailyStreak >= 7) {
          showNotification("Achievement Unlocked: Daily Reader! 📅", "success");
          return { ...ach, achieved: true };
        }
        // Add more achievement checks here
        return ach;
      });

      return {
        ...prev,
        points: newPoints,
        dailyStreak: newDailyStreak,
        lastReadDate: today,
        versesRead: newVersesRead,
        achievements: updatedAchievements,
        lastReadPosition: { surahId, verseId }, // Update last read position
      };
    });
  }, [showNotification]);

  // Handle audio play for verse, updating last read position.
  const handleVerseAudioPlay = useCallback((surahId, verseId) => {
      setUserProgress(prev => ({
          ...prev,
          lastReadPosition: { surahId, verseId }
      }));
  }, []);

  // Toggle bookmark for a verse.
  const handleToggleBookmark = useCallback((surahId, verseId) => {
    setUserProgress(prev => {
      const isBookmarked = prev.bookmarkedVerses.some(b => b.surahId === surahId && b.verseId === verseId);
      let updatedBookmarks;
      let notificationMessage;
      let notificationType;

      if (isBookmarked) {
        updatedBookmarks = prev.bookmarkedVerses.filter(b => !(b.surahId === surahId && b.verseId === verseId));
        notificationMessage = "Bookmark removed!";
        notificationType = "info";
      } else {
        updatedBookmarks = [...prev.bookmarkedVerses, { surahId, verseId, timestamp: new Date().toISOString() }];
        notificationMessage = "Verse bookmarked! ⭐";
        notificationType = "success";
      }
      showNotification(notificationMessage, notificationType);
      return { ...prev, bookmarkedVerses: updatedBookmarks };
    });
  }, [showNotification]);

  // Handle quiz completion and update points/achievements.
  const handleQuizComplete = useCallback((finalScore) => {
    setUserProgress(prev => {
      let newPoints = prev.points + finalScore;
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'quiz-whiz' && !ach.achieved && finalScore >= 500) { // Example threshold
          showNotification("Achievement Unlocked: Quiz Whiz! ❓", "success");
          return { ...ach, achieved: true };
        }
        return ach;
      });
      showNotification(`Quiz finished! You earned ${finalScore} points.`, "success");
      return { ...prev, points: newPoints, achievements: updatedAchievements };
    });
  }, [showNotification]);

  // --- Main App Render ---
  return (
    <div className="min-h-screen bg-green-900 text-green-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-4xl bg-green-800 p-4 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-extrabold text-green-100 mb-4 sm:mb-0">Quran App</h1>
        <div className="flex items-center space-x-4">
          <span className="text-xl font-semibold">Points: {userProgress.points} ✨</span>
          {userId && (
              <span className="text-sm text-green-300 bg-green-700 px-3 py-1 rounded-full">
                  User ID: {userId.substring(0, 8)}...
              </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl flex-grow">
        {/* Conditional Rendering of Views */}
        {(() => {
          switch (currentView) {
            case 'home':
              return (
                <HomeDashboard
                  setCurrentView={setCurrentView}
                  points={userProgress.points}
                  userProgress={userProgress}
                  unlockedReciters={recitersData.featured.concat(recitersData.free)} // All are unlocked
                  handleUnlockReciter={() => showNotification("All reciters are unlocked!", "info")}
                  showNotification={showNotification}
                  lastReadPosition={userProgress.lastReadPosition}
                  onContinueReading={handleContinueReading}
                />
              );
            case 'surah-selector':
              return <SurahSelector onSelectSurah={handleSelectSurah} />;
            case 'read-quran':
              return (
                <QuranReader
                  selectedSurahId={selectedSurahId}
                  onBackToSurahList={() => setCurrentView('surah-selector')}
                  onSurahChange={handleSelectSurah}
                  onVerseRead={handleVerseRead}
                  onToggleBookmark={handleToggleBookmark}
                  bookmarkedVerses={userProgress.bookmarkedVerses}
                  onVerseAudioPlay={handleVerseAudioPlay}
                />
              );
            case 'listen':
              return (
                <Listen
                  selectedReciter={selectedReciter}
                  onSelectReciter={(id, name, englishName, alquranCloudId) => setSelectedReciter({ id, name, englishName, alquranCloudId })}
                  showNotification={showNotification}
                />
              );
            case 'practice':
              return <Practice showNotification={showNotification} />;
            case 'prayer-times':
              return <PrayerTimes showNotification={showNotification} />;
            case 'bookmarks':
              return (
                <Bookmarks
                  bookmarkedVerses={userProgress.bookmarkedVerses}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectSurahAndVerse={handleSelectSurahAndVerse}
                  showNotification={showNotification}
                />
              );
            case 'quiz':
              return <Quiz showNotification={showNotification} onQuizComplete={handleQuizComplete} />;
            default:
              return (
                <div className="text-center text-red-400">
                  <p className="text-2xl">Error: Unknown view '{currentView}'</p>
                  <button onClick={() => setCurrentView('home')} className="mt-4 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-full">
                    Go to Home
                  </button>
                </div>
              );
          }
        })()}
      </main>

      {/* Footer Navigation */}
      <footer className="w-full max-w-4xl bg-green-800 p-4 rounded-xl shadow-lg mt-8 flex justify-around items-center">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${currentView === 'home' ? 'text-green-200 bg-green-700' : 'text-green-400 hover:text-green-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a1.5 1.5 0 0 1 0 2.12l-5.15 5.15a1.5 1.5 0 0 1-2.12 0L2.84 12.97a.75.75 0 0 1 0-1.06l8.69-8.69Z" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setCurrentView('surah-selector')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${currentView === 'surah-selector' || currentView === 'read-quran' ? 'text-green-200 bg-green-700' : 'text-green-400 hover:text-green-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c0 .526.163 1.035.474 1.457l1.513 2.159a3.001 3.001 0 0 0 2.247 1.024H18.75a.75.75 0 0 0 .75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3.001 3.001 0 0 0-2.247-1.024H9.375v-1.17c0-.935.759-1.695 1.695-1.695H21.75c.935 0 1.695.76 1.695 1.695v12.39c0 .935-.76 1.695-1.695 1.695H11.06a2.25 2.25 0 0 1-2.247-2.159v-8.25a.75.75 0 0 0-.75-.75H3.375a1.875 1.875 0 0 0-1.875 1.875v11.71c0 1.035.84 1.875 1.875 1.875H12.75A.75.75 0 0 0 13.5 22.5h6.75a2.25 2.25 0 0 0 2.25-2.25V9.375a.75.75 0 0 0-.75-.75H18.75a.75.75 0 0 0-.75.75v3.375c0 .414.336.75.75.75h-.75a.75.75 0 0 1-.75-.75V6.61a3