import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO, startOfDay, addDays, differenceInSeconds } from 'date-fns';
import { 
  Home, BookOpen, Headphones, Mic, Clock, Star, HelpCircle, ArrowLeft, 
  ChevronLeft, ChevronRight, Play, Pause, Bookmark, CheckCircle, XCircle, 
  Info, Sun, Moon, Cloud, Zap, Award, User, Clock9, CalendarDays, 
  BarChart, Gem, DollarSign, CircleDot, Square, MessageSquareText 
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// --- DATA & CONFIGURATION ---

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
    reference: 'At-Talaq 65:2'
  },
};

const quizQuestions = [
  {
    id: 1,
    question: "Which Surah is considered the heart of the Quran?",
    choices: ["Surah Yaseen", "Surah Al-Mulk", "Surah Ar-Rahman", "Surah Al-Kahf"],
    correctAnswer: "Surah Yaseen",
    category: "General"
  },
  {
    id: 2,
    question: "How many Surahs are there in the Quran?",
    choices: ["110", "114", "120", "99"],
    correctAnswer: "114",
    category: "General"
  },
  {
    id: 3,
    question: "What is the English translation of Surah Al-Fatiha, Verse 1: \"بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\"",
    correctAnswer: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    choices: [
      "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      "All praise is due to Allah, Lord of the worlds.",
      "The Most Gracious, the Most Merciful.",
      "Master of the Day of Judgment."
    ],
    category: "Short Surahs"
  }
];

// --- PREMIUM UI COMPONENTS ---

const PremiumCard = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-700 hover:bg-white/10 hover:border-[#d4af37]/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] w-full"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="text-[#d4af37] mb-6 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-700">
      {Icon && <Icon size={44} strokeWidth={1.2} />}
    </div>
    <h3 className="text-xl font-light tracking-wide text-white mb-2">{title}</h3>
    <p className="text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">{description}</p>
  </button>
);

// --- VIEWS ---

