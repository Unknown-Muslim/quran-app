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
        --ink:   #050810;
        --ink-2: #080d1b;
        --ink-3: #0d1427;
        --ink-4: #131d36;
        --ink-5: #1a2644;
        --moon:   #8ba7d4;
        --moon-l: #c2d5ee;
        --moon-d: #4a6a9c;
        --moon-dim: rgba(139,167,212,0.16);
        --cream:   #e8edf5;
        --cream-2: #bbc8e0;
        --cream-3: #7a8fad;
        --cream-4: #3d5070;
      }
      * { box-sizing: border-box; }
      body { background: var(--ink) !important; margin:0; }

      .p-app {
        min-height: 100vh;
        background: var(--ink);
        background-image:
          radial-gradient(ellipse 70% 50% at 20% -5%, rgba(60,100,180,0.09) 0%, transparent 60%),
          radial-gradient(ellipse 55% 40% at 80% 105%, rgba(80,120,200,0.06) 0%, transparent 55%);
        font-family: 'DM Sans', sans-serif;
        color: var(--cream);
      }

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
      .p-logo span { color: var(--moon-l); }
      .p-tagline {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: 1rem;
        letter-spacing: 0.08em;
        color: var(--moon);
        margin-bottom: 20px;
      }
      .p-points-badge {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 8px 22px;
        background: var(--ink-3);
        border: 1px solid var(--moon-dim);
        border-radius: 100px;
        font-size: 0.82rem; letter-spacing: 0.06em;
        color: var(--moon-l);
        margin-top: 8px;
      }

      /* ── Nav Cards ── */
      .p-card {
        background: linear-gradient(145deg, var(--ink-3), var(--ink-2));
        border: 1px solid var(--moon-dim);
        border-radius: 20px;
        padding: 28px 20px;
        display: flex; flex-direction: column;
        align-items: center; text-align: center;
        cursor: pointer;
        transition: transform 0.32s cubic-bezier(.4,0,.2,1), border-color 0.25s, box-shadow 0.32s;
        position: relative; overflow: hidden;
      }
      .p-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(139,167,212,0.3), transparent);
      }
      .p-card:hover {
        transform: translateY(-5px);
        border-color: rgba(139,167,212,0.4);
        box-shadow: 0 28px 60px rgba(0,0,0,0.55), 0 0 25px rgba(100,140,220,0.08);
      }
      .p-card-icon {
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(135deg, rgba(139,167,212,0.14), rgba(139,167,212,0.04));
        border: 1px solid rgba(139,167,212,0.22);
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 14px; color: var(--moon);
        transition: border-color 0.25s;
      }
      .p-card:hover .p-card-icon { border-color: rgba(139,167,212,0.5); }
      .p-card-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.2rem; font-weight: 500;
        color: var(--cream); letter-spacing: 0.04em; margin-bottom: 5px;
      }
      .p-card-desc { font-size: 0.76rem; color: var(--cream-3); letter-spacing: 0.03em; }

      /* ── Section ── */
      .p-section {
        background: linear-gradient(160deg, var(--ink-3), var(--ink-2));
        border: 1px solid var(--moon-dim);
        border-radius: 24px; padding: 28px; margin-bottom: 28px;
        position: relative; overflow: hidden;
      }
      .p-section::before {
        content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(139,167,212,0.26), transparent);
      }
      .p-section-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.5rem; font-weight: 400;
        color: var(--cream); letter-spacing: 0.05em;
        margin: 0 0 22px;
        display: flex; align-items: center; gap: 12px;
      }
      .p-section-title::after {
        content: ''; flex: 1; height: 1px;
        background: linear-gradient(90deg, rgba(139,167,212,0.2), transparent);
      }

      /* ── Verse of the Day ── */
      .p-votd {
        background: linear-gradient(150deg, var(--ink-3), var(--ink-2) 60%, rgba(80,120,200,0.05) 100%);
        border: 1px solid rgba(139,167,212,0.2);
        border-radius: 24px; padding: 44px 36px;
        text-align: center; position: relative; overflow: hidden; margin-bottom: 28px;
      }
      .p-votd::before, .p-votd::after {
        content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(139,167,212,0.35), transparent);
      }
      .p-votd::after {
        top: auto; bottom: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(139,167,212,0.12), transparent);
      }
      .p-votd-ornament { font-size: 0.6rem; letter-spacing: 0.8em; color: var(--moon-d); margin-bottom: 16px; display: block; }
      .p-votd-label {
        font-family: 'Cormorant Garamond', serif; font-style: italic;
        font-size: 0.82rem; letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--moon); margin-bottom: 22px;
      }
      .p-votd-arabic {
        font-family: 'Amiri', serif;
        font-size: clamp(1.9rem, 4vw, 2.8rem);
        line-height: 2.1; color: var(--cream); direction: rtl; margin-bottom: 18px;
        text-shadow: 0 0 30px rgba(100,150,220,0.1);
      }
      .p-votd-ref { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--moon-d); margin-bottom: 14px; }
      .p-votd-trans {
        font-family: 'Cormorant Garamond', serif; font-style: italic;
        font-size: 1.15rem; color: var(--cream-2); line-height: 1.9;
        max-width: 560px; margin: 0 auto 28px;
      }

      /* ── Buttons ── */
      .p-btn-gold {
        background: linear-gradient(135deg, var(--moon-d), var(--moon));
        color: #050810;
        border: none; border-radius: 100px; padding: 11px 28px;
        font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500;
        letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
        transition: box-shadow 0.25s, transform 0.2s;
        display: inline-flex; align-items: center; gap: 7px;
      }
      .p-btn-gold:hover { box-shadow: 0 0 24px rgba(139,167,212,0.45); transform: translateY(-1px); }
      .p-btn-ghost {
        background: transparent; color: var(--cream-2);
        border: 1px solid rgba(139,167,212,0.2); border-radius: 100px; padding: 9px 20px;
        font-family: 'DM Sans', sans-serif; font-size: 0.8rem; letter-spacing: 0.06em;
        cursor: pointer; transition: all 0.22s;
        display: inline-flex; align-items: center; gap: 7px;
      }
      .p-btn-ghost:hover { border-color: var(--moon); color: var(--moon-l); }
      .p-play-btn {
        width: 64px; height: 64px; border-radius: 50%;
        background: linear-gradient(135deg, var(--moon-d), var(--moon));
        border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        color: #050810;
        box-shadow: 0 0 30px rgba(100,150,220,0.25);
        transition: all 0.28s;
      }
      .p-play-btn:hover { transform: scale(1.08); box-shadow: 0 0 42px rgba(100,150,220,0.45); }
      .p-play-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      .p-ctrl-btn {
        width: 44px; height: 44px; border-radius: 50%;
        background: var(--ink-3); border: 1px solid var(--moon-dim);
        color: var(--cream-2); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
      }
      .p-ctrl-btn:hover { border-color: rgba(139,167,212,0.4); color: var(--moon-l); }
      .p-ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }

      /* ── Input / Select ── */
      .p-input, .p-select {
        background: var(--ink-2); border: 1px solid var(--moon-dim);
        border-radius: 12px; padding: 13px 18px; color: var(--cream);
        font-family: 'DM Sans', sans-serif; font-size: 0.9rem; width: 100%;
        outline: none; transition: border-color 0.2s, box-shadow 0.2s; appearance: none;
      }
      .p-input::placeholder { color: var(--cream-4); }
      .p-input:focus, .p-select:focus {
        border-color: rgba(139,167,212,0.48);
        box-shadow: 0 0 0 3px rgba(100,150,220,0.07);
      }
      .p-select option { background: var(--ink-2); color: var(--cream); }
      .p-select-wrap { position: relative; }
      .p-select-wrap::after {
        content: '›'; position: absolute; right: 14px; top: 50%;
        transform: translateY(-50%) rotate(90deg);
        color: var(--moon-d); pointer-events: none; font-size: 1.1rem;
      }

      /* ── Surah list ── */
      .p-surah-item {
        background: var(--ink-2); border: 1px solid rgba(139,167,212,0.07);
        border-radius: 12px; padding: 14px 18px;
        display: flex; align-items: center; gap: 14px;
        cursor: pointer; transition: all 0.2s;
        width: 100%; text-align: left; margin-bottom: 6px;
      }
      .p-surah-item:hover { background: var(--ink-3); border-color: rgba(139,167,212,0.28); transform: translateX(3px); }
      .p-surah-num {
        min-width: 34px; height: 34px; border: 1px solid rgba(139,167,212,0.25);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-size: 0.72rem; color: var(--moon);
      }

      /* ── Reciter Card ── */
      .p-reciter-card {
        background: var(--ink-2); border: 1px solid rgba(139,167,212,0.09);
        border-radius: 16px; padding: 22px 16px;
        display: flex; flex-direction: column; align-items: center; text-align: center;
        transition: all 0.3s; position: relative;
      }
      .p-reciter-card:hover { border-color: rgba(139,167,212,0.3); transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.45); }
      .p-reciter-img { width: 70px; height: 70px; border-radius: 50%; border: 2px solid rgba(139,167,212,0.3); margin-bottom: 12px; object-fit: cover; }
      .p-locked-badge {
        position: absolute; top: 10px; right: 10px;
        font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
        padding: 3px 10px;
        background: rgba(139,167,212,0.1); border: 1px solid rgba(139,167,212,0.2);
        border-radius: 100px; color: var(--moon);
      }

      /* ── Progress ── */
      .p-progress-bar { height: 3px; background: var(--ink-4); border-radius: 100px; overflow: hidden; margin: 10px 0 6px; }
      .p-progress-fill { height: 100%; background: linear-gradient(90deg, var(--moon-d), var(--moon)); border-radius: 100px; transition: width 0.7s ease-out; }

      /* ── Achievement ── */
      .p-achievement { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; margin-bottom: 8px; border: 1px solid transparent; transition: all 0.2s; }
      .p-achievement.achieved { background: rgba(139,167,212,0.07); border-color: rgba(139,167,212,0.18); }
      .p-achievement.locked { background: var(--ink-2); border-color: rgba(255,255,255,0.04); opacity: 0.55; }

      /* ── Verse row ── */
      .p-verse-row { border-left: 2px solid rgba(139,167,212,0.1); padding: 18px 22px; margin-bottom: 6px; border-radius: 0 12px 12px 0; cursor: pointer; transition: all 0.2s; }
      .p-verse-row:hover { background: rgba(139,167,212,0.04); border-left-color: rgba(139,167,212,0.38); }
      .p-verse-row.playing { background: rgba(100,150,220,0.08) !important; border-left-color: var(--moon) !important; box-shadow: 0 0 20px rgba(100,150,220,0.06); }

      /* ── Notification ── */
      .p-notif {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: var(--ink-3); border: 1px solid rgba(139,167,212,0.22);
        border-radius: 14px; padding: 14px 22px;
        display: flex; align-items: center; gap: 12px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.55); z-index: 9999;
        min-width: 280px; animation: fadeInUp 0.35s ease;
      }
      .p-notif.success { border-color: rgba(80,180,120,0.3); }
      .p-notif.error   { border-color: rgba(200,80,80,0.32); }

      /* ── Player ── */
      .p-player { background: var(--ink-2); border: 1px solid rgba(139,167,212,0.15); border-radius: 20px; padding: 26px; margin-bottom: 20px; }

      /* ── Quiz ── */
      .p-quiz-btn {
        background: var(--ink-2); border: 1px solid rgba(139,167,212,0.09);
        border-radius: 12px; padding: 15px 20px; width: 100%;
        text-align: left; color: var(--cream);
        font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
        cursor: pointer; transition: all 0.2s; margin-bottom: 8px; display: block;
      }
      .p-quiz-btn:hover:not(:disabled) { background: var(--ink-3); border-color: rgba(139,167,212,0.3); }
      .p-quiz-btn.correct  { background: rgba(70,160,110,0.12); border-color: rgba(70,160,110,0.4); color: #8eddb2; }
      .p-quiz-btn.incorrect{ background: rgba(200,60,60,0.1);  border-color: rgba(200,60,60,0.32); color: #e09e9e; }
      .p-quiz-btn:disabled { opacity: 0.75; cursor: not-allowed; }

      /* ── Prayer row ── */
      .p-prayer-row { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-radius: 16px; margin-bottom: 8px; background: linear-gradient(135deg, var(--ink-3), var(--ink-2)); border: 1px solid rgba(139,167,212,0.07); transition: all 0.25s; position: relative; overflow: hidden; }
      .p-prayer-row::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(139,167,212,0.1), transparent); }
      .p-prayer-row.next-prayer { background: linear-gradient(135deg, rgba(74,106,156,0.22), rgba(100,140,220,0.12)); border-color: rgba(139,167,212,0.38); box-shadow: 0 8px 32px rgba(100,140,220,0.1), inset 0 0 30px rgba(100,140,220,0.04); }
      .p-prayer-row.next-prayer::before { background: linear-gradient(90deg, transparent, rgba(139,167,212,0.4), transparent); }
      .p-prayer-row.passed { opacity: 0.45; }
      .p-prayer-countdown-hero { background: linear-gradient(160deg, rgba(74,106,156,0.18), rgba(20,40,90,0.4)); border: 1px solid rgba(139,167,212,0.28); border-radius: 24px; padding: 36px 28px; text-align: center; margin-bottom: 24px; position: relative; overflow: hidden; }
      .p-prayer-countdown-hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(139,167,212,0.5), transparent); }
      .p-hijri-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; background: rgba(139,167,212,0.08); border: 1px solid rgba(139,167,212,0.18); border-radius: 100px; font-size: 0.75rem; letter-spacing: 0.1em; color: var(--moon); margin-bottom: 20px; font-family: 'DM Sans', sans-serif; }

      /* ── Misc ── */
      .gold-line { height: 1px; margin: 24px 0; background: linear-gradient(90deg, transparent, rgba(139,167,212,0.24), transparent); }
      .p-label { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--moon-d); margin-bottom: 10px; display: block; }
      .font-arabic { font-family: 'Amiri', serif; }
      .p-score-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(139,167,212,0.09); border: 1px solid rgba(139,167,212,0.2); border-radius: 100px; padding: 6px 16px; font-size: 0.85rem; color: var(--moon-l); }

      /* ── Reciter pick ── */
      .p-reciter-pick { background: var(--ink-2); border: 1px solid rgba(139,167,212,0.09); border-radius: 14px; padding: 14px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.2s; text-align: center; }
      .p-reciter-pick.active { border-color: rgba(139,167,212,0.48); background: rgba(100,140,220,0.07); }
      .p-reciter-pick:hover { border-color: rgba(139,167,212,0.28); }

      /* ── Scrollbar ── */
      .custom-scrollbar::-webkit-scrollbar { width: 3px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: var(--ink-2); }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--moon-d); border-radius: 4px; }

      /* ── Animations ── */
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
      @keyframes fadeInDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in-down { animation: fadeInDown 0.6s ease forwards; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in-up { animation: fadeInUp 0.4s ease forwards; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .p-spinner { width: 22px; height: 22px; border: 2px solid rgba(139,167,212,0.2); border-top-color: var(--moon); border-radius: 50%; animation: spin 0.7s linear infinite; }

      /* ── Chat bubbles ── */
      .p-chat-bubble-user { background: rgba(100,140,220,0.1); border: 1px solid rgba(139,167,212,0.18); border-radius: 18px 18px 4px 18px; padding: 12px 18px; max-width: 78%; margin-left: auto; font-size: 0.88rem; color: var(--cream-2); line-height: 1.6; }
      .p-chat-bubble-ai { background: var(--ink-2); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px 18px 18px 18px; padding: 14px 18px; max-width: 88%; font-size: 0.88rem; color: var(--cream); line-height: 1.7; }
      .p-chat-input-row { display: flex; gap: 10px; align-items: center; padding-top: 14px; border-top: 1px solid rgba(139,167,212,0.09); margin-top: 16px; }

      /* ── Bookmarks ── */
      .p-bookmark-row { background: var(--ink-2); border: 1px solid rgba(139,167,212,0.08); border-radius: 14px; padding: 18px 20px; margin-bottom: 10px; transition: all 0.2s; }
      .p-bookmark-row:hover { border-color: rgba(139,167,212,0.26); background: var(--ink-3); }
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
};

// Reciter data, all set to unlocked for simplicity as per previous request.

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD A NEW RECITER — step by step
//
// 1. Find the reciter's audio edition identifier:
//    • Islamic Network CDN: visit https://api.alquran.cloud/v1/edition?format=audio&language=ar
//      and copy the "identifier" field  (e.g. "ar.alafasy")
//    • audioSource options: 'islamicnetwork' (CDN, instant) or 'api' (alquran.cloud, per-verse fetch)
//      audioSource: 'islamicnetwork',  // use 'api' if the reciter isn't on the CDN
//      alquranCloudId: 'ar.alafasy',   // used for verse-text fetching (can be same)
//    }
//
// 3. Done — getVerseAudioUrl() builds the correct CDN URL automatically.
// ─────────────────────────────────────────────────────────────────────────────
const recitersData = [
  // ── cdn.islamic.network reciters ──────────────────────────────────────────
  // URL pattern: https://cdn.islamic.network/quran/audio/128/{audioEdition}/{globalAyah}.mp3
  {
    id: 'alafasy',
    name: 'مشاري راشد العفاسي',
    englishName: 'Mishary Al-Afasy',
    style: 'Murattal',
    imageUrl: 'https://placehold.co/80x80/0d1427/c2d5ee?text=MA',
    audioEdition: 'ar.alafasy',
    audioSource: 'islamicnetwork',
    alquranCloudId: 'ar.alafasy',
  },
  {
    id: 'husary',
    name: 'محمود خليل الحصري',
    englishName: 'Mahmoud Khalil Al-Hussary',
    style: 'Murattal',
    imageUrl: 'https://placehold.co/80x80/0d1427/c2d5ee?text=MH',
    audioEdition: 'ar.husary',
    audioSource: 'islamicnetwork',
    alquranCloudId: 'ar.husary',
  },
  {
    id: 'minshawi',
    name: 'محمد صديق المنشاوي',
    englishName: 'Mohamed Al-Minshawi',
    style: 'Murattal',
    imageUrl: 'https://placehold.co/80x80/0d1427/c2d5ee?text=MM',
    audioEdition: 'ar.minshawi',
    audioSource: 'islamicnetwork',
    alquranCloudId: 'ar.minshawi',
  },
  {
    id: 'shaatree',
    name: 'أبو بكر الشاطري',
    englishName: 'Abu Bakr Al-Shaatree',
    style: 'Murattal',
    imageUrl: 'https://placehold.co/80x80/0d1427/c2d5ee?text=AS',
    audioEdition: 'ar.shaatree',
    audioSource: 'islamicnetwork',
    alquranCloudId: 'ar.shaatree',
  },
  {
    id: 'mahermuaiqly',
    name: 'ماهر المعيقلي',
    englishName: 'Maher Al-Muaiqly',
    style: 'Murattal',
    imageUrl: 'https://placehold.co/80x80/0d1427/c2d5ee?text=MM',
    audioEdition: 'ar.mahermuaiqly',
    audioSource: 'islamicnetwork',
    alquranCloudId: 'ar.mahermuaiqly',
  },
  // ── api.alquran.cloud reciters (fetches audio URL per verse from API) ─────
  // audioSource: 'api'
  // Used when a reciter isn't on the Islamic Network CDN — the API call
  // returns a guaranteed working audio URL from alquran.cloud's own servers.
  {
    id: 'khalid-hussary',
    name: 'خالد الحصري',
    englishName: 'Al-Hussary (Mujawwad)',
    style: 'Mujawwad',
    imageUrl: 'https://placehold.co/80x80/0d1427/c2d5ee?text=KH',
    audioEdition: 'ar.husarymujawwad',  // confirmed edition on alquran.cloud
    audioSource: 'api',
    alquranCloudId: 'ar.husarymujawwad',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Audio URL helpers — builds a direct CDN link, no API call needed per verse.
//
// Every verse in the Quran has a "global ayah number" from 1 to 6,236.
//   Al-Fatiha 1:1  = global 1
//   Al-Baqarah 2:1 = global 8   (Fatiha has 7 verses, so 7 + 1 = 8)
// CDN servers index their MP3s by this number, so we compute it locally.
// ─────────────────────────────────────────────────────────────────────────────
function getGlobalAyah(surahId, verseId) {
  let total = 0;
  for (let i = 0; i < surahId - 1; i++) total += quranData.surahs[i].numberOfVerses;
  return total + verseId;
}

function getVerseAudioUrl(reciter, surahId, verseId) {
  // cdn.islamic.network — indexed by global ayah number (1–6236)
  // This is the default CDN source; reciters with audioSource === 'api'
  // don't use this function — they fetch the URL from api.alquran.cloud instead.
  const globalAyah = getGlobalAyah(surahId, verseId);
  return `https://cdn.islamic.network/quran/audio/128/${reciter.audioEdition}/${globalAyah}.mp3`;
}
// Note: reciters with audioSource === 'api' are handled separately in playVerse.

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
  // ── General ────────────────────────────────────────────────────────────────
  { id:1, category:"General", question:"How many Surahs are in the Quran?", correctAnswer:"114", choices:["99","110","114","124"] },
  { id:2, category:"General", question:"How many verses (Ayaat) are in the Quran?", correctAnswer:"6,236", choices:["5,000","6,236","6,666","7,777"] },
  { id:3, category:"General", question:"Which is the longest Surah in the Quran?", correctAnswer:"Al-Baqarah", choices:["Al-Baqarah","An-Nisa","Al-Imran","At-Tawbah"] },
  { id:4, category:"General", question:"Which is the shortest Surah in the Quran?", correctAnswer:"Al-Kawthar", choices:["Al-Ikhlas","An-Nas","Al-Kawthar","Al-Asr"] },
  { id:5, category:"General", question:"Which Surah is known as 'The Opening'?", correctAnswer:"Al-Fatiha", choices:["Al-Fatiha","Al-Baqarah","An-Nas","Al-Ikhlas"] },
  { id:6, category:"General", question:"Which angel delivered the revelation to the Prophet ﷺ?", correctAnswer:"Jibreel (Gabriel)", choices:["Jibreel (Gabriel)","Mikail","Israfil","Azrael"] },
  { id:7, category:"General", question:"In how many years was the Quran revealed?", correctAnswer:"23 years", choices:["10 years","15 years","23 years","30 years"] },
  { id:8, category:"General", question:"Which Surah does NOT begin with Bismillah?", correctAnswer:"At-Tawbah", choices:["At-Tawbah","Al-Kahf","Al-Anfal","Al-Hajj"] },
  { id:9, category:"General", question:"How many Makki Surahs are there?", correctAnswer:"86", choices:["60","86","90","98"] },
  { id:10, category:"General", question:"Which Surah is called the heart of the Quran?", correctAnswer:"Ya-Sin", choices:["Al-Fatiha","Ya-Sin","Al-Kahf","Al-Baqarah"] },
  { id:11, category:"General", question:"In how many parts (Juz) is the Quran divided?", correctAnswer:"30", choices:["20","25","30","40"] },
  { id:12, category:"General", question:"Which Surah contains Ayat al-Kursi?", correctAnswer:"Al-Baqarah", choices:["Al-Imran","Al-Baqarah","An-Nisa","Al-Maidah"] },
  { id:13, category:"General", question:"What is Ayat al-Kursi? (its verse number in Al-Baqarah)", correctAnswer:"Verse 255", choices:["Verse 100","Verse 186","Verse 255","Verse 286"] },
  { id:14, category:"General", question:"Which Surah has a prostration (Sajda) in its last verse?", correctAnswer:"Al-Alaq", choices:["Al-Alaq","Al-Fajr","At-Tariq","Al-Qadr"] },
  { id:15, category:"General", question:"How many Surahs begin with the letters 'Alif Lam Mim'?", correctAnswer:"6", choices:["3","5","6","8"] },
  { id:16, category:"General", question:"Which is the only Surah named after a woman?", correctAnswer:"Maryam", choices:["Maryam","Hadija","Fatima","Zainab"] },
  { id:17, category:"General", question:"Which Surah is recited in every unit (Rak'ah) of prayer?", correctAnswer:"Al-Fatiha", choices:["Al-Ikhlas","Al-Fatiha","Al-Baqarah","Al-Kawthar"] },
  { id:18, category:"General", question:"What does 'Quran' literally mean?", correctAnswer:"That which is read/recited", choices:["The Book","The Light","That which is read/recited","The Message"] },
  { id:19, category:"General", question:"Which Surah contains the story of Dhul-Qarnayn?", correctAnswer:"Al-Kahf", choices:["Al-Anbiya","Al-Kahf","Al-Isra","Ta-Ha"] },
  { id:20, category:"General", question:"How many times is the word 'Allah' mentioned in the Quran?", correctAnswer:"2,699", choices:["999","1,500","2,699","5,000"] },

  // ── Prophets ───────────────────────────────────────────────────────────────
  { id:21, category:"Prophets", question:"Which prophet is mentioned most in the Quran?", correctAnswer:"Musa (Moses)", choices:["Ibrahim (Abraham)","Isa (Jesus)","Musa (Moses)","Muhammad ﷺ"] },
  { id:22, category:"Prophets", question:"Which Surah is entirely dedicated to the story of Yusuf (Joseph)?", correctAnswer:"Surah Yusuf (12)", choices:["Surah Yusuf (12)","Surah Ibrahim (14)","Surah Maryam (19)","Surah Yunus (10)"] },
  { id:23, category:"Prophets", question:"How many prophets are mentioned by name in the Quran?", correctAnswer:"25", choices:["10","18","25","40"] },
  { id:24, category:"Prophets", question:"Which prophet was swallowed by a whale?", correctAnswer:"Yunus (Jonah)", choices:["Musa (Moses)","Yunus (Jonah)","Ayyub (Job)","Idris (Enoch)"] },
  { id:25, category:"Prophets", question:"Which prophet built the Kaaba with his son?", correctAnswer:"Ibrahim (Abraham)", choices:["Adam","Nuh (Noah)","Ibrahim (Abraham)","Ismail (Ishmael)"] },
  { id:26, category:"Prophets", question:"Which prophet was given the ability to speak to animals and birds?", correctAnswer:"Sulayman (Solomon)", choices:["Dawud (David)","Sulayman (Solomon)","Idris","Ilyas"] },
  { id:27, category:"Prophets", question:"Which prophet built the Ark?", correctAnswer:"Nuh (Noah)", choices:["Ibrahim (Abraham)","Nuh (Noah)","Hud","Salih"] },
  { id:28, category:"Prophets", question:"Which prophet was born without a father?", correctAnswer:"Isa (Jesus)", choices:["Yahya (John)","Isa (Jesus)","Idris","Ismail"] },
  { id:29, category:"Prophets", question:"Which prophet was thrown into fire and was saved by Allah?", correctAnswer:"Ibrahim (Abraham)", choices:["Musa (Moses)","Ibrahim (Abraham)","Ismail","Yunus"] },
  { id:30, category:"Prophets", question:"Which prophet was known for his extreme patience and was afflicted with illness?", correctAnswer:"Ayyub (Job)", choices:["Ayyub (Job)","Musa (Moses)","Hud","Shuaib"] },
  { id:31, category:"Prophets", question:"Which prophet received the Zabur (Psalms)?", correctAnswer:"Dawud (David)", choices:["Sulayman (Solomon)","Dawud (David)","Ibrahim (Abraham)","Musa (Moses)"] },
  { id:32, category:"Prophets", question:"Which prophet received the Injeel (Gospel)?", correctAnswer:"Isa (Jesus)", choices:["Yahya (John)","Isa (Jesus)","Musa (Moses)","Ibrahim (Abraham)"] },
  { id:33, category:"Prophets", question:"Which prophet received the Torah?", correctAnswer:"Musa (Moses)", choices:["Ibrahim (Abraham)","Dawud (David)","Musa (Moses)","Harun (Aaron)"] },
  { id:34, category:"Prophets", question:"In which Surah is the story of prophet Hud mentioned?", correctAnswer:"Surah Hud (11)", choices:["Surah Hud (11)","Surah Al-Araf (7)","Surah Yunus (10)","Surah Nuh (71)"] },
  { id:35, category:"Prophets", question:"Which prophet was known as 'Khalilullah' (Friend of Allah)?", correctAnswer:"Ibrahim (Abraham)", choices:["Musa (Moses)","Ibrahim (Abraham)","Muhammad ﷺ","Sulayman (Solomon)"] },
  { id:36, category:"Prophets", question:"Which prophet is known as 'Kalimullah' (One who spoke to Allah)?", correctAnswer:"Musa (Moses)", choices:["Musa (Moses)","Ibrahim (Abraham)","Isa (Jesus)","Adam"] },
  { id:37, category:"Prophets", question:"Which prophet was raised to the heavens without dying?", correctAnswer:"Idris (Enoch)", choices:["Isa (Jesus)","Idris (Enoch)","Ibrahim (Abraham)","Ilyas (Elijah)"] },
  { id:38, category:"Prophets", question:"What miracle was given to Prophet Musa ﷺ?", correctAnswer:"His staff turning into a snake", choices:["Splitting the sea only","Speaking to animals","His staff turning into a snake","Flying to the heavens"] },
  { id:39, category:"Prophets", question:"Which prophet is mentioned in both the Quran and the Bible as a carpenter?", correctAnswer:"None — the Quran does not describe Isa as a carpenter", choices:["None — the Quran does not describe Isa as a carpenter","Zakariyya","Yusuf (Joseph)","Isa (Jesus)"] },
  { id:40, category:"Prophets", question:"Which prophet had the ability to make iron soft with his hands?", correctAnswer:"Dawud (David)", choices:["Sulayman (Solomon)","Dawud (David)","Ibrahim (Abraham)","Idris"] },

  // ── Short Surahs ───────────────────────────────────────────────────────────
  { id:41, category:"Short Surahs", question:"What is the meaning of 'Al-Ikhlas'?", correctAnswer:"Sincerity / Purity of Faith", choices:["Sincerity / Purity of Faith","The Elephant","The Pen","The Dawn"] },
  { id:42, category:"Short Surahs", question:"How many verses does Surah Al-Ikhlas have?", correctAnswer:"4", choices:["3","4","5","6"] },
  { id:43, category:"Short Surahs", question:"Which Surah declares that Allah is As-Samad (The Eternal Refuge)?", correctAnswer:"Al-Ikhlas", choices:["Al-Ikhlas","Al-Falaq","An-Nas","Al-Kawthar"] },
  { id:44, category:"Short Surahs", question:"How many verses does Surah Al-Fatiha have?", correctAnswer:"7", choices:["5","6","7","8"] },
  { id:45, category:"Short Surahs", question:"What is the meaning of 'Al-Kawthar'?", correctAnswer:"Abundance / The River in Paradise", choices:["The Elephant","Abundance / The River in Paradise","The Morning","The Night"] },
  { id:46, category:"Short Surahs", question:"Which Surah mentions the 'People of the Elephant'?", correctAnswer:"Al-Fil", choices:["Al-Fil","Al-Humazah","At-Takathur","Al-Qadr"] },
  { id:47, category:"Short Surahs", question:"What is the meaning of 'Al-Asr'?", correctAnswer:"The Time / The Afternoon", choices:["The Time / The Afternoon","The Morning","The Night","The Star"] },
  { id:48, category:"Short Surahs", question:"Which Surah is known as a third of the Quran in reward?", correctAnswer:"Al-Ikhlas", choices:["Al-Fatiha","Al-Ikhlas","Al-Baqarah","Al-Kawthar"] },
  { id:49, category:"Short Surahs", question:"Which two Surahs are known as Al-Mu'awwidhatayn (The Two Protections)?", correctAnswer:"Al-Falaq and An-Nas", choices:["Al-Ikhlas and Al-Fatiha","Al-Falaq and An-Nas","Al-Fil and Quraish","Al-Kawthar and Al-Asr"] },
  { id:50, category:"Short Surahs", question:"Surah An-Nas asks for refuge from the evil of whom?", correctAnswer:"The whispering retreater (shaitan)", choices:["Humans","Jinns only","The whispering retreater (shaitan)","Evil eye"] },
  { id:51, category:"Short Surahs", question:"What does 'Al-Falaq' mean?", correctAnswer:"The Daybreak / The Dawn", choices:["The Daybreak / The Dawn","The Mankind","The Jinn","The Night"] },
  { id:52, category:"Short Surahs", question:"How many verses does Surah Al-Kawthar have?", correctAnswer:"3", choices:["3","4","5","6"] },
  { id:53, category:"Short Surahs", question:"Which Surah says 'Truly with hardship comes ease'?", correctAnswer:"Ash-Sharh (Al-Inshirah)", choices:["Ad-Duhaa","Ash-Sharh (Al-Inshirah)","Al-Alaq","Al-Qadr"] },
  { id:54, category:"Short Surahs", question:"In Surah Al-Asr, how many types of people are described as successful?", correctAnswer:"Those with faith, good deeds, truth, and patience", choices:["Only those who pray","Only the rich","Those with faith, good deeds, truth, and patience","Only the scholars"] },
  { id:55, category:"Short Surahs", question:"Which Surah begins with 'Have you not seen what your Lord did to the companions of the elephant?'", correctAnswer:"Al-Fil", choices:["Al-Humazah","Al-Fil","Quraish","Al-Maun"] },

  // ── Stories ────────────────────────────────────────────────────────────────
  { id:56, category:"Stories", question:"Which Surah tells the story of the Companions of the Cave (Ashaab al-Kahf)?", correctAnswer:"Al-Kahf", choices:["Al-Kahf","Al-Anbiya","Al-Isra","Al-Qasas"] },
  { id:57, category:"Stories", question:"What did the Companions of the Cave flee from?", correctAnswer:"A tyrant king who forced idol worship", choices:["A flood","A tyrant king who forced idol worship","A plague","An invading army"] },
  { id:58, category:"Stories", question:"Who was the Queen of Sheba (Bilqis) in the Quran?", correctAnswer:"A queen who visited Sulayman", choices:["A prophetess","A queen who visited Sulayman","Maryam's mother","The wife of Pharaoh"] },
  { id:59, category:"Stories", question:"Which Surah tells the story of Luqman the Wise?", correctAnswer:"Surah Luqman (31)", choices:["Surah Luqman (31)","Surah Al-Kahf (18)","Surah Maryam (19)","Surah Ibrahim (14)"] },
  { id:60, category:"Stories", question:"In the story of Musa ﷺ, what was the name of the Pharaoh's wife who raised him?", correctAnswer:"Asiya", choices:["Asiya","Khadijah","Maryam","Zulaikha"] },
  { id:61, category:"Stories", question:"What miracle did Salih's ﷺ people ask for and then betray?", correctAnswer:"A she-camel from a rock", choices:["A well of water","A she-camel from a rock","A tree that produced gold","Rain from the sky"] },
  { id:62, category:"Stories", question:"In Surah Al-Qasas, who did Musa ﷺ accidentally kill?", correctAnswer:"An Egyptian (Coptic man)", choices:["A soldier of Pharaoh","An Egyptian (Coptic man)","A slave","A guard of the palace"] },
  { id:63, category:"Stories", question:"What city did Prophet Lut ﷺ live in?", correctAnswer:"Sodom (Sadum)", choices:["Madyan","Sodom (Sadum)","Babylon","Nineveh"] },
  { id:64, category:"Stories", question:"Which prophet's wife became a pillar of salt?", correctAnswer:"Lut (Lot)", choices:["Nuh (Noah)","Ibrahim (Abraham)","Lut (Lot)","Musa (Moses)"] },
  { id:65, category:"Stories", question:"In Surah Yusuf, how many brothers did Yusuf have?", correctAnswer:"11 brothers (including Binyamin)", choices:["7","9","11 brothers (including Binyamin)","12"] },
  { id:66, category:"Stories", question:"Who interpreted Yusuf's ﷺ dream about the seven fat and seven lean cows?", correctAnswer:"Yusuf ﷺ himself", choices:["The King's minister","Yusuf ﷺ himself","A wise man of Egypt","His father Yaqub"] },
  { id:67, category:"Stories", question:"Which Surah mentions the story of Maryam (Mary) in detail?", correctAnswer:"Maryam (19)", choices:["Maryam (19)","Al-Imran (3)","An-Nisa (4)","Al-Baqarah (2)"] },
  { id:68, category:"Stories", question:"What miracle was Isa ﷺ given that is mentioned in Surah Al-Maidah?", correctAnswer:"Bringing the dead back to life", choices:["Splitting the sea","Walking on water","Bringing the dead back to life","Turning water into milk"] },
  { id:69, category:"Stories", question:"Which surah tells the story of Dhul-Qarnayn and the building of a wall against Yajuj and Majuj?", correctAnswer:"Al-Kahf", choices:["Al-Kahf","Al-Anbiya","Al-Isra","Al-Qasas"] },
  { id:70, category:"Stories", question:"In the story of Nuh ﷺ, what was his people's punishment?", correctAnswer:"A great flood", choices:["A great flood","A fire from the sky","An earthquake","A plague of locusts"] },

  // ── History ────────────────────────────────────────────────────────────────
  { id:71, category:"History", question:"In which cave did the first revelation descend?", correctAnswer:"Cave Hira (Jabal al-Nour)", choices:["Cave Thawr","Cave Hira (Jabal al-Nour)","Cave Uhud","Cave Saur"] },
  { id:72, category:"History", question:"In which month was the Quran first revealed?", correctAnswer:"Ramadan", choices:["Muharram","Rajab","Ramadan","Shawwal"] },
  { id:73, category:"History", question:"Which was the first Surah revealed to the Prophet ﷺ?", correctAnswer:"Al-Alaq (first 5 verses)", choices:["Al-Fatiha","Al-Muddaththir","Al-Alaq (first 5 verses)","Al-Ikhlas"] },
  { id:74, category:"History", question:"Who was the first to compile the Quran into a single book (Mushaf)?", correctAnswer:"Abu Bakr As-Siddiq (ra)", choices:["Uthman ibn Affan (ra)","Umar ibn al-Khattab (ra)","Abu Bakr As-Siddiq (ra)","Ali ibn Abi Talib (ra)"] },
  { id:75, category:"History", question:"Who standardised and distributed the official Mushaf across the Muslim world?", correctAnswer:"Uthman ibn Affan (ra)", choices:["Umar ibn al-Khattab (ra)","Uthman ibn Affan (ra)","Ali ibn Abi Talib (ra)","Zaid ibn Thabit (ra)"] },
  { id:76, category:"History", question:"Which companion was the chief scribe who compiled the Quran under Abu Bakr and Uthman?", correctAnswer:"Zaid ibn Thabit (ra)", choices:["Abdullah ibn Masud (ra)","Ubayy ibn Kab (ra)","Zaid ibn Thabit (ra)","Muawiyah ibn Abi Sufyan (ra)"] },
  { id:77, category:"History", question:"The Quran was revealed over how many years?", correctAnswer:"23 years", choices:["10 years","20 years","23 years","40 years"] },
  { id:78, category:"History", question:"Which Surah was the last to be revealed?", correctAnswer:"Al-Maidah (some scholars say) or An-Nasr", choices:["Al-Kawthar","Al-Ikhlas","Al-Maidah (some scholars say) or An-Nasr","Al-Fatiha"] },
  { id:79, category:"History", question:"In which city was the Quran first revealed?", correctAnswer:"Makkah", choices:["Madinah","Makkah","Jerusalem","Ta'if"] },
  { id:80, category:"History", question:"What is the name of the Night of Power mentioned in the Quran?", correctAnswer:"Laylat al-Qadr", choices:["Laylat al-Miraj","Laylat al-Bara'ah","Laylat al-Qadr","Laylat al-Mawlid"] },
  { id:81, category:"History", question:"Which Surah describes Laylat al-Qadr as better than a thousand months?", correctAnswer:"Al-Qadr (97)", choices:["Al-Qadr (97)","Ad-Dukhan (44)","Al-Baqarah (2)","Al-Isra (17)"] },
  { id:82, category:"History", question:"What event does Surah Al-Fil describe?", correctAnswer:"The Year of the Elephant — Abraha's attack on the Kaaba", choices:["The Battle of Badr","The Hijra to Madinah","The Year of the Elephant — Abraha's attack on the Kaaba","The conquest of Makkah"] },
  { id:83, category:"History", question:"Which Surah was revealed to comfort the Prophet ﷺ when revelation briefly stopped?", correctAnswer:"Ad-Duhaa", choices:["Al-Inshirah","Ad-Duhaa","Al-Alaq","Al-Qadr"] },
  { id:84, category:"History", question:"The Battle of Badr is alluded to in which Surah?", correctAnswer:"Al-Anfal (8)", choices:["Al-Anfal (8)","Al-Imran (3)","At-Tawbah (9)","Al-Baqarah (2)"] },
  { id:85, category:"History", question:"Which Surah refers to the hypocrites of Madinah?", correctAnswer:"Al-Munafiqun (63)", choices:["Al-Munafiqun (63)","Al-Baqarah (2)","An-Nisa (4)","Al-Ahzab (33)"] },

  // ── Pillars & Worship ──────────────────────────────────────────────────────
  { id:86, category:"Pillars & Worship", question:"How many times is Salah (prayer) explicitly commanded in the Quran?", correctAnswer:"The Quran does not state a fixed number — Hadith specifies 5", choices:["3 times","5 times","The Quran does not state a fixed number — Hadith specifies 5","10 times"] },
  { id:87, category:"Pillars & Worship", question:"Which Surah mentions fasting in Ramadan?", correctAnswer:"Al-Baqarah (2:183-185)", choices:["Al-Baqarah (2:183-185)","Al-Maidah (5)","An-Nisa (4)","At-Tawbah (9)"] },
  { id:88, category:"Pillars & Worship", question:"The Quran mentions Zakat alongside Salah how many times?", correctAnswer:"Around 32 times", choices:["5 times","10 times","Around 32 times","50 times"] },
  { id:89, category:"Pillars & Worship", question:"Which Surah contains the ruling on Hajj?", correctAnswer:"Al-Baqarah and Al-Hajj", choices:["Al-Hajj only","Al-Baqarah only","Al-Baqarah and Al-Hajj","At-Tawbah"] },
  { id:90, category:"Pillars & Worship", question:"In which direction did Muslims first pray before the Qibla changed?", correctAnswer:"Jerusalem (Bayt al-Maqdis)", choices:["Makkah","Jerusalem (Bayt al-Maqdis)","Madinah","Iraq"] },
  { id:91, category:"Pillars & Worship", question:"Which verse commands believers to 'establish prayer and give Zakat'?", correctAnswer:"Found throughout, including Al-Baqarah 2:43", choices:["Found throughout, including Al-Baqarah 2:43","Only in Al-Maidah","Only in Al-Hajj","Al-Fatiha 1:5"] },
  { id:92, category:"Pillars & Worship", question:"What does the Quran say about the direction of prayer (Qibla) in Al-Baqarah?", correctAnswer:"Turn your face toward Al-Masjid Al-Haram", choices:["Turn your face toward Jerusalem","Turn your face toward Al-Masjid Al-Haram","Turn toward the East","Turn toward the West"] },
  { id:93, category:"Pillars & Worship", question:"Which Surah forbids consuming alcohol and gambling?", correctAnswer:"Al-Maidah (5:90)", choices:["Al-Baqarah","An-Nisa","Al-Maidah (5:90)","Al-Anam"] },
  { id:94, category:"Pillars & Worship", question:"The Quran states Zakat is for which categories of people?", correctAnswer:"8 categories including the poor, debtors, and travellers", choices:["Only the poor","The poor and orphans only","8 categories including the poor, debtors, and travellers","Unlimited — at giver's discretion"] },
  { id:95, category:"Pillars & Worship", question:"Which Surah contains the verse of Wudu (ablution) instructions?", correctAnswer:"Al-Maidah (5:6)", choices:["Al-Maidah (5:6)","An-Nisa (4:43)","Al-Baqarah (2:222)","Al-Hajj (22)"] },

  // ── Names & Meanings ───────────────────────────────────────────────────────
  { id:96, category:"Names & Meanings", question:"What does 'Al-Baqarah' mean?", correctAnswer:"The Cow", choices:["The Cow","The Camel","The Horse","The Goat"] },
  { id:97, category:"Names & Meanings", question:"What does 'Al-Kahf' mean?", correctAnswer:"The Cave", choices:["The Light","The Cave","The Mountain","The Rock"] },
  { id:98, category:"Names & Meanings", question:"What does 'An-Nahl' mean?", correctAnswer:"The Bee", choices:["The Bee","The Ant","The Spider","The Fly"] },
  { id:99, category:"Names & Meanings", question:"What does 'Al-Naml' mean?", correctAnswer:"The Ant", choices:["The Bee","The Spider","The Ant","The Elephant"] },
  { id:100, category:"Names & Meanings", question:"What does 'Al-Ankabut' mean?", correctAnswer:"The Spider", choices:["The Spider","The Ant","The Bee","The Locust"] },
  { id:101, category:"Names & Meanings", question:"What does 'Al-Mulk' mean?", correctAnswer:"The Sovereignty / Dominion", choices:["The King","The Sovereignty / Dominion","The Power","The Glory"] },
  { id:102, category:"Names & Meanings", question:"What does 'Ar-Rahman' mean?", correctAnswer:"The Most Gracious / Most Merciful", choices:["The Creator","The Most Gracious / Most Merciful","The All-Knowing","The All-Powerful"] },
  { id:103, category:"Names & Meanings", question:"What does 'Al-Maidah' mean?", correctAnswer:"The Table Spread (with food)", choices:["The Feast","The Table Spread (with food)","The Meal","The Banquet"] },
  { id:104, category:"Names & Meanings", question:"What does 'Al-Isra' mean?", correctAnswer:"The Night Journey", choices:["The Ascension","The Night Journey","The Night Prayer","The Night Sky"] },
  { id:105, category:"Names & Meanings", question:"What does 'Al-Fath' mean?", correctAnswer:"The Victory / Conquest", choices:["The Opening","The Victory / Conquest","The Peace","The Treaty"] },
  { id:106, category:"Names & Meanings", question:"What does 'Al-Hujurat' mean?", correctAnswer:"The Private Apartments / Inner Chambers", choices:["The Private Apartments / Inner Chambers","The Walls","The Gates","The Rooms of the Mosque"] },
  { id:107, category:"Names & Meanings", question:"What does 'Ar-Rum' mean?", correctAnswer:"The Romans / Byzantines", choices:["The Romans / Byzantines","The Persians","The Greeks","The Arabs"] },
  { id:108, category:"Names & Meanings", question:"What does 'Al-Furqan' mean?", correctAnswer:"The Criterion (between right and wrong)", choices:["The Distinction","The Criterion (between right and wrong)","The Balance","The Truth"] },
  { id:109, category:"Names & Meanings", question:"What does 'Al-Hijr' refer to?", correctAnswer:"The Rocky Tract — homeland of the people of Thamud", choices:["A mountain in Makkah","The Rocky Tract — homeland of the people of Thamud","The valley of Mina","A gate in Paradise"] },
  { id:110, category:"Names & Meanings", question:"What does 'At-Talaq' mean?", correctAnswer:"The Divorce", choices:["The Marriage","The Divorce","The Separation","The Inheritance"] },
];

const quizCategories = [
  "Combined",
  "General",
  "Prophets",
  "Short Surahs",
  "Stories",
  "History",
  "Pillars & Worship",
  "Names & Meanings",
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


// Prayer times are fetched live from the Aladhan API inside PrayerTimesPage.
// method=1 (University of Islamic Sciences, Karachi) + school=1 (Hanafi Asr)


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
    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139,167,212,0.12), rgba(139,167,212,0.04))', border: '1px solid rgba(139,167,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: 'var(--moon)' }}>
      {Icon && <Icon size={22} strokeWidth={1.5} />}
    </div>
    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'var(--cream-2)', marginBottom: '8px', letterSpacing: '0.04em' }}>{title}</p>
    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 500, color: 'var(--moon-l)', lineHeight: 1 }}>{value}</p>
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
      <Award size={18} style={{ color: 'var(--moon)' }} strokeWidth={1.5} />
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'var(--cream)', letterSpacing: '0.05em' }}>Achievements</span>
    </div>
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {achievements.map((achievement) => (
        <li key={achievement.id} className={`p-achievement ${achievement.achieved ? 'achieved' : 'locked'}`}>
          <span style={{ color: achievement.achieved ? 'var(--moon)' : 'var(--cream-4)', flexShrink: 0 }}>{achievement.icon}</span>
          <div>
            <p style={{ fontSize: '0.85rem', color: achievement.achieved ? 'var(--cream)' : 'var(--cream-3)', fontWeight: 500 }}>{achievement.title}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--cream-4)' }}>{achievement.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);



// ─── VotdPlayer ───────────────────────────────────────────────────────────────
// Small self-contained audio player for the verse of the day
const VotdPlayer = ({ surah, verse }) => {
  const [playing, setPlaying] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Reset player when verse changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
    }
  }, [surah, verse]);

  const handlePlay = async () => {
    if (!surah || !verse) return;

    // If already playing, pause
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    // If audio already loaded, just play
    if (audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
      return;
    }

    setLoading(true);
    try {
      // Fetch audio URL from alquran.cloud (Mishary Al-Afasy edition)
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${verse}/ar.alafasy`);
      const data = await res.json();
      if (data.code !== 200) throw new Error('audio fetch failed');

      const audioUrl = data.data.audio;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => setPlaying(false);
      audio.onerror = () => { setPlaying(false); setLoading(false); };

      await audio.play();
      setPlaying(true);
    } catch (e) {
      console.error('VOTD audio error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="p-play-btn"
      style={{ margin: '0 auto' }}
      onClick={handlePlay}
      title={playing ? 'Pause' : 'Play verse'}
    >
      {loading
        ? <div className="p-spinner" style={{ borderTopColor: '#050810', borderColor: 'rgba(5,8,16,0.3)' }} />
        : playing
          ? <Pause size={24} fill="currentColor" />
          : <Play size={24} fill="currentColor" />
      }
    </button>
  );
};

// ─── Curated verse pool ───────────────────────────────────────────────────────
// 60 handpicked references {s: surahNumber, v: verseNumber, label: "Surah · Verse"}
const VERSE_POOL = [
  {s:2,v:286,label:"Al-Baqarah · 2:286"},{s:2,v:255,label:"Al-Baqarah · 2:255"},
  {s:2,v:45,label:"Al-Baqarah · 2:45"},{s:2,v:153,label:"Al-Baqarah · 2:153"},
  {s:2,v:186,label:"Al-Baqarah · 2:186"},{s:3,v:173,label:"Āl-ʿImrān · 3:173"},
  {s:3,v:200,label:"Āl-ʿImrān · 3:200"},{s:3,v:139,label:"Āl-ʿImrān · 3:139"},
  {s:4,v:36,label:"An-Nisāʾ · 4:36"},{s:5,v:35,label:"Al-Māʾidah · 5:35"},
  {s:6,v:162,label:"Al-Anʿām · 6:162"},{s:7,v:156,label:"Al-Aʿrāf · 7:156"},
  {s:8,v:46,label:"Al-Anfāl · 8:46"},{s:9,v:51,label:"At-Tawbah · 9:51"},
  {s:10,v:62,label:"Yūnus · 10:62"},{s:11,v:88,label:"Hūd · 11:88"},
  {s:13,v:28,label:"Ar-Raʿd · 13:28"},{s:14,v:7,label:"Ibrāhīm · 14:7"},
  {s:15,v:9,label:"Al-Ḥijr · 15:9"},{s:16,v:97,label:"An-Naḥl · 16:97"},
  {s:17,v:44,label:"Al-Isrāʾ · 17:44"},{s:18,v:10,label:"Al-Kahf · 18:10"},
  {s:20,v:14,label:"Ṭāhā · 20:14"},{s:21,v:87,label:"Al-Anbiyāʾ · 21:87"},
  {s:22,v:46,label:"Al-Ḥajj · 22:46"},{s:23,v:1,label:"Al-Muʾminūn · 23:1"},
  {s:24,v:35,label:"An-Nūr · 24:35"},{s:25,v:63,label:"Al-Furqān · 25:63"},
  {s:27,v:62,label:"An-Naml · 27:62"},{s:29,v:45,label:"Al-ʿAnkabūt · 29:45"},
  {s:29,v:69,label:"Al-ʿAnkabūt · 29:69"},{s:30,v:21,label:"Ar-Rūm · 30:21"},
  {s:31,v:17,label:"Luqmān · 31:17"},{s:33,v:41,label:"Al-Aḥzāb · 33:41"},
  {s:35,v:34,label:"Fāṭir · 35:34"},{s:36,v:82,label:"Yāsīn · 36:82"},
  {s:39,v:10,label:"Az-Zumar · 39:10"},{s:39,v:53,label:"Az-Zumar · 39:53"},
  {s:40,v:60,label:"Ghāfir · 40:60"},{s:41,v:30,label:"Fuṣṣilat · 41:30"},
  {s:42,v:19,label:"Ash-Shūrā · 42:19"},{s:47,v:7,label:"Muḥammad · 47:7"},
  {s:49,v:13,label:"Al-Ḥujurāt · 49:13"},{s:51,v:56,label:"Adh-Dhāriyāt · 51:56"},
  {s:55,v:13,label:"Ar-Raḥmān · 55:13"},{s:57,v:3,label:"Al-Ḥadīd · 57:3"},
  {s:58,v:7,label:"Al-Mujādilah · 58:7"},{s:62,v:10,label:"Al-Jumuʿah · 62:10"},
  {s:65,v:2,label:"Aṭ-Ṭalāq · 65:2"},{s:65,v:3,label:"Aṭ-Ṭalāq · 65:3"},
  {s:66,v:8,label:"At-Taḥrīm · 66:8"},{s:67,v:2,label:"Al-Mulk · 67:2"},
  {s:67,v:3,label:"Al-Mulk · 67:3"},{s:73,v:20,label:"Al-Muzzammil · 73:20"},
  {s:84,v:6,label:"Al-Inshiqāq · 84:6"},{s:87,v:14,label:"Al-Aʿlā · 87:14"},
  {s:90,v:10,label:"Al-Balad · 90:10"},{s:93,v:11,label:"Aḍ-Ḍuḥā · 93:11"},
  {s:94,v:5,label:"Ash-Sharḥ · 94:5"},{s:103,v:3,label:"Al-ʿAṣr · 103:3"},
];

// Returns today's verse reference — deterministic, changes daily at midnight
function getTodaysVerse() {
  const dayIndex = Math.floor(Date.now() / 86_400_000); // days since epoch
  return VERSE_POOL[dayIndex % VERSE_POOL.length];
}

// ─── useDailyVerse hook ────────────────────────────────────────────────────────
function useDailyVerse() {
  const [verse, setVerse] = React.useState(null);   // {arabic, translation, label}
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const ref = getTodaysVerse();
    const cacheKey = `votd_${Math.floor(Date.now() / 86_400_000)}`;

    // Try localStorage cache first
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setVerse(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch (_) {}

    // Fetch both editions in one call from alquran.cloud
    const url = `https://api.alquran.cloud/v1/ayah/${ref.s}:${ref.v}/editions/quran-uthmani,en.asad`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.code !== 200) throw new Error('API error');
        const [arEdition, enEdition] = data.data;
        const result = {
          arabic: arEdition.text,
          translation: enEdition.text,
          label: ref.label,
          surah: ref.s,
          verse: ref.v,
        };
        try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch (_) {}
        setVerse(result);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to a hardcoded verse if network fails
        setVerse({
          arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
          translation: 'And whoever fears Allah – He will make for him a way out.',
          label: 'Aṭ-Ṭalāq · 65:2', surah: 65, verse: 2,
        });
        setLoading(false);
        setError(true);
      });
  }, []);

  return { verse, loading, error };
}

// HomeDashboard component, serving as the main landing page of the app.
const HomeDashboard = ({ setCurrentView, points, userProgress, unlockedReciters, handleUnlockReciter, showNotification, lastReadPosition, onContinueReading, onSelectReciterForListen }) => {
  const { verse: verseOfTheDay, loading: votdLoading } = useDailyVerse();

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

        {votdLoading ? (
          <div style={{ padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
            <div className="p-spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : (
          <>
            <div className="p-votd-arabic">{verseOfTheDay?.arabic}</div>
            <div className="p-votd-ref">{verseOfTheDay?.label}</div>
            <div className="p-votd-trans">"{verseOfTheDay?.translation}"</div>
            <VotdPlayer surah={verseOfTheDay?.surah} verse={verseOfTheDay?.verse} />
          </>
        )}
      </div>

      {/* Reciters */}
      <div className="p-section">
        <div className="p-section-title">
          <Headphones size={16} style={{ color: 'var(--moon)', flexShrink: 0 }} />
          Available Reciters
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
          {recitersData.map((reciter) => (
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
          <BarChart size={16} style={{ color: 'var(--moon)', flexShrink: 0 }} />
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
      <div className="p-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(139,167,212,0.1)' }}>
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
                  <p className="font-arabic" style={{ fontSize: '1.1rem', color: 'var(--moon-l)' }}>{surah.name}</p>
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
    const reciterToUse = selectedReciterAlquranCloudId || recitersData[0].alquranCloudId;

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(139,167,212,0.1)', flexWrap: 'wrap' }}>
        <button onClick={onBackToSurahList} className="p-btn-ghost"><ArrowLeft size={14} /> Back</button>
        <button onClick={onBackToHome} className="p-btn-ghost"><Home size={14} /> Home</button>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: 'var(--cream)', flex: 1, textAlign: 'center', margin: 0 }}>
          {selectedSurahMeta?.englishName} <span className="font-arabic" style={{ fontSize: '1.8rem', color: 'var(--moon-l)' }}>{selectedSurahMeta?.name}</span>
        </h2>
        <button onClick={handlePrevSurah} disabled={selectedSurahId === 1} className="p-ctrl-btn"><ChevronLeft size={18} /></button>
        <button onClick={handleNextSurah} disabled={selectedSurahId === quranData.surahs.length} className="p-ctrl-btn"><ChevronRight size={18} /></button>
      </div>

      {/* Font and Script Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '14px 18px', background: 'var(--ink-2)', border: '1px solid rgba(139,167,212,0.1)', borderRadius: '14px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="p-label" style={{ margin: 0 }}>Font</span>
          <select value={selectedFont} onChange={handleFontFamilyChange} className="p-select" style={{ width: 'auto', padding: '6px 12px' }}>
            {fontFamilies.map(font => <option key={font.name} value={font.name}>{font.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="p-label" style={{ margin: 0 }}>Size</span>
          <button onClick={() => handleFontSizeChange('decrease')} className="p-ctrl-btn" style={{ width: '32px', height: '32px' }}>−</button>
          <span style={{ color: 'var(--moon)', fontSize: '0.85rem', minWidth: '24px', textAlign: 'center' }}>{fontSize.replace('text-', '')}</span>
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
                {verse.arabic} <span style={{ fontSize: '0.75rem', color: 'var(--moon-d)', opacity: 0.9 }}>({verse.id})</span>
              </p>
              <button
                onClick={() => onToggleBookmark(selectedSurahId, verse.id)}
                style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', color: bookmarkedVerses.some(b => b.surahId === selectedSurahId && b.verseId === verse.id) ? 'var(--moon)' : 'var(--cream-4)', padding: '4px', flexShrink: 0, transition: 'color 0.2s' }}
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

      <div ref={chatContainerRef} className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px", background: "var(--ink-2)", borderRadius: "14px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(139,167,212,0.08)" }}>
        {chatHistory.length === 0 && !isLoadingResponse ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--cream-3)" }}>
            <MessageSquareText size={48} style={{ color: "var(--moon-d)", display: "block", margin: "0 auto 16px" }} />
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
            <p style={{ fontSize: "0.7rem", color: "var(--moon-d)", marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{message.role === 'user' ? 'You' : 'AI Guide'}</p>
            <p style={{ fontSize: "0.88rem" }}>{message.parts[0].text}</p>
          </div>
        </div>
      ))
    )}
    {isLoadingResponse && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div className="p-chat-bubble-ai animate-pulse">
              <p style={{ fontSize: '0.7rem', color: 'var(--moon-d)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Guide</p>
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
    unlockedReciters: recitersData.map(r => r.id), // All featured reciters are unlocked by default
  });

  // Reciter State for Listen Page
  const [selectedReciterId, setSelectedReciterId] = useState(recitersData[0].id);
  const [selectedReciterName, setSelectedReciterName] = useState(recitersData[0].name);
  const [selectedReciterEnglishName, setSelectedReciterEnglishName] = useState(recitersData[0].englishName);
  const [selectedReciterAlquranCloudId, setSelectedReciterAlquranCloudId] = useState(recitersData[0].alquranCloudId);

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
        const parsedUnlockedReciters = data.unlockedReciters ? JSON.parse(data.unlockedReciters) : recitersData.map(r => r.id);

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
          unlockedReciters: recitersData.map(r => r.id),
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
              <Star size={13} style={{ color: 'var(--moon)' }} />
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
// ─────────────────────────────────────────────────────────────────────────────
// HOW THE AUDIO ENGINE WORKS (for future reference):
//
//   1. On surah select → fetch Arabic verse texts from api.alquran.cloud
//      (one call, text only — no audio yet).
//   2. On Play → call getVerseAudioUrl(reciter, surahId, verseId)
//      which builds a direct CDN MP3 URL with NO network request.
//      e.g. Mishary · Al-Baqarah v1 → global ayah 8
//           → https://cdn.islamic.network/quran/audio/128/ar.alafasy/8.mp3
//   3. Set that URL as the <audio> src → plays instantly.
//   4. audio.onended fires → auto-advance to next verse.
//
// TO ADD A NEW RECITER: see the comment above recitersData.
// ─────────────────────────────────────────────────────────────────────────────
const ListenPage = ({ onBackToHome, selectedReciterId, showNotification }) => {
  const [activeReciterId, setActiveReciterId]     = useState(selectedReciterId || recitersData[0].id);
  const [selectedSurahId, setSelectedSurahId]     = useState(1);
  const [verses, setVerses]                       = useState([]);
  const [isLoadingVerses, setIsLoadingVerses]     = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isPlaying, setIsPlaying]                 = useState(false);
  const [isLoadingAudio, setIsLoadingAudio]       = useState(false);
  const [audioError, setAudioError]               = useState(false);
  const [audioDuration, setAudioDuration]         = useState(0);
  const [audioProgress, setAudioProgress]         = useState(0);
  const audioRef    = useRef(new Audio());
  const verseListRef = useRef(null);

  const activeReciter = recitersData.find(r => r.id === activeReciterId) || recitersData[0];
  const selectedSurah = quranData.surahs.find(s => s.id === selectedSurahId);

  // ── Fetch Arabic verse texts when surah changes ───────────────────────────
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setIsLoadingVerses(true);
      setVerses([]); setIsPlaying(false);
      setCurrentVerseIndex(0); setAudioProgress(0);
      audioRef.current.pause(); audioRef.current.src = '';
      try {
        const res  = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahId}/quran-uthmani`, { signal: ctrl.signal });
        const data = await res.json();
        if (data.code === 200) setVerses(data.data.ayahs.map(a => ({ id: a.numberInSurah, text: a.text })));
        else showNotification('Could not load surah text.', 'error');
      } catch (e) { if (e.name !== 'AbortError') showNotification('Network error.', 'error'); }
      finally { setIsLoadingVerses(false); }
    })();
    return () => ctrl.abort();
  }, [selectedSurahId]);

  // ── Wire up audio time/duration listeners ─────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setAudioProgress(audio.currentTime);
    const onDur  = () => setAudioDuration(audio.duration || 0);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDur);
    return () => {
      audio.pause(); audio.src = '';
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDur);
    };
  }, []);

  // ── Reset when reciter changes ────────────────────────────────────────────
  useEffect(() => {
    setIsPlaying(false); setAudioProgress(0); setAudioError(false);
    audioRef.current.pause(); audioRef.current.src = '';
  }, [activeReciterId]);

  // ── Auto-scroll verse list to the playing verse ───────────────────────────
  useEffect(() => {
    if (!verseListRef.current) return;
    const el = verseListRef.current.children[currentVerseIndex];
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentVerseIndex]);

  // ── Core play ─────────────────────────────────────────────────────────────
  // Handles three audio sources:
  //   'islamicnetwork' — builds CDN URL locally (instant, no API call)
  //   'api'            — fetches audio URL from alquran.cloud per verse
  //                      (one extra network hop but guaranteed correct link)
  const playVerse = useCallback((verseIndex) => {
    const verse = verses[verseIndex];
    if (!verse) return;
    setIsLoadingAudio(true); setAudioError(false); setAudioProgress(0);
    audioRef.current.pause();

    // Shared function that receives the final MP3 url and starts playback
    const doPlay = (url) => {
      audioRef.current.src = url;
      audioRef.current.load();

      audioRef.current.oncanplay = () => {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setCurrentVerseIndex(verseIndex);
            setIsLoadingAudio(false);
          })
          .catch(() => { setIsLoadingAudio(false); setIsPlaying(false); setAudioError(true); });
      };

      audioRef.current.onerror = () => {
        setIsLoadingAudio(false); setIsPlaying(false); setAudioError(true);
        showNotification('Audio unavailable — try another reciter.', 'error');
      };

      audioRef.current.onended = () => {
        const next = verseIndex + 1;
        if (next < verses.length) playVerse(next);
        else {
          setIsPlaying(false); setAudioProgress(0);
          showNotification(`${selectedSurah?.englishName || 'Surah'} complete ✦`, 'success');
        }
      };
    };

    if (activeReciter.audioSource === 'api') {
      // Abdul Basit Murattal — fetch the audio URL from the API, then play
      fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurahId}:${verse.id}/${activeReciter.audioEdition}`)
        .then(r => r.json())
        .then(data => {
          if (data.code === 200 && data.data?.audio) {
            doPlay(data.data.audio);
          } else {
            setIsLoadingAudio(false); setIsPlaying(false); setAudioError(true);
            showNotification('Audio unavailable for this verse.', 'error');
          }
        })
        .catch(() => {
          setIsLoadingAudio(false); setIsPlaying(false); setAudioError(true);
          showNotification('Network error loading audio.', 'error');
        });
    } else {
      // islamicnetwork — URL built locally, no round-trip needed
      doPlay(getVerseAudioUrl(activeReciter, selectedSurahId, verse.id));
    }
  }, [verses, selectedSurahId, activeReciter, selectedSurah]);

  const handlePlayPause = () => {
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else if (audioRef.current.src && !audioError) { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
    else playVerse(currentVerseIndex);
  };

  const handlePrev = () => { if (currentVerseIndex > 0) playVerse(currentVerseIndex - 1); };
  const handleNext = () => { if (currentVerseIndex < verses.length - 1) playVerse(currentVerseIndex + 1); };
  const handleSeek = (e) => {
    if (!audioDuration) return;
    const t = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * audioDuration;
    audioRef.current.currentTime = t; setAudioProgress(t);
  };

  const progressPct = audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0;

  return (
    <div className="p-section animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid rgba(139,167,212,0.1)' }}>
        <button onClick={onBackToHome} className="p-btn-ghost"><Home size={14} /> Home</button>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 400, color: 'var(--cream)', margin: 0 }}>Listen</h2>
        <div style={{ width: '72px' }} />
      </div>

      {/* ── Reciter picker ── */}
      <div style={{ marginBottom: '24px' }}>
        <span className="p-label">Choose Reciter</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
          {recitersData.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveReciterId(r.id)}
              className={`p-reciter-pick${activeReciterId === r.id ? ' active' : ''}`}
            >
              <img
                src={r.imageUrl}
                alt={r.englishName}
                style={{ width: '52px', height: '52px', borderRadius: '50%', border: `2px solid ${activeReciterId === r.id ? 'rgba(139,167,212,0.6)' : 'rgba(139,167,212,0.2)'}`, marginBottom: '8px', objectFit: 'cover', transition: 'border-color 0.2s' }}
                onError={e => { e.target.src = 'https://placehold.co/52x52/0d1427/8ba7d4?text=R'; }}
              />
              <p style={{ fontSize: '0.7rem', color: activeReciterId === r.id ? 'var(--moon-l)' : 'var(--cream-2)', lineHeight: 1.35, marginBottom: '2px', fontWeight: activeReciterId === r.id ? 500 : 400 }}>{r.englishName}</p>
              <p style={{ fontSize: '0.6rem', color: 'var(--cream-4)', letterSpacing: '0.05em' }}>{r.style}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Surah picker ── */}
      <div style={{ marginBottom: '16px' }}>
        <span className="p-label">Choose Surah</span>
        <div className="p-select-wrap">
          <select value={selectedSurahId} onChange={e => { setSelectedSurahId(Number(e.target.value)); }} className="p-select">
            {quranData.surahs.map(s => (
              <option key={s.id} value={s.id}>{s.id}. {s.englishName} — {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Jump to verse ── */}
      {verses.length > 0 && (
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="p-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Jump to verse</span>
          <input
            type="number"
            min="1"
            max={verses.length}
            placeholder={`1 – ${verses.length}`}
            className="p-input"
            style={{ width: '100px', padding: '8px 12px', textAlign: 'center' }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const v = Math.min(Math.max(1, Number(e.target.value)), verses.length);
                if (!isNaN(v)) { playVerse(v - 1); e.target.value = ''; }
              }
            }}
          />
          <button
            className="p-btn-ghost"
            style={{ fontSize: '0.75rem', padding: '8px 16px', whiteSpace: 'nowrap' }}
            onClick={e => {
              const input = e.currentTarget.previousSibling;
              const v = Math.min(Math.max(1, Number(input.value)), verses.length);
              if (!isNaN(v) && input.value) { playVerse(v - 1); input.value = ''; }
            }}
          >
            Go <ChevronRight size={13} />
          </button>
          <span style={{ fontSize: '0.7rem', color: 'var(--cream-4)' }}>or tap any verse below</span>
        </div>
      )}

      {/* ── Player card ── */}
      <div className="p-player" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>

        {/* Now playing info */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: 'var(--cream)', marginBottom: '4px' }}>
            {selectedSurah?.englishName}&nbsp;
            <span className="font-arabic" style={{ fontSize: '1.4rem', color: 'var(--moon-l)' }}>{selectedSurah?.name}</span>
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--cream-3)', letterSpacing: '0.04em' }}>
            {isLoadingVerses
              ? 'Loading…'
              : verses.length > 0
                ? `Verse ${verses[currentVerseIndex]?.id ?? 1} of ${verses.length} · ${activeReciter.englishName}`
                : activeReciter.englishName}
          </p>
        </div>

        {/* Arabic verse display */}
        <div style={{ width: '100%', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isLoadingVerses
            ? <div className="p-spinner" style={{ width: 24, height: 24 }} />
            : verses.length > 0
              ? <p className="font-arabic" style={{ fontSize: '2rem', lineHeight: 2.1, color: 'var(--cream)', direction: 'rtl', textAlign: 'right', width: '100%', padding: '0 8px', transition: 'opacity 0.3s' }}>
                  {verses[currentVerseIndex]?.text}
                </p>
              : null}
        </div>

        {/* Progress bar — click to seek */}
        {verses.length > 0 && (
          <div
            onClick={handleSeek}
            style={{ width: '100%', height: '4px', background: 'var(--ink-4)', borderRadius: '100px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, var(--moon-d), var(--moon))', borderRadius: '100px', transition: 'width 0.4s linear' }} />
          </div>
        )}

        {/* Playback controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handlePrev} disabled={isLoadingAudio || verses.length === 0 || currentVerseIndex === 0} className="p-ctrl-btn" title="Previous verse">
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handlePlayPause}
            disabled={verses.length === 0 || isLoadingVerses}
            className="p-play-btn"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoadingAudio
              ? <div className="p-spinner" style={{ borderTopColor: '#050810', borderColor: 'rgba(5,8,16,0.25)' }} />
              : isPlaying
                ? <Pause size={24} fill="currentColor" />
                : <Play size={24} fill="currentColor" />}
          </button>

          <button onClick={handleNext} disabled={isLoadingAudio || verses.length === 0 || currentVerseIndex === verses.length - 1} className="p-ctrl-btn" title="Next verse">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Audio error message */}
        {audioError && (
          <p style={{ fontSize: '0.75rem', color: '#e09e9e', textAlign: 'center' }}>
            Audio unavailable for this verse — tap another verse or switch reciter
          </p>
        )}
      </div>

      {/* ── Verse list ── */}
      {verses.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <span className="p-label">All Verses</span>
          <ul
            ref={verseListRef}
            className="custom-scrollbar"
            style={{ maxHeight: '320px', overflowY: 'auto', listStyle: 'none', margin: 0, padding: '2px', display: 'flex', flexDirection: 'column', gap: '3px' }}
          >
            {verses.map((v, idx) => (
              <li key={v.id}>
                <button
                  onClick={() => playVerse(idx)}
                  className={idx === currentVerseIndex ? 'p-verse-row playing' : 'p-verse-row'}
                  style={{ width: '100%', textAlign: 'right', direction: 'rtl', fontFamily: "'Amiri', serif", fontSize: '1.1rem', lineHeight: 2, cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <span style={{ float: 'left', fontSize: '0.65rem', color: idx === currentVerseIndex ? 'var(--moon)' : 'var(--moon-d)', fontFamily: "'DM Sans', sans-serif", direction: 'ltr', marginTop: '14px', minWidth: '22px' }}>{v.id}</span>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid rgba(139,167,212,0.1)' }}>
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
  const [coords, setCoords] = useState(null);
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');

  // Prayer display order & metadata
  const PRAYERS = [
    { key: 'Fajr',    label: 'Fajr',    arabic: 'الفجر',   icon: <Sun size={18} />,   isCount: true  },
    { key: 'Sunrise', label: 'Sunrise', arabic: 'الشروق',  icon: <Cloud size={18} />, isCount: false },
    { key: 'Dhuhr',   label: 'Dhuhr',   arabic: 'الظهر',   icon: <Sun size={18} />,   isCount: true  },
    { key: 'Asr',     label: 'Asr',     arabic: 'العصر',   icon: <Cloud size={18} />, isCount: true  },
    { key: 'Maghrib', label: 'Maghrib', arabic: 'المغرب',  icon: <Moon size={18} />,  isCount: true  },
    { key: 'Isha',    label: 'Isha',    arabic: 'العشاء',  icon: <Moon size={18} />,  isCount: true  },
  ];

  // Countable prayers (for next-prayer logic — exclude Sunrise)
  const COUNTABLE = PRAYERS.filter(p => p.isCount).map(p => p.key);

  // ── Step 1: get geolocation ──────────────────────────────────────────────────
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        ()  => setCoords({ lat: 51.5074, lng: -0.1278 }) // London fallback
      );
    } else {
      setCoords({ lat: 51.5074, lng: -0.1278 });
    }
  }, []);

  // ── Step 2: fetch from Aladhan API with localStorage cache ───────────────────
  useEffect(() => {
    if (!coords) return;
    const dateStr = format(currentDate, 'dd-MM-yyyy'); // Aladhan date format
    const cacheKey = `nurul_pt_${coords.lat.toFixed(3)}_${coords.lng.toFixed(3)}_${dateStr}`;

    const doFetch = async () => {
      setLoading(true);
      setError(null);

      // Check cache first
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const p = JSON.parse(cached);
          setTimings(p.timings);
          setHijriDate(p.hijri);
          setLocationName(p.locationName || '');
          setLoading(false);
          return;
        }
      } catch (_) {}

      // Fetch fresh from Aladhan  (method=1 Karachi/UISC, school=1 Hanafi Asr)
      try {
        const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${coords.lat}&longitude=${coords.lng}&method=1&school=1`;
        const res  = await fetch(url);
        const data = await res.json();
        if (data.code === 200) {
          const t    = data.data.timings;
          const hijri = data.data.date.hijri;
          const meta  = data.data.meta;
          // Try to build a readable location label from timezone
          const tz = meta.timezone || '';
          const cityGuess = tz.includes('/') ? tz.split('/').pop().replace(/_/g,' ') : '';

          setTimings(t);
          setHijriDate(hijri);
          setLocationName(cityGuess);

          // Cache for today (24 h is fine since times only change ~1 min/day)
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ timings: t, hijri, locationName: cityGuess }));
          } catch (_) {}
        } else {
          setError('Could not load prayer times. Please try again.');
        }
      } catch (e) {
        setError('Network error — check your connection.');
      }
      setLoading(false);
    };

    doFetch();
  }, [coords, currentDate]);

  // ── Step 3: live countdown (updates every second) ───────────────────────────
  useEffect(() => {
    if (!timings) return;

    const tick = () => {
      const now  = new Date();
      let found  = null;

      for (const key of COUNTABLE) {
        const [h, m] = timings[key].split(':').map(Number);
        const pt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
        if (now < pt) {
          const diff = Math.floor((pt - now) / 1000);
          found = { key, diff };
          break;
        }
      }

      // After Isha, roll to tomorrow's Fajr
      if (!found) {
        const [h, m] = timings['Fajr'].split(':').map(Number);
        const tFajr  = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m, 0);
        const diff   = Math.floor((tFajr - now) / 1000);
        found = { key: 'Fajr', diff };
      }

      const hrs  = Math.floor(found.diff / 3600);
      const mins = Math.floor((found.diff % 3600) / 60);
      const secs = found.diff % 60;
      setNextPrayer(found.key);
      setCountdown(
        `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timings]);

  // Helper: parse "HH:MM" → Date on currentDate
  const toDateObj = (hhmm) => {
    if (!hhmm) return null;
    const [h, m] = hhmm.split(':').map(Number);
    const d = new Date(currentDate);
    d.setHours(h, m, 0, 0);
    return d;
  };

  // Has this prayer already passed today?
  const hasPassed = (key) => {
    if (!timings) return false;
    const now = new Date();
    const sameDay = format(currentDate,'yyyy-MM-dd') === format(now,'yyyy-MM-dd');
    if (!sameDay) return false;
    return toDateObj(timings[key]) < now;
  };

  const nextPrayerMeta = PRAYERS.find(p => p.key === nextPrayer);
  const hijriStr = hijriDate
    ? `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year} AH`
    : '';

  return (
    <div className="p-section animate-fade-in">
      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px', paddingBottom:'18px', borderBottom:'1px solid rgba(139,167,212,0.1)' }}>
        <button onClick={onBackToHome} className="p-btn-ghost"><Home size={14} /> Home</button>
        <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.7rem', fontWeight:400, color:'var(--cream)', margin:0 }}>Prayer Times</h2>
        <div style={{ width:'72px' }} />
      </div>

      {/* ── Date row ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'14px', marginBottom:'22px' }}>
        <button onClick={() => setCurrentDate(d => addDays(d,-1))} className="p-ctrl-btn"><ChevronLeft size={18} /></button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.15rem', color:'var(--cream)', letterSpacing:'0.04em' }}>
            {format(currentDate,'EEEE, MMMM d, yyyy')}
          </div>
          {hijriStr && (
            <div style={{ fontSize:'0.74rem', color:'var(--moon)', letterSpacing:'0.08em', marginTop:'4px' }}>
              {hijriStr}
            </div>
          )}
        </div>
        <button onClick={() => setCurrentDate(d => addDays(d,1))} className="p-ctrl-btn"><ChevronRight size={18} /></button>
      </div>

      {/* ── Countdown hero ── */}
      {!loading && !error && nextPrayer && (
        <div className="p-prayer-countdown-hero">
          {/* subtle glow */}
          <div style={{ position:'absolute', top:'-40px', left:'50%', transform:'translateX(-50%)', width:'200px', height:'120px', background:'radial-gradient(ellipse, rgba(100,140,220,0.12), transparent 70%)', pointerEvents:'none' }} />

          {locationName && (
            <div style={{ fontSize:'0.72rem', color:'var(--moon-d)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'14px' }}>
              <Clock size={11} style={{ display:'inline', marginRight:'5px', verticalAlign:'middle' }} />
              {locationName}
              {' · '}Hanafi · Karachi Method
            </div>
          )}

          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:'0.85rem', color:'var(--moon)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:'8px' }}>
            next prayer
          </div>

          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(1.6rem,5vw,2.4rem)', fontWeight:400, color:'var(--cream)', letterSpacing:'0.08em', marginBottom:'4px' }}>
            {nextPrayer}
          </div>

          {nextPrayerMeta && (
            <div style={{ fontFamily:"'Amiri', serif", fontSize:'1.2rem', color:'var(--moon-d)', marginBottom:'18px' }}>
              {nextPrayerMeta.arabic}
            </div>
          )}

          <div style={{ fontFamily:"'DM Sans', monospace", fontSize:'clamp(2rem,7vw,3.2rem)', fontWeight:300, color:'var(--moon-l)', letterSpacing:'0.05em', lineHeight:1 }}>
            {countdown}
          </div>
        </div>
      )}

      {/* ── Loading / Error ── */}
      {loading && (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--cream-3)', fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:'1.05rem' }}>
          Locating & fetching prayer times…
        </div>
      )}
      {error && (
        <div style={{ textAlign:'center', padding:'24px', background:'rgba(200,80,80,0.07)', border:'1px solid rgba(200,80,80,0.2)', borderRadius:'16px', color:'#e09e9e', fontSize:'0.9rem', marginBottom:'20px' }}>
          {error}
        </div>
      )}

      {/* ── Prayer rows ── */}
      {!loading && timings && (
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {PRAYERS.map(prayer => {
            const isNext   = prayer.key === nextPrayer;
            const passed   = hasPassed(prayer.key);
            const timeStr  = timings[prayer.key]
              ? format(toDateObj(timings[prayer.key]), 'h:mm a')
              : '—';

            return (
              <div
                key={prayer.key}
                className={`p-prayer-row${isNext ? ' next-prayer' : ''}${passed && !isNext ? ' passed' : ''}`}
              >
                {/* Left side */}
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <div style={{
                    width:'38px', height:'38px', borderRadius:'50%',
                    background: isNext
                      ? 'linear-gradient(135deg, rgba(139,167,212,0.25), rgba(139,167,212,0.08))'
                      : 'rgba(139,167,212,0.06)',
                    border:`1px solid ${isNext ? 'rgba(139,167,212,0.45)' : 'rgba(139,167,212,0.14)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: isNext ? 'var(--moon-l)' : 'var(--moon-d)',
                    flexShrink:0,
                  }}>
                    {prayer.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.15rem', color: isNext ? 'var(--cream)' : 'var(--cream-2)', letterSpacing:'0.04em' }}>
                      {prayer.label}
                    </div>
                    <div style={{ fontFamily:"'Amiri', serif", fontSize:'0.9rem', color:'var(--moon-d)', lineHeight:1 }}>
                      {prayer.arabic}
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <span style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:'1.25rem',
                    fontWeight: isNext ? 500 : 400,
                    color: isNext ? 'var(--moon-l)' : passed ? 'var(--cream-4)' : 'var(--cream-2)',
                    letterSpacing:'0.02em',
                  }}>
                    {timeStr}
                  </span>
                  {isNext && (
                    <span style={{ fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--moon)', background:'rgba(139,167,212,0.1)', border:'1px solid rgba(139,167,212,0.25)', borderRadius:'100px', padding:'3px 10px' }}>
                      Next
                    </span>
                  )}
                  {passed && !isNext && (
                    <span style={{ fontSize:'0.62rem', color:'var(--cream-4)', letterSpacing:'0.06em' }}>✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer note ── */}
      {!loading && timings && (
        <div style={{ textAlign:'center', marginTop:'22px', fontSize:'0.7rem', color:'var(--cream-4)', letterSpacing:'0.06em' }}>
          Hanafi madhab · University of Islamic Sciences, Karachi · Times update daily
        </div>
      )}
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
  const [selectedCategory, setSelectedCategory] = useState("Combined");
  const [seenIds, setSeenIds] = useState(new Set());

  // Returns a random question not yet seen this session; resets when pool exhausted
  const getRandomQuestion = useCallback((category, currentSeenIds) => {
    const pool = category === "Combined"
      ? quizQuestions
      : quizQuestions.filter(q => q.category === category);

    if (pool.length === 0) {
      showNotification(`No questions available for: ${category}`, 'error');
      return { question: null, newSeenIds: currentSeenIds };
    }

    let unseen = pool.filter(q => !currentSeenIds.has(q.id));
    if (unseen.length === 0) {
      // All seen — reset the pool
      unseen = pool;
      showNotification('All questions completed! Shuffling again…', 'info');
      return { question: unseen[Math.floor(Math.random() * unseen.length)], newSeenIds: new Set() };
    }

    const chosen = unseen[Math.floor(Math.random() * unseen.length)];
    const newSet = new Set(currentSeenIds);
    newSet.add(chosen.id);
    return { question: chosen, newSeenIds: newSet };
  }, [showNotification]);


  useEffect(() => {
    if (quizStarted) {
      const { question, newSeenIds } = getRandomQuestion(selectedCategory, new Set());
      setCurrentQuestion(question);
      setSeenIds(newSeenIds);
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
    const { question, newSeenIds } = getRandomQuestion(selectedCategory, seenIds);
    setQuestionCount(prevCount => prevCount + 1);
    setCurrentQuestion(question);
    setSeenIds(newSeenIds);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const startQuiz = () => {
    const freshSeen = new Set();
    const { question, newSeenIds } = getRandomQuestion(selectedCategory, freshSeen);
    setScore(0);
    setQuestionCount(0);
    setQuizStarted(true);
    setSelectedAnswer(null);
    setFeedback(null);
    setSeenIds(newSeenIds);
    setCurrentQuestion(question);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setScore(0);
    setQuestionCount(0);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setFeedback(null);
    setSeenIds(new Set());
  };

  return (
    <div className="p-section animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid rgba(139,167,212,0.1)' }}>
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
            <span className="p-score-badge"><CircleDot size={12} /> Q {questionCount + 1} of {(selectedCategory === 'Combined' ? quizQuestions : quizQuestions.filter(q => q.category === selectedCategory)).length}</span>
          </div>

          {currentQuestion ? (
            <div style={{ background: 'var(--ink-2)', border: '1px solid rgba(139,167,212,0.12)', borderRadius: '16px', padding: '26px' }}>
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