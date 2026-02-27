/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Grid, 
  List, 
  BookOpen, 
  Info, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Download, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Heart,
  Home as HomeIcon,
  Search,
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';
import namesData from './data/names.json';
import audioLyrics from './data/audio_lyrics.json';
import { cn } from './lib/utils';

// --- Types ---
interface Name {
  arabic: string;
  pashto: string;
  english: string;
  english2: string;
  benefits: string;
}

type Screen = 'onboarding' | 'home' | 'list' | 'detail' | 'tasbeeh' | 'about';
type ViewMode = 'grid' | 'list' | 'pager';

// --- Components ---

const Onboarding = ({ onComplete }: { onComplete: () => void; key?: React.Key }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "ټول ۹۹ نومونه د معنا او فضايلو سره",
      desc: "د الله جل جلاله د نومونو مکمل معلومات په پښتو او انګليسي ژبو کې.",
      icon: <BookOpen className="w-12 h-12 text-emerald-600" />
    },
    {
      title: "د هر نوم ځانګړی تسبيح کاؤنټر",
      desc: "خپل ذکر په اسانۍ سره ثبت کړئ او خپل اهداف وټاکئ.",
      icon: <RotateCcw className="w-12 h-12 text-emerald-600" />
    },
    {
      title: "د هر نوم ډيزاين انځور جوړول",
      desc: "ښکلي اسلامي انځورونه جوړ کړئ او له ملګرو سره يې شريک کړئ.",
      icon: <Download className="w-12 h-12 text-emerald-600" />
    },
    {
      title: "مکمل ۴ دقيقې آډيو تلاوت",
      desc: "د ټولو نومونو په زړه پورې آډيو تلاوت واورئ.",
      icon: <Volume2 className="w-12 h-12 text-emerald-600" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col islamic-pattern">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-emerald-100 flex flex-col items-center max-w-md w-full"
        >
          <div className="mb-6 p-4 bg-emerald-50 rounded-full">
            {slides[currentSlide].icon}
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4 font-pashto">
            {slides[currentSlide].title}
          </h2>
          <p className="text-slate-600 font-pashto leading-relaxed">
            {slides[currentSlide].desc}
          </p>
        </motion.div>
        
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentSlide === i ? "w-8 bg-emerald-600" : "w-2 bg-emerald-200"
              )}
            />
          ))}
        </div>
      </div>

      <div className="p-8 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={onComplete}
            className="text-emerald-600 font-pashto font-medium px-4 py-2"
          >
            Skip
          </button>
          <button 
            onClick={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide(s => s + 1);
              } else {
                onComplete();
              }
            }}
            className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-pashto font-bold shadow-lg shadow-emerald-200 flex items-center gap-2"
          >
            {currentSlide === slides.length - 1 ? "پيل کړئ" : "بل"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => (
  <header 
    className="bg-emerald-600 text-white p-6 rounded-b-[40px] shadow-lg relative overflow-hidden"
    style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}
  >
    <div className="absolute inset-0 opacity-10 islamic-pattern pointer-events-none" />
    <div className="relative z-10 flex items-center justify-between">
      {onBack ? (
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
      ) : <div className="w-10" />}
      <h1 className="text-2xl font-bold font-pashto">{title}</h1>
      <div className="w-10" />
    </div>
  </header>
);

const Home = ({ 
  onNavigate, 
  randomName,
  onShowAudio
}: { 
  onNavigate: (s: Screen, data?: any) => void;
  randomName: Name;
  onShowAudio: () => void;
  key?: React.Key;
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar pb-24">
      {/* Name of the Day */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl border border-emerald-50 overflow-hidden"
      >
        <div className="bg-emerald-600 p-4 text-white text-center font-pashto text-sm opacity-90">
          د ورځې يو نوم
        </div>
        <div className="p-8 text-center flex flex-col items-center gap-4">
          <h2 className="text-6xl font-arabic font-bold text-emerald-800 leading-tight">
            {randomName.arabic}
          </h2>
          <p className="text-2xl font-pashto text-gold-600 font-bold">
            {randomName.pashto}
          </p>
          <button 
            onClick={() => onNavigate('detail', randomName)}
            className="mt-4 text-emerald-600 font-pashto font-medium flex items-center gap-2 hover:underline"
          >
            نور معلومات وګورئ
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => onNavigate('list')}
          className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center justify-between group hover:bg-emerald-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h3 className="font-pashto font-bold text-emerald-900">ټول نومونه وګورئ</h3>
              <p className="text-xs text-emerald-700 font-pashto">۹۹ نومونه د معنا سره</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={() => onNavigate('tasbeeh')}
          className="bg-gold-50 border border-gold-100 p-6 rounded-3xl flex items-center justify-between group hover:bg-gold-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-600 text-white rounded-2xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h3 className="font-pashto font-bold text-gold-900">تسبيح کاؤنټر</h3>
              <p className="text-xs text-gold-700 font-pashto">خپل ذکر ثبت کړئ</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-gold-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Audio Recitation Prompt */}
      <div className="emerald-gold-gradient p-6 rounded-3xl text-white shadow-lg shadow-emerald-100 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-pashto font-bold text-lg">ټول نومونه واورئ</h3>
          <p className="text-xs opacity-90 font-pashto">۴ دقيقې آډيو تلاوت</p>
        </div>
        <button 
          onClick={onShowAudio}
          className="bg-white text-emerald-700 p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <Play className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
};

