// C:\NovaCoreSite\components\BackgroundFX.jsx
import { useEffect, useState } from "react";

export default function BackgroundFX() {
  // Fokuso taškas (CSS kintamieji cover fonui)
  const [focus, setFocus] = useState({ x: "58%", y: "34%" });
  // Kiek snaigių piešti
  const [flakeCount, setFlakeCount] = useState(70);
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    // Nustatom fokusą pagal ekraną
    const pickFocus = () => {
      const w = window.innerWidth;

      // Preset'ai:
      // Desktop (≥1280): herojus centre, truputį aukščiau
      const DESKTOP = { x: "58%", y: "34%" };
      // Laptop (~1024–1279): veidas šiek tiek arčiau centro
      const LAPTOP  = { x: "60%", y: "32%" };
      // Mobile (<768): veidą keliam aukščiau, kad nesidengtų tekstu
      const MOBILE  = { x: "62%", y: "26%" };

      if (w < 768) setFocus(MOBILE);
      else if (w < 1280) setFocus(LAPTOP);
      else setFocus(DESKTOP);
    };

    // Sumažinam animaciją, jei vartotojas jos nemėgsta
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setFlakeCount(0);
    else {
      // Šiek tiek mažiau snaigių ant mažų ekranų
      const w = window.innerWidth;
      setFlakeCount(w < 768 ? 35 : w < 1280 ? 55 : 70);
    }

    pickFocus();
    window.addEventListener("resize", pickFocus);
    return () => window.removeEventListener("resize", pickFocus);
  }, []);

  // Sugeneruojam snaiges
  useEffect(() => {
    const arr = Array.from({ length: flakeCount }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${-Math.random() * 20}s`,
      dur: `${12 + Math.random() * 18}s`,
      scale: (0.6 + Math.random() * 1.4).toFixed(2),
      opacity: (0.3 + Math.random() * 0.5).toFixed(2),
    }));
    setFlakes(arr);
  }, [flakeCount]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {/* 1) blur cover – užpildo šonus, suteikia gylį */}
      <div className="bg-ice-cover-blur" />

      {/* 2) pagrindinis paveikslas (COVER) – fokuso taškas per CSS kintamuosius */}
      <div
        className="bg-lich-cover"
        style={{ "--focus-x": focus.x, "--focus-y": focus.y }}
      />

      {/* 3) skaidrūs švytėjimai */}
      <div className="bg-ice-glow" />

      {/* 4) kraštų „fade“ + 5) lengva vinjetė */}
      <div className="edge-fade" />
      <div className="bg-vignette" />

      {/* 6) snaigės */}
      <div className="absolute inset-0 overflow-hidden">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="snowflake"
            style={{
              left: f.left,
              "--delay": f.delay,
              "--dur": f.dur,
              "--scale": f.scale,
              "--opacity": f.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}