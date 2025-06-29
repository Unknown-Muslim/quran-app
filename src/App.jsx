// --- Initial Setup and Data ---
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO, startOfDay, addDays, differenceInSeconds } from 'date-fns';
import { getPrayerTimes } from './prayerTimesCalc'; // We'll assume this utility exists or create a simple one if needed

// Placeholder for quranData if not defined elsewhere.
// In a real app, this would be fetched from an API or a large data file.
// For now, it's mocked to ensure the app runs.
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
    // Add more surahs as needed for a complete list
  ],
  verseOfTheDay: {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
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
  { id: 'quiz-whiz', title: 'Quiz Whiz', description: 'Score over 500 points in quizzes', icon: '�', achieved: false },
];

// Utility for basic prayer time calculation (Hanafi for Asr)
// This is a simplified, client-side only calculation and may not be as precise as external APIs
// For production, consider a robust library or API.
function getPrayerTimes(latitude, longitude, date = new Date()) {
  const times = {
    Fajr: null,
    Sunrise: null,
    Dhuhr: null,
    Asr: null, // Hanafi method for Asr
    Maghrib: null,
    Isha: null,
  };

  // Simplified calculation based on fixed angles and offsets for demonstration
  // In a real app, you'd use a comprehensive library like 'adhan' or 'prayertimes.js'
  // and specific calculation methods (e.g., ISNA, MWL, Egyptian, etc.)
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
    // Since all reciters are now unlocked, the action is always to select them for listening
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
      {/* Since all reciters are unlocked, only the 'Listen' button is shown */}
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
  return (
    <div className="bg-green-800 p-6 rounded-xl shadow-lg mb-6 text-green-50">
      <h2 className="text-2xl font-bold mb-5 text-center">Select a Surah</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
        {quranData.surahs.map((surah) => (
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
        ))}
      </ul>
    </div>
  );
};

const QuranReader = ({ selectedSurahId, settings, onBackToSurahList, onSurahChange, onVerseRead, onPlayVerse }) => {
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
        {surahVerses.map((verse) => (
          <div
            key={verse.id}
            className={`p-4 rounded-lg transition-all duration-300 border border-green-700 ${
              highlightedVerseId === verse.id ? 'bg-green-700 shadow-lg scale-[1.01]' : 'hover:bg-green-700 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-base font-medium text-green-300 bg-green-900 px-3 py-1 rounded-full">Verse {verse.id}</span>
              {verse.audio && (
                <button
                  onClick={() => playVerseAudio(verse.id, verse.audio)}
                  className="ml-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  title={`Play Verse ${verse.id}`}
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
                  </svg>
                </button>
              )}
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
        ))}
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

const AudioPlayer = ({ mediaUrl, isVideo = false, currentReciterName, currentSurahName, showNotification }) => {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const audio = mediaRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75H16.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.715 1.295 2.565 0 3.28l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button className="p-2 rounded-full bg-green-800 hover:bg-green-900 transition focus:outline-none focus:ring-2 focus:ring-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-200"><path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" /><path fillRule="evenodd" d="M9.315 7.587A.75.75 0 0 0 8.58 8.41L10.07 12l-1.49 3.59a.75.75 0 0 0 1.06 1.06l1.74-4.168 1.74 4.168a.75.75 0 0 0 1.06-1.06L13.93 12l1.49-3.59a.75.75 0 0 0-1.06-1.06L12 10.07l-2.685-2.483Z" clipRule="evenodd" /></svg>
            </button>
            <button className="p-2 rounded-full bg-green-800 hover:bg-green-900 transition focus:outline-none focus:ring-2 focus:ring-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-200"><path fillRule="evenodd" d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.403l-4.706 4.707a.75.75 0 0 1-1.06-1.06L19.597 3.75H15.75a.75.75 0 0 1 0-1.5Zm-11.5 0A.75.75 0 0 0 3 3v5.25a.75.75 0 0 0 1.5 0V4.403l4.706 4.707a.75.75 0 0 0 1.06-1.06L4.403 3.75H8.25a.75.75 0 0 0 0-1.5ZM2.25 15.75A.75.75 0 0 1 3 15v5.25a.75.75 0 0 1-1.5 0V19.597l-4.706-4.707a.75.75 0 0 1 1.06-1.06L3.75 19.597V15.75a.75.75 0 0 1 1.5 0Zm11.5 0a.75.75 0 0 0-.75.75v3.847l-4.706-4.707a.75.75 0 1 0-1.06 1.06l4.707 4.706H15.75a.75.75 0 0 0 0-1.5Z" clipRule="evenodd" /></svg>
            </button>
          </div>
          {/* Volume Control */}
          <div className="flex items-center mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-green-200">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25v2.25a2.25 2.25 0 0 0 2.25 2.25h2.94l4.5 4.5c.945.945 2.56-.133 2.56-1.06V4.06ZM18.042 9.75a.75.75 0 1 0-1.06-1.06L15 10.44V8.25a.75.75 0 0 0-1.5 0v3.75c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V11.56l1.988-1.99Z" />
              <path d="M19.5 1.5a.75.75 0 0 0-1.28.53v16.5c0 .285.307.573.618.723l2.678 1.339c.264.132.559.183.782.183.527 0 .9-.442.9-.9V2.56a.75.75 0 0 0-.53-.72L19.5 1.5Z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-green-800 rounded-lg appearance-none cursor-pointer accent-green-400"
            />
          </div>
        </div>
      ) : (
        <p className="text-green-300">Select a Surah to start listening.</p>
      )}
    </div>
  );
};


const ListenPage = ({ points, unlockedReciters, handleUnlockReciter, showNotification, onBackToHome }) => {
  const [selectedReciter, setSelectedReciter] = useState(null); // { id, name, englishName, alquranCloudId }
  const [selectedSurahForListening, setSelectedSurahForListening] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);

  const handleSelect�
