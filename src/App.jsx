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


// ─── Premium Style Injection ─────────────────────────────────────────────────
const PremiumStyles = () => {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = 'nurul-premium';
    style.textContent = `
      :root {
        --ink: #060a12;
        --ink-2: #0c1221;
        --ink-3: #131928;
        --ink-4: #1b2236;
        --ink-5: #232d46;
        --gold: #c9a454;
        --gold-l: #e2c27a;
        --gold-d: #8a6d2e;
        --gold-dim: rgba(201,164,84,0.18);
        --cream: #f0e6d3;
        --cream-2: #d4c4a8;
        --cream-3: #a89880;
        --cream-4: #5e5145;
      }
      * { box-sizing: border-box; }
      body { background: var(--ink) !important; margin:0; }

      .p-app {
        min-height: 100vh;
        background: var(--ink);
        background-image:
          radial-gradient(ellipse 70% 50% at 15% -10%, rgba(201,164,84,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 85% 110%, rgba(201,164,84,0.05) 0%, transparent 55%);
        font-family: 'DM Sans', sans-serif;
        color: var(--cream);
      }

      /* ── Header ── */
      .p-header { text-align:center; padding: 40px 0 32px; }
      .p-logo {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 300;
        font-size: clamp(2.4rem, 6vw, 4rem);
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--cream);
        margin: 0 0 6px;
        line-height: 1;
      }
      .p-logo span { color: var(--gold); }
      .p-tagline {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: 1rem;
        letter-spacing: 0.08em;
        color: var(--gold);
        margin-bottom: 20px;
      }
      .p-points-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 22px;
        background: var(--ink-3);
        border: 1px solid var(--gold-dim);
        border-radius: 100px;
        font-size: 0.82rem;
        letter-spacing: 0.06em;
        color: var(--gold-l);
        margin-top: 8px;
      }

      /* ── Nav Cards ── */
      .p-card {
        background: linear-gradient(145deg, var(--ink-3), var(--ink-2));
        border: 1px solid var(--gold-dim);
        border-radius: 20px;
        padding: 28px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: pointer;
        transition: transform 0.32s cubic-bezier(.4,0,.2,1), border-color 0.25s, box-shadow 0.32s;
        position: relative;
        overflow: hidden;
      }
      .p-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(201,164,84,0.35), transparent);
      }
      .p-card:hover {
        transform: translateY(-5px);
        border-color: rgba(201,164,84,0.45);
        box-shadow: 0 28px 60px rgba(0,0,0,0.55), 0 0 25px rgba(201,164,84,0.09);
      }
      .p-card-icon {
        width: 56px; height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(201,164,84,0.14), rgba(201,164,84,0.04));
        border: 1px solid rgba(201,164,84,0.25);
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 14px;
        color: var(--gold);
        transition: border-color 0.25s;
      }
      .p-card:hover .p-card-icon { border-color: rgba(201,164,84,0.55); }
      .p-card-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--cream);
        letter-spacing: 0.04em;
        margin-bottom: 5px;
      }
      .p-card-desc {
        font-size: 0.76rem;
        color: var(--cream-3);
        letter-spacing: 0.03em;
      }

      /* ── Section wrappers ── */
      .p-section {
        background: linear-gradient(160deg, var(--ink-3), var(--ink-2));
        border: 1px solid var(--gold-dim);
        border-radius: 24px;
        padding: 28px;
        margin-bottom: 28px;
        position: relative;
        overflow: hidden;
      }
      .p-section::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(201,164,84,0.3), transparent);
      }
      .p-section-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.5rem;
        font-weight: 400;
        color: var(--cream);
        letter-spacing: 0.05em;
        margin: 0 0 22px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .p-section-title::after {
        content: '';
        flex: 1; height: 1px;
        background: linear-gradient(90deg, rgba(201,164,84,0.25), transparent);
      }

      /* ── Verse of the Day ── */
      .p-votd {
        background: linear-gradient(150deg, var(--ink-3), var(--ink-2) 60%, rgba(201,164,84,0.04) 100%);
        border: 1px solid rgba(201,164,84,0.22);
        border-radius: 24px;
        padding: 44px 36px;
        text-align: center;
        position: relative;
        overflow: hidden;
        margin-bottom: 28px;
      }
      .p-votd::before, .p-votd::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(201,164,84,0.4), transparent);
      }
      .p-votd::after {
        top: auto; bottom: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(201,164,84,0.15), transparent);
      }
      .p-votd-ornament {
        font-size: 0.6rem;
        letter-spacing: 0.8em;
        color: var(--gold-d);
        margin-bottom: 16px;
        display: block;
      }
      .p-votd-label {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: 0.82rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 22px;
      }
      .p-votd-arabic {
        font-family: 'Amiri', serif;
        font-size: clamp(1.9rem, 4vw, 2.8rem);
        line-height: 2.1;
        color: var(--cream);
        direction: rtl;
        margin-bottom: 18px;
        text-shadow: 0 0 30px rgba(201,164,84,0.12);
      }
      .p-votd-ref {
        font-size: 0.7rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--gold-d);
        margin-bottom: 14px;
      }
      .p-votd-trans {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: 1.15rem;
        color: var(--cream-2);
        line-height: 1.9;
        max-width: 560px;
        margin: 0 auto 28px;
      }

      /* ── Buttons ── */
      .p-btn-gold {
        background: linear-gradient(135deg, var(--gold-d), var(--gold));
        color: var(--ink);
        border: none;
        border-radius: 100px;
        padding: 11px 28px;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.8rem;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        transition: box-shadow 0.25s, transform 0.2s;
        display: inline-flex; align-items: center; gap: 7px;
      }
      .p-btn-gold:hover {
        box-shadow: 0 0 24px rgba(201,164,84,0.4);
        transform: translateY(-1px);
      }
      .p-btn-ghost {
        background: transparent;
        color: var(--cream-2);
        border: 1px solid rgba(201,164,84,0.22);
        border-radius: 100px;
        padding: 9px 20px;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 0.06em;
        cursor: pointer;
        transition: all 0.22s;
        display: inline-flex; align-items: center; gap: 7px;
      }
      .p-btn-ghost:hover { border-color: var(--gold); color: var(--gold-l); }
      .p-play-btn {
        width: 64px; height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--gold-d), var(--gold));
        border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        color: var(--ink);
        box-shadow: 0 0 30px rgba(201,164,84,0.28);
        transition: all 0.28s;
      }
      .p-play-btn:hover { transform: scale(1.08); box-shadow: 0 0 40px rgba(201,164,84,0.5); }
      .p-play-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      .p-ctrl-btn {
        width: 44px; height: 44px;
        border-radius: 50%;
        background: var(--ink-3);
        border: 1px solid var(--gold-dim);
        color: var(--cream-2);
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
      }
      .p-ctrl-btn:hover { border-color: rgba(201,164,84,0.4); color: var(--gold-l); }
      .p-ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }

      /* ── Input / Select ── */
      .p-input, .p-select {
        background: var(--ink-2);
        border: 1px solid var(--gold-dim);
        border-radius: 12px;
        padding: 13px 18px;
        color: var(--cream);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.9rem;
        width: 100%;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        appearance: none;
      }
      .p-input::placeholder { color: var(--cream-4); }
      .p-input:focus, .p-select:focus {
        border-color: rgba(201,164,84,0.5);
        box-shadow: 0 0 0 3px rgba(201,164,84,0.07);
      }
      .p-select option { background: var(--ink-2); color: var(--cream); }
      .p-select-wrap { position: relative; }
      .p-select-wrap::after {
        content: '›';
        position: absolute; right: 14px; top: 50%;
        transform: translateY(-50%) rotate(90deg);
        color: var(--gold-d); pointer-events: none;
        font-size: 1.1rem;
      }

      /* ── Surah list ── */
      .p-surah-item {
        background: var(--ink-2);
        border: 1px solid rgba(201,164,84,0.08);
        border-radius: 12px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 14px;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
        text-align: left;
        margin-bottom: 6px;
      }
      .p-surah-item:hover {
        background: var(--ink-3);
        border-color: rgba(201,164,84,0.3);
        transform: translateX(3px);
      }
      .p-surah-num {
        min-width: 34px; height: 34px;
        border: 1px solid rgba(201,164,84,0.28);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.72rem;
        color: var(--gold);
      }

      /* ── Reciter Card ── */
      .p-reciter-card {
        background: var(--ink-2);
        border: 1px solid rgba(201,164,84,0.1);
        border-radius: 16px;
        padding: 22px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: all 0.3s;
        position: relative;
      }
      .p-reciter-card:hover {
        border-color: rgba(201,164,84,0.32);
        transform: translateY(-4px);
        box-shadow: 0 20px 50px rgba(0,0,0,0.45);
      }
      .p-reciter-img {
        width: 70px; height: 70px;
        border-radius: 50%;
        border: 2px solid rgba(201,164,84,0.35);
        margin-bottom: 12px;
        object-fit: cover;
      }
      .p-locked-badge {
        position: absolute; top: 10px; right: 10px;
        font-size: 0.6rem; letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 3px 10px;
        background: rgba(201,164,84,0.12);
        border: 1px solid rgba(201,164,84,0.22);
        border-radius: 100px;
        color: var(--gold);
      }

      /* ── Progress bars ── */
      .p-progress-bar {
        height: 3px; background: var(--ink-4);
        border-radius: 100px; overflow: hidden;
        margin: 10px 0 6px;
      }
      .p-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--gold-d), var(--gold));
        border-radius: 100px;
        transition: width 0.7s ease-out;
      }

      /* ── Achievement items ── */
      .p-achievement {
        display: flex; align-items: center; gap: 12px;
        padding: 12px 16px;
        border-radius: 10px;
        margin-bottom: 8px;
        border: 1px solid transparent;
        transition: all 0.2s;
      }
      .p-achievement.achieved {
        background: rgba(201,164,84,0.08);
        border-color: rgba(201,164,84,0.2);
      }
      .p-achievement.locked {
        background: var(--ink-2);
        border-color: rgba(255,255,255,0.04);
        opacity: 0.55;
      }

      /* ── Verse display (reader) ── */
      .p-verse-row {
        border-left: 2px solid rgba(201,164,84,0.12);
        padding: 18px 22px;
        margin-bottom: 6px;
        border-radius: 0 12px 12px 0;
        cursor: pointer;
        transition: all 0.2s;
      }
      .p-verse-row:hover { background: rgba(201,164,84,0.04); border-left-color: rgba(201,164,84,0.4); }
      .p-verse-row.playing {
        background: rgba(201,164,84,0.08) !important;
        border-left-color: var(--gold) !important;
        box-shadow: 0 0 20px rgba(201,164,84,0.06);
      }

      /* ── Notification ── */
      .p-notif {
        position: fixed; bottom: 24px;
        left: 50%; transform: translateX(-50%);
        background: var(--ink-3);
        border: 1px solid rgba(201,164,84,0.25);
        border-radius: 14px;
        padding: 14px 22px;
        display: flex; align-items: center; gap: 12px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.55);
        z-index: 9999;
        min-width: 280px;
        animation: fadeInUp 0.35s ease;
      }
      .p-notif.success { border-color: rgba(100,200,100,0.3); }
      .p-notif.error   { border-color: rgba(200,80,80,0.32); }

      /* ── Player panel ── */
      .p-player {
        background: var(--ink-2);
        border: 1px solid rgba(201,164,84,0.18);
        border-radius: 20px;
        padding: 26px;
        margin-bottom: 20px;
      }

      /* ── Quiz answer btn ── */
      .p-quiz-btn {
        background: var(--ink-2);
        border: 1px solid rgba(201,164,84,0.1);
        border-radius: 12px;
        padding: 15px 20px;
        width: 100%;
        text-align: left;
        color: var(--cream);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 8px;
        display: block;
      }
      .p-quiz-btn:hover:not(:disabled) {
        background: var(--ink-3);
        border-color: rgba(201,164,84,0.32);
      }
      .p-quiz-btn.correct {
        background: rgba(80,170,80,0.12);
        border-color: rgba(80,170,80,0.4);
        color: #9ee09e;
      }
      .p-quiz-btn.incorrect {
        background: rgba(200,60,60,0.12);
        border-color: rgba(200,60,60,0.35);
        color: #e09e9e;
      }
      .p-quiz-btn:disabled { opacity: 0.75; cursor: not-allowed; }

      /* ── Prayer row ── */
      .p-prayer-row {
        display: flex; align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        border-radius: 12px;
        margin-bottom: 8px;
        background: var(--ink-2);
        border: 1px solid rgba(255,255,255,0.04);
        transition: background 0.2s;
      }
      .p-prayer-row.next-prayer {
        background: rgba(201,164,84,0.08);
        border-color: rgba(201,164,84,0.25);
      }

      /* ── Misc ── */
      .gold-line {
        height: 1px; margin: 24px 0;
        background: linear-gradient(90deg, transparent, rgba(201,164,84,0.28), transparent);
      }
      .p-label {
        font-size: 0.7rem; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--gold-d);
        margin-bottom: 10px; display: block;
      }
      .font-arabic { font-family: 'Amiri', serif; }
      .p-score-badge {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(201,164,84,0.1);
        border: 1px solid rgba(201,164,84,0.22);
        border-radius: 100px;
        padding: 6px 16px;
        font-size: 0.85rem; color: var(--gold-l);
      }

      /* ── Reciter picker row ── */
      .p-reciter-pick {
        background: var(--ink-2);
        border: 1px solid rgba(201,164,84,0.1);
        border-radius: 14px;
        padding: 14px;
        display: flex; flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }
      .p-reciter-pick.active {
        border-color: rgba(201,164,84,0.5);
        background: rgba(201,164,84,0.07);
      }
      .p-reciter-pick:hover { border-color: rgba(201,164,84,0.3); }

      /* Scrollbar */
      .custom-scrollbar::-webkit-scrollbar { width: 3px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: var(--ink-2); }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--gold-d); border-radius: 4px; }

      /* Animations */
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
      @keyframes fadeInDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in-down { animation: fadeInDown 0.6s ease forwards; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in-up { animation: fadeInUp 0.4s ease forwards; }

      /* Spinner */
      @keyframes spin { to { transform: rotate(360deg); } }
      .p-spinner {
        width: 22px; height: 22px;
        border: 2px solid rgba(201,164,84,0.25);
        border-top-color: var(--gold);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }

      /* Deen buddy chat */
      .p-chat-bubble-user {
        background: rgba(201,164,84,0.1);
        border: 1px solid rgba(201,164,84,0.2);
        border-radius: 18px 18px 4px 18px;
        padding: 12px 18px;
        max-width: 78%;
        margin-left: auto;
        font-size: 0.88rem;
        color: var(--cream-2);
        line-height: 1.6;
      }
      .p-chat-bubble-ai {
        background: var(--ink-2);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 4px 18px 18px 18px;
        padding: 14px 18px;
        max-width: 88%;
        font-size: 0.88rem;
        color: var(--cream);
        line-height: 1.7;
      }
      .p-chat-input-row {
        display: flex; gap: 10px; align-items: center;
        padding-top: 14px;
        border-top: 1px solid rgba(201,164,84,0.1);
        margin-top: 16px;
      }
      
      /* Bookmarks */
      .p-bookmark-row {
        background: var(--ink-2);
        border: 1px solid rgba(201,164,84,0.09);
        border-radius: 14px;
        padding: 18px 20px;
        margin-bottom: 10px;
        transition: all 0.2s;
      }
      .p-bookmark-row:hover {
        border-color: rgba(201,164,84,0.28);
        background: var(--ink-3);
      }
    `;
    document.head.appendChild(style);
    return () => {
      try { document.head.removeChild(link); document.head.removeChild(style); } catch(e){}
    };
  }, []);
  return null;
};

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
  },
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
    choices: ["3", "4", "5", "6"] ["256"],
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
  const IconComponent = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info;
  const iconColor = type === 'success' ? '#7ec87e' : type === 'error' ? '#e07e7e' : '#c9a454';
  return (
    <div className={`p-notif ${type || 'info'}`}>
      <IconComponent size={20} style={{ color: iconColor, flexShrink: 0 }} />
      <p style={{ fontSize: '0.88rem', color: 'var(--cream-2)', flex: 1 }}>{message}</p>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream-3)', padding: '2px' }}>
        <XCircle size={16} />
      </button>
    </div>
  );
};

