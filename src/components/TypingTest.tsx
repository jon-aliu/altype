"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import albanianTexts, { TextEntry } from "@/data/albanianTexts";

type CharState = "idle" | "correct" | "incorrect" | "current";

interface CharData {
  char: string;
  state: CharState;
}

const DURATIONS = [30, 60, 120] as const;
type Duration = (typeof DURATIONS)[number];

const EASY_MAP: Record<string, string> = {
  "ë": "e",
  "Ë": "E",
  "ç": "c",
  "Ç": "C",
};

function normalize(char: string, easy: boolean): string {
  if (!easy) return char;
  return EASY_MAP[char] ?? char;
}

const themes = {
  dark: {
    page:        "bg-[#0f0f0f] text-[#e0e0e0]",
    panel:       "bg-[#1a1a1a]",
    panelHover:  "hover:bg-[#2a2a2a]",
    track:       "bg-[#2c2e31]",
    muted:       "text-[#646669]",
    mutedHover:  "hover:text-white",
    textPrimary: "text-white",
    border:      "border-[#2c2e31]",
    btnResult:   "bg-[#2c2e31] hover:bg-[#3a3d42] text-white",
    selectOpt:   "bg-[#1a1a1a]",
    hint:        "bg-[#1a1a1a]/80",
    footer:      "text-[#3a3d42]",
    switchBg:    "bg-[#2c2e31]",
    switchKnob:  "bg-[#646669]",
  },
  light: {
    page:        "bg-[#f3f3ee] text-[#1a1a1a]",
    panel:       "bg-[#e6e6e0]",
    panelHover:  "hover:bg-[#d8d8d2]",
    track:       "bg-[#d0d0ca]",
    muted:       "text-[#888]",
    mutedHover:  "hover:text-[#1a1a1a]",
    textPrimary: "text-[#1a1a1a]",
    border:      "border-[#d0d0ca]",
    btnResult:   "bg-[#d8d8d2] hover:bg-[#c8c8c2] text-[#1a1a1a]",
    selectOpt:   "bg-[#e6e6e0]",
    hint:        "bg-[#f3f3ee]/90",
    footer:      "text-[#bbb]",
    switchBg:    "bg-[#d0d0ca]",
    switchKnob:  "bg-white",
  },
} as const;

type Theme = { [K in keyof typeof themes.dark]: string };

function charClass(state: CharState, t: Theme): string {
  switch (state) {
    case "correct":   return t.textPrimary;
    case "incorrect": return "text-[#ca4754] bg-[#ca475420] rounded";
    case "current":   return `${t.textPrimary} border-b-2 border-[#e2b714] animate-pulse`;
    default:          return t.muted;
  }
}

