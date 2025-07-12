// --- Initial Setup and Data Imports ---
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO, startOfDay, addDays, differenceInSeconds } from 'date-fns';
// NEW: Import Lucide React icons for a modern look
import { Home, BookOpen, Headphones, Mic, Clock, Star, HelpCircle, ArrowLeft, ChevronLeft, ChevronRight, Play, Pause, Bookmark, CheckCircle, XCircle, Info, Sun, Moon, Cloud, Zap, Award, User, Clock9, CalendarDays, BarChart, Gem, DollarSign } from 'lucide-react';
// NEW: Import Vercel Analytics component for web analytics
import { Analytics } from '@vercel/analytics/react';
// NEW: Import Vercel Speed Insights component for performance monitoring
import { SpeedInsights } from '@vercel/speed-insights/react';

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
    { id: 108, name: 'الكوثر', englishName: 'Al-Kawthar', numberOfNumberOfVerses: 3 },
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
  { id: 'first-read', title: 'First Read', description: 'Complete your first reading session', icon: <BookOpen size={20} />, achieved: false },
  { id: 'first-week', title: 'Daily Reader', description: 'Maintain a 7-day reading streak', icon: <CalendarDays size={20} />, achieved: false },
  { id: 'practice-master', title: 'Practice Master', description: 'Complete 100 practice sessions', icon: <Mic size={20} />, achieved: false },
  { id: 'quiz-whiz', title: 'Quiz Whiz', description: 'Score over 500 points in quizzes', icon: <HelpCircle size={20} />, achieved: false },
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
    { name: 'Fajr', time: times.Fajr, icon: <Sun size={24} className="text-yellow-300" /> },
    { name: 'Sunrise', time: times.Sunrise, icon: <Cloud size={24} className="text-orange-300" /> },
    { name: 'Dhuhr', time: times.Dhuhr, icon: <Sun size={24} className="text-yellow-500" /> },
    { name: 'Asr', time: times.Asr, icon: <Cloud size={24} className="text-orange-500" /> },
    { name: 'Maghrib', time: times.Maghrib, icon: <Moon size={24} className="text-purple-300" /> },
    { name: 'Isha', time: times.Isha, icon: <Moon size={24} className="text-purple-500" /> },
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
  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  const textColor = 'text-white';
  const IconComponent = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-2xl flex items-center space-x-3 transition-all duration-500 transform animate-fade-in-up z-50 ${bgColor} ${textColor}`}>
      <IconComponent size={24} className="flex-shrink-0" />
      <p className="font-semibold text-base md:text-lg">{message}</p>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 focus:outline-none p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
        <XCircle size={20} />
      </button>
    </div>
  );
};

// --- Reusable UI Components ---

// Card component for navigation and feature display on the dashboard.
const Card = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-br from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transition-all transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
    <div className="text-5xl mb-3 text-green-200 group-hover:text-white transition-colors duration-300">
      {Icon && <Icon size={48} strokeWidth={1.5} />}
    </div>
    <h3 className="text-xl md:text-2xl font-semibold mb-1 text-green-50 group-hover:text-white transition-colors duration-300">{title}</h3>
    <p className="text-sm md:text-base opacity-90 text-green-100 group-hover:text-green-50 transition-colors duration-300">{description}</p>
  </button>
);

// ReciterCard component to display individual reciter information.
const ReciterCard = ({ reciter, onSelectReciter, points, isUnlocked, onUnlock, showNotification }) => {
  const handleAction = () => {
    if (isUnlocked) {
      if (onSelectReciter) {
        onSelectReciter(reciter.id, reciter.name, reciter.englishName, reciter.alquranCloudId);
      }
    } else {
      if (onUnlock) {
        onUnlock(reciter.id, reciter.cost);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-700 to-green-800 p-4 rounded-2xl shadow-lg flex flex-col items-center text-center relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <img
        src={reciter.imageUrl}
        alt={reciter.englishName}
        className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-green-400 shadow-md group-hover:border-green-300 transition-colors duration-300"
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/6EE7B7/047857?text=Reciter"; }} // Fallback image
      />
      <p className="font-arabic text-xl text-green-50 font-medium">{reciter.name}</p>
      <p className="text-sm text-green-200 mb-3">{reciter.englishName}</p>
      <button
        onClick={handleAction}
        className={`mt-2 py-2 px-5 rounded-full font-semibold transition-all duration-300 flex items-center shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 ${
          isUnlocked ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-800 text-green-300 cursor-default opacity-80'
        }`}
      >
        {isUnlocked ? (
          <>
            <Play size={20} className="mr-2" />
            Listen
          </>
        ) : (
          <>
            <Gem size={20} className="mr-2" />
            Unlock ({reciter.cost} pts)
          </>
        )}
      </button>
      {!isUnlocked && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
          Locked
        </div>
      )}
    </div>
  );
};

// ProgressCard component to display individual user progress metrics.
const ProgressCard = ({ title, value, unit, icon: Icon, progressBar, progressPercent, milestoneText }) => (
  <div className="bg-gradient-to-br from-green-700 to-green-800 p-5 rounded-2xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="text-5xl mb-3 text-green-200">
      {Icon && <Icon size={48} strokeWidth={1.5} />}
    </div>
    <h3 className="text-xl font-semibold text-green-50 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-green-200">{value}</p>
    <p className="text-sm text-green-300">{unit}</p>
    {progressBar && (
      <div className="w-full mt-4">
        <div className="h-3 bg-green-900 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-green-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-green-300 mt-2 font-medium">{milestoneText}</p>
      </div>
    )}
  </div>
);

// AchievementsCard component to display unlocked and pending achievements.
const AchievementsCard = ({ achievements }) => (
  <div className="bg-gradient-to-br from-green-700 to-green-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-2xl font-bold text-green-50 mb-4 flex items-center">
      <Award size={32} className="text-yellow-400 mr-3" strokeWidth={1.5} /> Achievements
    </h3>
    <ul className="space-y-3">
      {achievements.map((achievement) => (
        <li key={achievement.id} className={`flex items-center p-2 rounded-lg ${achievement.achieved ? 'bg-green-600 text-green-200' : 'bg-green-800 text-green-400 opacity-90'}`}>
          <span className="text-2xl mr-3 flex-shrink-0">{achievement.icon}</span>
          <div>
            <p className="font-medium text-lg">{achievement.title}</p>
            <p className="text-xs text-green-300">{achievement.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// HomeDashboard component, serving as the main landing page of the app.
const HomeDashboard = ({ setCurrentView, points, userProgress, unlockedReciters, handleUnlockReciter, showNotification, lastReadPosition, onContinueReading, onSelectReciterForListen }) => {
  const [verseOfTheDay, setVerseOfTheDay] = useState(quranData.verseOfTheDay);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Navigation Cards for main features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={BookOpen} title="Read Quran" description="Browse surahs and verses" onClick={() => setCurrentView('surah-selector')} />
        <Card icon={Headphones} title="Listen" description="Beautiful recitations" onClick={() => setCurrentView('listen')} />
        <Card icon={Mic} title="Practice" description="Record & improve" onClick={() => setCurrentView('practice')} />
        <Card icon={Clock} title="Prayer Times" description="Hanafi calculations" onClick={() => setCurrentView('prayer-times')} />
      </div>

      {/* Dynamic Verse of the Day display */}
      <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-3xl shadow-2xl text-white text-center transform hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 rounded-3xl"></div>
        <p className="text-lg md:text-xl mb-3 font-semibold text-green-200">Verse of the Day</p>
        <p className="font-arabic text-4xl md:text-5xl mb-4 leading-relaxed text-green-50 font-extrabold drop-shadow-md">
          {verseOfTheDay.arabic}
        </p>
        <p className="text-sm italic mb-4 opacity-80 text-green-100">At-Talaq (65:2)</p> {/* Hardcoded for now, can be dynamic */}
        <p className="text-base md:text-lg text-green-100">"{verseOfTheDay.translation}"</p>
        <div className="mt-6">
          <button className="bg-white bg-opacity-20 p-4 rounded-full hover:bg-opacity-30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 shadow-lg">
            <Play size={28} className="text-white" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Display of available reciters */}
      <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl text-green-50">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-100">Available Reciters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...recitersData.featured, ...recitersData.free].map((reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              points={points} // Points are passed but not used for unlocking here
              isUnlocked={userProgress.unlockedReciters.includes(reciter.id)} // Check if reciter is unlocked
              onUnlock={handleUnlockReciter} // Pass unlock handler
              onSelectReciter={handleSelectReciterForListen} // Pass select reciter for listen
              showNotification={showNotification}
            />
          ))}
        </div>
      </div>

      {/* User Progress Summary section */}
      <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl text-green-50">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-100">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProgressCard
            title="Daily Streak"
            value={userProgress.dailyStreak}
            unit="Days in a row"
            icon={Zap} // Using Zap icon for streak
            progressBar={false}
          />
          <ProgressCard
            title="Verses Read"
            value={userProgress.versesRead}
            unit="verses"
            icon={BookOpen} // Using BookOpen icon for verses read
            progressBar={true}
            progressPercent={(userProgress.versesRead % 100) / 100 * 100}
            milestoneText={`${100 - (userProgress.versesRead % 100)} verses to next milestone`}
          />
          <AchievementsCard achievements={userProgress.achievements} />
        </div>
      </div>

      {/* NEW: Continue Reading Section - visible only if a last read position exists */}
      {lastReadPosition && (
          <Card
              icon={ArrowLeft} // Using ArrowLeft for continue reading
              title="Continue Reading"
              description={`Resume Surah ${quranData.surahs.find(s => s.id === lastReadPosition.surahId)?.englishName || 'Unknown'} from Verse ${lastReadPosition.verseId}`}
              onClick={onContinueReading}
          />
      )}

      {/* Bookmarked Verses & Quiz Cards - arranged in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card icon={Bookmark} title="Bookmarked Verses" description="Access your saved verses" onClick={() => setCurrentView('bookmarks')} />
        <Card icon={HelpCircle} title="Quiz Me!" description="Test your Quran knowledge" onClick={() => setCurrentView('quiz')} />
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
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-green-100">Select a Surah</h2>
      <input
        type="text"
        placeholder="Search Surah by name or number..."
        className="w-full p-4 mb-6 rounded-xl bg-green-700 text-green-50 placeholder-green-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-inner text-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto custom-scrollbar p-2">
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <li key={surah.id}>
              <button
                onClick={() => onSelectSurah(surah.id)}
                className="w-full text-left p-5 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 rounded-xl transition-all duration-300 flex justify-between items-center text-green-50 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl"></div>
                <div>
                  <p className="font-semibold text-xl text-green-50 group-hover:text-white transition-colors duration-300">{surah.englishName}</p>
                  <p className="font-arabic text-2xl text-green-200 group-hover:text-green-100 transition-colors duration-300">{surah.name}</p>
                </div>
                <span className="text-base text-green-300 group-hover:text-green-200 transition-colors duration-300">{surah.numberOfVerses} Verses</span>
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-green-300 col-span-full py-8 text-lg">No surahs found matching your search.</p>
        )}
      </ul>
    </div>
  );
};

// QuranReader component for displaying and interacting with Quranic verses.
// NOW RECEIVES selectedReciterAlquranCloudId PROP
const QuranReader = ({ selectedSurahId, onBackToSurahList, onSurahChange, onVerseRead, onToggleBookmark, bookmarkedVerses, onVerseAudioPlay, selectedReciterAlquranCloudId, showNotification }) => {
  const [surahVerses, setSurahVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedVerseId, setHighlightedVerseId] = useState(null);
  const [selectedFont, setSelectedFont] = useState(fontFamilies[0].name); // Default to first font
  const [fontSize, setFontSize] = useState(fontSizes[1].className); // Default to Medium font size
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlayingCurrentVerse, setIsPlayingCurrentVerse] = useState(false); // New state for current verse audio status

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
      // Pause any existing audio when a new surah is loaded
      audioRef.current.pause();
      setIsPlayingCurrentVerse(false);

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
            audio: arabicAyah.audio, // This audio URL is for a default reciter (usually Ghamdi)
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
      setIsPlayingCurrentVerse(false);
    };
    const handlePlay = () => setIsPlayingCurrentVerse(true);
    const handlePause = () => setIsPlayingCurrentVerse(false);
    const handleError = (e) => {
      console.error("Audio playback error:", e);
      showNotification("Error playing audio. Try another reciter or verse.", 'error');
      setIsPlayingCurrentVerse(false);
      setIsAudioLoading(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);


    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause(); // Pause any playing audio when component unmounts or re-renders.
      audio.src = ''; // Clear audio source.
    };
  }, [showNotification]);

  // Callback to play verse audio using the selected reciter
  const playVerseAudio = useCallback(async (verseId) => {
    if (!selectedReciterAlquranCloudId) {
      showNotification("Please select a reciter from the 'Listen' section on the Home page first.", 'info');
      return;
    }

    setIsAudioLoading(true);
    setHighlightedVerseId(verseId); // Highlight the currently playing verse.
    audioRef.current.pause(); // Pause any currently playing audio
    setIsPlayingCurrentVerse(false); // Reset playing state

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurahId}:${verseId}/${selectedReciterAlquranCloudId}`);
      const data = await response.json();

      if (data.code === 200 && data.data && data.data.audio) {
        audioRef.current.src = data.data.audio;
        audioRef.current.play().catch(error => {
          console.error("Error playing audio after setting src:", error);
          showNotification("Failed to play audio. Browser autoplay blocked or network issue.", 'error');
          setIsPlayingCurrentVerse(false);
        });
        onVerseAudioPlay(selectedSurahId, verseId); // Inform parent about audio play for last read tracking.
      } else {
        showNotification("Audio not found for this verse with the selected reciter.", 'error');
        console.error("API Error: Audio data missing or API response not 200", data);
        setIsPlayingCurrentVerse(false);
      }
    } catch (err) {
      console.error("Fetch error for verse audio:", err);
      showNotification("Could not fetch audio. Please check your internet connection.", 'error');
      setIsPlayingCurrentVerse(false);
    } finally {
      setIsAudioLoading(false);
    }
  }, [selectedReciterAlquranCloudId, selectedSurahId, onVerseAudioPlay, showNotification]);

  const toggleVerseAudio = useCallback((verseId) => {
    if (highlightedVerseId === verseId && isPlayingCurrentVerse) {
      audioRef.current.pause();
      setHighlightedVerseId(null);
    } else {
      playVerseAudio(verseId);
    }
  }, [highlightedVerseId, isPlayingCurrentVerse, playVerseAudio]);


  // Handler for navigating to the previous surah.
  const handlePrevSurah = () => {
    if (selectedSurahId > 1) {
      onSurahChange(selectedSurahId - 1); // Navigate to previous surah.
      audioRef.current.pause(); // Pause current audio.
      setIsPlayingCurrentVerse(false);
      setHighlightedVerseId(null); // Clear highlight.
    }
  };

  // Handler for navigating to the next surah.
  const handleNextSurah = () => {
    if (selectedSurahId < quranData.surahs.length) {
      onSurahChange(selectedSurahId + 1); // Navigate to next surah.
      audioRef.current.pause(); // Pause current audio.
      setIsPlayingCurrentVerse(false);
      setHighlightedVerseId(null); // Clear highlight.
    }
  };

  // Handler for changing font size.
  const handleFontSizeChange = (action) => {
    const currentSizes = fontSizes.map(f => f.className);
    const currentIndex = currentSizes.indexOf(fontSize);

    if (action === 'increase' && currentIndex < currentSizes.length - 1) {
      setFontSize(currentSizes[currentIndex + 1]);
    } else if (action === 'decrease' && currentIndex > 0) {
      setFontSize(currentSizes[currentIndex - 1]);
    }
  };

  // Handler for changing font family.
  const handleFontFamilyChange = (e) => {
    setSelectedFont(e.target.value);
  };

  if (isLoading) {
    return <div className="text-center text-green-200 text-xl py-8 animate-pulse">Loading Surah...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 text-xl py-8">Error: {error}</div>;
  }

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToSurahList}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h2 className="text-3xl md:text-4xl font-bold text-center flex-grow text-green-100">
          {selectedSurahMeta?.englishName} <span className="font-arabic text-4xl md:text-5xl ml-2 text-green-200">{selectedSurahMeta?.name}</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevSurah}
            disabled={selectedSurahId === 1}
            className="bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextSurah}
            disabled={selectedSurahId === quranData.surahs.length}
            className="bg-green-700 hover:bg-green-600 px-3 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Font Controls */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6 p-4 bg-green-700 rounded-2xl shadow-inner border border-green-600">
        <div className="flex items-center space-x-2">
          <label htmlFor="font-family" className="text-green-200 font-medium">Font:</label>
          <select
            id="font-family"
            value={selectedFont}
            onChange={handleFontFamilyChange}
            className="p-2 rounded-lg bg-green-600 text-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-500 shadow-sm"
          >
            {fontFamilies.map(font => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-green-200 font-medium">Font Size:</label>
          <button
            onClick={() => handleFontSizeChange('decrease')}
            className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-md text-green-50 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
          >
            -
          </button>
          <span className="text-green-50 text-xl font-bold">{fontSize.replace('text-', '')}</span> {/* Display current size */}
          <button
            onClick={() => handleFontSizeChange('increase')}
            className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-md text-green-50 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* Verses Display */}
      <div className="space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar p-2">
        {surahVerses.map((verse) => (
          <div
            key={verse.id}
            className={`p-5 rounded-2xl shadow-lg transition-all duration-300 border ${
              highlightedVerseId === verse.id ? 'bg-green-600 border-green-400 animate-pulse-once' : 'bg-green-700 border-green-700 hover:shadow-xl'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <p className={`font-arabic text-right leading-loose ${fontSize} ${fontFamilies.find(f => f.name === selectedFont)?.className || 'font-arabic'} text-green-50 font-medium`}>
                {verse.arabic} <span className="text-sm opacity-70 text-green-200">({verse.id})</span>
              </p>
              <button
                onClick={() => onToggleBookmark(selectedSurahId, verse.id)}
                className="ml-4 text-yellow-400 hover:text-yellow-300 focus:outline-none p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
                title={bookmarkedVerses.some(b => b.surahId === selectedSurahId && b.verseId === verse.id) ? "Remove Bookmark" : "Add Bookmark"}
              >
                <Bookmark size={24} fill={bookmarkedVerses.some(b => b.surahId === selectedSurahId && b.verseId === verse.id) ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-green-100 text-left mt-2 text-base md:text-lg">{verse.translation}</p>
            <div className="mt-4 flex justify-end">
              <button
                // Modified to use toggleVerseAudio
                onClick={() => {
                  toggleVerseAudio(verse.id);
                  onVerseRead(selectedSurahId, verse.id); // Mark verse as read
                }}
                disabled={isAudioLoading && highlightedVerseId !== verse.id} // Disable if another audio is loading
                className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-full text-white flex items-center shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50"
              >
                {isAudioLoading && highlightedVerseId === verse.id ? (
                    <>
                        <span className="animate-spin mr-2">🌀</span> Loading...
                    </>
                ) : (highlightedVerseId === verse.id && isPlayingCurrentVerse) ? (
                    <>
                        <Pause size={20} className="mr-2" fill="currentColor" />
                        Pause
                    </>
                ) : (
                    <>
                        <Play size={20} className="mr-2" fill="currentColor" />
                        Play
                    </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Placeholder Components for Navigation ---
// These components are placeholders. You can expand them with full functionality later.

const ListenPage = ({ onBackToHome, selectedReciterId, selectedReciterName, selectedReciterEnglishName, selectedReciterAlquranCloudId, onSelectReciter, showNotification }) => {
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSurahId, setSelectedSurahId] = useState(1); // Default to Al-Fatiha
  const [selectedVerseId, setSelectedVerseId] = useState(1); // Default to first verse

  const selectedSurahMeta = quranData.surahs.find(s => s.id === selectedSurahId);

  // Function to fetch and play audio for a specific verse
  const playVerse = useCallback(async (surahId, verseId, reciterAlquranCloudId) => {
    if (!reciterAlquranCloudId) {
      setError("Please select a reciter first from the Home page.");
      showNotification("Please select a reciter from the 'Listen' section on the Home page first.", 'info');
      return;
    }
    setIsLoadingAudio(true);
    setError(null);
    setIsPlaying(false);
    audioRef.current.pause(); // Ensure previous audio stops

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahId}:${verseId}/${reciterAlquranCloudId}`);
      const data = await response.json();

      if (data.code === 200 && data.data && data.data.audio) {
        setCurrentAudioUrl(data.data.audio);
        audioRef.current.src = data.data.audio;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(err => {
          console.error("Error playing audio:", err);
          setError("Failed to play audio. Browser autoplay blocked or network issue.");
          showNotification("Failed to play audio. Browser autoplay blocked or network issue.", 'error');
          setIsPlaying(false);
        });
      } else {
        setError("Audio not found for this verse with the selected reciter.");
        showNotification("Audio not found for this verse with the selected reciter.", 'error');
        console.error("API Error:", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not fetch audio. Check internet connection.");
      showNotification("Could not fetch audio. Check internet connection.", 'error');
    } finally {
      setIsLoadingAudio(false);
    }
  }, [showNotification]);

  // Effect to manage audio playback state
  useEffect(() => {
    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e) => {
      console.error("Audio playback error in ListenPage:", e);
      setError("Error playing audio. Try another reciter or verse.");
      showNotification("Error playing audio. Try another reciter or verse.", 'error');
      setIsPlaying(false);
      setIsLoadingAudio(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [showNotification]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentAudioUrl) {
        audioRef.current.play().catch(err => console.error("Error resuming play:", err));
      } else {
        // If no audio loaded, try to play the default first verse of the selected surah
        playVerse(selectedSurahId, selectedVerseId, selectedReciterAlquranCloudId);
      }
    }
  };

  const handleSurahChange = (e) => {
    const newSurahId = parseInt(e.target.value);
    setSelectedSurahId(newSurahId);
    setSelectedVerseId(1); // Reset verse to 1 when surah changes
    // Automatically try to play the new selection
    playVerse(newSurahId, 1, selectedReciterAlquranCloudId);
  };

  const handleVerseChange = (e) => {
    const newVerseId = parseInt(e.target.value);
    setSelectedVerseId(newVerseId);
    // Automatically try to play the new selection
    playVerse(selectedSurahId, newVerseId, selectedReciterAlquranCloudId);
  };

  // Initial play when component mounts or reciter changes, if not already playing
  useEffect(() => {
    if (selectedReciterAlquranCloudId && !currentAudioUrl && !isLoadingAudio) {
      playVerse(selectedSurahId, selectedVerseId, selectedReciterAlquranCloudId);
    }
  }, [selectedReciterAlquranCloudId, selectedSurahId, selectedVerseId, playVerse, currentAudioUrl, isLoadingAudio]);


  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Listen Quran</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="text-center mb-6">
        {selectedReciterName ? (
          <p className="text-xl text-green-100">Reciter: <span className="font-arabic font-semibold text-green-50">{selectedReciterName}</span> (<span className="text-green-200">{selectedReciterEnglishName}</span>)</p>
        ) : (
          <p className="text-xl text-red-300 font-medium">No reciter selected. Please select one from the Home page.</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="surah-select" className="block text-green-200 font-medium mb-2">Select Surah:</label>
          <select
            id="surah-select"
            value={selectedSurahId}
            onChange={handleSurahChange}
            className="w-full p-3 rounded-lg bg-green-700 text-green-50 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-inner text-base"
          >
            {quranData.surahs.map(surah => (
              <option key={surah.id} value={surah.id}>
                {surah.englishName} ({surah.name})
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="verse-select" className="block text-green-200 font-medium mb-2">Select Verse:</label>
          <select
            id="verse-select"
            value={selectedVerseId}
            onChange={handleVerseChange}
            className="w-full p-3 rounded-lg bg-green-700 text-green-50 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-inner text-base"
          >
            {Array.from({ length: selectedSurahMeta?.numberOfVerses || 0 }, (_, i) => i + 1).map(verseNum => (
              <option key={verseNum} value={verseNum}>
                Verse {verseNum}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoadingAudio && (
        <div className="text-center text-green-300 text-lg mb-4 animate-pulse">Loading audio...</div>
      )}
      {error && (
        <div className="text-center text-red-400 text-lg mb-4">Error: {error}</div>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={togglePlayPause}
          disabled={!selectedReciterAlquranCloudId || isLoadingAudio}
          className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full text-white flex items-center shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50"
        >
          {isLoadingAudio ? (
            <>
              <span className="animate-spin mr-2">🌀</span> Loading...
            </>
          ) : isPlaying ? (
            <>
              <Pause size={24} className="mr-2" fill="currentColor" />
              Pause
            </>
          ) : (
            <>
              <Play size={24} className="mr-2" fill="currentColor" />
              Play
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const PracticePage = ({ onBackToHome }) => (
  <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
    <div className="flex justify-between items-center mb-6">
      <button
        onClick={onBackToHome}
        className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>
      <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Practice Recitation</h2>
      <div className="w-10"></div> {/* Spacer */}
    </div>
    <p className="text-center text-lg text-green-200 mt-8">
      This is where you can practice your recitation. (Feature coming soon!)
    </p>
    <div className="mt-8 text-center">
        <Mic size={96} className="text-green-400 animate-pulse" strokeWidth={1} />
    </div>
  </div>
);

const PrayerTimesPage = ({ onBackToHome }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Effect to get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError("Geolocation denied or unavailable. Using default location.");
          // Default to a known location (e.g., London) if geolocation fails
          setLocation({ latitude: 51.5074, longitude: 0.1278 });
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser. Using default location.");
      // Default to a known location (e.g., London) if not supported
      setLocation({ latitude: 51.5074, longitude: 0.1278 });
      setLoading(false);
    }
  }, []);

  // Effect to calculate prayer times when location changes
  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      const times = getPrayerTimes(location.latitude, location.longitude, currentTime);
      setPrayerTimes(times);
    }
  }, [location, currentTime]);

  // Effect to update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 text-center animate-pulse">
        <p className="text-lg text-green-200">Getting your location for accurate prayer times...</p>
        <div className="mt-4 text-6xl text-green-400 animate-bounce">📍</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Prayer Times</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {error && <p className="text-red-400 text-center mb-4 text-lg">{error}</p>}

      {prayerTimes && (
        <div className="text-center mb-6">
          <p className="text-xl font-semibold mb-2 text-green-100">Current Time: <span className="text-green-50">{format(currentTime, 'h:mm:ss a')}</span></p>
          {prayerTimes.nextPrayer ? (
            <div className="bg-green-700 p-5 rounded-2xl shadow-inner border border-green-600">
              <p className="text-2xl md:text-3xl font-bold text-green-200 flex items-center justify-center">Next Prayer: {prayerTimes.nextPrayer.name} <span className="ml-2">{prayerTimes.nextPrayer.icon}</span></p>
              <p className="text-xl text-green-100">in <span className="font-bold text-green-50">{prayerTimes.timeToNextPrayer}</span></p>
              <p className="text-sm text-green-300 mt-1">at {format(prayerTimes.nextPrayer.time, 'h:mm a')}</p>
            </div>
          ) : (
            <p className="text-lg text-green-200">No upcoming prayers for today.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {prayerTimes?.times.map((prayer, index) => (
          <div key={index} className="bg-green-700 p-4 rounded-xl shadow-md text-center border border-green-600 hover:shadow-lg transition-shadow duration-200">
            <p className="text-3xl mb-2 flex justify-center">{prayer.icon}</p>
            <p className="text-lg font-semibold text-green-100">{prayer.name}</p>
            <p className="text-xl font-bold text-green-200">{format(prayer.time, 'h:mm a')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookmarksPage = ({ onBackToHome, bookmarkedVerses, onSelectSurah, onToggleBookmark }) => {
  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Bookmarked Verses</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {bookmarkedVerses.length === 0 ? (
        <p className="text-center text-lg text-green-300 py-8">You haven't bookmarked any verses yet. Start reading to add some!</p>
      ) : (
        <ul className="space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar p-2">
          {bookmarkedVerses.map((bookmark) => {
            const surah = quranData.surahs.find(s => s.id === bookmark.surahId);
            return (
              <li key={`${bookmark.surahId}-${bookmark.verseId}`} className="bg-green-700 p-5 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-center sm:items-start border border-green-600 hover:shadow-lg transition-shadow duration-200">
                <div className="text-center sm:text-left mb-3 sm:mb-0">
                  <p className="text-lg font-semibold text-green-100">{surah?.englishName || 'Unknown Surah'} (<span className="text-green-200">{bookmark.surahId}:{bookmark.verseId}</span>)</p>
                  <p className="text-sm text-green-200 italic">{bookmark.arabicText}</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => onSelectSurah(bookmark.surahId, bookmark.verseId)}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full text-white text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 shadow-sm"
                  >
                    Go to Verse
                  </button>
                  <button
                    onClick={() => onToggleBookmark(bookmark.surahId, bookmark.verseId)}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-full text-white text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50 shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const QuizPage = ({ onBackToHome, updateUserProgress, showNotification }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [quizPoints, setQuizPoints] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Combined'); // Default category

  // Function to get a random question based on category
  const getRandomQuestion = useCallback(() => {
    const availableQuestions = selectedCategory === 'Combined'
      ? quizQuestions
      : quizQuestions.filter(q => q.category === selectedCategory);

    if (availableQuestions.length === 0) {
      setFeedback("No questions available for this category.");
      setCurrentQuestion(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[randomIndex]);
    setSelectedAnswer(null);
    setFeedback('');
  }, [selectedCategory]);

  useEffect(() => {
    if (quizStarted) {
      getRandomQuestion();
    }
  }, [quizStarted, getRandomQuestion]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) {
      setFeedback("Please select an answer.");
      return;
    }

    setQuestionsAnswered(prev => prev + 1);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setFeedback("Correct! 🎉");
      setQuizPoints(prev => prev + 10); // Award 10 points for correct answer
      showNotification("Correct answer! +10 points!", 'success');
    } else {
      setFeedback(`Incorrect. The correct answer was: ${currentQuestion.correctAnswer}`);
      showNotification("Incorrect answer.", 'error');
    }
  };

  const handleNextQuestion = () => {
    getRandomQuestion();
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizPoints(0);
    setQuestionsAnswered(0);
    getRandomQuestion();
  };

  const handleEndQuiz = () => {
    setQuizStarted(false);
    updateUserProgress(prev => ({
      ...prev,
      points: (prev.points || 0) + quizPoints,
      // Potentially update quiz-related achievements here
    }));
    showNotification(`Quiz ended. You earned ${quizPoints} points!`, 'info');
  };

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Quran Quiz</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {!quizStarted ? (
        <div className="text-center py-8">
          <p className="text-lg text-green-200 mb-4">Test your knowledge of the Quran!</p>
          <div className="mb-6">
            <label htmlFor="category-select" className="block text-green-200 font-medium mb-2">Select Category:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 rounded-lg bg-green-700 text-green-50 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-inner text-base"
            >
              {quizCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleStartQuiz}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 text-xl"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div>
          <div className="text-center mb-4 bg-green-700 p-4 rounded-xl shadow-inner">
            <p className="text-xl font-semibold text-green-100">Score: <span className="text-green-50">{quizPoints}</span> points</p>
            <p className="text-md text-green-200">Questions Answered: <span className="text-green-100">{questionsAnswered}</span></p>
          </div>

          {currentQuestion ? (
            <div className="bg-green-700 p-6 rounded-2xl shadow-lg mb-4 border border-green-600">
              <p className="text-lg md:text-xl font-medium text-green-100 mb-4">{currentQuestion.question}</p>
              <div className="space-y-3">
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(choice)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 text-base md:text-lg font-medium shadow-sm hover:shadow-md ${
                      selectedAnswer === choice ? 'bg-green-500 text-white border-2 border-green-400' : 'bg-green-600 hover:bg-green-500 text-green-50'
                    } focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {feedback && (
                <p className={`mt-4 text-center font-semibold text-lg ${feedback.includes('Correct') ? 'text-green-300' : 'text-red-300'}`}>
                  {feedback}
                </p>
              )}
              <div className="flex justify-between mt-6 flex-col sm:flex-row gap-3 sm:gap-0">
                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 text-base"
                >
                  Submit Answer
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 text-base"
                >
                  Next Question
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-lg text-green-200 py-8">Loading question...</p>
          )}

          <div className="text-center mt-6">
            <button
              onClick={handleEndQuiz}
              className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50 text-xl"
            >
              End Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  // Firebase State
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // App UI State
  const [currentView, setCurrentView] = useState('home'); // 'home', 'surah-selector', 'quran-reader', 'listen', 'practice', 'prayer-times', 'bookmarks', 'quiz'
  const [notification, setNotification] = useState(null);

  // Quran Reader State
  const [selectedSurahId, setSelectedSurahId] = useState(null);

  // User Progress State (synced with Firestore)
  const [userProgress, setUserProgress] = useState({
    points: 0,
    dailyStreak: 0,
    lastLoginDate: null,
    versesRead: 0,
    bookmarkedVerses: [], // { surahId: number, verseId: number, arabicText: string }
    lastReadPosition: null, // { surahId: number, verseId: number }
    achievements: achievementsData.map(a => ({ ...a, achieved: false })), // Initialize with all achievements as not achieved
    unlockedReciters: recitersData.featured.map(r => r.id), // All featured reciters are unlocked by default
  });

  // Reciter State for Listen Page
  const [selectedReciterId, setSelectedReciterId] = useState(recitersData.featured[0].id);
  const [selectedReciterName, setSelectedReciterName] = useState(recitersData.featured[0].name);
  const [selectedReciterEnglishName, setSelectedReciterEnglishName] = useState(recitersData.featured[0].englishName);
  const [selectedReciterAlquranCloudId, setSelectedReciterAlquranCloudId] = useState(recitersData.featured[0].alquranCloudId);


  // --- Firebase Initialization and Authentication ---
  useEffect(() => {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;

    if (!firebaseConfig) {
      console.error("Firebase config is not defined. Please set __firebase_config environment variable.");
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // If no user, sign in anonymously
          try {
            const anonymousUser = await signInAnonymously(firebaseAuth);
            setUserId(anonymousUser.user.uid);
          } catch (error) {
            console.error("Error signing in anonymously:", error);
            showNotification("Failed to authenticate. Please try again.", 'error');
          }
        }
        setIsAuthReady(true); // Mark auth as ready once initial check/sign-in is done
      });

      // Handle initial custom token sign-in if available
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
      if (initialAuthToken && !firebaseAuth.currentUser) {
        signInWithCustomToken(firebaseAuth, initialAuthToken)
          .then(() => console.log("Signed in with custom token"))
          .catch(error => {
            console.error("Error signing in with custom token:", error);
            showNotification("Failed to authenticate with custom token.", 'error');
          });
      }

      return () => unsubscribe(); // Cleanup auth listener
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      showNotification("Failed to initialize Firebase. Check console for details.", 'error');
    }
  }, []); // Run once on component mount

  // --- Firestore Data Listener (User Progress) ---
  useEffect(() => {
    if (!isAuthReady || !db || !userId) {
      return;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/quranProgress/data`);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Parse JSON strings back to objects/arrays where necessary
        const parsedBookmarkedVerses = data.bookmarkedVerses ? JSON.parse(data.bookmarkedVerses) : [];
        const parsedAchievements = data.achievements ? JSON.parse(data.achievements) : achievementsData.map(a => ({ ...a, achieved: false }));
        const parsedLastReadPosition = data.lastReadPosition ? JSON.parse(data.lastReadPosition) : null;
        const parsedUnlockedReciters = data.unlockedReciters ? JSON.parse(data.unlockedReciters) : recitersData.featured.map(r => r.id);

        setUserProgress({
          points: data.points || 0,
          dailyStreak: data.dailyStreak || 0,
          lastLoginDate: data.lastLoginDate ? parseISO(data.lastLoginDate) : null,
          versesRead: data.versesRead || 0,
          bookmarkedVerses: parsedBookmarkedVerses,
          lastReadPosition: parsedLastReadPosition,
          achievements: parsedAchievements,
          unlockedReciters: parsedUnlockedReciters,
        });
      } else {
        // Initialize default progress for new users
        console.log("No user progress found, initializing default.");
        setUserProgress({
          points: 0,
          dailyStreak: 0,
          lastLoginDate: null,
          versesRead: 0,
          bookmarkedVerses: [],
          lastReadPosition: null,
          achievements: achievementsData.map(a => ({ ...a, achieved: false })),
          unlockedReciters: recitersData.featured.map(r => r.id),
        });
      }
    }, (error) => {
      console.error("Error fetching user progress:", error);
      showNotification("Failed to load user progress. Please try refreshing.", 'error');
    });

    return () => unsubscribe(); // Cleanup listener
  }, [isAuthReady, db, userId]); // Re-run if auth state or Firebase instances change

  // --- Save User Progress to Firestore (Debounced) ---
  const saveProgressTimeoutRef = useRef(null);
  useEffect(() => {
    if (!db || !userId || !isAuthReady) {
      return;
    }

    // Clear any existing timeout to debounce saves
    if (saveProgressTimeoutRef.current) {
      clearTimeout(saveProgressTimeoutRef.current);
    }

    // Set a new timeout to save progress after a short delay
    saveProgressTimeoutRef.current = setTimeout(async () => {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/quranProgress/data`);

      try {
        // Stringify complex objects/arrays before saving
        const dataToSave = {
          ...userProgress,
          lastLoginDate: userProgress.lastLoginDate ? format(userProgress.lastLoginDate, 'yyyy-MM-dd') : null,
          bookmarkedVerses: JSON.stringify(userProgress.bookmarkedVerses),
          lastReadPosition: JSON.stringify(userProgress.lastReadPosition),
          achievements: JSON.stringify(userProgress.achievements),
          unlockedReciters: JSON.stringify(userProgress.unlockedReciters),
        };
        await setDoc(userDocRef, dataToSave, { merge: true });
        console.log("User progress saved to Firestore.");
      } catch (error) {
        console.error("Error saving user progress:", error);
        showNotification("Failed to save progress.", 'error');
      }
    }, 1000); // Save after 1 second of no changes

    return () => {
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
      }
    };
  }, [userProgress, db, userId, isAuthReady]); // Re-save whenever userProgress changes

  // --- Daily Streak Logic ---
  useEffect(() => {
    if (!userProgress.lastLoginDate) {
      // First login or no previous login, set streak to 1
      updateUserProgress(prev => ({
        ...prev,
        dailyStreak: 1,
        lastLoginDate: startOfDay(new Date()),
      }));
      return;
    }

    const today = startOfDay(new Date());
    const lastLogin = startOfDay(userProgress.lastLoginDate);
    const yesterday = addDays(today, -1);

    if (lastLogin.getTime() === today.getTime()) {
      // Already logged in today, do nothing to streak
      return;
    } else if (lastLogin.getTime() === yesterday.getTime()) {
      // Logged in yesterday, increment streak
      updateUserProgress(prev => ({
        ...prev,
        dailyStreak: prev.dailyStreak + 1,
        lastLoginDate: today,
      }));
      showNotification(`Daily streak: ${userProgress.dailyStreak + 1} days!`, 'success');
    } else {
      // Missed a day, reset streak
      updateUserProgress(prev => ({
        ...prev,
        dailyStreak: 1,
        lastLoginDate: today,
      }));
      showNotification("Daily streak reset. Keep going!", 'info');
    }
  }, [userProgress.lastLoginDate]); // Only run when lastLoginDate changes

  // --- Achievement Logic ---
  useEffect(() => {
    const updatedAchievements = userProgress.achievements.map(ach => {
      if (ach.achieved) return ach; // Already achieved, no need to re-evaluate

      switch (ach.id) {
        case 'first-read':
          if (userProgress.versesRead > 0) {
            showNotification(`Achievement Unlocked: ${ach.title}!`, 'success');
            return { ...ach, achieved: true };
          }
          break;
        case 'first-week':
          if (userProgress.dailyStreak >= 7) {
            showNotification(`Achievement Unlocked: ${ach.title}!`, 'success');
            return { ...ach, achieved: true };
          }
          break;
        case 'practice-master':
          // Assuming a 'practiceSessions' counter in userProgress
          // if (userProgress.practiceSessions >= 100) {
          //   showNotification(`Achievement Unlocked: ${ach.title}!`, 'success');
          //   return { ...ach, achieved: true };
          // }
          break;
        case 'quiz-whiz':
          if (userProgress.points >= 500) {
            showNotification(`Achievement Unlocked: ${ach.title}!`, 'success');
            return { ...ach, achieved: true };
          }
          break;
        default:
          break;
      }
      return ach;
    });

    // Only update if there are actual changes to prevent infinite loops
    if (JSON.stringify(updatedAchievements) !== JSON.stringify(userProgress.achievements)) {
      setUserProgress(prev => ({ ...prev, achievements: updatedAchievements }));
    }
  }, [userProgress.versesRead, userProgress.dailyStreak, userProgress.points, userProgress.achievements]); // Depend on relevant progress metrics

  // --- Notification Management ---
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Notification disappears after 3 seconds
  }, []);

  // --- Handlers for App Navigation and Logic ---

  const handleSelectSurah = useCallback((surahId, verseIdToHighlight = null) => {
    setSelectedSurahId(surahId);
    setCurrentView('quran-reader');
    // If a specific verse is to be highlighted, the QuranReader component will handle scrolling to it.
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentView('home');
    setSelectedSurahId(null); // Clear selected surah when going back to home
  }, []);

  const handleVerseRead = useCallback((surahId, verseId) => {
    setUserProgress(prev => {
      const updatedVersesRead = prev.versesRead + 1;
      return {
        ...prev,
        versesRead: updatedVersesRead,
        lastReadPosition: { surahId, verseId },
      };
    });
  }, []);

  const handleToggleBookmark = useCallback((surahId, verseId) => {
    setUserProgress(prev => {
      const isBookmarked = prev.bookmarkedVerses.some(
        (b) => b.surahId === surahId && b.verseId === verseId
      );

      let updatedBookmarkedVerses;
      if (isBookmarked) {
        updatedBookmarkedVerses = prev.bookmarkedVerses.filter(
          (b) => !(b.surahId === surahId && b.verseId === verseId)
        );
        showNotification("Bookmark removed.", 'info');
      } else {
        // Fetch Arabic text for the bookmark
        const surahMeta = quranData.surahs.find(s => s.id === surahId);
        // In a real app, you'd fetch the actual verse text here if not already available.
        // For now, we'll use a placeholder or assume it's fetched by QuranReader.
        const arabicTextPlaceholder = `Surah ${surahMeta?.englishName || 'Unknown'}, Verse ${verseId}`;
        updatedBookmarkedVerses = [...prev.bookmarkedVerses, { surahId, verseId, arabicText: arabicTextPlaceholder }];
        showNotification("Verse bookmarked!", 'success');
      }
      return { ...prev, bookmarkedVerses: updatedBookmarkedVerses };
    });
  }, [showNotification]);

  const handleVerseAudioPlay = useCallback((surahId, verseId) => {
    setUserProgress(prev => ({
      ...prev,
      lastReadPosition: { surahId, verseId },
    }));
  }, []);

  const handleContinueReading = useCallback(() => {
    if (userProgress.lastReadPosition) {
      handleSelectSurah(userProgress.lastReadPosition.surahId, userProgress.lastReadPosition.verseId);
    } else {
      showNotification("No last read position found. Starting from Al-Fatiha.", 'info');
      handleSelectSurah(1); // Default to Al-Fatiha if no last position
    }
  }, [userProgress.lastReadPosition, handleSelectSurah, showNotification]);

  const handleUnlockReciter = useCallback((reciterId, cost) => {
    setUserProgress(prev => {
      if (prev.points >= cost) {
        const updatedUnlockedReciters = [...prev.unlockedReciters, reciterId];
        showNotification(`Reciter unlocked! You spent ${cost} points.`, 'success');
        return {
          ...prev,
          points: prev.points - cost,
          unlockedReciters: updatedUnlockedReciters,
        };
      } else {
        showNotification("Not enough points to unlock this reciter.", 'error');
        return prev; // Return previous state if not enough points
      }
    });
  }, [showNotification]);

  const handleSelectReciterForListen = useCallback((id, name, englishName, alquranCloudId) => {
    setSelectedReciterId(id);
    setSelectedReciterName(name);
    setSelectedReciterEnglishName(englishName);
    setSelectedReciterAlquranCloudId(alquranCloudId);
    setCurrentView('listen');
  }, []);

  // --- Render based on currentView ---
  const renderContent = () => {
    if (!isAuthReady) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-950 to-black text-green-100">
          <p className="text-2xl mb-4 font-medium">Loading application...</p>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
          <p className="mt-4 text-sm text-green-300">Authenticating with Firebase...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <HomeDashboard
            setCurrentView={setCurrentView}
            points={userProgress.points}
            userProgress={userProgress}
            unlockedReciters={userProgress.unlockedReciters}
            handleUnlockReciter={handleUnlockReciter}
            showNotification={showNotification}
            lastReadPosition={userProgress.lastReadPosition}
            onContinueReading={handleContinueReading}
            onSelectReciterForListen={handleSelectReciterForListen}
          />
        );
      case 'surah-selector':
        return <SurahSelector onSelectSurah={handleSelectSurah} />;
      case 'quran-reader':
        return (
          <QuranReader
            selectedSurahId={selectedSurahId}
            onBackToSurahList={() => setCurrentView('surah-selector')}
            onSurahChange={handleSelectSurah}
            onVerseRead={handleVerseRead}
            onToggleBookmark={handleToggleBookmark}
            bookmarkedVerses={userProgress.bookmarkedVerses}
            onVerseAudioPlay={handleVerseAudioPlay}
            selectedReciterAlquranCloudId={selectedReciterAlquranCloudId} // Pass reciter ID
            showNotification={showNotification} // Pass notification handler
          />
        );
      case 'listen':
        return (
          <ListenPage
            onBackToHome={handleBackToHome}
            selectedReciterId={selectedReciterId}
            selectedReciterName={selectedReciterName}
            selectedReciterEnglishName={selectedReciterEnglishName}
            selectedReciterAlquranCloudId={selectedReciterAlquranCloudId}
            onSelectReciter={handleSelectReciterForListen} // Allow selection from here if needed
            showNotification={showNotification}
          />
        );
      case 'practice':
        return <PracticePage onBackToHome={handleBackToHome} />;
      case 'prayer-times':
        return <PrayerTimesPage onBackToHome={handleBackToHome} />;
      case 'bookmarks':
        return (
          <BookmarksPage
            onBackToHome={handleBackToHome}
            bookmarkedVerses={userProgress.bookmarkedVerses}
            onSelectSurah={handleSelectSurah}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case 'quiz':
        return (
          <QuizPage
            onBackToHome={handleBackToHome}
            updateUserProgress={setUserProgress} // Pass setUserProgress directly
            showNotification={showNotification}
          />
        );
      default:
        return (
          <div className="text-center text-red-400 py-8">
            <p className="text-xl">Something went wrong. Unknown view.</p>
            <button onClick={handleBackToHome} className="mt-4 bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg text-white">
              Go to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-green-900 text-green-50 font-inter">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-200 drop-shadow-lg animate-fade-in-down">
            Quran App
          </h1>
          <p className="text-xl md:text-2xl text-green-300 mt-2 font-light animate-fade-in">Your Daily Companion for Quranic Reflection</p>
          {userId && (
            <p className="text-sm text-green-400 mt-2">User ID: <span className="font-mono text-green-300 break-all">{userId}</span></p>
          )}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-800 to-green-700 rounded-xl shadow-xl inline-block transform hover:scale-105 transition-transform duration-300">
            <p className="text-lg md:text-xl font-semibold flex items-center text-green-50">
              <DollarSign size={24} className="text-yellow-300 mr-2" /> Points: <span className="ml-2 text-yellow-200">{userProgress.points}</span>
            </p>
          </div>
        </header>

        <main>
          {renderContent()}
        </main>

        {notification && (
          <NotificationMessage
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
      {/* Vercel Analytics and Speed Insights components */}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