// --- Reusable UI Components ---

// Card component for navigation and feature display on the dashboard.
const Card = ({ icon: Icon, title, description, onClick }) => (
  <button onClick={onClick} className="p-card" style={{ width: '100%', background: 'none' }}>
    <div className="p-card-icon">
      {Icon && <Icon size={24} strokeWidth={1.5} />}
    </div>
    <div className="p-card-title">{title}</div>
    <div className="p-card-desc">{description}</div>
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
    <div className="p-reciter-card">
      <img
        src={reciter.imageUrl}
        alt={reciter.englishName}
        className="p-reciter-img"
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/1b2236/c9a454?text=R"; }}
      />
      <p className="font-arabic" style={{ fontSize: '1.1rem', color: 'var(--cream)', marginBottom: '4px' }}>{reciter.name}</p>
      <p style={{ fontSize: '0.78rem', color: 'var(--cream-3)', marginBottom: '14px', letterSpacing: '0.03em' }}>{reciter.englishName}</p>
      <button onClick={handleAction} className={isUnlocked ? 'p-btn-gold' : 'p-btn-ghost'} style={{ fontSize: '0.75rem' }}>
        {isUnlocked ? (<><Play size={14} fill="currentColor" /> Listen</>) : (<><Gem size={14} /> {reciter.cost} pts</>)}
      </button>
      {!isUnlocked && <span className="p-locked-badge">Locked</span>}
    </div>
  );
};

