// --- Initial Setup and Data ---
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO, startOfDay, addDays, differenceInSeconds } from 'date-fns';

// --- COMPLETE QURAN DATA (All 114 Surahs) ---
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
    { id: 73, 'name': 'المزمل', 'englishName': 'Al-Muzzammil', 'numberOfVerses': 20 },
    { id: 74, 'name': 'المدثر', 'englishName': 'Al-Muddaththir', 'numberOfVerses': 56 },
    { id: 75, 'name': 'القيامة', 'englishName': 'Al-Qiyamah', 'numberOfVerses': 40 },
    { id: 76, 'name': 'الإنسان', 'englishName': 'Al-Insan', 'numberOfVerses': 31 },
    { id: 77, 'name': 'المرسلات', 'englishName': 'Al-Mursalat', 'numberOfVerses': 50 },
    { id: 78, 'name': 'النبأ', 'englishName': 'An-Naba', 'numberOfVerses': 40 },
    { id: 79, 'name': 'النازعات', 'englishName': 'An-Nazi\'at', 'numberOfVerses': 46 },
    { id: 80, 'name': 'عبس', 'englishName': 'Abasa', 'numberOfVerses': 42 },
    { id: 81, 'name': 'التكوير', 'englishName': 'At-Takwir', 'numberOfVerses': 29 },
    { id: 82, 'name': 'الإنفطار', 'englishName': 'Al-Infitar', 'numberOfVerses': 19 },
    { id: 83, 'name': 'المطففين', 'englishName': 'Al-Mutaffifin', 'numberOfVerses': 36 },
    { id: 84, 'name': 'الإنشقاق', 'englishName': 'Al-Inshiqaq', 'numberOfVerses': 25 },
    { id: 85, 'name': 'البروج', 'englishName': 'Al-Buruj', 'numberOfVerses': 22 },
    { id: 86, 'name': 'الطارق', 'englishName': 'At-Tariq', 'numberOfVerses': 17 },
    { id: 87, 'name': 'الأعلى', 'englishName': 'Al-A\'la', 'numberOfVerses': 19 },
    { id: 88, 'name': 'الغاشية', 'englishName': 'Al-Ghashiyah', 'numberOfVerses': 26 },
    { id: 89, 'name': 'الفجر', 'englishName': 'Al-Fajr', 'numberOfVerses': 30 },
    { id: 90, 'name': 'البلد', 'englishName': 'Al-Balad', 'numberOfVerses': 20 },
    { id: 91, 'name': 'الشمس', 'englishName': 'Ash-Shams', 'numberOfVerses': 15 },
    { id: 92, 'name': 'الليل', 'englishName': 'Al-Layl', 'numberOfVerses': 21 },
    { id: 93, 'name': 'الضحى', 'englishName': 'Ad-Duhaa', 'numberOfVerses': 11 },
    { id: 94, 'name': 'الشرح', 'englishName': 'Ash-Sharh', 'numberOfVerses': 8 },
    { id: 95, 'name': 'التين', 'englishName': 'At-Tin', 'numberOfVerses': 8 },
    { id: 96, 'name': 'العلق', 'englishName': 'Al-Alaq', 'numberOfVerses': 19 },
    { id: 97, 'name': 'القدر', 'englishName': 'Al-Qadr', 'numberOfVerses': 5 },
    { id: 98, 'name': 'البينة', 'englishName': 'Al-Bayyinah', 'numberOfVerses': 8 },
    { id: 99, 'name': 'الزلزلة', 'englishName': 'Az-Zalzalah', 'numberOfVerses': 8 },
    { id: 100, 'name': 'العاديات', 'englishName': 'Al-Adiyat', 'numberOfVerses': 11 },
    { id: 101, 'name': 'القارعة', 'englishName': 'Al-Qari\'ah', 'numberOfVerses': 11 },
    { id: 102, 'name': 'التكاثر', 'englishName': 'At-Takathur', 'numberOfVerses': 8 },
    { id: 103, 'name': 'العصر', 'englishName': 'Al-Asr', 'numberOfVerses': 3 },
    { id: 104, 'name': 'الهمزة', 'englishName': 'Al-Humazah', 'numberOfVerses': 9 },
    { id: 105, 'name': 'الفيل', 'englishName': 'Al-Fil', 'numberOfVerses': 5 },
    { id: 106, 'name': 'قريش', 'englishName': 'Quraish', 'numberOfVerses': 4 },
    { id: 107, 'name': 'الماعون', 'englishName': 'Al-Ma\'un', 'numberOfVerses': 7 },
    { id: 108, 'name': 'الكوثر', 'englishName': 'Al-Kawthar', 'numberOfVerses': 3 },
    { id: 109, 'name': 'الكافرون', 'englishName': 'Al-Kafirun', 'numberOfVerses': 6 },
    { id: 110, 'name': 'النصر', 'englishName': 'An-Nasr', 'numberOfVerses': 3 },
    { id: 111, 'name': 'المسد', 'englishName': 'Al-Masad', 'numberOfVerses': 5 },
    { id: 112, 'name': 'الإخلاص', 'englishName': 'Al-Ikhlas', 'numberOfVerses': 4 },
    { id: 113, 'name': 'الفلق', 'englishName': 'Al-Falaq', 'numberOfVerses': 5 },
    { id: 114, 'name': 'الناس', 'englishName': 'An-Nas', 'numberOfVerses': 6 }
  ],
  verseOfTheDay: {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'And whoever fears Allah – He will make for him a way out.',
  }
};

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

const achievementsData = [
  { id: 'first-read', title: 'First Read', description: 'Complete your first reading session', icon: '✨', achieved: false },
  { id: 'first-week', title: 'Daily Reader', description: 'Maintain a 7-day reading streak', icon: '📅', achieved: false },
  { id: 'practice-master', title: 'Practice Master', description: 'Complete 100 practice sessions', icon: '🎤', achieved: false },
  { id: 'quiz-whiz', title: 'Quiz Whiz', description: 'Score over 500 points in quizzes', icon: '❓', achieved: false },
];

