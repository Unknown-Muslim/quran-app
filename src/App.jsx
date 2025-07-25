// --- Initial Setup and Data Imports ---
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO, startOfDay, addDays, differenceInSeconds } from 'date-fns';
// NEW: Import Lucide React icons for a modern look
import { Home, BookOpen, Headphones, Mic, Clock, Star, HelpCircle, ArrowLeft, ChevronLeft, ChevronRight, Play, Pause, Bookmark, CheckCircle, XCircle, Info, Sun, Moon, Cloud, Zap, Award, User, Clock9, CalendarDays, BarChart, Gem, DollarSign, CircleDot, Square, MessageSquareText } from 'lucide-react'; // Added MessageSquareText for Islamic Q&A
// NEW: Import Vercel Analytics component for web analytics
import { Analytics } from '@vercel/analytics/react';
// NEW: Import Vercel Speed Insights component for performance monitoring
import { SpeedInsights } from '@vercel/speed-insights/react';

// NEW: Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore'; // Correct import statement

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
      "لَمْ يَلِدْ وَلَمْ يُوُلَدْ",
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
      if (onSelectReciter) { // This is the prop name ReciterCard expects
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
            <Play size={20} className="mr-2" fill="currentColor" />
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
              onSelectReciter={onSelectReciterForListen} // Correctly pass the prop received by HomeDashboard
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

      {/* NEW: Islamic Q&A Card */}
      <div className="grid grid-cols-1">
        <Card icon={MessageSquareText} title="Islamic Q&A" description="Ask your Islamic questions" onClick={() => setCurrentView('deen-buddy')} />
      </div>
    </div>
  );
};