export default function TypingTest() {
  const [dark, setDark] = useState(true);
  const t = dark ? themes.dark : themes.light;

  const [selectedText, setSelectedText] = useState<TextEntry>(albanianTexts[0]);
  const [duration, setDuration] = useState<Duration>(60);
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [chars, setChars] = useState<CharData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [easyChars, setEasyChars] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTexts = useCallback(() => {
    if (difficulty === "all") return albanianTexts;
    return albanianTexts.filter((tx) => tx.difficulty === difficulty);
  }, [difficulty]);

  const initText = useCallback(
    (text: TextEntry) => {
      const charData: CharData[] = text.text.split("").map((c) => ({ char: c, state: "idle" as CharState }));
      if (charData.length > 0) charData[0].state = "current";
      setChars(charData);
      setCurrentIndex(0);
      setTimeLeft(duration);
      setStarted(false);
      setFinished(false);
      setCorrectCount(0);
      setIncorrectCount(0);
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [duration]
  );

  useEffect(() => {
    const texts = filteredTexts();
    const newText = texts.find((tx) => tx.id === selectedText.id) || texts[0];
    setSelectedText(newText);
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { initText(selectedText); }, [selectedText, initText]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { clearInterval(timerRef.current!); setFinished(true); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (finished) return;
      if (e.key === "Tab") { e.preventDefault(); handleRestart(); }
    },
    [finished] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (finished) return;
      const value = e.target.value;
      if (!value) return;
      const typedChar = value[value.length - 1];
      e.target.value = "";
      if (!started) setStarted(true);
      setChars((prev) => {
        const next = [...prev];
        const idx = currentIndex;
        if (idx >= next.length) return prev;
        const isCorrect = normalize(typedChar, easyChars) === normalize(next[idx].char, easyChars);
        next[idx].state = isCorrect ? "correct" : "incorrect";
        if (isCorrect) setCorrectCount((c) => c + 1);
        else setIncorrectCount((c) => c + 1);
        const nextIdx = idx + 1;
        if (nextIdx >= next.length) { setFinished(true); if (timerRef.current) clearInterval(timerRef.current); }
        else { next[nextIdx].state = "current"; setCurrentIndex(nextIdx); }
        return next;
      });
    },
    [finished, started, currentIndex, easyChars]
  );

  const handleRestart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    initText(selectedText);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [selectedText, initText]);

  const handlePickRandom = () => {
    const texts = filteredTexts();
    const remaining = texts.filter((tx) => tx.id !== selectedText.id);
    const pool = remaining.length > 0 ? remaining : texts;
    setSelectedText(pool[Math.floor(Math.random() * pool.length)]);
  };

  const elapsedSeconds = duration - timeLeft;
  const wpm = elapsedSeconds > 0 ? Math.round((correctCount / 5 / elapsedSeconds) * 60) : 0;
  const totalTyped = correctCount + incorrectCount;
  const accuracy = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 100;
  const progressPercent = ((duration - timeLeft) / duration) * 100;

  return (
    <div className={`min-h-screen ${t.page} flex flex-col items-center justify-center px-4 py-12 font-mono transition-colors duration-300`}>

      {/* Header */}
      <header className="mb-10 w-full max-w-2xl flex items-start justify-between">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${t.textPrimary}`}>
            al<span className="text-[#e2b714]">type</span>
          </h1>
          <p className={`text-sm ${t.muted} mt-1`}>testo shpejtësinë e shkrimit shqip</p>
        </div>

        {/* Dark/Light toggle */}
        <button
          onClick={() => setDark((v) => !v)}
          title={dark ? "Modaliteti i çelët" : "Modaliteti i errët"}
          className={`flex items-center gap-2 mt-1 ${t.muted} ${t.mutedHover} transition-colors text-xs select-none`}
          aria-label="toggle dark mode"
        >
          <span>{dark ? "☀️" : "🌙"}</span>
          <span className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-300 ${dark ? "bg-[#e2b714]" : t.switchBg}`}>
            <span className={`inline-block h-4 w-4 rounded-full ${t.switchKnob} shadow transition-transform duration-300 mt-0.5 ${dark ? "translate-x-4" : "translate-x-0.5"}`} />
          </span>
        </button>
      </header>

      {/* Controls */}
      {!started && !finished && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {/* Duration */}
          <div className={`flex items-center gap-1 ${t.panel} rounded-lg p-1`}>
            {DURATIONS.map((d) => (
              <button key={d} onClick={() => { setDuration(d); setTimeLeft(d); initText(selectedText); }}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${duration === d ? "bg-[#e2b714] text-[#0f0f0f] font-semibold" : `${t.muted} ${t.mutedHover}`}`}>
                {d}s
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className={`flex items-center gap-1 ${t.panel} rounded-lg p-1`}>
            {(["all", "easy", "medium", "hard"] as const).map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all capitalize ${difficulty === d ? "bg-[#e2b714] text-[#0f0f0f] font-semibold" : `${t.muted} ${t.mutedHover}`}`}>
                {d === "all" ? "të gjitha" : d}
              </button>
            ))}
          </div>

          {/* Text selector */}
          <div className={`flex items-center gap-1 ${t.panel} rounded-lg p-1`}>
            <select value={selectedText.id}
              onChange={(e) => { const tx = albanianTexts.find((x) => x.id === Number(e.target.value)); if (tx) setSelectedText(tx); }}
              className={`bg-transparent ${t.muted} ${t.mutedHover} text-sm px-2 py-1.5 outline-none cursor-pointer`}>
              {filteredTexts().map((tx) => (
                <option key={tx.id} value={tx.id} className={t.selectOpt}>{tx.title}</option>
              ))}
            </select>
          </div>

          <button onClick={handlePickRandom} title="Tekst i rastit"
            className={`${t.panel} ${t.panelHover} ${t.muted} ${t.mutedHover} px-3 py-2 rounded-lg text-sm transition-all`}>
            🔀
          </button>

          {/* ë=e toggle */}
          <button
            onClick={() => setEasyChars((v) => !v)}
            title={easyChars ? "Çaktivizo ë=e" : "Aktivizo ë=e (për tastierë pa ë)"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${easyChars ? "bg-[#e2b714] text-[#0f0f0f] border-[#e2b714]" : `${t.panel} ${t.muted} ${t.mutedHover} ${t.border}`}`}>
            <span>ë</span><span className="text-xs opacity-70">=</span><span>e</span>
          </button>
        </div>
      )}

      {/* Stats bar */}
      {(started || finished) && (
        <div className="flex gap-8 mb-6 text-center">
          <Stat label="wpm" value={wpm} highlight t={t} />
          <Stat label="saktësi" value={`${accuracy}%`} t={t} />
          <Stat label="kohë" value={`${timeLeft}s`} t={t} />
          <Stat label="gabime" value={incorrectCount} t={t} />
        </div>
      )}

      {/* Progress bar */}
      {started && !finished && (
        <div className="w-full max-w-2xl mb-3">
          <div className={`h-1 ${t.track} rounded-full overflow-hidden`}>
            <div className="h-full bg-[#e2b714] transition-all duration-1000 ease-linear" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Text display */}
      {!finished && (
        <div ref={containerRef}
          className={`relative w-full max-w-2xl ${t.panel} rounded-xl p-6 mb-4 cursor-text select-none overflow-hidden transition-colors duration-300`}
          onClick={() => inputRef.current?.focus()}
          style={{ minHeight: "140px" }}>
          <p className="text-xl leading-relaxed tracking-wide break-words whitespace-pre-wrap">
            {chars.map((c, i) => (
              <span key={i} className={charClass(c.state, t)}>{c.char}</span>
            ))}
          </p>
          {!started && (
            <div className={`absolute inset-0 flex items-center justify-center ${t.hint} rounded-xl`}>
              <span className={`${t.muted} text-sm`}>klikoni ose filloni të shkruani…</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden input */}
      {!finished && (
        <input ref={inputRef} autoFocus type="text"
          onKeyDown={handleKeyDown} onChange={handleInput}
          className="opacity-0 absolute w-0 h-0"
          aria-label="typing input" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
      )}

      {/* Results */}
      {finished && (
        <div className={`w-full max-w-2xl ${t.panel} rounded-xl p-8 text-center animate-fadeIn transition-colors duration-300`}>
          <h2 className={`text-lg ${t.muted} mb-6 font-sans`}>rezultati juaj</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <BigStat label="wpm" value={wpm} t={t} />
            <BigStat label="saktësi" value={`${accuracy}%`} t={t} />
            <BigStat label="shkronja" value={correctCount} t={t} />
            <BigStat label="gabime" value={incorrectCount} t={t} />
          </div>
          <div className={`text-sm ${t.muted} mb-6`}>
            <span className="text-[#e2b714] font-semibold">{selectedText.title}</span>{" "}
            · {selectedText.difficulty} · {duration}s
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={handleRestart}
              className="bg-[#e2b714] hover:bg-[#cba412] text-[#0f0f0f] font-semibold px-6 py-2.5 rounded-lg transition-all text-sm">
              provo sërish
            </button>
            <button onClick={handlePickRandom}
              className={`${t.btnResult} px-6 py-2.5 rounded-lg transition-all text-sm`}>
              tekst tjetër
            </button>
          </div>
        </div>
      )}

      {!finished && (
        <p className={`mt-4 ${t.muted} text-xs`}>
          <kbd className={`${t.track} px-1.5 py-0.5 rounded text-[10px]`}>Tab</kbd> rinis
        </p>
      )}

      <footer className={`mt-12 ${t.footer} text-xs`}>altype · shqip typing test</footer>
    </div>
  );
}

function Stat({ label, value, highlight, t }: { label: string; value: string | number; highlight?: boolean; t: Theme }) {
  return (
    <div>
      <div className={`text-2xl font-bold ${highlight ? "text-[#e2b714]" : t.textPrimary}`}>{value}</div>
      <div className={`text-xs ${t.muted} mt-0.5`}>{label}</div>
    </div>
  );
}

function BigStat({ label, value, t }: { label: string; value: string | number; t: Theme }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[#e2b714] text-xs uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-4xl font-bold ${t.textPrimary}`}>{value}</div>
    </div>
  );
}