// Utility for basic prayer time calculation (Hanafi for Asr)
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

// --- Components ---

const HomeDashboard = ({ setCurrentView, points, userProgress, unlockedReciters, handleUnlockReciter, showNotification }) => {
  const [verseOfTheDay, setVerseOfTheDay] = useState(quranData.verseOfTheDay);

  return (
    <div className="space-y-8">
      {/* Top Nav Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card icon="📖" title="Read Quran" description="Browse surahs and verses" onClick={() => setCurrentView('surah-selector')} />
        <Card icon="🎧" title="Listen" description="Beautiful recitations" onClick={() => setCurrentView('listen')} />
        <Card icon="🎤" title="Practice" description="Record & improve" onClick={() => setCurrentView('practice')} />
        <Card icon="⏰" title="Prayer Times" description="Hanafi calculations" onClick={() => setCurrentView('prayer-times')} />
      </div>

      {/* Verse of the Day */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 rounded-xl shadow-lg text-white text-center transform hover:scale-105 transition-transform duration-300">
        <p className="text-lg md:text-xl mb-3 font-semibold">Verse of the Day</p>
        <p className="font-arabic text-3xl md:text-4xl mb-4 leading-relaxed">
          {verseOfTheDay.arabic}
        </p>
        <p className="text-sm italic mb-4 opacity-90">At-Talaq (65:2)</p>
        <p className="text-base md:text-lg">"{verseOfTheDay.translation}"</p>
        <div className="mt-5">
          <button className="bg-white bg-opacity-30 p-3 rounded-full hover:bg-opacity-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.715 1.295 2.565 0 3.28l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Reciters (No longer separated by featured/free for simplicity, all are unlocked) */}
      <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
        <h2 className="text-2xl font-bold mb-5">Available Reciters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...recitersData.featured, ...recitersData.free].map((reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              points={points} // Still pass points, though not used for unlocking here
              isUnlocked={true} // All are now unlocked
              onUnlock={() => {}} // No unlock action
              showNotification={showNotification}
            />
          ))}
        </div>
      </div>

      {/* Your Progress Summary */}
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

      {/* Bookmarked Verses Card */}
      <Card icon="⭐" title="Bookmarked Verses" description="Access your saved verses" onClick={() => setCurrentView('bookmarks')} />

      {/* NEW: Quiz Card */}
      <Card icon="❓" title="Quiz Me!" description="Test your Quran knowledge" onClick={() => setCurrentView('quiz')} />
    </div>
  );
};

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