// SurahSelector component for browsing and selecting Quranic Surahs.
const SurahSelector = ({ onSelectSurah, onBackToHome }) => { // Added onBackToHome prop
  const [searchTerm, setSearchTerm] = useState('');

  // Filter surahs based on search term (English name, Arabic name, or ID).
  const filteredSurahs = quranData.surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.includes(searchTerm) ||
    surah.id.toString().includes(searchTerm)
  );

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6"> {/* Added header for buttons */}
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <Home size={20} className="mr-2" /> {/* Home icon */}
          Home
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Select a Surah</h2>
        <div className="w-20"></div> {/* Spacer to balance header */}
      </div>
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
const QuranReader = ({ selectedSurahId, onBackToSurahList, onSurahChange, onVerseRead, onToggleBookmark, bookmarkedVerses, onVerseAudioPlay, selectedReciterAlquranCloudId, showNotification, onBackToHome }) => {
  const [surahVerses, setSurahVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedVerseId, setHighlightedVerseId] = useState(null);
  const [selectedFont, setSelectedFont] = useState(fontFamilies[0].name); // Default to first font
  const [fontSize, setFontSize] = useState(fontSizes[1].className); // Default to Medium font size
  // State for Quran script edition
  const [quranScriptEdition, setQuranScriptEdition] = useState('quran-uthmani'); // 'quran-uthmani' for 15-line style, 'quran-simple' for standard digital

  const audioRef = useRef(new Audio());
  audioRef.current.volume = 0.8; // Set default audio volume

  const selectedSurahMeta = quranData.surahs.find(s => s.id === selectedSurahId);

  // Swipe gesture states
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50; // Minimum distance for a swipe to be registered

  // Handle touch start
  const onTouchStart = (e) => {
    touchEndX.current = 0; // Reset endX
    touchStartX.current = e.targetTouches[0].clientX;
  };

  // Handle touch move
  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  // Handle touch end (swipe detection)
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextSurah();
    } else if (isRightSwipe) {
      handlePrevSurah();
    }
  };


  // Effect to fetch surah verses from the API when selectedSurahId or quranScriptEdition changes.
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
        // Fetch Arabic text of the surah based on selected edition.
        // We are no longer fetching translation here as per user request.
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahId}/editions/${quranScriptEdition}`);
        const data = await response.json();

        // Improved check for data validity
        if (data.code === 200 && data.data && data.data.length >= 1) { // Check for at least Arabic data
          const arabicVerses = data.data[0].ayahs;

          const combinedVerses = arabicVerses.map((arabicAyah) => ({
            id: arabicAyah.numberInSurah,
            arabic: arabicAyah.text,
            // Translation is intentionally removed as per user request
          }));
          setSurahVerses(combinedVerses);
        } else {
          setError("Failed to load Surah verses. Data structure unexpected from API.");
          console.error("API Error fetching surah text:", data); // More specific error message
        }
      } catch (err) {
        console.error("Fetch error for surah text:", err);
        setError("Could not connect to Quran API for surah text. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurah();
  }, [selectedSurahId, quranScriptEdition]); // Dependency added for quranScriptEdition

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
  const playVerseAudio = useCallback(async (verseId) => {
    // Use the passed selected reciter, or fallback to the first featured reciter
    const reciterToUse = selectedReciterAlquranCloudId || recitersData.featured[0].alquranCloudId;

    if (!reciterToUse) {
        showNotification("Please select a reciter from the Home page or Listen page first.", 'error');
        return;
    }

    setHighlightedVerseId(verseId); // Highlight the currently playing verse.
    audioRef.current.pause(); // Pause any currently playing audio
    audioRef.current.src = ''; // Clear source

    const audioApiUrl = `https://api.alquran.cloud/v1/ayah/${selectedSurahId}:${verseId}/${reciterToUse}`;
    console.log("QuranReader: Attempting to fetch audio from:", audioApiUrl); // DEBUG: Log the URL

    try {
        // Fetch audio URL for the specific verse and selected reciter
        const response = await fetch(audioApiUrl);
        const data = await response.json();

        if (data.code === 200 && data.data && data.data.audio) {
            console.log("QuranReader: Audio URL received:", data.data.audio); // DEBUG: Log the audio URL
            audioRef.current.src = data.data.audio;
            audioRef.current.load(); // Added load()
            audioRef.current.play().catch(error => {
                console.error("QuranReader: Error playing audio:", error);
                showNotification("Failed to play audio. Your browser might block autoplay, or there's a network issue.", 'error');
            });
        } else {
            console.error("QuranReader: Audio not found in API response:", data);
            setError("Audio not available for this verse or reciter. Check console for details."); // Set error for display
            showNotification("Audio not available for this verse or reciter.", 'error');
        }
    } catch (error) {
        console.error("QuranReader: Fetch audio error:", error);
        setError("Could not connect to Quran API for audio. Please check your internet connection."); // Set error for display
        showNotification("Could not fetch audio. Check your internet connection.", 'error');
    }

    onVerseAudioPlay(selectedSurahId, verseId); // Inform parent about audio play for last read tracking.
  }, [onVerseAudioPlay, selectedSurahId, selectedReciterAlquranCloudId, showNotification]); // Dependencies updated

  // Handler for navigating to the previous surah.
  const handlePrevSurah = () => {
    if (selectedSurahId > 1) {
      onSurahChange(selectedSurahId - 1); // Navigate to previous surah.
      audioRef.current.pause(); // Pause current audio.
      setHighlightedVerseId(null); // Clear highlight.
    } else {
      showNotification("You are at the first Surah.", 'info');
    }
  };

  // Handler for navigating to the next surah.
  const handleNextSurah = () => {
    if (selectedSurahId < quranData.surahs.length) {
      onSurahChange(selectedSurahId + 1); // Navigate to next surah.
      audioRef.current.pause(); // Pause current audio.
      setHighlightedVerseId(null); // Clear highlight.
    } else {
      showNotification("You are at the last Surah.", 'info');
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
                <button
                    onClick={onBackToHome}
                    className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
                >
                    <Home size={20} className="mr-2" />
                    Home
                </button>
                <div className="w-20"></div> {/* Spacer */}
            </div>
            <div className="text-center text-red-400 text-xl py-8">Error: {error}</div>
        </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToSurahList}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <Home size={20} className="mr-2" />
          Home
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

      {/* Font and Quran Script Controls */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6 p-4 bg-green-700 rounded-2xl shadow-inner border border-green-600">
        {/* Font Family */}
        <div className="flex items-center space-x-2">
          <label htmlFor="font-family" className="text-green-200 font-medium">Font:</label>
          <select
            id="font-family"
            value={selectedFont}
            onChange={handleFontFamilyChange}
            className="p-2 rounded-lg bg-green-600 text-green-50 focus:outline-none focus:ring-2 focus:ring-4 focus:ring-green-400 border border-green-500 shadow-sm"
          >
            {fontFamilies.map(font => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
        {/* Font Size */}
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
        {/* Quran Script Edition */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <label className="text-green-200 font-medium">Quran Style:</label>
          <button
            onClick={() => setQuranScriptEdition('quran-uthmani')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              quranScriptEdition === 'quran-uthmani' ? 'bg-green-500 text-white' : 'bg-green-600 hover:bg-green-500 text-green-50'
            }`}
          >
            Uthmani (15-line style)
          </button>
          <button
            onClick={() => setQuranScriptEdition('quran-simple')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              quranScriptEdition === 'quran-simple' ? 'bg-green-500 text-white' : 'bg-green-600 hover:bg-green-500 text-green-50'
            }`}
          >
            Simple (Standard Digital)
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-green-300 italic mb-4">
        Note: "15-line style" refers to the Uthmani script often used in 15-line Mushafs; digital rendering may vary from exact physical page layouts.
      </p>

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
            {/* Translation removed as per user request */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  playVerseAudio(verse.id); // Now only pass verse.id
                  onVerseRead(selectedSurahId, verse.id); // Mark verse as read
                }}
                className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-full text-white flex items-center shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50"
              >
                <Play size={20} className="mr-2" fill="currentColor" />
                Play
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

const ListenPage = ({ onBackToHome, selectedReciterId, selectedReciterName, selectedReciterEnglishName, selectedReciterAlquranCloudId, showNotification }) => { // Added showNotification prop
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSurahId, setSelectedSurahId] = useState(1); // Default to Al-Fatiha
  const [selectedVerseId, setSelectedVerseId] = useState(1); // Default to first verse

  const selectedSurahMeta = quranData.surahs.find(s => s.id === selectedSurahId);

  // Function to fetch and play audio for a specific verse
  const playVerse = useCallback(async (surahId, verseId) => {
    // Use the passed selectedReciterAlquranCloudId, or fallback to the first featured reciter
    const reciterToUse = selectedReciterAlquranCloudId || recitersData.featured[0].alquranCloudId;

    if (!reciterToUse) {
        showNotification("No reciter available to play audio. Please select one from Home.", 'error');
        return;
    }

    setIsLoadingAudio(true);
    setError(null);
    setIsPlaying(false);

    const audioApiUrl = `https://api.alquran.cloud/v1/ayah/${surahId}:${verseId}/${reciterToUse}`;
    console.log("ListenPage: Attempting to fetch audio from:", audioApiUrl); // DEBUG: Log the URL

    try {
      const response = await fetch(audioApiUrl);
      const data = await response.json();

      // --- IMPROVED ERROR CHECKING FOR LISTEN PAGE AUDIO API RESPONSE ---
      if (data.code === 200 && data.data && data.data.audio) {
        console.log("ListenPage: Audio URL received:", data.data.audio); // DEBUG: Log the audio URL
        setCurrentAudioUrl(data.data.audio);
        audioRef.current.src = data.data.audio;
        audioRef.current.load(); // Added load()
        audioRef.current.play().then(() => setIsPlaying(true)).catch(err => {
          console.error("ListenPage: Error playing audio:", err);
          setError("Failed to play audio. Your browser might block autoplay, or there's a network issue.");
          showNotification("Failed to play audio. Browser might block autoplay, or network issue.", 'error'); // Added notification
          setIsPlaying(false);
        });
      } else {
        setError("Audio not found for this verse with the selected reciter. Try another reciter.");
        console.error("ListenPage: Audio not found in API response:", data);
        showNotification("Audio not found for this verse or reciter.", 'error'); // Added notification
      }
    } catch (err) {
      console.error("ListenPage: Fetch error:", err);
      setError("Could not fetch audio. Check internet connection or API status.");
      showNotification("Could not fetch audio. Check internet connection.", 'error'); // Added notification
    } finally {
      setIsLoadingAudio(false);
    }
  }, [selectedReciterAlquranCloudId, showNotification]); // Dependency changed to ensure re-creation if reciter changes

  // Effect to manage audio playback state
  useEffect(() => {
    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentAudioUrl) {
        audioRef.current.play().catch(err => console.error("Error resuming play:", err));
      } else {
        // If no audio loaded, try to play the default first verse
        playVerse(selectedSurahId, selectedVerseId);
      }
    }
  };

  const handleSurahChange = (e) => {
    setSelectedSurahId(parseInt(e.target.value));
    setSelectedVerseId(1); // Reset verse to 1 when surah changes
    setCurrentAudioUrl(null); // Clear current audio
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const handleVerseChange = (e) => {
    setSelectedVerseId(parseInt(e.target.value));
    setCurrentAudioUrl(null); // Clear current audio
    setIsPlaying(false);
    audioRef.current.pause();
  };

  // Automatically play selected verse when surah/verse/reciter changes
  useEffect(() => {
    if (selectedReciterAlquranCloudId && selectedSurahId && selectedVerseId) {
      playVerse(selectedSurahId, selectedVerseId);
    }
  }, [selectedReciterAlquranCloudId, selectedSurahId, selectedVerseId, playVerse]);


  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome} // <-- ADDED HOME BUTTON
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <Home size={20} className="mr-2" />
          Home
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
          disabled={isLoadingAudio} // Removed !selectedReciterAlquranCloudId as it's handled by playVerse
          className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full text-white flex items-center shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50"
        >
          {isPlaying ? (
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

const PracticePage = ({ onBackToHome, showNotification }) => {
  const [selectedSurahId, setSelectedSurahId] = useState(1); // Default to Al-Fatiha
  const [selectedVerseId, setSelectedVerseId] = useState(1); // Default to first verse
  const [surahVerses, setSurahVerses] = useState([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [errorFetchingVerses, setErrorFetchingVerses] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  const audioPlaybackRef = useRef(new Audio());
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0); // Default to normal speed

  const selectedSurahMeta = quranData.surahs.find(s => s.id === selectedSurahId);

  // Effect to fetch surah verses for display
  useEffect(() => {
    const fetchVerseText = async () => {
      setIsLoadingVerses(true);
      setErrorFetchingVerses(null);
      setSurahVerses([]);

      if (!selectedSurahId || !selectedVerseId) {
        setIsLoadingVerses(false);
        return;
      }

      try {
        const response = await fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurahId}:${selectedVerseId}/editions/quran-simple,en.sahih`);
        const data = await response.json();

        // --- IMPROVED ERROR CHECKING FOR PRACTICE PAGE API RESPONSE ---
        // Ensure data.data exists, is an array, and has at least two elements (Arabic and Translation)
        // Also check if ayahs property exists and is an array with at least one element
        if (data.code === 200 && data.data && Array.isArray(data.data) && data.data.length >= 2 &&
            data.data[0]?.ayahs && Array.isArray(data.data[0].ayahs) && data.data[0].ayahs.length > 0 &&
            data.data[1]?.ayahs && Array.isArray(data.data[1].ayahs) && data.data[1].ayahs.length > 0) {

          const arabicAyah = data.data[0].ayahs[0]; // First ayah of the first edition (arabic)
          const translationAyah = data.data[1].ayahs[0]; // First ayah of the second edition (translation)

          setSurahVerses([{
            id: arabicAyah.numberInSurah,
            arabic: arabicAyah.text,
            translation: translationAyah ? translationAyah.text : 'Translation not available.',
          }]);
        } else {
          setErrorFetchingVerses("Failed to load verse text. API response was unexpected or incomplete.");
          console.error("API Error fetching verse text for practice:", data);
          showNotification("Failed to load verse text for practice. API response issue.", 'error');
        }
      } catch (err) {
        console.error("Fetch error for verse text for practice:", err);
        setErrorFetchingVerses("Could not connect to Quran API for verse text. Check internet connection.");
        showNotification("Could not connect to Quran API for verse text.", 'error');
      } finally {
        setIsLoadingVerses(false);
      }
    };

    fetchVerseText();
  }, [selectedSurahId, selectedVerseId, showNotification]); // Added showNotification to dependencies

  // Recording logic
  const startRecording = async () => {
    setRecordedAudioUrl(null); // Clear previous recording
    setAudioChunks([]);
    setIsPlayingRecording(false);
    audioPlaybackRef.current.pause(); // Stop any playback

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Prefer 'audio/webm' for broader browser support and smaller file sizes,
      // but if that fails, consider 'audio/ogg' as a fallback if needed for specific issues.
      const options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn('audio/webm not supported, trying audio/ogg');
        options.mimeType = 'audio/ogg';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn('audio/ogg not supported, trying audio/wav');
          options.mimeType = 'audio/wav';
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            showNotification("Your browser does not support any common audio recording formats.", 'error');
            return;
          }
        }
      }

      const recorder = new MediaRecorder(stream, options);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) { // Only add if data exists
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        if (audioChunks.length === 0) {
          showNotification("No audio recorded. Make sure your microphone is working.", 'error');
          return;
        }
        const audioBlob = new Blob(audioChunks, { type: recorder.mimeType }); // Use recorder's actual mimeType
        const url = URL.createObjectURL(audioBlob);
        console.log("Recorded audio Blob type:", audioBlob.type); // Log the MIME type
        setRecordedAudioUrl(url);
        showNotification("Recording finished!", 'success');
      };

      recorder.onerror = (event) => { // Added error handling for MediaRecorder
        console.error("MediaRecorder error:", event.error);
        showNotification(`Recording error: ${event.error.name}`, 'error');
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
      showNotification("Recording started...", 'info');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      showNotification("Microphone access denied or unavailable. Please allow microphone access in browser settings.", 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop()); // Stop microphone track
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  // Playback logic
  const playRecordedAudio = useCallback(() => {
    if (recordedAudioUrl) {
      audioPlaybackRef.current.src = recordedAudioUrl;
      audioPlaybackRef.current.playbackRate = playbackRate;
      audioPlaybackRef.current.load(); // Added load() to ensure source is ready
      audioPlaybackRef.current.play().then(() => setIsPlayingRecording(true)).catch(err => {
        console.error("Error playing recorded audio:", err);
        showNotification("Failed to play recording. Your browser might block autoplay, or the audio format is not supported.", 'error');
      });
    } else {
      showNotification("No recording available to play.", 'info');
    }
  }, [recordedAudioUrl, playbackRate, showNotification]);

  const pauseRecordedAudio = () => {
    audioPlaybackRef.current.pause();
    setIsPlayingRecording(false);
  };

  // Effect for audio playback cleanup
  useEffect(() => {
    const audio = audioPlaybackRef.current;
    const handleEnded = () => setIsPlayingRecording(false);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl); // Clean up object URL
      }
    };
  }, [recordedAudioUrl]);

  // Handlers for dropdowns
  const handleSurahChange = (e) => {
    setSelectedSurahId(parseInt(e.target.value));
    setSelectedVerseId(1); // Reset verse to 1 when surah changes
    setRecordedAudioUrl(null); // Clear recording on surah change
    setIsPlayingRecording(false);
    audioPlaybackRef.current.pause();
  };

  const handleVerseChange = (e) => {
    setSelectedVerseId(parseInt(e.target.value));
    setRecordedAudioUrl(null); // Clear recording on verse change
    setIsPlayingRecording(false);
    audioPlaybackRef.current.pause();
  };

  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
    if (audioPlaybackRef.current.src) {
      audioPlaybackRef.current.playbackRate = parseFloat(e.target.value);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <Home size={20} className="mr-2" />
          Home
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Practice Recitation</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <p className="text-center text-lg text-green-200 mb-6">
        Select a verse, record your recitation, and listen back to improve!
      </p>

      {/* Surah and Verse Selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-green-700 rounded-2xl shadow-inner border border-green-600">
        <div className="flex-1">
          <label htmlFor="surah-select-practice" className="block text-green-200 font-medium mb-2">Select Surah:</label>
          <select
            id="surah-select-practice"
            value={selectedSurahId}
            onChange={handleSurahChange}
            className="w-full p-3 rounded-lg bg-green-600 text-green-50 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-inner text-base"
          >
            {quranData.surahs.map(surah => (
              <option key={surah.id} value={surah.id}>
                {surah.englishName} ({surah.name})
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="verse-select-practice" className="block text-green-200 font-medium mb-2">Select Verse:</label>
          <select
            id="verse-select-practice"
            value={selectedVerseId}
            onChange={handleVerseChange}
            className="w-full p-3 rounded-lg bg-green-600 text-green-50 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-inner text-base"
          >
            {Array.from({ length: selectedSurahMeta?.numberOfVerses || 0 }, (_, i) => i + 1).map(verseNum => (
              <option key={verseNum} value={verseNum}>
                Verse {verseNum}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoadingVerses ? (
        <div className="text-center text-green-300 text-lg py-4 animate-pulse">Loading verse text...</div>
      ) : errorFetchingVerses ? (
        <div className="text-center text-red-400 text-lg py-4">Error: {errorFetchingVerses}</div>
      ) : (
        <div className="bg-green-700 p-6 rounded-2xl shadow-lg mb-6 border border-green-600">
          {surahVerses.length > 0 ? (
            <>
              <p className="font-arabic text-right text-3xl md:text-4xl leading-loose text-green-50 font-medium mb-3">
                {surahVerses[0].arabic} <span className="text-base opacity-70 text-green-200">({surahVerses[0].id})</span>
              </p>
              <p className="text-green-100 text-left text-base md:text-lg">{surahVerses[0].translation}</p>
            </>
          ) : (
            <p className="text-center text-green-300 text-lg">No verse selected or loaded.</p>
          )}
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex justify-center items-center gap-4 mb-6 p-4 bg-green-700 rounded-2xl shadow-inner border border-green-600">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50 flex items-center"
          >
            <CircleDot size={24} className="mr-2" fill="currentColor" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 flex items-center animate-pulse"
          >
            <Square size={24} className="mr-2" fill="currentColor" />
            Stop Recording
          </button>
        )}
      </div>

      {/* Playback Controls and Speed */}
      {recordedAudioUrl && (
        <div className="bg-green-700 p-6 rounded-2xl shadow-lg mb-6 border border-green-600">
          <h3 className="text-xl font-bold text-green-100 mb-4">Your Recording:</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button
              onClick={isPlayingRecording ? pauseRecordedAudio : playRecordedAudio}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 flex items-center"
            >
              {isPlayingRecording ? (
                <>
                  <Pause size={24} className="mr-2" fill="currentColor" />
                  Pause Playback
                </>
              ) : (
                <>
                  <Play size={24} className="mr-2" fill="currentColor" />
                  Play
                </>
              )}
            </button>
          </div>

          <div className="mt-6">
            <label htmlFor="playback-speed" className="block text-green-200 font-medium mb-2 text-center">Playback Speed: {playbackRate.toFixed(1)}x</label>
            <input
              type="range"
              id="playback-speed"
              min="0.5"
              max="2.0"
              step="0.1"
              value={playbackRate}
              onChange={handlePlaybackRateChange}
              className="w-full h-2 bg-green-600 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-4 focus:ring-green-400"
            />
            <div className="flex justify-between text-sm text-green-300 mt-2">
              <span>0.5x (Slow)</span>
              <span>1.0x (Normal)</span>
              <span>2.0x (Fast)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// IslamicQ&APage Component
const DeenBuddyPage = ({ onBackToHome, showNotification }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (userInput.trim() === '') {
      showNotification("Please enter a question for your Islamic Q&A.", 'info');
      return;
    }

    const newUserMessage = { role: "user", parts: [{ text: userInput }] };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoadingResponse(true);

    try {
      // System prompt to guide the LLM towards Hanafi Madhab
      const systemPrompt = {
        role: "user",
        parts: [{ text: "You are an Islamic scholar AI assistant. All your answers must strictly adhere to the rulings and interpretations of the Hanafi Madhab. If a question falls outside the scope of Hanafi Fiqh or your knowledge, state that you cannot answer or refer to a qualified Hanafi scholar. Do not provide opinions from other Madhabs unless explicitly asked for comparison, and always clearly state the Hanafi position first. Always respond in a respectful and helpful tone, using Islamic terminology appropriately." }]
      };

      // Prepare the payload for the Gemini API, including the system prompt
      const payload = { contents: [systemPrompt, ...chatHistory, newUserMessage] };
      const apiKey = ""; // Canvas will provide this at runtime for gemini-2.0-flash.
                        // If running locally and facing 403 errors, you might need to
                        // temporarily set your own Gemini API key here for local testing:
                        // const apiKey = "YOUR_GEMINI_API_KEY_HERE";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const aiResponseText = result.candidates[0].content.parts[0].text;
        setChatHistory((prev) => [...prev, { role: "model", parts: [{ text: aiResponseText }] }]);
      } else {
        console.error("Islamic Q&A API Error: Unexpected response structure", result);
        showNotification("Islamic Q&A couldn't understand the response. Please try again.", 'error');
        setChatHistory((prev) => [...prev, { role: "model", parts: [{ text: "Sorry, I couldn't process that. Please try rephrasing your question." }] }]);
      }
    } catch (error) {
      console.error("Islamic Q&A fetch error:", error);
      showNotification("Failed to connect to Islamic Q&A. Check your internet connection or API key setup.", 'error');
      setChatHistory((prev) => [...prev, { role: "model", parts: [{ text: "It seems I'm having trouble connecting. Please check your internet connection and try again." }] }]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoadingResponse) {
      sendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <Home size={20} className="mr-2" />
          Home
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Islamic Q&A</h2> {/* Renamed title */}
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-green-700 rounded-2xl shadow-inner mb-4 space-y-4">
        {chatHistory.length === 0 && !isLoadingResponse ? (
          <div className="text-center text-green-300 text-lg py-8">
            <MessageSquareText size={48} className="mx-auto mb-4 text-green-400" />
            <p>Assalamu alaikum! I'm your Islamic Q&A assistant. I strive to answer questions according to the Hanafi Madhab. How can I help you today?</p>
            <p className="text-sm mt-2 opacity-80"> (e.g., "What is the meaning of Surah Al-Ikhlas?", "How do I perform Wudu according to Hanafi Fiqh?", "Tell me about Prophet Muhammad (PBUH).")</p>
            <p className="text-xs mt-4 text-yellow-300">Disclaimer: This AI aims to provide guidance based on the Hanafi Madhab but is not a substitute for a qualified human scholar. Always consult with knowledgeable individuals for important religious matters.</p>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-green-600 text-white rounded-bl-none'
                }`}
              >
                <p className="text-sm opacity-80 mb-1">{message.role === 'user' ? 'You' : 'Islamic Q&A'}</p>
                <p className="text-base">{message.parts[0].text}</p>
              </div>
            </div>
          ))
        )}
        {isLoadingResponse && (
          <div className="flex justify-start">
            <div className="max-w-[75%] p-3 rounded-lg shadow-md bg-green-600 text-white rounded-bl-none animate-pulse">
              <p className="text-sm opacity-80 mb-1">Islamic Q&A</p>
              <p className="text-base">Typing...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your Islamic Q&A..."
          className="flex-1 p-3 rounded-xl bg-green-700 text-green-50 placeholder-green-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-inner text-base"
          disabled={isLoadingResponse}
        />
        <button
          onClick={sendMessage}
          disabled={isLoadingResponse || userInput.trim() === ''}
          className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageSquareText size={20} className="inline-block mr-2" /> Send
        </button>
      </div>
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
  const [currentView, setCurrentView] = useState('home'); // 'home', 'surah-selector', 'quran-reader', 'listen', 'practice', 'prayer-times', 'bookmarks', 'quiz', 'deen-buddy'
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

  // --- Notification Management --- // MOVED THIS UP!
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Notification disappears after 3 seconds
  }, []);


  // --- Firebase Initialization and Authentication ---
  useEffect(() => {
    // Define a default/mock Firebase config for local development
    // IMPORTANT: Replace with your actual Firebase project config if deploying!
    const defaultFirebaseConfig = {
      apiKey: "YOUR_API_KEY", // Replace with your Firebase project's API Key
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // Replace with your Firebase project's Auth Domain
      projectId: "YOUR_PROJECT_ID", // Replace with your Firebase project ID
      storageBucket: "YOUR_PROJECT_ID.appspot.com", // Replace with your Firebase project's Storage Bucket
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Firebase project's Messaging Sender ID
      appId: "YOUR_APP_ID" // Replace with your Firebase project's App ID
    };

    // Use the provided __firebase_config if available (e.g., in a hosted environment),
    // otherwise, use the defaultFirebaseConfig for local development.
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : defaultFirebaseConfig;
    const appId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.projectId || 'default-app-id'; // Use project ID as default appId

    if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
      console.warn("Firebase config is missing or using default placeholders. Please update defaultFirebaseConfig with your actual Firebase project details for full functionality.");
      // Even if config is missing/placeholder, we'll try to initialize to prevent hard crashes,
      // but Firestore operations will likely fail without proper credentials.
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
            // Use __initial_auth_token if available, otherwise sign in anonymously
            const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
              console.log("Signed in with custom token.");
            } else {
              await signInAnonymously(firebaseAuth);
              console.log("Signed in anonymously.");
            }
            setUserId(firebaseAuth.currentUser.uid); // Ensure userId is set after sign-in
          } catch (error) {
            console.error("Error signing in anonymously or with custom token:", error);
            showNotification("Failed to authenticate. Please check console for details.", 'error');
          }
        }
        setIsAuthReady(true); // Mark auth as ready once initial check/sign-in is done
      });

      return () => unsubscribe(); // Cleanup auth listener
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      showNotification("Failed to initialize Firebase. Check console for details.", 'error');
      setIsAuthReady(true); // Still set auth ready to allow UI to render, even if Firebase is broken
    }
  }, [showNotification]); // Added showNotification to dependencies


  // --- Firestore Data Listener (User Progress) ---
  useEffect(() => {
    if (!isAuthReady || !db || !userId) {
      // console.log("Firestore listener skipped: isAuthReady", isAuthReady, "db", !!db, "userId", !!userId); // Debugging line
      return;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : (db.app.options.projectId || 'default-app-id'); // Fallback to projectId if __app_id not defined
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
  }, [isAuthReady, db, userId, showNotification]); // Re-run if auth state or Firebase instances change

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
      const appId = typeof __app_id !== 'undefined' ? __app_id : (db.app.options.projectId || 'default-app-id');
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
  }, [userProgress, db, userId, isAuthReady, showNotification]); // Re-save whenever userProgress changes

  // --- Daily Streak Logic ---
  useEffect(() => {
    // Ensure `setUserProgress` is used here, not `updateUserProgress`
    if (!userProgress.lastLoginDate) {
      // First login or no previous login, set streak to 1
      setUserProgress(prev => ({ // CORRECTED: Use setUserProgress
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
      setUserProgress(prev => ({ // CORRECTED: Use setUserProgress
        ...prev,
        dailyStreak: prev.dailyStreak + 1,
        lastLoginDate: today,
      }));
      showNotification(`Daily streak: ${userProgress.dailyStreak + 1} days!`, 'success');
    } else {
      // Missed a day, reset streak
      setUserProgress(prev => ({ // CORRECTED: Use setUserProgress
        ...prev,
        dailyStreak: 1,
        lastLoginDate: today,
      }));
      showNotification("Daily streak reset. Keep going!", 'info');
    }
  }, [userProgress.lastLoginDate, setUserProgress, showNotification]); // Added setUserProgress and showNotification to dependencies

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
  }, [userProgress.versesRead, userProgress.dailyStreak, userProgress.points, userProgress.achievements, showNotification]); // Depend on relevant progress metrics and showNotification

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
            onSelectReciterForListen={handleSelectReciterForListen} // Correctly pass the handler
          />
        );
      case 'surah-selector':
        return <SurahSelector onSelectSurah={handleSelectSurah} onBackToHome={handleBackToHome} />;
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
            selectedReciterAlquranCloudId={selectedReciterAlquranCloudId}
            showNotification={showNotification}
            onBackToHome={handleBackToHome} // Pass onBackToHome
          />
        );
      case 'listen':
        return (
          <ListenPage
            onBackToHome={handleBackToHome} // Pass onBackToHome
            selectedReciterId={selectedReciterId}
            selectedReciterName={selectedReciterName}
            selectedReciterEnglishName={selectedReciterEnglishName}
            selectedReciterAlquranCloudId={selectedReciterAlquranCloudId}
            showNotification={showNotification}
          />
        );
      case 'practice':
        return <PracticePage onBackToHome={handleBackToHome} showNotification={showNotification} />; // Pass onBackToHome and showNotification
      case 'prayer-times':
        return <PrayerTimesPage onBackToHome={handleBackToHome} />; // Pass onBackToHome
      case 'bookmarks':
        return (
          <BookmarksPage
            onBackToHome={handleBackToHome} // Pass onBackToHome
            bookmarkedVerses={userProgress.bookmarkedVerses}
            onSelectSurah={handleSelectSurah}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case 'quiz':
        return (
          <QuizPage
            onBackToHome={handleBackToHome} // Pass onBackToHome
            updateUserProgress={setUserProgress} // Pass setUserProgress directly
            showNotification={showNotification}
          />
        );
      case 'deen-buddy': // This case now handles Islamic Q&A
        return (
          <DeenBuddyPage
            onBackToHome={handleBackToHome}
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
            Nurul Quran {/* The new app name! */}
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

// --- Placeholder Components for other pages (Add full functionality later) ---

const PrayerTimesPage = ({ onBackToHome }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Attempt to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default location if geolocation fails
          setLocation({ latitude: 53.72, longitude: -1.86 }); // Default to Halifax, UK
        }
      );
    } else {
      // Browser doesn't support Geolocation, use default
      setLocation({ latitude: 53.72, longitude: -1.86 }); // Default to Halifax, UK
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const times = getPrayerTimes(location.latitude, location.longitude, currentDate);
      setPrayerTimes(times);
    }
  }, [location, currentDate]);

  const handlePrevDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, -1));
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <Home size={20} className="mr-2" />
          Home
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Prayer Times</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="text-center mb-6">
        <p className="text-xl text-green-100 mb-2">Today: <span className="font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</span></p>
        <div className="flex justify-center items-center gap-4 mb-4">
          <button onClick={handlePrevDay} className="bg-green-700 hover:bg-green-600 p-3 rounded-full shadow-md transition-colors"><ChevronLeft size={24} /></button>
          <button onClick={handleNextDay} className="bg-green-700 hover:bg-green-600 p-3 rounded-full shadow-md transition-colors"><ChevronRight size={24} /></button>
        </div>
        {prayerTimes && prayerTimes.nextPrayer && (
          <p className="text-2xl font-bold text-green-200 flex items-center justify-center">
            <Clock9 size={28} className="mr-3 text-blue-300" />
            Next Prayer: {prayerTimes.nextPrayer.name} in {prayerTimes.timeToNextPrayer}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayerTimes && prayerTimes.times.map((prayer) => (
          <div key={prayer.name} className="bg-green-700 p-5 rounded-2xl shadow-lg flex items-center space-x-4">
            <div className="text-4xl text-green-200 flex-shrink-0">{prayer.icon}</div>
            <div>
              <p className="text-xl font-semibold text-green-50">{prayer.name}</p>
              <p className="text-2xl font-bold text-green-100">{format(prayer.time, 'h:mm a')}</p>
            </div>
          </div>
        ))}
        {!prayerTimes && (
          <p className="col-span-full text-center text-green-300 text-lg">Loading prayer times or geolocation not available...</p>
        )}
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
          <Home size={20} className="mr-2" />
          Home
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Bookmarked Verses</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {bookmarkedVerses.length === 0 ? (
        <p className="text-center text-green-300 text-lg py-8">You haven't bookmarked any verses yet. Start reading to save some!</p>
      ) : (
        <ul className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
          {bookmarkedVerses.map((bookmark, index) => {
            const surah = quranData.surahs.find(s => s.id === bookmark.surahId);
            return (
              <li key={index} className="bg-green-700 p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border border-green-600">
                <div>
                  <p className="text-xl font-semibold text-green-50 mb-1">
                    {surah?.englishName || `Surah ${bookmark.surahId}`} - Verse {bookmark.verseId}
                  </p>
                  {/* Displaying a placeholder as actual Arabic text isn't stored in bookmark object yet */}
                  <p className="font-arabic text-right text-2xl text-green-200">{bookmark.arabicText || 'Arabic text placeholder'}</p>
                </div>
                <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => onSelectSurah(bookmark.surahId)}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full text-white flex items-center shadow-md transition-colors"
                  >
                    <BookOpen size={18} className="mr-2" /> Read
                  </button>
                  <button
                    onClick={() => onToggleBookmark(bookmark.surahId, bookmark.verseId)}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-full text-white flex items-center shadow-md transition-colors"
                  >
                    <XCircle size={18} className="mr-2" /> Remove
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
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Combined"); // Default to Combined

  // Function to get a random question based on category
  const getRandomQuestion = useCallback((category) => {
    const availableQuestions = category === "Combined"
      ? quizQuestions
      : quizQuestions.filter(q => q.category === category);

    if (availableQuestions.length === 0) {
      showNotification(`No questions available for category: ${category}`, 'error');
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  }, [showNotification]);


  useEffect(() => {
    if (quizStarted) {
      setCurrentQuestion(getRandomQuestion(selectedCategory));
      setFeedback(null);
      setSelectedAnswer(null);
    }
  }, [quizStarted, selectedCategory, getRandomQuestion]); // Re-fetch question when category changes

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setFeedback('correct');
      setScore(prevScore => prevScore + 10); // Award points for correct answer
      updateUserProgress(prev => ({ ...prev, points: prev.points + 10 })); // Update global points
      showNotification("Correct! +10 points", 'success');
    } else {
      setFeedback('incorrect');
      showNotification("Incorrect. Try again!", 'error');
    }
  };

  const handleNextQuestion = () => {
    setQuestionCount(prevCount => prevCount + 1);
    setCurrentQuestion(getRandomQuestion(selectedCategory));
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const startQuiz = () => {
    setScore(0);
    setQuestionCount(0);
    setQuizStarted(true);
    setSelectedAnswer(null);
    setFeedback(null);
    setCurrentQuestion(getRandomQuestion(selectedCategory));
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setScore(0);
    setQuestionCount(0);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-3xl shadow-2xl mb-6 text-green-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl flex items-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-md"
        >
          <Home size={20} className="mr-2" />
          Home
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-center flex-grow text-green-100">Quran Quiz</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {!quizStarted ? (
        <div className="text-center py-8">
          <p className="text-xl text-green-200 mb-4">Test your knowledge of the Quran!</p>
          <div className="mb-6">
            <label htmlFor="quiz-category" className="block text-green-200 font-medium mb-2">Select Category:</label>
            <select
              id="quiz-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-1/2 lg:w-1/3 p-3 rounded-lg bg-green-700 text-green-50 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-inner text-base"
            >
              {quizCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            onClick={startQuiz}
            className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-full text-white text-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 transform hover:scale-105"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center text-green-200 text-lg">
            <p className="font-semibold">Score: {score} | Question: {questionCount + 1}</p>
          </div>

          {currentQuestion ? (
            <div className="bg-green-700 p-6 rounded-2xl shadow-lg border border-green-600">
              <p className="text-xl md:text-2xl font-medium text-green-50 mb-5 leading-relaxed">
                {currentQuestion.question}
              </p>
              <div className="space-y-3">
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(choice)}
                    disabled={selectedAnswer !== null} // Disable buttons after an answer is selected
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ${
                      selectedAnswer === choice
                        ? feedback === 'correct'
                          ? 'bg-green-500 border-green-400 text-white shadow-lg'
                          : 'bg-red-500 border-red-400 text-white shadow-lg'
                        : selectedAnswer !== null && choice === currentQuestion.correctAnswer
                          ? 'bg-green-400 border-green-300 text-white shadow-lg' // Highlight correct answer after selection
                          : 'bg-green-600 hover:bg-green-500 border-green-600 text-green-50 hover:border-green-500'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {feedback && (
                <div className="mt-6 text-center">
                  <p className={`text-lg font-bold ${feedback === 'correct' ? 'text-green-300' : 'text-red-300'}`}>
                    {feedback === 'correct' ? 'Correct Answer!' : `Incorrect. Correct was: "${currentQuestion.correctAnswer}"`}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="mt-4 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full text-white font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                  >
                    Next Question
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-green-300">Quiz finished or no questions available.</p>
              <button
                onClick={resetQuiz}
                className="mt-4 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full text-white font-semibold shadow-md transition-all duration-200"
              >
                Start New Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};