const HomeDashboard = ({ setCurrentView }) => (
  <div className="max-w-7xl mx-auto px-6 space-y-16 animate-fade-in py-10">
    <section className="text-center space-y-4 pt-6">
      <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight">Al-Quran</h1>
      <p className="text-[#d4af37] uppercase tracking-[0.5em] text-xs">Divine Guidance for Mankind</p>
    </section>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <PremiumCard icon={BookOpen} title="Read" description="Browse 114 Surahs" onClick={() => setCurrentView('surah-selector')} />
      <PremiumCard icon={Headphones} title="Listen" description="Noble Recitations" onClick={() => setCurrentView('listen')} />
      <PremiumCard icon={MessageSquareText} title="Q&A" description="Deen Buddy AI" onClick={() => setCurrentView('qa')} />
      <PremiumCard icon={HelpCircle} title="Quiz" description="Test Knowledge" onClick={() => setCurrentView('quiz')} />
    </div>

    {/* Verse of the Day Section */}
    <div className="relative py-16 px-10 rounded-[4rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent text-center overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050a08] border border-[#d4af37]/30 px-8 py-2 rounded-full text-[#d4af37] text-[10px] tracking-[0.4em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.2)]">
        Ayah of the Day
      </div>
      <p className="font-arabic text-4xl md:text-6xl mb-10 leading-[1.8] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        {quranData.verseOfTheDay.arabic}
      </p>
      <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent mx-auto mb-8" />
      <p className="text-xl font-light text-white/60 max-w-3xl mx-auto italic font-serif leading-relaxed mb-4">
        "{quranData.verseOfTheDay.translation}"
      </p>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]/60">
        {quranData.verseOfTheDay.reference}
      </p>
    </div>
    
    {/* Stats / Progress Mini Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center space-x-6">
            <div className="bg-[#d4af37]/10 p-4 rounded-2xl text-[#d4af37]"><Zap size={24} /></div>
            <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Current Streak</p>
                <p className="text-2xl font-serif text-white">7 Days</p>
            </div>
        </div>
        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center space-x-6">
            <div className="bg-[#d4af37]/10 p-4 rounded-2xl text-[#d4af37]"><Award size={24} /></div>
            <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Total Points</p>
                <p className="text-2xl font-serif text-white">1,250</p>
            </div>
        </div>
        <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center space-x-6">
            <div className="bg-[#d4af37]/10 p-4 rounded-2xl text-[#d4af37]"><Clock size={24} /></div>
            <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Next Prayer</p>
                <p className="text-2xl font-serif text-white">Asr - 17:00</p>
            </div>
        </div>
    </div>
  </div>
);

const QuizView = ({ setCurrentView }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswer = (choice) => {
    setSelectedAnswer(choice);
    setFeedback(choice === currentQuestion.correctAnswer ? 'correct' : 'incorrect');
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <button 
        onClick={() => setCurrentView('home')}
        className="flex items-center text-white/50 hover:text-[#d4af37] transition-colors mb-10 text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={14} className="mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[80px]" />
        
        {currentQuestion ? (
          <div className="relative z-10">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-6 text-center">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </h2>
            <h3 className="text-2xl md:text-3xl font-serif text-white text-center mb-12 leading-relaxed">
              {currentQuestion.question}
            </h3>
            
            <div className="grid gap-4">
              {currentQuestion.choices.map((choice, index) => {
                let buttonStyle = "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-[#d4af37]/30";
                if (selectedAnswer) {
                  if (choice === currentQuestion.correctAnswer) buttonStyle = "bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]";
                  else if (choice === selectedAnswer) buttonStyle = "bg-red-500/20 border-red-500/50 text-red-200";
                  else buttonStyle = "bg-white/5 border-white/5 text-white/20 opacity-40";
                }

                return (
                  <button
                    key={index}
                    onClick={() => !selectedAnswer && handleAnswer(choice)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left px-8 py-5 rounded-2xl border transition-all duration-500 ${buttonStyle}`}
                  >
                    <span className="font-light text-lg">{choice}</span>
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className="mt-12 text-center animate-fade-in">
                <p className={`text-lg font-serif italic mb-8 ${feedback === 'correct' ? 'text-[#d4af37]' : 'text-red-400'}`}>
                  {feedback === 'correct' ? 'Masha\'Allah, that is correct!' : `The correct answer was: ${currentQuestion.correctAnswer}`}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-[#d4af37] to-[#b5952f] text-[#050a08] px-12 py-4 rounded-full font-bold tracking-widest uppercase text-[10px] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:scale-105 transition-all"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 relative z-10">
            <Award size={64} className="mx-auto text-[#d4af37] mb-6" />
            <p className="text-3xl font-serif text-white mb-8">Assessment Complete</p>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-white/5 border border-white/20 text-white px-10 py-4 rounded-full font-bold tracking-widest uppercase text-[10px] hover:bg-[#d4af37] hover:text-[#050a08] transition-all"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-[#050a08] text-white selection:bg-[#d4af37]/30 font-sans">
      <Analytics />
      <SpeedInsights />
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d4af37]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-2xl bg-[#050a08]/80 px-8 py-6 flex justify-between items-center sticky top-0">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <Star size={20} fill="currentColor" />
          </div>
          <span className="font-serif text-xl tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Al-Quran
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-10 text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
          <button onClick={() => setCurrentView('home')} className={`hover:text-[#d4af37] transition-colors ${currentView === 'home' ? 'text-[#d4af37]' : ''}`}>Home</button>
          <button className="hover:text-[#d4af37] transition-colors">Library</button>
          <button className="hover:text-[#d4af37] transition-colors">Settings</button>
          <div className="h-4 w-[1px] bg-white/10" />
          <button className="flex items-center space-x-2 text-[#d4af37] hover:text-white transition-colors">
            <User size={16} />
            <span>Profile</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pb-20">
        {currentView === 'home' && <HomeDashboard setCurrentView={setCurrentView} />}
        {currentView === 'quiz' && <QuizView setCurrentView={setCurrentView} />}
        
        {/* Placeholder View */}
        {['surah-selector', 'listen', 'qa', 'practice', 'prayer-times', 'bookmarks', 'deen-buddy'].includes(currentView) && (
          <div className="flex flex-col items-center justify-center pt-32 text-center animate-fade-in px-6">
             <div className="w-20 h-20 mb-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]">
               <Clock9 size={32} />
             </div>
             <h2 className="text-3xl font-serif mb-4 uppercase tracking-widest">Coming Soon</h2>
             <p className="text-white/40 max-w-sm mx-auto text-sm leading-relaxed mb-10">
               This feature is being carefully crafted for a premium spiritual experience.
             </p>
             <button 
              onClick={() => setCurrentView('home')}
              className="bg-white/5 border border-white/20 hover:border-[#d4af37]/50 text-white/70 hover:text-white px-8 py-3 rounded-full uppercase tracking-[0.2em] text-[10px] transition-all"
            >
              Back to Dashboard
             </button>
          </div>
        )}
      </main>
    </div>
  );
}