const ReciterCard = ({ reciter, points, isUnlocked, onUnlock, showNotification, onSelectReciter }) => {
  const handleAction = () => {
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
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/cccccc/333333?text=Reciter"; }}
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

const SurahSelector = ({ onSelectSurah }) => {
  const [searchTerm, setSearchTerm] = useState('');

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

const QuranReader = ({ selectedSurahId, settings, onBackToSurahList, onSurahChange, onVerseRead, onToggleBookmark, bookmarkedVerses }) => {
  const [surahVerses, setSurahVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedVerseId, setHighlightedVerseId] = useState(null);

  const audioRef = useRef(new Audio());
  audioRef.current.volume = 0.8;

  const selectedSurahMeta = quranData.surahs.find(s => s.id === selectedSurahId);

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
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahId}/editions/quran-simple,en.sahih`);
        const data = await response.json();

        if (data.code === 200 && data.data && data.data[0] && data.data[1]) {
          const arabicVerses = data.data[0].ayahs;
          const translationVerses = data.data[1].ayahs;

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

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setHighlightedVerseId(null);
    };
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playVerseAudio = useCallback((verseId, audioUrl) => {
    setHighlightedVerseId(verseId);
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    onVerseRead();
  }, [onVerseRead]);

  const handlePrevSurah = () => {
    if (selectedSurahId > 1) {
      onSurahChange(selectedSurahId - 1);
      audioRef.current.pause();
      setHighlightedVerseId(null);
    }
  };

  const handleNextSurah = () => {
    if (selectedSurahId < quranData.surahs.length) {
      onSurahChange(selectedSurahId + 1);
      audioRef.current.pause();
      setHighlightedVerseId(null);
    }
  };

  if (isLoading) {
    return <p className="text-center text-green-200 p-8">Loading Surah...</p>;
  }

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
        <div className="flex space-x-2">
          <button
            onClick={() => settings.onFontSizeChange('decrease')}
            className="bg-green-700 text-green-50 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            A-
          </button>
          <button
            onClick={() => settings.onFontSizeChange('increase')}
            className="bg-green-700 text-green-50 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            A+
          </button>
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
                      arabic: verse.arabic,
                      translation: verse.translation
                    })}
                    className={`p-2 rounded-full transition-colors flex items-center justify-center text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 ${
                      isBookmarked ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-400 focus:ring-yellow-300' : 'bg-green-700 text-green-200 hover:bg-green-600 focus:ring-green-400'
                    }`}
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark Verse"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2ZM3.25 8.75a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H3.25ZM16 9.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM9.5 3a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H9.5ZM10 15.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75ZM15.25 9.5a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H15.25ZM10 17a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75ZM4.5 9.5a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H4.5ZM15.25 10.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className={`text-right font-arabic mb-3 leading-loose ${
                settings.fontSize === 'small' ? 'text-xl' : settings.fontSize === 'medium' ? 'text-2xl' : 'text-3xl'
              }`} style={{ lineHeight: '2.2em' }}>
                {verse.arabic}
              </p>
              {settings.showTranslation && (
                <p className={`text-left text-green-100 border-t border-green-700 pt-3 mt-3 ${
                  settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'medium' ? 'text-base' : 'text-lg'
                }`}>
                  {verse.translation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between items-center border-t pt-4 border-green-700">
        <button
          onClick={handlePrevSurah}
          disabled={selectedSurahId === 1}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-full transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1"><path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" /></svg>
          Previous Surah
        </button>
        <span className="text-md text-green-200 font-medium">
          {selectedSurahMeta?.englishName} ({selectedSurahId}/{quranData.surahs.length})
        </span>
        <button
          onClick={handleNextSurah}
          disabled={selectedSurahId === quranData.surahs.length}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-full transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Next Surah
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1"><path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

// --- MODIFIED: AudioPlayer with Playback Speed Control ---
const AudioPlayer = ({ mediaUrl, isVideo = false, currentReciterName, currentSurahName, showNotification }) => {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  // NEW STATE: Playback rate
  const [playbackRate, setPlaybackRate] = useState(1.0); // Default to normal speed

  useEffect(() => {
    const audio = mediaRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // NEW EFFECT: Apply playbackRate to media element
  useEffect(() => {
    const audio = mediaRef.current;
    if (audio) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const mediaElement = mediaRef.current;
    if (mediaElement && mediaUrl && typeof mediaUrl === 'string') {
      mediaElement.src = mediaUrl;
      mediaElement.load();
      mediaElement.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing media automatically:", error);
        showNotification("Autoplay blocked. Please click play.", "info");
        setIsPlaying(false);
      });
    } else if (mediaElement && !mediaUrl) {
      mediaElement.pause();
      mediaElement.src = '';
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [mediaUrl, showNotification]);


  const togglePlay = () => {
    const mediaElement = mediaRef.current;
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.pause();
      } else {
        mediaElement.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Error playing media:", error);
          showNotification("Could not play audio. Autoplay blocked?", "error");
          setIsPlaying(false);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = parseFloat(e.target.value);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
    }
  };

  // NEW: Handle playback rate change
  const handlePlaybackRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setPlaybackRate(newRate);
    if (mediaRef.current) {
      mediaRef.current.playbackRate = newRate;
    }
  };

  useEffect(() => {
    const mediaElement = mediaRef.current;
    if (mediaElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => { setIsPlaying(false); setCurrentTime(0); };

      mediaElement.addEventListener('play', handlePlay);
      mediaElement.addEventListener('pause', handlePause);
      mediaElement.addEventListener('ended', handleEnded);
      mediaElement.addEventListener('timeupdate', handleTimeUpdate);
      mediaElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        mediaElement.removeEventListener('play', handlePlay);
        mediaElement.removeEventListener('pause', handlePause);
        mediaElement.removeEventListener('ended', handleEnded);
        mediaElement.removeEventListener('timeupdate', handleTimeUpdate);
        mediaElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-green-700 p-6 rounded-xl shadow-lg mt-6 flex flex-col items-center text-green-50">
      <h3 className="text-xl font-bold mb-4 text-center">
        {currentReciterName || 'Select Reciter'} - {currentSurahName || 'Select Surah'}
      </h3>
      {isVideo ? (
        <video
          ref={mediaRef}
          src={mediaUrl || ''}
          className="w-full max-w-lg rounded-lg shadow-md mb-4 aspect-video bg-green-800"
          poster="https://placehold.co/600x300/e0e0e0/000000?text=Video+Recitation"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x300/e0e0e0/000000?text=Video+Error"; }}
          controls
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <audio
          ref={mediaRef}
          src={mediaUrl || ''}
          className="w-full max-w-lg mb-4"
          controls
        >
          Your browser does not support the audio tag.
        </audio>
      )}

      {mediaUrl && typeof mediaUrl === 'string' ? (
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-2 text-green-200 text-sm">
            <span>{currentReciterName || 'Sheikh Reciter'}</span>
            <span>{currentSurahName || 'Surah Audio'}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2.5 bg-green-800 rounded-lg appearance-none cursor-pointer mb-3 accent-green-400"
            style={{
              background: `linear-gradient(to right, #6EE7B7 0%, #6EE7B7 ${ (currentTime / duration) * 100 }%, #047857 ${ (currentTime / duration) * 100 }%, #047857 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-green-300 mb-4">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button className="p-2 rounded-full bg-green-800 hover:bg-green-900 transition focus:outline-none focus:ring-2 focus:ring-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-200"><path fillRule="evenodd" d="M4.755 10.704a.75.75 0 0 0 1.09-.568V6.045c0-1.054.71-1.954 1.745-2.285a4.52 4.52 0 0 1 2.227-.375c1.077.168 2.02.664 2.76 1.41L15 4.736V7.5a.75.75 0 0 0 1.5 0V3.342a.75.75 0 0 0-.213-.505L15.35 2.1c-.496-.495-1.071-.99-1.807-1.343C12.903.424 12.01.25 11.026.25a6.047 6.047 0 0 0-3.321.824 3.75 3.75 0 0 0-1.942 2.057 3.092 3.092 0 0 0-.89 1.488.75.75 0 0 0 .568 1.09ZM4.5 13.5a.75.75 0 0 0-.75.75V19.5c0 1.035.84 1.875 1.875 1.875h4.5a.75.75 0 0 0 0-1.5H5.625a.375.375 0 0 1-.375-.375V14.25a.75.75 0 0 0-.75-.75Zm14.25 0a.75.75 0 0 0-.75.75V19.5a.375.375 0 0 1-.375.375h-4.5a.75.75 0 0 0 0 1.5h4.5c1.035 0 1.875-.84 1.875-1.875V14.25a.75.75 0 0 0-.75-.75Z" clipRule="evenodd" /></svg>
            </button>
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75H16.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.715 1.295 2.565 0 3.28l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button className="p-2 rounded-full bg-green-800 hover:bg-green-900 transition focus:outline-none focus:ring-2 focus:ring-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-200"><path fillRule="evenodd" d="M19.245 10.704a.75.75 0 0 0-1.09.568v3.659c0 1.054-.71 1.954-1.745 2.285a4.52 4.52 0 0 1-2.227.375c-1.077-.168-2.02-.664-2.76-1.41L9 19.264V16.5a.75.75 0 0 0-1.5 0v4.158a.75.75 0 0 0 .213.505l.89.89c.496.495 1.071.99 1.807 1.343C11.097 23.576 11.99 23.75 12.974 23.75a6.047 6.047 0 0 0 3.321-.824 3.75 3.75 0 0 0 1.942-2.057 3.092 3.092 0 0 0 .89-1.488.75.75 0 0 0-.568-1.09ZM4.5 13.5a.75.75 0 0 0-.75.75V19.5c0 1.035.84 1.875 1.875 1.875h4.5a.75.75 0 0 0 0-1.5H5.625a.375.375 0 0 1-.375-.375V14.25a.75.75 0 0 0-.75-.75Zm14.25 0a.75.75 0 0 0-.75.75V19.5a.375.375 0 0 1-.375.375h-4.5a.75.75 0 0 0 0 1.5h4.5c1.035 0 1.875-.84 1.875-1.875V14.25a.75.75 0 0 0-.75-.75Z" clipRule="evenodd" /></svg>
            </button>
          </div>
          {/* Volume Control */}
          <div className="flex items-center mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-200 mr-2">
              <path d="M13.5 4.06c0-1.334-1.166-2.5-2.5-2.5s-2.5 1.166-2.5 2.5V19.94c0 1.334 1.166 2.5 2.5 2.5s2.5-1.166 2.5-2.5V4.06Z" />
              <path fillRule="evenodd" d="M4.5 9.75a.75.75 0 0 1 .75-.75h.75c2.16 0 3.93 1.58 4.195 3.614A2.25 2.25 0 0 1 10.5 15.75h-.75a.75.75 0 0 1-.75-.75V9.75ZM19.5 9.75a.75.75 0 0 0-.75-.75h-.75c-2.16 0-3.93 1.58-4.195 3.614A2.25 2.25 0 0 0 13.5 15.75h.75a.75.75 0 0 0 .75-.75V9.75Z" clipRule="evenodd" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-green-800 rounded-lg appearance-none cursor-pointer accent-green-400"
              style={{
                background: `linear-gradient(to right, #6EE7B7 0%, #6EE7B7 ${ volume * 100 }%, #047857 ${ volume * 100 }%, #047857 100%)`
              }}
            />
          </div>
          {/* NEW: Playback Speed Control */}
          <div className="flex items-center mt-4">
            <span className="text-sm text-green-200 mr-2">Speed: {playbackRate.toFixed(1)}x</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={playbackRate}
              onChange={handlePlaybackRateChange}
              className="w-full h-2 bg-green-800 rounded-lg appearance-none cursor-pointer accent-green-400"
              style={{
                background: `linear-gradient(to right, #6EE7B7 0%, #6EE7B7 ${ ((playbackRate - 0.5) / 1.5) * 100 }%, #047857 ${ ((playbackRate - 0.5) / 1.5) * 100 }%, #047857 100%)`
              }}
            />
          </div>
        </div>
      ) : (
        <p className="text-green-300 text-center">Select an audio file to play.</p>
      )}
    </div>
  );
};

// --- MODIFIED: ListenPage for Full Surah Audio ---
const ListenPage = ({ points, unlockedReciters, handleUnlockReciter, showNotification }) => {
  const [selectedReciter, setSelectedReciter] = useState(null); // Stores the full reciter object
  const [selectedSurahForListening, setSelectedSurahForListening] = useState(null); // Stores the full surah object
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // For searching surahs in listen page

  const handleSelectReciter = useCallback((id, name, englishName, alquranCloudId) => {
    setSelectedReciter({ id, name, englishName, alquranCloudId });
    setSelectedSurahForListening(null); // Reset surah selection when reciter changes
    setCurrentAudioUrl(null); // Reset audio when reciter changes
  }, []);

  const handleSelectSurahForListening = useCallback((surahId) => {
    const surah = quranData.surahs.find(s => s.id === surahId);
    setSelectedSurahForListening(surah);
    // Construct audio URL for the FULL SURAH
    if (selectedReciter && surah) {
      const audioUrl = `https://cdn.alquran.cloud/media/audio/surah/${selectedReciter.alquranCloudId}/${surah.id}`;
      setCurrentAudioUrl(audioUrl);
      showNotification(`Playing ${surah.englishName} by ${selectedReciter.englishName}`, 'success');
    } else {
      showNotification("Please select a reciter first.", "error");
    }
  }, [selectedReciter, showNotification]);

  // Filter surahs for the listen page based on search term
  const filteredSurahs = quranData.surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.includes(searchTerm) ||
    surah.id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-green-50 text-center mb-6">Listen to Quran</h2>

      {/* Reciter Selection */}
      <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
        <h3 className="text-2xl font-bold mb-4">Choose a Reciter</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...recitersData.featured, ...recitersData.free].map((reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              points={points}
              isUnlocked={unlockedReciters.includes(reciter.id)} // Check if unlocked
              onUnlock={handleUnlockReciter}
              showNotification={showNotification}
              onSelectReciter={handleSelectReciter} // Pass the new handler
            />
          ))}
        </div>
      </div>

      {/* Surah Selection for Listening */}
      {selectedReciter && (
        <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
          <h3 className="text-2xl font-bold mb-4">Select Surah for {selectedReciter.englishName}</h3>
          {/* Search Input for Surahs in Listen Page */}
          <input
            type="text"
            placeholder="Search Surah to listen..."
            className="w-full p-3 mb-5 rounded-lg bg-green-700 text-green-50 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto custom-scrollbar p-2">
            {filteredSurahs.length > 0 ? (
              filteredSurahs.map((surah) => (
                <li key={surah.id}>
                  <button
                    onClick={() => handleSelectSurahForListening(surah.id)}
                    className={`w-full text-left p-4 rounded-lg transition-colors duration-200 flex justify-between items-center shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      selectedSurahForListening?.id === surah.id ? 'bg-green-600 text-white' : 'bg-green-700 text-green-50 hover:bg-green-600'
                    }`}
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
      )}

      {/* Audio Player */}
      {currentAudioUrl && (
        <AudioPlayer
          mediaUrl={currentAudioUrl}
          currentReciterName={selectedReciter?.englishName}
          currentSurahName={selectedSurahForListening?.englishName}
          showNotification={showNotification}
        />
      )}
    </div>
  );
};

const PracticePage = ({ showNotification }) => {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null); // For playing back user's recording

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        audioChunks.current = []; // Clear chunks for next recording
        stream.getTracks().forEach(track => track.stop()); // Stop microphone
        showNotification("Recording stopped. Ready to play!", "success");
      };

      recorder.start();
      setIsRecording(true);
      showNotification("Recording started...", "info");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      showNotification("Failed to start recording. Please allow microphone access.", "error");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handlePlayRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.error("Error playing recording:", e));
      }
    } else {
      showNotification("No recording to play.", "info");
    }
  };

  const handleSelectSurahForPractice = (surahId) => {
    const surah = quranData.surahs.find(s => s.id === surahId);
    setSelectedSurah(surah);
    setSelectedVerse(null); // Reset verse when surah changes
    setAudioBlob(null); // Clear recording
  };

  const handleSelectVerseForPractice = async (verseId) => {
    if (!selectedSurah) {
      showNotification("Please select a Surah first.", "error");
      return;
    }
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah.id}:${verseId}/en.sahih`);
      const data = await response.json();
      if (data.code === 200 && data.data) {
        setSelectedVerse({
          id: verseId,
          arabic: data.data.text,
          translation: data.data.edition.direction === 'rtl' ? data.data.text : data.data.text, // Simplified for example
          audio: data.data.audio,
        });
        setAudioBlob(null); // Clear previous recording
      } else {
        showNotification("Failed to load verse for practice.", "error");
        console.error("API Error:", data);
      }
    } catch (error) {
      showNotification("Error fetching verse. Check internet.", "error");
      console.error("Fetch error:", error);
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-green-50 text-center mb-6">Practice Recitation</h2>

      {/* Surah Selection */}
      <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
        <h3 className="text-2xl font-bold mb-4">Select a Surah to Practice</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto custom-scrollbar p-2">
          {quranData.surahs.map((surah) => (
            <li key={surah.id}>
              <button
                onClick={() => handleSelectSurahForPractice(surah.id)}
                className={`w-full text-left p-4 rounded-lg transition-colors duration-200 flex justify-between items-center shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                  selectedSurah?.id === surah.id ? 'bg-green-600 text-white' : 'bg-green-700 text-green-50 hover:bg-green-600'
                }`}
              >
                <div>
                  <p className="font-semibold text-lg">{surah.englishName}</p>
                  <p className="font-arabic text-xl text-green-200">{surah.name}</p>
                </div>
                <span className="text-sm text-green-300">{surah.numberOfVerses} Verses</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Verse Selection */}
      {selectedSurah && (
        <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50">
          <h3 className="text-2xl font-bold mb-4">Select a Verse from {selectedSurah.englishName}</h3>
          <ul className="grid grid-cols-5 md:grid-cols-10 gap-2 max-h-[40vh] overflow-y-auto custom-scrollbar p-2">
            {Array.from({ length: selectedSurah.numberOfVerses }, (_, i) => i + 1).map((verseNumber) => (
              <li key={verseNumber}>
                <button
                  onClick={() => handleSelectVerseForPractice(verseNumber)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    selectedVerse?.id === verseNumber ? 'bg-green-600 text-white' : 'bg-green-700 text-green-50 hover:bg-green-600'
                  }`}
                >
                  {verseNumber}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practice Controls */}
      {selectedVerse && (
        <div className="bg-green-800 p-6 rounded-xl shadow-lg text-green-50 text-center">
          <h3 className="text-2xl font-bold mb-4">Practice Verse {selectedVerse.id}</h3>
          <p className="font-arabic text-3xl mb-4">{selectedVerse.arabic}</p>
          <p className="text-lg text-green-200 mb-6">"{selectedVerse.translation}"</p>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={handleStartRecording}
              disabled={isRecording}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                <path d="M8.25 4.5a.75.75 0 0 1 .75-.75h.75c.966 0 1.89.172 2.754.484 1.057.39 1.95.914 2.757 1.614A9.006 9.006 0 0 1 18 10.5V12a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75V10.5a10.5 10.5 0 0 0-10.5-10.5h-.75a.75.75 0 0 0-.75.75v.75ZM6 10.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm10.5 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z" />
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75V10.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M12 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                <path d="M12 18a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Z" />
                <path fillRule="evenodd" d="M12 15a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0V15Z" clipRule="evenodd" />
              </svg>
              {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
            <button
              onClick={handleStopRecording}
              disabled={!isRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M6.75 5.25A.75.75 0 0 1 7.5 4.5h9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </button>
            <button
              onClick={handlePlayRecording}
              disabled={!audioBlob}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.715 1.295 2.565 0 3.28l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              Play Recording
            </button>
          </div>
          <audio ref={audioRef} controls className="w-full max-w-md mx-auto mt-4 hidden"></audio>
        </div>
      )}
    </div>
  );
};