const AudioPlayer = ({ onClose }: { onClose: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 247; // Total seconds based on lyrics

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(t => {
          const next = t + 0.1;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          setProgress((next / totalDuration) * 100);
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentLyric = useMemo(() => {
    const active = [...audioLyrics].reverse().find(l => currentTime >= l.time);
    return active ? active.text : "";
  }, [currentTime]);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      <Header title="تلاوت" onBack={onClose} />
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 islamic-pattern">
        <div className="w-64 h-64 emerald-gold-gradient rounded-full flex items-center justify-center shadow-2xl relative">
          <div className="absolute inset-0 opacity-20 islamic-pattern rounded-full" />
          <motion.div 
            animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-white/20 p-8 rounded-full backdrop-blur-md flex flex-col items-center justify-center w-48 h-48"
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentLyric}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center px-4"
              >
                <span className="text-2xl font-arabic font-bold text-white leading-relaxed">
                  {currentLyric || <Volume2 className="w-16 h-16 text-white" />}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="w-full space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-pashto font-bold text-emerald-900 min-h-[3rem]">
              {currentLyric}
            </h3>
            <p className="text-slate-500 font-pashto">۴ دقيقې مکمل تلاوت</p>
          </div>
          
          <div className="relative h-2 bg-emerald-100 rounded-full overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-emerald-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-sans">
            <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')}</span>
            <span>4:07</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              setCurrentTime(Math.max(0, currentTime - 5));
              setProgress((Math.max(0, currentTime - 5) / totalDuration) * 100);
            }}
            className="p-4 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
          >
            <SkipBack className="w-8 h-8" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>
          <button 
            onClick={() => {
              setCurrentTime(Math.min(totalDuration, currentTime + 5));
              setProgress((Math.min(totalDuration, currentTime + 5) / totalDuration) * 100);
            }}
            className="p-4 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
          >
            <SkipForward className="w-8 h-8" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const NamesList = ({ 
  onNavigate 
}: { 
  onNavigate: (s: Screen, data?: any) => void;
  key?: React.Key;
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [pagerIndex, setPagerIndex] = useState(0);

  const filteredNames = useMemo(() => {
    return (namesData as Name[]).filter(n => 
      n.arabic.includes(search) || 
      n.pashto.includes(search) || 
      n.english.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col gap-4">
        {/* Search & Toggle */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="لټون..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-10 pr-4 font-pashto focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="bg-slate-100 p-1 rounded-2xl flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-xl transition-colors", viewMode === 'grid' ? "bg-white shadow-sm text-emerald-600" : "text-slate-400")}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-xl transition-colors", viewMode === 'list' ? "bg-white shadow-sm text-emerald-600" : "text-slate-400")}
            >
              <List className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('pager')}
              className={cn("p-2 rounded-xl transition-colors", viewMode === 'pager' ? "bg-white shadow-sm text-emerald-600" : "text-slate-400")}
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'pager' ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={pagerIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-6"
                >
                  <h2 className="text-8xl font-arabic font-bold text-emerald-800">{filteredNames[pagerIndex]?.arabic}</h2>
                  <p className="text-3xl font-pashto font-bold text-gold-600">{filteredNames[pagerIndex]?.pashto}</p>
                  <p className="text-slate-400 font-sans uppercase tracking-widest">{filteredNames[pagerIndex]?.english2}</p>
                  
                  <button 
                    onClick={() => onNavigate('tasbeeh', filteredNames[pagerIndex])}
                    className="mt-8 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-pashto font-bold shadow-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    ذکر پيل کړئ
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="p-8 flex justify-between items-center">
              <button 
                disabled={pagerIndex === 0}
                onClick={() => setPagerIndex(p => p - 1)}
                className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl disabled:opacity-30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="font-sans font-bold text-emerald-900">{pagerIndex + 1} / {filteredNames.length}</span>
              <button 
                disabled={pagerIndex === filteredNames.length - 1}
                onClick={() => setPagerIndex(p => p + 1)}
                className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl disabled:opacity-30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-6 pb-24 no-scrollbar">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredNames.map((name, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    onClick={() => onNavigate('detail', name)}
                    className="bg-white border border-emerald-50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2"
                  >
                    <span className="text-3xl font-arabic font-bold text-emerald-800">{name.arabic}</span>
                    <span className="text-sm font-pashto text-slate-600 text-center">{name.pashto}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredNames.map((name, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    onClick={() => onNavigate('detail', name)}
                    className="bg-white border border-emerald-50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div className="text-right">
                        <h4 className="font-pashto font-bold text-emerald-900">{name.pashto}</h4>
                        <p className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">{name.english2}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-arabic font-bold text-emerald-800">{name.arabic}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const NameDetail = ({ 
  name, 
  onNavigate 
}: { 
  name: Name; 
  onNavigate: (s: Screen, data?: any) => void;
  key?: React.Key;
}) => {
  const captureRef = useRef<HTMLDivElement>(null);

  const saveAsImage = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null,
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `${name.english}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error saving image:', err);
    }
  };

  const shareName = async () => {
    const text = `${name.arabic}\n${name.pashto}\n${name.english2}\n\n${name.benefits}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Asmaul Husna',
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('کاپي شو!');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-24">
        {/* Visual Card for Image Generation */}
        <div className="relative mb-8">
          <div 
            ref={captureRef}
            className="w-full aspect-square emerald-gold-gradient rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-8 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 islamic-pattern" />
            <h2 className="text-7xl font-arabic font-bold mb-4 z-10">{name.arabic}</h2>
            <p className="text-3xl font-pashto font-bold z-10">{name.pashto}</p>
            <div className="mt-8 pt-8 border-t border-white/20 w-full text-center z-10">
              <p className="text-sm font-sans uppercase tracking-[0.2em] opacity-80">{name.english}</p>
              <p className="text-lg font-sans font-light italic">{name.english2}</p>
            </div>
          </div>
          
          {/* Action Buttons Overlay */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            <button 
              onClick={saveAsImage}
              className="bg-white p-4 rounded-2xl shadow-xl text-emerald-600 hover:scale-110 transition-transform"
            >
              <Download className="w-6 h-6" />
            </button>
            <button 
              onClick={shareName}
              className="bg-white p-4 rounded-2xl shadow-xl text-emerald-600 hover:scale-110 transition-transform"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-12 space-y-6">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <h3 className="font-pashto font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              فضايل او ګټې
            </h3>
            <p className="text-slate-700 font-pashto leading-relaxed text-lg">
              {name.benefits}
            </p>
          </div>

          <button 
            onClick={() => onNavigate('tasbeeh', name)}
            className="w-full bg-emerald-600 text-white p-6 rounded-3xl font-pashto font-bold text-xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
            ذکر پيل کړئ
          </button>
        </div>
      </div>
    </div>
  );
};

const Tasbeeh = ({ 
  name 
}: { 
  name?: Name;
  key?: React.Key;
}) => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [vibrate, setVibrate] = useState(true);
  const [isCustom, setIsCustom] = useState(false);
  const [customVal, setCustomVal] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('tasbeeh_count');
    if (saved) setCount(parseInt(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasbeeh_count', count.toString());
    if (count > 0 && count % target === 0 && vibrate) {
      if (window.navigator.vibrate) window.navigator.vibrate(200);
    }
  }, [count, target, vibrate]);

  const progress = (count % target) / target * 100;

  return (
    <div className="flex-1 flex flex-col p-6 items-center justify-center gap-8 overflow-hidden">
      {/* Target Selector */}
      <div className="flex flex-col gap-4 w-full items-center">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
          {[33, 99, 1000].map(t => (
            <button 
              key={t}
              onClick={() => { setTarget(t); setIsCustom(false); }}
              className={cn(
                "px-4 py-2 rounded-xl font-bold transition-all text-sm",
                target === t && !isCustom ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"
              )}
            >
              {t}
            </button>
          ))}
          <button 
            onClick={() => setIsCustom(true)}
            className={cn(
              "px-4 py-2 rounded-xl font-bold transition-all text-sm",
              isCustom ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"
            )}
          >
            Custom
          </button>
        </div>
        
        {isCustom && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <input 
              type="number" 
              placeholder="هدف وټاکئ..."
              value={customVal}
              onChange={(e) => {
                setCustomVal(e.target.value);
                const val = parseInt(e.target.value);
                if (val > 0) setTarget(val);
              }}
              className="bg-slate-100 border-none rounded-xl px-4 py-2 w-32 text-center font-pashto focus:ring-2 focus:ring-emerald-500"
            />
          </motion.div>
        )}
      </div>

      {/* Counter Circle */}
      <div 
        onClick={() => setCount(c => c + 1)}
        className="relative w-64 h-64 flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle 
            cx="128" cy="128" r="115" 
            className="stroke-emerald-100 fill-none" 
            strokeWidth="10" 
          />
          <motion.circle 
            cx="128" cy="128" r="115" 
            className="stroke-emerald-600 fill-none" 
            strokeWidth="10" 
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 722" }}
            animate={{ strokeDasharray: `${(progress / 100) * 722} 722` }}
          />
        </svg>
        <div className="text-center z-10">
          <p className="text-slate-400 font-pashto text-xs mb-1">ټول ذکر</p>
          <h2 className="text-6xl font-bold text-emerald-900 font-sans">{count}</h2>
          {name && <p className="text-emerald-600 font-arabic text-xl mt-2">{name.arabic}</p>}
          <p className="text-xs text-slate-400 mt-1 font-sans">Target: {target}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-6">
        <button 
          onClick={() => setCount(0)}
          className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setVibrate(!vibrate)}
          className={cn(
            "p-4 rounded-2xl transition-colors",
            vibrate ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
          )}
        >
          {vibrate ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </div>

      <p className="text-slate-400 font-pashto text-xs text-center">
        د ذکر زياتولو لپاره هر ځای کليک کړئ
      </p>
    </div>
  );
};

const About = () => {
  const contacts = [
    { name: "عبيدالله غفاري", role: "کاريال جوړوونکی", socials: [
      { type: 'Facebook', color: 'bg-blue-600' },
      { type: 'Telegram', color: 'bg-sky-500' },
      { type: 'WhatsApp', color: 'bg-green-500' },
      { type: 'Email', color: 'bg-red-500' }
    ]},
    { name: "الحاج ډاکټر فريدون احرار", role: "جمع او ترتيب", socials: [
      { type: 'Telegram', color: 'bg-sky-500' },
      { type: 'WhatsApp', color: 'bg-green-500' },
      { type: 'Email', color: 'bg-red-500' }
    ]},
    { name: "د اسلامي کاريالونو څانګه", role: "نشروونکې اداره", socials: [
      { type: 'WhatsApp Channel', color: 'bg-green-600' },
      { type: 'Telegram Channel', color: 'bg-sky-600' }
    ]}
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-24">
      <div className="space-y-8">
        {contacts.map((c, i) => (
          <div key={i} className="bg-white border border-emerald-50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-900 font-pashto mb-1">{c.name}</h3>
            <p className="text-emerald-600 font-pashto text-sm mb-6">{c.role}</p>
            <div className="flex flex-wrap gap-3">
              {c.socials.map((s, j) => (
                <button 
                  key={j}
                  className={cn(
                    "px-4 py-2 rounded-xl text-white text-xs font-pashto font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity",
                    s.color
                  )}
                >
                  {s.type}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-center pt-8 opacity-40">
          <p className="text-xs font-pashto">ټول حقوق خوندي دي © ۲۰۲۴</p>
        </div>
      </div>
    </div>
  );
};

const Navigation = ({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) => {
  const items = [
    { id: 'home', icon: <HomeIcon className="w-6 h-6" />, label: 'کور' },
    { id: 'list', icon: <BookOpen className="w-6 h-6" />, label: 'نومونه' },
    { id: 'tasbeeh', icon: <RotateCcw className="w-6 h-6" />, label: 'تسبيح' },
    { id: 'about', icon: <Info className="w-6 h-6" />, label: 'زمونږ په اړه' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 flex justify-around items-center z-40">
      {items.map(item => (
        <button 
          key={item.id}
          onClick={() => onNavigate(item.id as Screen)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            current === item.id ? "text-emerald-600 scale-110" : "text-slate-400"
          )}
        >
          {item.icon}
          <span className="text-[10px] font-pashto font-bold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const Splash = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-emerald-600 flex flex-col items-center justify-center text-white islamic-pattern"
  >
    <div className="absolute inset-0 opacity-10 islamic-pattern" />
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-10 flex flex-col items-center"
    >
      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/30">
        <BookOpen className="w-16 h-16 text-white" />
      </div>
      <h1 className="text-4xl font-bold font-pashto mb-2">اسماء الحسنا</h1>
      <p className="text-emerald-100 font-pashto opacity-80">د الله جل جلاله ۹۹ ښکلي نومونه</p>
    </motion.div>
    <div className="absolute bottom-12 text-emerald-200/50 font-pashto text-sm">
      Loading...
    </div>
  </motion.div>
);

const ExitDialog = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-[32px] p-8 w-full max-w-xs shadow-2xl border border-emerald-100 text-center"
    >
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Info className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-xl font-bold text-emerald-900 font-pashto mb-2">وتل غواړئ؟</h3>
      <p className="text-slate-500 font-pashto mb-8">ايا واقعاً غواړئ چې له اپليکېشن څخه ووځئ؟</p>
      <div className="flex gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 font-pashto font-bold hover:bg-slate-200 transition-colors"
        >
          نه
        </button>
        <button 
          onClick={onConfirm}
          className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-pashto font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
        >
          هو
        </button>
      </div>
    </motion.div>
  </div>
);

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [isSplash, setIsSplash] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [selectedName, setSelectedName] = useState<Name | null>(null);
  const [history, setHistory] = useState<Screen[]>([]);
  const [showAudio, setShowAudio] = useState(false);

  useEffect(() => {
    // Check onboarding
    const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding');
    if (!hasSeenOnboarding) {
      setScreen('onboarding');
    }

    // Splash timer
    const timer = setTimeout(() => setIsSplash(false), 3000);

    // Capacitor Setup
    StatusBar.setBackgroundColor({ color: '#059669' }); // Emerald 600

    const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (screen === 'home') {
        setShowExitDialog(true);
      } else if (showAudio) {
        setShowAudio(false);
      } else {
        goBack();
      }
    });

    return () => {
      clearTimeout(timer);
      backListener.then(l => l.remove());
    };
  }, [screen, showAudio]);

  const randomName = useMemo(() => {
    const names = namesData as Name[];
    return names[Math.floor(Math.random() * names.length)];
  }, []);

  const navigate = (s: Screen, data?: any) => {
    if (data) setSelectedName(data);
    setHistory(prev => [...prev, screen]);
    setScreen(s);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setScreen(prev);
    } else {
      setScreen('home');
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('has_seen_onboarding', 'true');
    setScreen('home');
  };

  const getTitle = () => {
    switch(screen) {
      case 'home': return 'اسماء الحسنا';
      case 'list': return 'د الله جل جلاله نومونه';
      case 'detail': return selectedName?.arabic || 'معلومات';
      case 'tasbeeh': return 'تسبيح کاؤنټر';
      case 'about': return 'زمونږ په اړه';
      default: return '';
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white flex flex-col relative overflow-hidden shadow-2xl">
      <AnimatePresence>
        {isSplash && <Splash key="splash" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {screen === 'onboarding' ? (
          <Onboarding key="onboarding" onComplete={completeOnboarding} />
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <Header 
              title={getTitle()} 
              onBack={screen !== 'home' ? goBack : undefined} 
            />
            
            <main className="flex-1 flex flex-col overflow-hidden gradient-bg">
              <AnimatePresence mode="wait">
                {screen === 'home' && (
                  <Home 
                    key="home" 
                    onNavigate={navigate} 
                    randomName={randomName} 
                    onShowAudio={() => setShowAudio(true)}
                  />
                )}
                {screen === 'list' && <NamesList key="list" onNavigate={navigate} />}
                {screen === 'detail' && selectedName && <NameDetail key="detail" name={selectedName} onNavigate={navigate} />}
                {screen === 'tasbeeh' && <Tasbeeh key="tasbeeh" name={selectedName || undefined} />}
                {screen === 'about' && <About key="about" />}
              </AnimatePresence>
            </main>

            <Navigation current={screen} onNavigate={(s) => setScreen(s)} />
            
            <AnimatePresence>
              {showAudio && <AudioPlayer onClose={() => setShowAudio(false)} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {showExitDialog && (
        <ExitDialog 
          onConfirm={() => CapApp.exitApp()} 
          onCancel={() => setShowExitDialog(false)} 
        />
      )}
    </div>
  );
}