// ProgressCard component to display individual user progress metrics.
const ProgressCard = ({ title, value, unit, icon: Icon, progressBar, progressPercent, milestoneText }) => (
  <div className="p-reciter-card" style={{ padding: '26px 20px' }}>
    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(201,164,84,0.12), rgba(201,164,84,0.04))', border: '1px solid rgba(201,164,84,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: 'var(--gold)' }}>
      {Icon && <Icon size={22} strokeWidth={1.5} />}
    </div>
    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'var(--cream-2)', marginBottom: '8px', letterSpacing: '0.04em' }}>{title}</p>
    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 500, color: 'var(--gold-l)', lineHeight: 1 }}>{value}</p>
    <p style={{ fontSize: '0.72rem', color: 'var(--cream-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>{unit}</p>
    {progressBar && (
      <div style={{ width: '100%', marginTop: '14px' }}>
        <div className="p-progress-bar">
          <div className="p-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--cream-4)', marginTop: '6px' }}>{milestoneText}</p>
      </div>
    )}
  </div>
);

// AchievementsCard component to display unlocked and pending achievements.
const AchievementsCard = ({ achievements }) => (
  <div className="p-reciter-card" style={{ alignItems: 'stretch', padding: '22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
      <Award size={18} style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'var(--cream)', letterSpacing: '0.05em' }}>Achievements</span>
    </div>
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {achievements.map((achievement) => (
        <li key={achievement.id} className={`p-achievement ${achievement.achieved ? 'achieved' : 'locked'}`}>
          <span style={{ color: achievement.achieved ? 'var(--gold)' : 'var(--cream-4)', flexShrink: 0 }}>{achievement.icon}</span>
          <div>
            <p style={{ fontSize: '0.85rem', color: achievement.achieved ? 'var(--cream)' : 'var(--cream-3)', fontWeight: 500 }}>{achievement.title}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--cream-4)' }}>{achievement.description}</p>
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Navigation cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        <Card icon={BookOpen} title="Read" description="Browse surahs" onClick={() => setCurrentView('surah-selector')} />
        <Card icon={Headphones} title="Listen" description="Beautiful recitations" onClick={() => setCurrentView('listen')} />
        <Card icon={Mic} title="Practice" description="Record & improve" onClick={() => setCurrentView('practice')} />
        <Card icon={Clock} title="Prayer Times" description="Hanafi calculations" onClick={() => setCurrentView('prayer-times')} />
      </div>

      {/* Verse of the Day */}
      <div className="p-votd">
        <span className="p-votd-ornament">✦ &nbsp; ✦ &nbsp; ✦</span>
        <div className="p-votd-label">Verse of the Day</div>
        <div className="p-votd-arabic">{verseOfTheDay.arabic}</div>
        <div className="p-votd-ref">At-Talaq · 65:2</div>
        <div className="p-votd-trans">"{verseOfTheDay.translation}"</div>
        <button className="p-play-btn" style={{ margin: '0 auto' }}>
          <Play size={24} fill="currentColor" />
        </button>
      </div>

      {/* Reciters */}
      <div className="p-section">
        <div className="p-section-title">
          <Headphones size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          Available Reciters
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
          {[...recitersData.featured, ...recitersData.free].map((reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              points={points}
              isUnlocked={userProgress.unlockedReciters.includes(reciter.id)}
              onUnlock={handleUnlockReciter}
              onSelectReciter={onSelectReciterForListen}
              showNotification={showNotification}
            />
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="p-section">
        <div className="p-section-title">
          <BarChart size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          Your Progress
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <ProgressCard title="Daily Streak" value={userProgress.dailyStreak} unit="Days in a row" icon={Zap} progressBar={false} />
          <ProgressCard title="Verses Read" value={userProgress.versesRead} unit="verses" icon={BookOpen} progressBar={true} progressPercent={(userProgress.versesRead % 100) / 100 * 100} milestoneText={`${100 - (userProgress.versesRead % 100)} to next milestone`} />
          <AchievementsCard achievements={userProgress.achievements} />
        </div>
      </div>

      {/* Continue Reading */}
      {lastReadPosition && (
        <Card icon={ArrowLeft} title="Continue Reading" description={`Resume Surah ${quranData.surahs.find(s => s.id === lastReadPosition.surahId)?.englishName || 'Unknown'} · Verse ${lastReadPosition.verseId}`} onClick={onContinueReading} />
      )}

      {/* Bottom feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        <Card icon={Bookmark} title="Bookmarks" description="Saved verses" onClick={() => setCurrentView('bookmarks')} />
        <Card icon={HelpCircle} title="Quiz" description="Test your knowledge" onClick={() => setCurrentView('quiz')} />
        <Card icon={MessageSquareText} title="Islamic Q&A" description="Ask your questions" onClick={() => setCurrentView('deen-buddy')} />
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
    <div className="p-section animate-fade-in">
      <div className="p-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(201,164,84,0.1)' }}>
        <button onClick={onBackToHome} className="p-btn-ghost"><Home size={14} /> Home</button>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 400, color: 'var(--cream)', letterSpacing: '0.05em', margin: 0 }}>Select a Surah</h2>
        <div style={{ width: '80px' }}></div>
      </div>
      <input
        type="text"
        placeholder="Search by name or number…"
        className="p-input"
        style={{ marginBottom: '20px' }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="custom-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px', maxHeight: '62vh', overflowY: 'auto', padding: '2px', listStyle: 'none', margin: 0 }}>
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <li key={surah.id}>
              <button onClick={() => onSelectSurah(surah.id)} className="p-surah-item">
                <span className="p-surah-num">{surah.id}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--cream)', fontSize: '0.92rem', fontWeight: 500, marginBottom: '2px' }}>{surah.englishName}</p>
                  <p className="font-arabic" style={{ fontSize: '1.1rem', color: 'var(--gold-l)' }}>{surah.name}</p>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--cream-4)', letterSpacing: '0.06em' }}>{surah.numberOfVerses}v</span>
              </button>
            </li>
          ))
        ) : (
          <p className="text-center  col-span-full py-8 text-lg">No surahs found matching your search.</p>
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
    return <div style={{ textAlign: "center", color: "var(--cream-3)", padding: "48px 0", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }} className="animate-pulse">Loading Surah…</div>;
  }

  if (error) {
    return (
        <div className="p-section animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={onBackToSurahList}
                    className="p-btn-ghost"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </button>
                <button
                    onClick={onBackToHome}
                    className="p-btn-ghost"
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
      className="p-section animate-fade-in"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(201,164,84,0.1)', flexWrap: 'wrap' }}>
        <button onClick={onBackToSurahList} className="p-btn-ghost"><ArrowLeft size={14} /> Back</button>
        <button onClick={onBackToHome} className="p-btn-ghost"><Home size={14} /> Home</button>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: 'var(--cream)', flex: 1, textAlign: 'center', margin: 0 }}>
          {selectedSurahMeta?.englishName} <span className="font-arabic" style={{ fontSize: '1.8rem', color: 'var(--gold-l)' }}>{selectedSurahMeta?.name}</span>
        </h2>
        <button onClick={handlePrevSurah} disabled={selectedSurahId === 1} className="p-ctrl-btn"><ChevronLeft size={18} /></button>
        <button onClick={handleNextSurah} disabled={selectedSurahId === quranData.surahs.length} className="p-ctrl-btn"><ChevronRight size={18} /></button>
      </div>

      {/* Font and Script Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '14px 18px', background: 'var(--ink-2)', border: '1px solid rgba(201,164,84,0.1)', borderRadius: '14px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="p-label" style={{ margin: 0 }}>Font</span>
          <select value={selectedFont} onChange={handleFontFamilyChange} className="p-select" style={{ width: 'auto', padding: '6px 12px' }}>
            {fontFamilies.map(font => <option key={font.name} value={font.name}>{font.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="p-label" style={{ margin: 0 }}>Size</span>
          <button onClick={() => handleFontSizeChange('decrease')} className="p-ctrl-btn" style={{ width: '32px', height: '32px' }}>−</button>
          <span style={{ color: 'var(--gold)', fontSize: '0.85rem', minWidth: '24px', textAlign: 'center' }}>{fontSize.replace('text-', '')}</span>
          <button onClick={() => handleFontSizeChange('increase')} className="p-ctrl-btn" style={{ width: '32px', height: '32px' }}>+</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="p-label" style={{ margin: 0 }}>Script</span>
          <button onClick={() => setQuranScriptEdition('quran-uthmani')} className={quranScriptEdition === 'quran-uthmani' ? 'p-btn-gold' : 'p-btn-ghost'} style={{ fontSize: '0.72rem', padding: '6px 14px' }}>Uthmani</button>
          <button onClick={() => setQuranScriptEdition('quran-simple')} className={quranScriptEdition === 'quran-simple' ? 'p-btn-gold' : 'p-btn-ghost'} style={{ fontSize: '0.72rem', padding: '6px 14px' }}>Simple</button>
        </div>
      </div>

      {/* Verses Display */}
      <div className="custom-scrollbar" style={{ maxHeight: '62vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {surahVerses.map((verse) => (
          <div
            key={verse.id}
            className={`p-verse-row${highlightedVerseId === verse.id ? ' playing' : ''}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <p className={`font-arabic ${fontSize} ${fontFamilies.find(f => f.name === selectedFont)?.className || 'font-arabic'}`} style={{ textAlign: 'right', direction: 'rtl', lineHeight: 2, color: 'var(--cream)', flex: 1 }}>
                {verse.arabic} <span style={{ fontSize: '0.75rem', color: 'var(--gold-d)', opacity: 0.9 }}>({verse.id})</span>
              </p>
              <button
                onClick={() => onToggleBookmark(selectedSurahId, verse.id)}
                style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', color: bookmarkedVerses.some(b => b.surahId === selectedSurahId && b.verseId === verse.id) ? 'var(--gold)' : 'var(--cream-4)', padding: '4px', flexShrink: 0, transition: 'color 0.2s' }}
                title="Toggle Bookmark"
              >
                <Bookmark size={18} fill={bookmarkedVerses.some(b => b.surahId === selectedSurahId && b.verseId === verse.id) ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  playVerseAudio(verse.id);
                  onVerseRead(selectedSurahId, verse.id);
                }}
                className="p-btn-gold" style={{ fontSize: '0.72rem', padding: '8px 18px' }}
              >
                <Play size={12} className="mr-2" fill="currentColor" />
                Play
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <div className="p-section animate-fade-in" style={{ display: "flex", flexDirection: "column", minHeight: "75vh" }}>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="p-btn-ghost"
        >
          <Home size={20} className="mr-2" />
          Home
        </button>
        <h2 style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "1.7rem", fontWeight: 400, color: "var(--cream)", margin: 0 }}>Islamic Q&A</h2> {/* Renamed title */}
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div ref={chatContainerRef} className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px", background: "var(--ink-2)", borderRadius: "14px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(201,164,84,0.08)" }}>
        {chatHistory.length === 0 && !isLoadingResponse ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--cream-3)" }}>
            <MessageSquareText size={48} style={{ color: "var(--gold-d)", display: "block", margin: "0 auto 16px" }} />
            <p>Coming Soon Inshallah")</p>
            <p className="text-xs mt-4 text-yellow-300">Disclaimer: This AI aims to provide guidance based on the Hanafi Madhab but is not a substitute for a qualified human scholar. Always consult with knowledgeable individuals for important religious matters.</p>
          </div>
        ) : (
      chatHistory.map((message, index) => (
        <div
          key={index}
          style={{ display: "flex", justifyContent: message.role === "user" ? "flex-end" : "flex-start" }}
        >
          <div
className={message.role === 'user' ? 'p-chat-bubble-user' : 'p-chat-bubble-ai'}
          >
            <p style={{ fontSize: "0.7rem", color: "var(--gold-d)", marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{message.role === 'user' ? 'You' : 'AI Guide'}</p>
            <p style={{ fontSize: "0.88rem" }}>{message.parts[0].text}</p>
          </div>
        </div>
      ))
    )}
    {isLoadingResponse && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div className="p-chat-bubble-ai animate-pulse">
              <p style={{ fontSize: '0.7rem', color: 'var(--gold-d)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Guide</p>
              <p style={{ fontSize: '0.88rem' }}>Thinking…</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-chat-input-row">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your Islamic Q&A..."
          className="p-input" style={{ flex: 1 }}
          disabled={isLoadingResponse}
        />
        <button
          onClick={sendMessage}
          disabled={isLoadingResponse || userInput.trim() === ''}
          className="p-btn-gold" style={{ opacity: (isLoadingResponse || userInput.trim() === '') ? 0.4 : 1 }}
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

    const appId = typeof __app_id !== 'undefined' ? __app_id : (db.app.options.projectId || 'default-app-id');
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br  to-black ">
          <p className="text-2xl mb-4 font-medium">Loading application...</p>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 "></div>
          <p className="mt-4 text-sm ">Authenticating with Firebase...</p>
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
        return (
          <PracticePage
            setCurrentPage={setCurrentView}
            surahs={quranData.surahs}
            juzStartPoints={[]}
            showNotification={showNotification}
            incrementVersesRead={() => setUserProgress(prev => ({ ...prev, versesRead: prev.versesRead + 1 }))}
          />
        );
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
          <div style={{ color: "#e07e7e", textAlign: "center", padding: "32px 0" }}>
            <p className="text-xl">Something went wrong. Unknown view.</p>
            <button onClick={handleBackToHome} className="p-btn-gold">
              Go to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="p-app">
      <PremiumStyles />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 60px' }}>
        <header className="p-header animate-fade-in-down">
          <h1 className="p-logo">Nurul <span>Quran</span></h1>
          <p className="p-tagline">Your Daily Companion for Quranic Reflection</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
            <span className="p-points-badge">
              <Star size={13} style={{ color: 'var(--gold)' }} />
              {userProgress.points} points
            </span>
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
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

// --- Placeholder Components for other pages (Add full functionality later) ---

// ============================================================
// ListenPage — Pick a reciter & surah and stream audio
// ============================================================
const ListenPage = ({ onBackToHome, selectedReciterId, selectedReciterName, selectedReciterEnglishName, selectedReciterAlquranCloudId, showNotification }) => {
  const allReciters = [...recitersData.featured, ...recitersData.free];

  const [activeReciterId, setActiveReciterId]     = useState(selectedReciterId || allReciters[0].id);
  const [selectedSurahId, setSelectedSurahId]     = useState(1);
  const [verses, setVerses]                       = useState([]);
  const [isLoadingVerses, setIsLoadingVerses]     = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isPlaying, setIsPlaying]                 = useState(false);
  const [isLoadingAudio, setIsLoadingAudio]       = useState(false);
  const audioRef = useRef(new Audio());

  const activeReciter = allReciters.find(r => r.id === activeReciterId) || allReciters[0];
  const selectedSurah = quranData.surahs.find(s => s.id === selectedSurahId);

  // Fetch verse texts for selected surah
  useEffect(() => {
    const fetchVerses = async () => {
      setIsLoadingVerses(true);
      setVerses([]);
      setIsPlaying(false);
      setCurrentVerseIndex(0);
      audioRef.current.pause();
      audioRef.current.src = '';
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahId}/quran-uthmani`);
        const data = await res.json();
        if (data.code === 200 && data.data) {
          setVerses(data.data.ayahs.map(a => ({ id: a.numberInSurah, text: a.text })));
        } else {
          showNotification('Could not load surah verses.', 'error');
        }
      } catch {
        showNotification('Network error loading surah.', 'error');
      } finally {
        setIsLoadingVerses(false);
      }
    };
    fetchVerses();
  }, [selectedSurahId]);

  // Cleanup audio on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const playVerse = useCallback(async (verseIndex) => {
    const verse = verses[verseIndex];
    if (!verse) return;
    setIsLoadingAudio(true);
    audioRef.current.pause();
    audioRef.current.src = '';
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${selectedSurahId}:${verse.id}/${activeReciter.alquranCloudId}`
      );
      const data = await res.json();
      if (data.code === 200 && data.data?.audio) {
        audioRef.current.src = data.data.audio;
        audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
        setCurrentVerseIndex(verseIndex);
        audioRef.current.onended = () => {
          const next = verseIndex + 1;
          if (next < verses.length) {
            playVerse(next);
          } else {
            setIsPlaying(false);
            showNotification('Surah complete!', 'success');
          }
        };
      } else {
        showNotification('Audio not available for this verse.', 'error');
        setIsPlaying(false);
      }
    } catch {
      showNotification('Could not load audio. Check your connection.', 'error');
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [verses, selectedSurahId, activeReciter]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.src && audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        playVerse(currentVerseIndex);
      }
    }
  };

  const handlePrev = () => {
    const prev = Math.max(0, currentVerseIndex - 1);
    playVerse(prev);
  };

  const handleNext = () => {
    const next = Math.min(verses.length - 1, currentVerseIndex + 1);
    playVerse(next);
  };

  const handleVerseClick = (idx) => {
    playVerse(idx);
  };

  return (
    <div className="p-section animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid rgba(201,164,84,0.1)' }}>
        <button onClick={onBackToHome} className="p-btn-ghost"><Home size={14} /> Home</button>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 400, color: 'var(--cream)', margin: 0 }}>Listen</h2>
        <div style={{ width: '72px' }}></div>
      </div>

      {/* Reciter picker */}
      <div style={{ marginBottom: '24px' }}>
        <span className="p-label">Choose Reciter</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
          {allReciters.map(r => (
            <button
              key={r.id}
              onClick={() => { setActiveReciterId(r.id); setIsPlaying(false); audioRef.current.pause(); audioRef.current.src = ''; }}
              className={`p-reciter-pick${activeReciterId === r.id ? ' active' : ''}`}
            >
              <img src={r.imageUrl} alt={r.englishName} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(201,164,84,0.3)', marginBottom: '8px', objectFit: 'cover' }} onError={e => { e.target.src = 'https://placehold.co/56x56/1b2236/c9a454?text=R'; }} />
              <p style={{ fontSize: '0.72rem', color: 'var(--cream-2)', lineHeight: 1.3 }}>{r.englishName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Surah picker */}
      <div style={{ marginBottom: '24px' }}>
        <span className="p-label">Choose Surah</span>
        <div className="p-select-wrap">
          <select value={selectedSurahId} onChange={e => setSelectedSurahId(Number(e.target.value))} className="p-select">
            {quranData.surahs.map(s => (
              <option key={s.id} value={s.id}>{s.id}. {s.englishName} — {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Player */}
      <div className="p-player" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--cream)' }}>
            {selectedSurah?.englishName} <span className="font-arabic" style={{ fontSize: '1.5rem', color: 'var(--gold-l)' }}>{selectedSurah?.name}</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--cream-3)', marginTop: '4px', letterSpacing: '0.04em' }}>
            {isLoadingVerses ? 'Loading…' : verses.length > 0 ? `Verse ${(verses[currentVerseIndex]?.id ?? 1)} of ${verses.length} · ${activeReciter.englishName}` : ''}
          </p>
        </div>
        {verses.length > 0 && !isLoadingVerses && (
          <p className="font-arabic" style={{ fontSize: '1.9rem', lineHeight: 2, color: 'var(--cream)', direction: 'rtl', textAlign: 'right', width: '100%', padding: '0 8px' }}>
            {verses[currentVerseIndex]?.text}
          </p>
        )}
        {isLoadingVerses && <p style={{ color: 'var(--cream-3)', fontSize: '0.85rem' }}>Loading surah…</p>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
          <button onClick={handlePrev} disabled={isLoadingAudio || verses.length === 0 || currentVerseIndex === 0} className="p-ctrl-btn">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handlePlayPause} disabled={isLoadingAudio || verses.length === 0 || isLoadingVerses} className="p-play-btn">
            {isLoadingAudio ? (
              <div className="p-spinner" />
            ) : isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" />
            )}
          </button>
          <button onClick={handleNext} disabled={isLoadingAudio || verses.length === 0 || currentVerseIndex === verses.length - 1} className="p-ctrl-btn">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Verse list */}
      {verses.length > 0 && (
        <div>
          <span className="p-label">All Verses — tap to jump</span>
          <ul className="custom-scrollbar" style={{ maxHeight: '280px', overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {verses.map((v, idx) => (
              <li key={v.id}>
                <button
                  onClick={() => handleVerseClick(idx)}
                  className={idx === currentVerseIndex ? 'p-verse-row playing' : 'p-verse-row'}
                  style={{ width: '100%', textAlign: 'right', direction: 'rtl', fontFamily: "'Amiri', serif", fontSize: '1.15rem', lineHeight: 2, cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <span style={{ float: 'left', fontSize: '0.7rem', color: 'var(--gold-d)', fontFamily: "'DM Sans', sans-serif", direction: 'ltr', marginTop: '12px' }}>{v.id}</span>
                  {v.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ============================================================
// PracticePage — Record & play back your Quran recitation
// ============================================================
const PracticePage = ({ setCurrentPage, surahs, showNotification, incrementVersesRead }) => {
  const [selectedSurahId, setSelectedSurahId] = useState(1);
  const [selectedVerseId, setSelectedVerseId] = useState(1);
  const [verseText, setVerseText] = useState('');
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const selectedSurah = surahs.find(s => s.id === selectedSurahId);
  const verseCount = selectedSurah ? selectedSurah.numberOfVerses : 1;

  // Fetch verse text whenever surah or verse changes
  useEffect(() => {
    const fetchVerse = async () => {
      setIsLoadingVerse(true);
      setVerseText('');
      try {
        const res = await fetch(
          `https://api.alquran.cloud/v1/ayah/${selectedSurahId}:${selectedVerseId}/quran-uthmani`
        );
        const data = await res.json();
        if (data.code === 200 && data.data) {
          setVerseText(data.data.text);
        } else {
          showNotification('Could not load verse text.', 'error');
        }
      } catch (err) {
        showNotification('Network error loading verse.', 'error');
      } finally {
        setIsLoadingVerse(false);
      }
    };
    fetchVerse();
  }, [selectedSurahId, selectedVerseId]);

  // Reset recording when verse changes
  useEffect(() => {
    setAudioUrl(null);
    setRecordingTime(0);
  }, [selectedSurahId, selectedVerseId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleSurahChange = (e) => {
    setSelectedSurahId(Number(e.target.value));
    setSelectedVerseId(1);
  };

  const handleVerseChange = (e) => {
    setSelectedVerseId(Number(e.target.value));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
        showNotification('Recording saved! Play it back to check your recitation.', 'success');
        if (incrementVersesRead) incrementVersesRead();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioUrl(null);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      showNotification('Microphone access denied. Please allow microphone access in your browser settings.', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="p-section animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid rgba(201,164,84,0.1)' }}>
        <button onClick={() => setCurrentPage('home')} className="p-btn-ghost"><Home size={14} /> Home</button>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 400, color: 'var(--cream)', margin: 0 }}>Practice Recitation</h2>
        <div style={{ width: '72px' }}></div>
      </div>

      {/* Step 1 — Choose Verse */}
      <div className="mb-6">
        <span className="p-label">Step 1 — Choose a Verse</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="p-label">Surah</label>
            <select
              value={selectedSurahId}
              onChange={handleSurahChange}
              className="p-select"
            >
              {surahs.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.englishName} — {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="p-label">
              Verse ({verseCount} total)
            </label>
            <select
              value={selectedVerseId}
              onChange={handleVerseChange}
              className="p-select"
            >
              {Array.from({ length: verseCount }, (_, i) => i + 1).map(v => (
                <option key={v} value={v}>Verse {v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Step 2 — Read the Verse */}
      <div className="mb-6">
        <span className="p-label">Step 2 — Read the Verse</span>
        <div className="p-player" style={{ minHeight: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isLoadingVerse ? (
            <p style={{ color: "var(--cream-3)", fontFamily: "'Cormorant Garamond', serif" }} className="animate-pulse">Loading verse…</p>
          ) : verseText ? (
            <p className="font-arabic" style={{ fontSize: "2rem", lineHeight: 2, color: "var(--cream)", direction: "rtl", textAlign: "right", width: "100%" }}>
              {verseText}
            </p>
          ) : (
            <p style={{ color: "var(--cream-3)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>Select a verse above to see the text.</p>
          )}
        </div>
        <p style={{ fontSize: "0.72rem", color: "var(--cream-4)", marginTop: "8px", textAlign: "right" }}>
          {selectedSurah?.englishName} ({selectedSurahId}:{selectedVerseId})
        </p>
      </div>

      {/* Step 3 — Record */}
      <div className="mb-6">
        <span className="p-label">Step 3 — Record Your Recitation</span>
        <div className="p-player" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
          {isRecording && (
            <div className="flex items-center gap-3 text-red-400 font-semibold animate-pulse">
              <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
              Recording — {formatTime(recordingTime)}
            </div>
          )}
          <div className="flex items-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isLoadingVerse || !verseText}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-full text-white text-lg font-semibold flex items-center gap-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50 transform hover:scale-105"
              >
                <Mic size={22} />
                {audioUrl ? 'Re-record' : 'Start Recording'}
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-full text-white text-lg font-semibold flex items-center gap-3 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
              >
                <Square size={22} fill="currentColor" />
                Stop Recording
              </button>
            )}
          </div>
          <p className=" text-sm text-center">
            {!verseText
              ? 'Load a verse first before recording.'
              : isRecording
              ? 'Recite the verse above clearly, then press Stop.'
              : 'Press the button and recite the verse. Press Stop when finished.'}
          </p>
        </div>
      </div>

      {/* Step 4 — Playback */}
      {audioUrl && (
        <div>
          <p className=" text-sm font-semibold uppercase tracking-widest mb-3">
            Step 4 — Play Back &amp; Check
          </p>
          <div className="bg-black bg-opacity-20 border  rounded-2xl p-6 flex flex-col items-center gap-3">
            <p className=" text-base text-center">
              Listen to your recording and compare it with the verse above. Re-record as many times as you need!
            </p>
            <audio
              controls
              src={audioUrl}
              className="w-full max-w-md mt-2"
            />
            <p className=" text-xs mt-1">✅ Recording ready — how did it sound?</p>
          </div>
        </div>
      )}

    </div>
  );
};

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
    <div className="p-section animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="p-btn-ghost"
        >
          <Home size={20} className="mr-2" />
          Home
        </button>
        <h2 style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "1.7rem", fontWeight: 400, color: "var(--cream)", margin: 0 }}>Prayer Times</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <p style={{ color: 'var(--cream-2)', marginBottom: '16px', fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}>
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '18px' }}>
          <button onClick={handlePrevDay} className="p-ctrl-btn"><ChevronLeft size={20} /></button>
          <button onClick={handleNextDay} className="p-ctrl-btn"><ChevronRight size={20} /></button>
        </div>
        {prayerTimes && prayerTimes.nextPrayer && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(201,164,84,0.08)', border: '1px solid rgba(201,164,84,0.22)', borderRadius: '100px', padding: '10px 22px' }}>
            <Clock9 size={18} style={{ color: 'var(--gold)' }} />
            <span style={{ color: 'var(--cream)', fontSize: '0.88rem', letterSpacing: '0.03em' }}>Next: <strong>{prayerTimes.nextPrayer.name}</strong> in {prayerTimes.timeToNextPrayer}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {prayerTimes && prayerTimes.times.map((prayer) => (
          <div key={prayer.name} className={`p-prayer-row${prayerTimes.nextPrayer?.name === prayer.name ? ' next-prayer' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--gold)', opacity: 0.8 }}>{prayer.icon}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'var(--cream)' }}>{prayer.name}</span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: prayerTimes.nextPrayer?.name === prayer.name ? 'var(--gold-l)' : 'var(--cream-2)' }}>{format(prayer.time, 'h:mm a')}</span>
          </div>
        ))}
        {!prayerTimes && (
          <p style={{ color: 'var(--cream-3)', textAlign: 'center', padding: '24px 0' }}>Loading prayer times…</p>
        )}
      </div>
    </div>
  );
};

const BookmarksPage = ({ onBackToHome, bookmarkedVerses, onSelectSurah, onToggleBookmark }) => {
  return (
    <div className="p-section animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToHome}
          className="p-btn-ghost"
        >
          <Home size={20} className="mr-2" />
          Home
        </button>
        <h2 style={{ fontFamily: "\'Cormorant Garamond\', serif", fontSize: "1.7rem", fontWeight: 400, color: "var(--cream)", margin: 0 }}>Bookmarked Verses</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {bookmarkedVerses.length === 0 ? (
        <p style={{ color: "var(--cream-3)", textAlign: "center", padding: "32px 0", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic" }}>No bookmarks yet. Start reading to save verses.</p>
      ) : (
        <ul className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
          {bookmarkedVerses.map((bookmark, index) => {
            const surah = quranData.surahs.find(s => s.id === bookmark.surahId);
            return (
              <li key={index} className="p-bookmark-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--cream)", marginBottom: "4px" }}>
                    {surah?.englishName || `Surah ${bookmark.surahId}`} - Verse {bookmark.verseId}
                  </p>
                  {/* Displaying a placeholder as actual Arabic text isn't stored in bookmark object yet */}
                  <p className="font-arabic text-right text-2xl ">{bookmark.arabicText || 'Arabic text placeholder'}</p>
                </div>
                <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => onSelectSurah(bookmark.surahId)}
                    className=" hover: px-4 py-2 rounded-full text-white flex items-center shadow-md transition-colors"
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
    <div className="p-section animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid rgba(201,164,84,0.1)' }}>
        <button onClick={onBackToHome} className="p-btn-ghost"><Home size={14} /> Home</button>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 400, color: 'var(--cream)', margin: 0 }}>Quran Quiz</h2>
        <div style={{ width: '72px' }}></div>
      </div>

      {!quizStarted ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <p style={{ color: 'var(--cream-2)', marginBottom: '28px', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic' }}>Test your knowledge of the Quran</p>
          <div style={{ marginBottom: '28px', maxWidth: '320px', margin: '0 auto 28px' }}>
            <span className="p-label">Select Category</span>
            <div className="p-select-wrap">
              <select id="quiz-category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-select">
                {quizCategories.map(category => (<option key={category} value={category}>{category}</option>))}
              </select>
            </div>
          </div>
          <button onClick={startQuiz} className="p-btn-gold" style={{ fontSize: '0.88rem', padding: '14px 40px' }}>Begin Quiz</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <span className="p-score-badge"><Star size={12} /> Score: {score}</span>
            <span className="p-score-badge"><CircleDot size={12} /> Q {questionCount + 1}</span>
          </div>

          {currentQuestion ? (
            <div style={{ background: 'var(--ink-2)', border: '1px solid rgba(201,164,84,0.12)', borderRadius: '16px', padding: '26px' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: 'var(--cream)', marginBottom: '22px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {currentQuestion.question}
              </p>
              <div>
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(choice)}
                    disabled={selectedAnswer !== null}
                    className={`p-quiz-btn ${selectedAnswer === choice ? (feedback === 'correct' ? 'correct' : 'incorrect') : (selectedAnswer !== null && choice === currentQuestion.correctAnswer ? 'correct' : '')}`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {feedback && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.9rem', color: feedback === 'correct' ? '#9ee09e' : '#e09e9e', marginBottom: '14px' }}>
                    {feedback === 'correct' ? '✦ Correct' : `Incorrect — correct: "${currentQuestion.correctAnswer}"`}
                  </p>
                  <button onClick={handleNextQuestion} className="p-btn-gold">Next Question</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'var(--cream-2)', marginBottom: '20px', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>Quiz complete</p>
              <button onClick={resetQuiz} className="p-btn-gold">New Quiz</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};