const PrayerTimesPage = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Get user's current location
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
          // Fallback to a default location if user denies or error occurs
          setLocation({ latitude: 53.8, longitude: -2.2 }); // Example: Blackburn, UK
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setLocation({ latitude: 53.8, longitude: -2.2 }); // Example: Blackburn, UK
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const times = getPrayerTimes(location.latitude, location.longitude);
      setPrayerTimes(times);
    }
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for countdown

    return () => clearInterval(timer);
  }, []);

  const displayedPrayerTimes = prayerTimes ? prayerTimes.times.map(p => ({
    ...p,
    formattedTime: format(p.time, 'HH:mm')
  })) : [];

  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50 text-center">
      <h2 className="text-3xl font-bold mb-6">Prayer Times</h2>
      <p className="text-xl mb-4">Current Time: {format(currentTime, 'HH:mm:ss')}</p>

      {prayerTimes ? (
        <>
          <div className="mb-6">
            <p className="text-2xl font-semibold text-green-300">
              Next Prayer: {prayerTimes.nextPrayer ? prayerTimes.nextPrayer.name : 'N/A'}
            </p>
            <p className="text-4xl font-bold text-green-100 mt-2">
              {prayerTimes.timeToNextPrayer || 'Calculating...'}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {displayedPrayerTimes.map((prayer) => (
              <div key={prayer.name} className="bg-green-700 p-4 rounded-lg shadow-md">
                <span className="text-4xl block mb-2">{prayer.icon}</span>
                <p className="font-semibold text-lg">{prayer.name}</p>
                <p className="text-xl text-green-200">{prayer.formattedTime}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-green-300">Fetching prayer times...</p>
      )}
    </div>
  );
};

// --- NEW COMPONENT: BookmarkedVersesPage ---
const BookmarkedVersesPage = ({ bookmarkedVerses, onToggleBookmark, onBackToHome }) => {
  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
      <div className="flex justify-between items-center mb-4 border-b pb-4 border-green-700">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
        <h2 className="text-3xl font-bold text-green-50 text-center">Bookmarked Verses</h2>
        <div className="w-5 h-5"></div> {/* Placeholder for alignment */}
      </div>

      {bookmarkedVerses.length === 0 ? (
        <p className="text-center text-green-300 p-8">You haven't bookmarked any verses yet. Start reading to add some!</p>
      ) : (
        <div className="space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar p-3">
          {bookmarkedVerses.map((bookmark) => (
            <div
              key={`${bookmark.surahId}-${bookmark.verseId}`}
              className="p-4 rounded-lg transition-all duration-300 border border-green-700 hover:bg-green-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-base font-medium text-green-300 bg-green-900 px-3 py-1 rounded-full">
                  {bookmark.surahName}: Verse {bookmark.verseId}
                </span>
                <button
                  onClick={() => onToggleBookmark(bookmark)}
                  className="p-2 rounded-full bg-yellow-500 text-yellow-900 hover:bg-yellow-400 transition-colors flex items-center justify-center text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  title="Remove Bookmark"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 10 2ZM3.25 8.75a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H3.25ZM16 9.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM9.5 3a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H9.5ZM10 15.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75ZM15.25 9.5a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H15.25ZM10 17a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75ZM4.5 9.5a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H4.5ZM15.25 10.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-right font-arabic text-2xl mb-3 leading-loose">{bookmark.arabic}</p>
              <p className="text-left text-green-100 border-t border-green-700 pt-3 mt-3 text-base">
                {bookmark.translation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- NEW COMPONENT: QuizPage ---
const QuizPage = ({ showNotification, onBackToHome }) => {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [quizVerses, setQuizVerses] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizType, setQuizType] = useState('translation'); // 'translation' or 'next-verse'

  const fetchSurahVersesForQuiz = useCallback(async (surahId) => {
    const surahMeta = quranData.surahs.find(s => s.id === surahId);
    if (!surahMeta) {
      showNotification("Selected Surah not found.", "error");
      return;
    }

    try {
      // Fetch both Arabic and English translation for quiz
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-simple,en.sahih`);
      const data = await response.json();

      if (data.code === 200 && data.data && data.data[0] && data.data[1]) {
        const arabicVerses = data.data[0].ayahs;
        const translationVerses = data.data[1].ayahs;

        const combinedVerses = arabicVerses.map((arabicAyah, index) => ({
          id: arabicAyah.numberInSurah,
          arabic: arabicAyah.text,
          translation: translationVerses[index] ? translationVerses[index].text : 'Translation not available.',
        }));
        setQuizVerses(combinedVerses);
        setSelectedSurah(surahMeta);
        setQuizStarted(true);
        setQuizFinished(false);
        setScore(0);
        setQuestionIndex(0);
        setFeedback('');
        setUserAnswer('');
        generateQuestion(combinedVerses, 0, quizType); // Generate first question
      } else {
        showNotification("Failed to load Surah verses for quiz.", "error");
        console.error("API Error:", data);
      }
    } catch (err) {
      showNotification("Could not connect to Quran API for quiz. Check internet.", "error");
      console.error("Fetch error:", err);
    }
  }, [showNotification, quizType]);

  const generateQuestion = useCallback((verses, index, type) => {
    if (index >= verses.length) {
      setQuizFinished(true);
      showNotification("Quiz finished!", "success");
      return;
    }

    const verse = verses[index];
    let questionText = '';
    let correctAnswer = '';

    if (type === 'translation') {
      questionText = `What is the English translation of Surah ${selectedSurah?.englishName}, Verse ${verse.id}:\n"${verse.arabic}"`;
      correctAnswer = verse.translation;
    } else if (type === 'next-verse') {
      if (index < verses.length - 1) {
        questionText = `What is the Arabic text of the verse that comes AFTER Surah ${selectedSurah?.englishName}, Verse ${verse.id}:\n"${verse.arabic}"`;
        correctAnswer = verses[index + 1].arabic;
      } else {
        // Last verse, handle end of quiz or special question
        setQuizFinished(true);
        showNotification("Quiz finished! No next verse.", "info");
        return;
      }
    }
    setCurrentQuestion({
      question: questionText,
      correctAnswer: correctAnswer,
      verseId: verse.id,
      surahId: selectedSurah?.id,
      surahName: selectedSurah?.englishName,
      type: type
    });
    setUserAnswer('');
    setFeedback('');
  }, [selectedSurah, showNotification]);

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    // Simple comparison, could be improved with fuzzy matching
    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      setFeedback('Correct! ✅');
      setScore(prev => prev + 1);
      showNotification('Correct Answer!', 'success', 1500);
    } else {
      setFeedback(`Incorrect. ❌ The correct answer was: "${currentQuestion.correctAnswer}"`);
      showNotification('Incorrect Answer.', 'error', 2500);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      generateQuestion(quizVerses, nextIndex, quizType);
    }, 2000);
  };

  const handleRestartQuiz = () => {
    setSelectedSurah(null);
    setQuizVerses([]);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setUserAnswer('');
    setFeedback('');
    setScore(0);
    setQuizStarted(false);
    setQuizFinished(false);
  };

  // Render quiz UI
  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
      <div className="flex justify-between items-center mb-4 border-b pb-4 border-green-700">
        <button
          onClick={onBackToHome}
          className="bg-green-700 hover:bg-green-600 text-green-50 font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M9.75 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M.93 13.297a.75.75 0 0 0 0 1.06l6.5 6.5a.75.75 0 0 0 1.06-1.06L2.81 13.75h14.44a.75.75 0 0 0 0-1.5H2.81l5.68-5.69a.75.75 0 0 0-1.06-1.06l-6.5 6.5Z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
        <h2 className="text-3xl font-bold text-green-50 text-center">Quran Quiz</h2>
        <div className="w-5 h-5"></div> {/* Placeholder for alignment */}
      </div>

      {!quizStarted ? (
        <div className="text-center space-y-6 mt-8">
          <h3 className="text-2xl font-semibold">Select Quiz Type:</h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setQuizType('translation')}
              className={`py-3 px-6 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 ${
                quizType === 'translation' ? 'bg-indigo-600 text-white' : 'bg-green-700 text-green-50 hover:bg-green-600'
              }`}
            >
              Arabic to English Translation
            </button>
            <button
              onClick={() => setQuizType('next-verse')}
              className={`py-3 px-6 rounded-full font-semibold transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 ${
                quizType === 'next-verse' ? 'bg-indigo-600 text-white' : 'bg-green-700 text-green-50 hover:bg-green-600'
              }`}
            >
              Next Verse (Arabic)
            </button>
          </div>

          <h3 className="text-2xl font-semibold mt-8">Select a Surah for Quiz:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto custom-scrollbar p-2 mx-auto max-w-lg">
            {quranData.surahs.map((surah) => (
              <li key={surah.id}>
                <button
                  onClick={() => fetchSurahVersesForQuiz(surah.id)}
                  className="w-full text-left p-4 bg-green-700 hover:bg-green-600 rounded-lg transition-colors duration-200 flex justify-between items-center text-green-50 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <div>
                    <p className="font-semibold text-lg">{surah.englishName}</p>
                    <p className="font-arabic text-xl text-green-200">{surah.name}</p>
                  </div>
                  <span className="text-sm text-green-300">{surah.numberOfVerses} Verses</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : quizFinished ? (
        <div className="text-center p-8 space-y-4">
          <h3 className="text-3xl font-bold text-green-300">Quiz Complete! 🎉</h3>
          <p className="text-xl">You scored: <span className="text-yellow-400 font-bold">{score}</span> out of <span className="font-bold">{quizVerses.length}</span></p>
          <button
            onClick={handleRestartQuiz}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Start New Quiz
          </button>
        </div>
      ) : (
        <div className="text-center p-8 space-y-6">
          <h3 className="text-2xl font-bold text-green-300">
            Surah {selectedSurah?.englishName} - Question {questionIndex + 1} of {quizVerses.length}
          </h3>
          <p className="text-xl font-semibold text-green-200">Score: {score}</p>
          {currentQuestion && (
            <>
              <p className="text-xl md:text-2xl mb-4 leading-relaxed">{currentQuestion.question}</p>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full max-w-md p-3 rounded-lg bg-green-700 text-green-50 placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-center"
              />
              <button
                onClick={handleSubmitAnswer}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!userAnswer.trim()}
              >
                Submit Answer
              </button>
              {feedback && (
                <p className={`mt-4 text-lg font-semibold ${feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};


// --- Main App Component (MODIFIED) ---
export default function App() {
  // NEW STATE: Theme (light/dark)
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  const [currentView, setCurrentView] = useState('home'); // 'home', 'surah-selector', 'quran-reader', 'listen', 'practice', 'prayer-times', 'bookmarks', 'quiz'
  const [selectedSurahId, setSelectedSurahId] = useState(null);
  const [points, setPoints] = useState(0);
  const [userProgress, setUserProgress] = useState({
    dailyStreak: 0,
    versesRead: 0,
    achievements: achievementsData,
  });
  const [unlockedReciters, setUnlockedReciters] = useState(['alafasy', 'abdulbaset', 'minshawi', 'shuraim']);
  const [notification, setNotification] = useState(null);
  const [readerSettings, setReaderSettings] = useState({
    fontSize: 'medium',
    showTranslation: true,
  });
  const [bookmarkedVerses, setBookmarkedVerses] = useState(() => {
    try {
      const storedBookmarks = localStorage.getItem('quranAppBookmarks');
      return storedBookmarks ? JSON.parse(storedBookmarks) : [];
    } catch (error) {
      console.error("Failed to parse bookmarks from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('quranAppBookmarks', JSON.stringify(bookmarkedVerses));
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage:", error);
    }
  }, [bookmarkedVerses]);

  // NEW EFFECT: Apply dark/light mode classes to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-green-900', 'text-green-50');
      document.body.classList.remove('bg-gray-100', 'text-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-green-900', 'text-green-50');
      document.body.classList.add('bg-gray-100', 'text-gray-900');
    }
  }, [isDarkMode]);


  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, duration);
  }, []);

  const handleUnlockReciter = useCallback((reciterId, cost) => {
    if (points >= cost) {
      setPoints(prev => prev - cost);
      setUnlockedReciters(prev => [...prev, reciterId]);
      showNotification(`Unlocked ${reciterId} for ${cost} points!`, 'success');
    } else {
      showNotification(`Not enough points to unlock ${reciterId}.`, 'error');
    }
  }, [points, showNotification]);

  const handleVerseRead = useCallback(() => {
    setUserProgress(prev => ({
      ...prev,
      versesRead: prev.versesRead + 1,
    }));
    setPoints(prev => prev + 1); // Reward 1 point per verse read
  }, []);

  const handleSurahChange = useCallback((surahId) => {
    setSelectedSurahId(surahId);
    setCurrentView('quran-reader');
  }, []);

  const handleFontSizeChange = useCallback((action) => {
    setReaderSettings(prev => {
      if (action === 'increase') {
        if (prev.fontSize === 'small') return { ...prev, fontSize: 'medium' };
        if (prev.fontSize === 'medium') return { ...prev, fontSize: 'large' };
      } else if (action === 'decrease') {
        if (prev.fontSize === 'large') return { ...prev, fontSize: 'medium' };
        if (prev.fontSize === 'medium') return { ...prev, fontSize: 'small' };
      }
      return prev;
    });
  }, []);

  const handleToggleTranslation = useCallback(() => {
    setReaderSettings(prev => ({
      ...prev,
      showTranslation: !prev.showTranslation,
    }));
  }, []);

  const handleToggleBookmark = useCallback((verseToBookmark) => {
    setBookmarkedVerses(prevBookmarks => {
      const isAlreadyBookmarked = prevBookmarks.some(
        b => b.surahId === verseToBookmark.surahId && b.verseId === verseToBookmark.verseId
      );

      if (isAlreadyBookmarked) {
        showNotification(`Removed bookmark from Surah ${verseToBookmark.surahName}, Verse ${verseToBookmark.verseId}`, 'info');
        return prevBookmarks.filter(
          b => !(b.surahId === verseToBookmark.surahId && b.verseId === verseToBookmark.verseId)
        );
      } else {
        showNotification(`Bookmarked Surah ${verseToBookmark.surahName}, Verse ${verseToBookmark.verseId}`, 'success');
        return [...prevBookmarks, verseToBookmark];
      }
    });
  }, [showNotification]);

  return (
    // MODIFIED: Apply theme classes to the main div
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 ${isDarkMode ? 'bg-green-900 text-green-50' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`w-full max-w-4xl p-6 rounded-xl shadow-lg flex justify-between items-center mb-6 ${isDarkMode ? 'bg-green-800' : 'bg-white'}`}>
        <h1 className={`text-4xl font-extrabold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>QuranApp</h1>
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-yellow-400 flex items-center">
            {points} <span className="text-xl ml-1">✨</span>
          </span>
          {/* NEW: Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className={`p-3 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-green-700 hover:bg-green-600 text-green-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9c.035 0 .07-.004.105-.008a.75.75 0 0 1 .819.162 10.5 10.5 0 0 1-8.853 16.81l-.-.001-.002-.002-.002-.002-.002-.001A10.5 10.5 0 0 1 9.528 1.718Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.592 1.591a.75.75 0 0 0 1.06 1.061l1.592-1.591ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.24 18.394a.75.75 0 0 0 1.06 1.06l1.591-1.592a.75.75 0 0 0-1.06-1.06l-1.591 1.592ZM12 18.75a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V19.5a.75.75 0 0 1 .75-.75ZM5.05 18.394a.75.75 0 0 0-1.06-1.06l-1.591 1.592a.75.75 0 0 0 1.06 1.06l1.591-1.591ZM3 12a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5H2.25A.75.75 0 0 1 3 12ZM6.166 5.05a.75.75 0 0 0-1.06-1.06L3.515 5.583a.75.75 0 1 0 1.06 1.06L6.166 5.05Z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className={`p-3 rounded-full transition-colors duration-200 ${currentView === 'home' ? 'bg-green-600 text-white' : (isDarkMode ? 'bg-green-700 hover:bg-green-600 text-green-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}`}
            title="Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a1.5 1.5 0 0 1 0 2.12l-5.177 5.177a.75.75 0 0 1-1.06 0l-1.65-1.65a.75.75 0 0 0-1.154.043l-1.5 1.75A.75.75 0 0 1 9.46 19L2.303 11.843a1.5 1.5 0 0 1 0-2.122L11.47 3.84Z" /></svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl flex-grow">
        {currentView === 'home' && (
          <HomeDashboard
            setCurrentView={setCurrentView}
            points={points}
            userProgress={userProgress}
            unlockedReciters={unlockedReciters}
            handleUnlockReciter={handleUnlockReciter}
            showNotification={showNotification}
          />
        )}
        {currentView === 'surah-selector' && (
          <SurahSelector onSelectSurah={handleSurahChange} />
        )}
        {currentView === 'quran-reader' && (
          <QuranReader
            selectedSurahId={selectedSurahId}
            settings={readerSettings}
            onBackToSurahList={() => setCurrentView('surah-selector')}
            onSurahChange={handleSurahChange}
            onVerseRead={handleVerseRead}
            onToggleBookmark={handleToggleBookmark}
            bookmarkedVerses={bookmarkedVerses}
          />
        )}
        {currentView === 'listen' && (
          <ListenPage
            points={points}
            unlockedReciters={unlockedReciters}
            handleUnlockReciter={handleUnlockReciter}
            showNotification={showNotification}
          />
        )}
        {currentView === 'practice' && (
          <PracticePage showNotification={showNotification} />
        )}
        {currentView === 'prayer-times' && (
          <PrayerTimesPage />
        )}
        {currentView === 'bookmarks' && (
          <BookmarkedVersesPage
            bookmarkedVerses={bookmarkedVerses}
            onToggleBookmark={handleToggleBookmark}
            onBackToHome={() => setCurrentView('home')}
          />
        )}
        {/* NEW ROUTE: Quiz Page */}
        {currentView === 'quiz' && (
          <QuizPage
            showNotification={showNotification}
            onBackToHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Notification Message */}
      {notification && (
        <NotificationMessage
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
