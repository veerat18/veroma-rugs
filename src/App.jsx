import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Jost:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@1,400;1,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: #0d0b09;
    color: #f0ead8;
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #0d0b09; }
  ::-webkit-scrollbar-thumb { background: #c4a76b; border-radius: 2px; }

  .cf { font-family: 'Cormorant Garamond', serif; }
  .pf { font-family: 'Playfair Display', serif; }
  .gold { color: #c4a76b; }
  .muted { color: rgba(240,234,216,0.5); }

  /* ── Reveal animations ── */
  .rev { opacity: 0; transform: translateY(48px); transition: opacity 0.95s cubic-bezier(0.16,1,0.3,1), transform 0.95s cubic-bezier(0.16,1,0.3,1); }
  .rev.on { opacity: 1; transform: translateY(0); }
  .rev-l { opacity: 0; transform: translateX(-50px); transition: opacity 0.95s cubic-bezier(0.16,1,0.3,1), transform 0.95s cubic-bezier(0.16,1,0.3,1); }
  .rev-l.on { opacity: 1; transform: translateX(0); }
  .rev-r { opacity: 0; transform: translateX(50px); transition: opacity 0.95s cubic-bezier(0.16,1,0.3,1), transform 0.95s cubic-bezier(0.16,1,0.3,1); }
  .rev-r.on { opacity: 1; transform: translateX(0); }
  .d1 { transition-delay: 0.1s !important; }
  .d2 { transition-delay: 0.2s !important; }
  .d3 { transition-delay: 0.3s !important; }
  .d4 { transition-delay: 0.4s !important; }
  .d5 { transition-delay: 0.5s !important; }
  .d6 { transition-delay: 0.6s !important; }

  /* ── Marquee ── */
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .mq-track { display: flex; animation: marquee 30s linear infinite; white-space: nowrap; width: max-content; }

  /* ── Float ── */
  @keyframes float {
    0%,100% { transform: translateY(0) rotate(-1deg); }
    50% { transform: translateY(-22px) rotate(1deg); }
  }
  @keyframes floatB {
    0%,100% { transform: translateY(0) rotate(2deg); }
    50% { transform: translateY(-14px) rotate(-2deg); }
  }

  /* ── Grain overlay ── */
  @keyframes grain {
    0%,100% { transform: translate(0,0); }
    10% { transform: translate(-2%,-3%); }
    30% { transform: translate(3%,-1%); }
    50% { transform: translate(-1%,3%); }
    70% { transform: translate(2%,1%); }
    90% { transform: translate(-3%,2%); }
  }
  .grain::before {
    content: '';
    position: fixed; top: -50%; left: -50%;
    width: 200%; height: 200%;
    pointer-events: none; z-index: 9999;
    opacity: 0.022;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: grain 8s steps(10) infinite;
  }

  /* ── Nav ── */
  .nav-scrolled {
    background: rgba(13,11,9,0.94) !important;
    backdrop-filter: blur(24px) !important;
    border-bottom: 1px solid rgba(196,167,107,0.15) !important;
  }

  /* ── Buttons ── */
  .btn-g {
    display: inline-block; cursor: pointer;
    border: 1px solid #c4a76b; color: #c4a76b;
    padding: 15px 42px; font-family: 'Jost',sans-serif;
    font-size: 10.5px; letter-spacing: 3px; text-transform: uppercase;
    font-weight: 400; background: transparent;
    transition: background 0.3s ease, color 0.3s ease;
    text-decoration: none;
  }
  .btn-g:hover { background: #c4a76b; color: #0d0b09; }

  .btn-s {
    display: inline-block; cursor: pointer;
    border: 1px solid #c4a76b; color: #0d0b09;
    padding: 15px 42px; font-family: 'Jost',sans-serif;
    font-size: 10.5px; letter-spacing: 3px; text-transform: uppercase;
    font-weight: 500; background: #c4a76b;
    transition: background 0.3s ease, color 0.3s ease;
    text-decoration: none;
  }
  .btn-s:hover { background: transparent; color: #c4a76b; }

  /* ── Rug card ── */
  .rug-card { transition: transform 0.55s cubic-bezier(0.16,1,0.3,1); cursor: pointer; }
  .rug-card:hover { transform: translateY(-10px); }
  .rug-card .rug-inner { transition: transform 0.7s ease; overflow: hidden; }
  .rug-card:hover .rug-inner { transform: scale(1.04); }

  /* ── Feature card ── */
  .feat-card {
    border: 1px solid rgba(240,234,216,0.07);
    background: rgba(240,234,216,0.03);
    backdrop-filter: blur(10px);
    padding: 40px 32px;
    transition: border-color 0.3s ease, background 0.3s ease;
  }
  .feat-card:hover {
    border-color: rgba(196,167,107,0.35);
    background: rgba(196,167,107,0.05);
  }

  /* ── Form inputs ── */
  .fi {
    width: 100%; background: transparent;
    border: none; border-bottom: 1px solid rgba(240,234,216,0.18);
    color: #f0ead8; font-family: 'Jost',sans-serif;
    font-size: 14px; font-weight: 300; padding: 14px 0;
    outline: none; transition: border-color 0.3s;
  }
  .fi::placeholder { color: rgba(240,234,216,0.35); }
  .fi:focus { border-bottom-color: #c4a76b; }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .d-none-m { display: none !important; }
    .d-block-m { display: block !important; }
    .hero-title { font-size: clamp(44px,12vw,72px) !important; }
    .section-pad { padding: 80px 24px !important; }
    .grid-2 { grid-template-columns: 1fr !important; }
    .grid-3 { grid-template-columns: 1fr !important; }
    .grid-4 { grid-template-columns: 1fr 1fr !important; }
    .feat-grid { grid-template-columns: 1fr 1fr !important; }
    .about-layout { flex-direction: column !important; }
    .contact-layout { flex-direction: column !important; }
    .nav-links-d { display: none !important; }
    .nav-cta-d { display: none !important; }
  }
  @media (min-width: 769px) { .ham-btn { display: none !important; } }

  /* ── WhatsApp ── */
  .wa-btn {
    position: fixed; bottom: 32px; right: 32px;
    width: 58px; height: 58px; border-radius: 50%;
    background: #25d366; display: flex; align-items: center;
    justify-content: center; z-index: 9000; cursor: pointer;
    box-shadow: 0 8px 32px rgba(37,211,102,0.45);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
  }
  .wa-btn:hover {
    transform: scale(1.12);
    box-shadow: 0 14px 44px rgba(37,211,102,0.55);
  }

  /* ── Divider line ── */
  .gold-line {
    height: 1px; background: linear-gradient(90deg, #c4a76b, transparent);
    transform-origin: left; transform: scaleX(0);
    transition: transform 1.2s cubic-bezier(0.16,1,0.3,1);
  }
  .gold-line.on { transform: scaleX(1); }

  /* ── Process step ── */
  .proc-step { border-left: 1px solid rgba(196,167,107,0.25); padding-left: 32px; }

  /* ── Parallax section ── */
  .para-bg { background-attachment: fixed; }

  /* ── Organic shape clip ── */
  .organic-frame {
    clip-path: polygon(0 4%, 8% 0, 100% 2%, 100% 96%, 91% 100%, 0 97%);
  }
`;

/* ─────────────────────────────────────────────
   SVG RUG PATTERN COMPONENTS
───────────────────────────────────────────── */
const RugSahara = ({ style = {} }) => (
  <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', ...style }}>
    <defs>
      <pattern id="warp1" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="4" x2="8" y2="4" stroke="#a08060" strokeWidth="0.4" opacity="0.4" />
        <line x1="4" y1="0" x2="4" y2="8" stroke="#b09070" strokeWidth="0.3" opacity="0.25" />
      </pattern>
    </defs>
    <rect width="360" height="480" fill="#d4c4a4" />
    <rect width="360" height="480" fill="url(#warp1)" />
    {/* Outer border */}
    <rect x="14" y="14" width="332" height="452" fill="none" stroke="#8b6840" strokeWidth="2.5" />
    <rect x="22" y="22" width="316" height="436" fill="none" stroke="#8b6840" strokeWidth="0.8" opacity="0.6" />
    <rect x="30" y="30" width="300" height="420" fill="none" stroke="#a08050" strokeWidth="0.5" opacity="0.4" />
    {/* Diamond lattice */}
    {Array.from({ length: 9 }, (_, col) =>
      Array.from({ length: 12 }, (_, row) => {
        const cx = 52 + col * 32;
        const cy = 52 + row * 35;
        return (
          <g key={`d${col}-${row}`}>
            <polygon
              points={`${cx},${cy - 12} ${cx + 12},${cy} ${cx},${cy + 12} ${cx - 12},${cy}`}
              fill="none" stroke="#8b6840" strokeWidth="0.9" opacity="0.5"
            />
            <polygon
              points={`${cx},${cy - 6} ${cx + 6},${cy} ${cx},${cy + 6} ${cx - 6},${cy}`}
              fill="#8b6840" opacity="0.18"
            />
          </g>
        );
      })
    )}
    {/* Central medallion */}
    <circle cx="180" cy="240" r="72" fill="#a07840" opacity="0.18" stroke="#8b6840" strokeWidth="1.5" />
    <circle cx="180" cy="240" r="54" fill="none" stroke="#8b6840" strokeWidth="1" opacity="0.7" />
    <circle cx="180" cy="240" r="36" fill="#c4a76b" opacity="0.25" stroke="#8b6840" strokeWidth="1.5" />
    <circle cx="180" cy="240" r="18" fill="#8b6840" opacity="0.35" />
    {/* 8-petal flower */}
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const a2 = ((i + 0.5) / 8) * Math.PI * 2;
      return (
        <path key={`p${i}`}
          d={`M 180 240 Q ${180 + 38 * Math.cos(a - 0.3)} ${240 + 38 * Math.sin(a - 0.3)} ${180 + 54 * Math.cos(a)} ${240 + 54 * Math.sin(a)} Q ${180 + 38 * Math.cos(a + 0.3)} ${240 + 38 * Math.sin(a + 0.3)} 180 240`}
          fill="#8b6840" opacity="0.3"
        />
      );
    })}
    {/* Corner medallions */}
    {[[52, 62], [308, 62], [52, 418], [308, 418]].map(([cx, cy], i) => (
      <g key={`cm${i}`}>
        <circle cx={cx} cy={cy} r="18" fill="none" stroke="#8b6840" strokeWidth="1" opacity="0.6" />
        <circle cx={cx} cy={cy} r="9" fill="#8b6840" opacity="0.25" />
        <circle cx={cx} cy={cy} r="4" fill="#8b6840" opacity="0.4" />
      </g>
    ))}
    {/* Side medallions */}
    {[[180, 72], [180, 408]].map(([cx, cy], i) => (
      <g key={`sm${i}`}>
        <circle cx={cx} cy={cy} r="14" fill="none" stroke="#8b6840" strokeWidth="1" opacity="0.5" />
        <circle cx={cx} cy={cy} r="6" fill="#8b6840" opacity="0.3" />
      </g>
    ))}
  </svg>
);

const RugNomad = ({ style = {} }) => (
  <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', ...style }}>
    <defs>
      <pattern id="warp2" width="6" height="6" patternUnits="userSpaceOnUse">
        <line x1="0" y1="3" x2="6" y2="3" stroke="#ffffff" strokeWidth="0.3" opacity="0.06" />
      </pattern>
    </defs>
    <rect width="360" height="480" fill="#201c18" />
    <rect width="360" height="480" fill="url(#warp2)" />
    <rect x="12" y="12" width="336" height="456" fill="none" stroke="#c4a76b" strokeWidth="2" opacity="0.7" />
    <rect x="20" y="20" width="320" height="440" fill="none" stroke="#c4a76b" strokeWidth="0.6" opacity="0.35" />
    {/* Hexagonal grid */}
    {Array.from({ length: 7 }, (_, col) =>
      Array.from({ length: 10 }, (_, row) => {
        const x = 42 + col * 48 + (row % 2) * 24;
        const y = 48 + row * 42;
        const r = 18;
        const pts = Array.from({ length: 6 }, (_, k) => {
          const a = (k / 6) * Math.PI * 2 - Math.PI / 6;
          return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
        }).join(' ');
        return <polygon key={`h${col}-${row}`} points={pts} fill="none" stroke="#c4a76b" strokeWidth="0.7" opacity="0.2" />;
      })
    )}
    {/* Central medallion rings */}
    {[85, 65, 45, 28, 14].map((r, i) => (
      <circle key={`r${i}`} cx="180" cy="240" r={r}
        fill={i === 4 ? '#c4a76b' : 'none'}
        fillOpacity={i === 4 ? 0.25 : 0}
        stroke="#c4a76b" strokeWidth={i === 1 ? 2 : 1}
        opacity={0.8 - i * 0.1}
      />
    ))}
    {/* Radiating spokes */}
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return (
        <line key={`sp${i}`}
          x1={180 + 14 * Math.cos(a)} y1={240 + 14 * Math.sin(a)}
          x2={180 + 65 * Math.cos(a)} y2={240 + 65 * Math.sin(a)}
          stroke="#c4a76b" strokeWidth="0.8" opacity="0.5"
        />
      );
    })}
    {/* Star polygon */}
    {Array.from({ length: 8 }, (_, i) => {
      const a1 = (i / 8) * Math.PI * 2;
      const a2 = ((i + 0.5) / 8) * Math.PI * 2;
      return (
        <polygon key={`st${i}`}
          points={`180,240 ${180 + 45 * Math.cos(a1)},${240 + 45 * Math.sin(a1)} ${180 + 22 * Math.cos(a2)},${240 + 22 * Math.sin(a2)}`}
          fill="#c4a76b" opacity="0.12"
        />
      );
    })}
    {/* Corner ornaments */}
    {[[38, 52], [322, 52], [38, 428], [322, 428]].map(([cx, cy], i) => (
      <g key={`co${i}`}>
        <circle cx={cx} cy={cy} r="16" fill="none" stroke="#c4a76b" strokeWidth="1" opacity="0.55" />
        <circle cx={cx} cy={cy} r="7" fill="#c4a76b" opacity="0.2" />
        {Array.from({ length: 4 }, (_, k) => {
          const a = (k / 4) * Math.PI * 2;
          return <circle key={k} cx={cx + 10 * Math.cos(a)} cy={cy + 10 * Math.sin(a)} r="2" fill="#c4a76b" opacity="0.4" />;
        })}
      </g>
    ))}
  </svg>
);

const RugIvory = ({ style = {} }) => (
  <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', ...style }}>
    <defs>
      <pattern id="warp3" width="10" height="10" patternUnits="userSpaceOnUse">
        <line x1="0" y1="5" x2="10" y2="5" stroke="#8b7055" strokeWidth="0.3" opacity="0.3" />
        <line x1="5" y1="0" x2="5" y2="10" stroke="#8b7055" strokeWidth="0.2" opacity="0.2" />
      </pattern>
    </defs>
    <rect width="360" height="480" fill="#f0e8d4" />
    <rect width="360" height="480" fill="url(#warp3)" />
    {/* Multi-frame border */}
    <rect x="12" y="12" width="336" height="456" fill="none" stroke="#8b6840" strokeWidth="2" />
    <rect x="20" y="20" width="320" height="440" fill="none" stroke="#8b6840" strokeWidth="0.7" opacity="0.6" />
    <rect x="28" y="28" width="304" height="424" fill="none" stroke="#8b6840" strokeWidth="0.4" opacity="0.4" />
    {/* Organic botanical vines */}
    <g fill="none" stroke="#7a5e38" opacity="0.5" strokeWidth="1.2">
      <path d="M 180 60 C 200 100 230 120 210 160 C 190 200 200 220 180 260" />
      <path d="M 180 60 C 160 100 130 120 150 160 C 170 200 160 220 180 260" />
      <path d="M 180 260 C 200 300 230 320 210 360 C 190 400 200 420 180 440" />
      <path d="M 180 260 C 160 300 130 320 150 360 C 170 400 160 420 180 440" />
    </g>
    {/* Leaf motifs */}
    {[
      [218, 135, 35], [142, 135, -35], [215, 315, 25], [145, 315, -25],
      [235, 195, 45], [125, 195, -45], [230, 380, 40], [130, 380, -40],
    ].map(([cx, cy, rot], i) => (
      <ellipse key={`lf${i}`} cx={cx} cy={cy} rx="22" ry="10"
        transform={`rotate(${rot},${cx},${cy})`}
        fill="#8b6840" opacity="0.22" stroke="#8b6840" strokeWidth="0.7"
      />
    ))}
    {/* Center diamond */}
    <polygon points="180,218 210,248 180,278 150,248" fill="#8b6840" opacity="0.18" stroke="#8b6840" strokeWidth="1.5" />
    <circle cx="180" cy="248" r="8" fill="#8b6840" opacity="0.3" />
    {/* Dot border */}
    {Array.from({ length: 22 }, (_, i) => (
      <circle key={`db${i}`} cx={26 + i * 14} cy="22" r="2" fill="#8b6840" opacity="0.4" />
    ))}
    {Array.from({ length: 22 }, (_, i) => (
      <circle key={`db2${i}`} cx={26 + i * 14} cy="458" r="2" fill="#8b6840" opacity="0.4" />
    ))}
  </svg>
);

const RugObsidian = ({ style = {} }) => (
  <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', ...style }}>
    <defs>
      <radialGradient id="rg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#2a2218" />
        <stop offset="100%" stopColor="#0e0a06" />
      </radialGradient>
    </defs>
    <rect width="360" height="480" fill="url(#rg)" />
    <rect x="10" y="10" width="340" height="460" fill="none" stroke="#c4a76b" strokeWidth="2.5" opacity="0.75" />
    <rect x="18" y="18" width="324" height="444" fill="none" stroke="#c4a76b" strokeWidth="0.7" opacity="0.35" />
    {/* Triangular tessellation */}
    {Array.from({ length: 8 }, (_, col) =>
      Array.from({ length: 11 }, (_, row) => {
        const x = 36 + col * 40;
        const y = 42 + row * 38;
        return (
          <g key={`tr${col}-${row}`}>
            <polygon
              points={`${x},${y} ${x + 40},${y} ${x + 20},${y + 34}`}
              fill="none" stroke="#c4a76b" strokeWidth="0.6" opacity="0.18"
            />
            <polygon
              points={`${x + 40},${y} ${x + 60},${y + 34} ${x + 20},${y + 34}`}
              fill="none" stroke="#c4a76b" strokeWidth="0.6" opacity="0.12"
            />
          </g>
        );
      })
    )}
    {/* Central sun medallion */}
    {[80, 60, 42, 26, 14].map((r, i) => (
      <circle key={`or${i}`} cx="180" cy="240" r={r}
        fill={i === 4 ? '#c4a76b' : 'none'}
        fillOpacity={i === 4 ? 0.3 : 0}
        stroke="#c4a76b" strokeWidth={i === 0 ? 0.8 : i === 2 ? 1.5 : 1}
        opacity={0.9 - i * 0.08}
      />
    ))}
    {/* Sun rays */}
    {Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      const r1 = 26;
      const r2 = i % 2 === 0 ? 60 : 42;
      return (
        <line key={`ray${i}`}
          x1={180 + r1 * Math.cos(a)} y1={240 + r1 * Math.sin(a)}
          x2={180 + r2 * Math.cos(a)} y2={240 + r2 * Math.sin(a)}
          stroke="#c4a76b" strokeWidth="0.9" opacity="0.55"
        />
      );
    })}
    {/* Four corner stars */}
    {[[42, 58], [318, 58], [42, 422], [318, 422]].map(([cx, cy], i) => (
      <g key={`cs${i}`}>
        {Array.from({ length: 6 }, (_, k) => {
          const a = (k / 6) * Math.PI * 2;
          return (
            <line key={k}
              x1={cx} y1={cy}
              x2={cx + 14 * Math.cos(a)} y2={cy + 14 * Math.sin(a)}
              stroke="#c4a76b" strokeWidth="1" opacity="0.6"
            />
          );
        })}
        <circle cx={cx} cy={cy} r="4" fill="#c4a76b" opacity="0.5" />
      </g>
    ))}
  </svg>
);

/* ─────────────────────────────────────────────
   ORGANIC BLOB DECORATIONS
───────────────────────────────────────────── */
const BlobGold = ({ style = {} }) => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M 420 170 C 460 230 480 310 440 370 C 400 430 310 460 240 440 C 170 420 100 360 80 290 C 60 220 90 130 150 90 C 210 50 300 30 360 60 C 420 90 440 120 420 170 Z" fill="#c4a76b" />
  </svg>
);

const BlobDark = ({ style = {} }) => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M 380 140 C 430 200 450 300 410 370 C 370 440 270 470 190 440 C 110 410 60 330 60 250 C 60 170 110 80 190 55 C 270 30 360 50 380 140 Z" fill="#c9b99a" />
  </svg>
);

/* ─────────────────────────────────────────────
   LABEL COMPONENT
───────────────────────────────────────────── */
const SectionLabel = ({ children, light = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px' }}>
    <div style={{ width: '40px', height: '1px', background: '#c4a76b' }} />
    <span style={{
      fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase',
      color: '#c4a76b', fontFamily: 'Jost, sans-serif', fontWeight: 400,
    }}>{children}</span>
  </div>
);

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const links = ['about', 'heritage', 'custom', 'collection', 'contact'];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '20px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.45s ease',
        background: scrolled ? 'rgba(13,11,9,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(196,167,107,0.14)' : 'none',
      }}>
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, letterSpacing: '8px', color: '#f0ead8', lineHeight: 1 }}>
            VEROMA
          </div>
          <div style={{ fontSize: '8.5px', letterSpacing: '6px', color: '#c4a76b', marginTop: '3px', fontFamily: 'Jost, sans-serif' }}>
            RUGS
          </div>
        </button>

        {/* Desktop links */}
        <div className="nav-links-d" style={{ display: 'flex', gap: '38px', alignItems: 'center' }}>
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(240,234,216,0.65)', fontSize: '10.5px',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              fontFamily: 'Jost, sans-serif', fontWeight: 400,
              transition: 'color 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#c4a76b'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,234,216,0.65)'}
            >{l}</button>
          ))}
        </div>

        {/* Desktop CTA */}
        <a href="mailto:veeram.bdh@gmail.com" className="btn-g nav-cta-d"
          style={{ padding: '10px 26px', fontSize: '9.5px' }}>
          Inquire Now
        </a>

        {/* Mobile hamburger */}
        <button className="ham-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[24, 16, 24].map((w, i) => (
            <span key={i} style={{ width: w, height: '1px', background: '#f0ead8', display: 'block', transition: 'all 0.3s' }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
        background: 'rgba(13,11,9,0.97)', backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '36px',
        opacity: mobileOpen ? 1 : 0,
        pointerEvents: mobileOpen ? 'all' : 'none',
        transition: 'opacity 0.4s ease',
      }}>
        <button onClick={() => setMobileOpen(false)} style={{
          position: 'absolute', top: '24px', right: '24px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#f0ead8', fontSize: '24px',
        }}>✕</button>
        {links.map(l => (
          <button key={l} onClick={() => scrollTo(l)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '36px',
            fontWeight: 300, color: '#f0ead8', letterSpacing: '4px',
            textTransform: 'uppercase',
          }}>{l}</button>
        ))}
        <a href="mailto:veeram.bdh@gmail.com" className="btn-g" style={{ marginTop: '16px' }}>
          Inquire Now
        </a>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 120); }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section style={{
      minHeight: '100vh', background: '#0d0b09',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Background blobs */}
      <BlobGold style={{
        position: 'absolute', top: '-10%', right: '-8%',
        width: '52%', height: '70%', opacity: 0.07,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-5%', left: '-12%',
        width: '40%', height: '50%', opacity: 0.04,
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
          <circle cx="200" cy="200" r="200" fill="#c9b99a" />
        </svg>
      </div>

      {/* Floating rug visual */}
      <div className="d-none-m" style={{
        position: 'absolute', right: '6%', top: '50%',
        transform: 'translateY(-50%)',
        width: '280px', height: '380px',
        borderRadius: '62% 38% 55% 45% / 45% 55% 45% 55%',
        overflow: 'hidden',
        boxShadow: '0 50px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(196,167,107,0.12)',
        animation: 'float 7s ease-in-out infinite',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 1.2s ease 1s',
      }}>
        <RugNomad style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Second floating rug */}
      <div className="d-none-m" style={{
        position: 'absolute', right: '28%', bottom: '8%',
        width: '140px', height: '180px',
        borderRadius: '70% 30% 60% 40% / 40% 60% 40% 60%',
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        animation: 'floatB 9s ease-in-out infinite',
        opacity: loaded ? 0.8 : 0,
        transition: 'opacity 1.2s ease 1.3s',
      }}>
        <RugSahara style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Horizontal rule */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: '1px', background: 'rgba(196,167,107,0.06)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ padding: '0 8%', maxWidth: '800px', position: 'relative', zIndex: 10, paddingTop: '100px', paddingBottom: '80px' }}>
        {/* Top label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '18px',
          marginBottom: '52px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          <div style={{ width: '50px', height: '1px', background: '#c4a76b' }} />
          <span style={{ fontSize: '10px', letterSpacing: '5px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
            Bhadohi, India — Since Ancient Times
          </span>
        </div>

        {/* Title line 1 */}
        <h1 className="hero-title" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(50px,7.5vw,118px)',
          fontWeight: 300, lineHeight: 1.0,
          color: '#f0ead8', letterSpacing: '-0.025em',
          marginBottom: '0',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(60px)',
          transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.45s',
        }}>
          Crafted in
        </h1>
        <h1 className="hero-title" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(50px,7.5vw,118px)',
          fontWeight: 300, lineHeight: 1.05,
          fontStyle: 'italic', color: '#c4a76b', letterSpacing: '-0.025em',
          marginBottom: '0',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(60px)',
          transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.6s',
        }}>
          Bhadohi.
        </h1>
        <h1 className="hero-title" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(50px,7.5vw,118px)',
          fontWeight: 300, lineHeight: 1.05,
          color: '#f0ead8', letterSpacing: '-0.025em',
          marginBottom: '0',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(60px)',
          transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.75s',
        }}>
          Designed for
        </h1>
        <h1 className="hero-title" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(50px,7.5vw,118px)',
          fontWeight: 300, lineHeight: 1.05,
          color: '#f0ead8', letterSpacing: '-0.025em',
          marginBottom: '48px',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(60px)',
          transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.9s',
        }}>
          the World.
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(14px,1.4vw,17px)',
          color: 'rgba(240,234,216,0.58)',
          fontFamily: 'Jost, sans-serif',
          fontWeight: 300, lineHeight: 1.9,
          maxWidth: '460px', marginBottom: '52px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.9s ease 1.1s',
        }}>
          Luxury handcrafted rugs born from India's Carpet Capital — where five centuries of artisan mastery meet the language of contemporary global interiors.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', gap: '16px', flexWrap: 'wrap',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.9s ease 1.3s',
        }}>
          <button className="btn-g" onClick={() => scrollTo('collection')}
            style={{ cursor: 'pointer' }}>
            Explore Collection
          </button>
          <button className="btn-s" onClick={() => scrollTo('contact')}
            style={{ cursor: 'pointer' }}>
            Custom Rug Inquiry
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '36px', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        opacity: loaded ? 0.45 : 0,
        transition: 'opacity 0.8s ease 1.8s',
      }}>
        <span style={{ fontSize: '9px', letterSpacing: '3px', color: '#f0ead8', fontFamily: 'Jost, sans-serif' }}>
          SCROLL
        </span>
        <div style={{
          width: '1px', height: '48px',
          background: 'linear-gradient(to bottom, #f0ead8, transparent)',
        }} />
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   MARQUEE BAR
───────────────────────────────────────────── */
const Marquee = () => {
  const items = ['HANDCRAFTED', 'BHADOHI', 'INDIA', 'LUXURY RUGS', 'CUSTOM MADE', 'EXPORT QUALITY', 'ARTISAN CRAFTED', 'GLOBAL INTERIORS'];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div style={{
      background: '#c4a76b', overflow: 'hidden',
      padding: '16px 0', borderTop: '1px solid rgba(0,0,0,0.1)',
    }}>
      <div className="mq-track">
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'Jost, sans-serif', fontSize: '11px',
            fontWeight: 500, letterSpacing: '4px',
            color: '#0d0b09', padding: '0 40px',
            textTransform: 'uppercase', display: 'inline-block',
          }}>
            {item}
            <span style={{ marginLeft: '40px', opacity: 0.4 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────────── */
const About = () => (
  <section id="about" className="section-pad" style={{
    background: '#0d0b09', padding: '120px 8%', overflow: 'hidden',
  }}>
    {/* Big decorative text */}
    <div style={{
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: 'clamp(80px,14vw,200px)',
      fontWeight: 300,
      color: 'rgba(196,167,107,0.05)',
      lineHeight: 1, letterSpacing: '-0.02em',
      userSelect: 'none', pointerEvents: 'none',
      marginBottom: '-40px',
    }}>
      About
    </div>

    <div className="about-layout" style={{ display: 'flex', gap: '80px', alignItems: 'flex-start' }}>
      {/* Left: stats */}
      <div style={{ flexShrink: 0, width: '260px' }}>
        {[
          { num: '500+', label: 'Years of Weaving Heritage' },
          { num: '100%', label: 'Handcrafted with Natural Fibres' },
          { num: '60+', label: 'Countries Exported To' },
        ].map((s, i) => (
          <div key={i} className="rev" style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(44px,5vw,72px)',
              fontWeight: 300, color: '#c4a76b', lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              {s.num}
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(240,234,216,0.5)', marginTop: '8px', fontFamily: 'Jost, sans-serif' }}>
              {s.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Right: story */}
      <div style={{ flex: 1, maxWidth: '680px' }}>
        <div className="rev">
          <SectionLabel>Our Story</SectionLabel>
        </div>
        <h2 className="rev d1" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(32px,4vw,58px)',
          fontWeight: 300, lineHeight: 1.15,
          color: '#f0ead8', letterSpacing: '-0.01em',
          marginBottom: '36px',
        }}>
          Where Ancient Craftsmanship<br />
          <em style={{ fontStyle: 'italic', color: '#c4a76b' }}>Meets Modern Vision</em>
        </h2>

        {[
          "VEROMA RUGS is born from the soul of Bhadohi — India's legendary Carpet City, where the art of hand-weaving has been passed down through generations. We are not merely rug makers; we are custodians of a living tradition, reimagined for the discerning palates of global contemporary interiors.",
          "Every VEROMA rug is a dialogue between the hands of our master artisans and the vision of modern design. From the careful selection of premium natural fibres to the final finishing touch, each piece is an individual work of art — carrying within its weave the spirit of centuries-old mastery and the precision of bespoke craftsmanship.",
          "We collaborate with interior architects, hospitality groups, and design studios worldwide to deliver rugs that are not accessories, but foundations — transformative surfaces that define the character of a space.",
        ].map((p, i) => (
          <p key={i} className={`rev d${i + 2}`} style={{
            fontSize: 'clamp(14px,1.3vw,16px)',
            color: 'rgba(240,234,216,0.62)',
            lineHeight: 1.95, marginBottom: '24px',
            fontFamily: 'Jost, sans-serif', fontWeight: 300,
          }}>
            {p}
          </p>
        ))}

        {/* Signature line */}
        <div className="rev d5" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '48px' }}>
          <div style={{ width: '60px', height: '1px', background: '#c4a76b' }} />
          <span style={{
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
            fontSize: '20px', color: '#c4a76b', fontWeight: 400,
          }}>
            Veroma Rugs, Bhadohi
          </span>
        </div>

        {/* Rug image */}
        <div className="rev d6" style={{
          marginTop: '56px', width: '100%', maxWidth: '440px', height: '280px',
          borderRadius: '4px', overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          border: '1px solid rgba(196,167,107,0.12)',
        }}>
          <RugIvory style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   BHADOHI HERITAGE
───────────────────────────────────────────── */
const Heritage = () => (
  <section id="heritage" style={{
    background: '#141008', padding: '120px 8%', position: 'relative', overflow: 'hidden',
  }}>
    {/* Background blob */}
    <BlobDark style={{
      position: 'absolute', right: '-15%', top: '-10%',
      width: '60%', height: '80%', opacity: 0.04,
      pointerEvents: 'none',
    }} />

    {/* Decorative headline */}
    <div style={{
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: 'clamp(60px,12vw,180px)',
      fontWeight: 300, lineHeight: 0.9,
      color: 'rgba(196,167,107,0.06)',
      letterSpacing: '-0.02em',
      userSelect: 'none', pointerEvents: 'none',
      marginBottom: '-20px',
    }}>
      Heritage
    </div>

    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
      {/* Rug visual */}
      <div className="rev-l" style={{ position: 'relative' }}>
        <div style={{
          width: '100%', paddingBottom: '130%',
          borderRadius: '50% 50% 48% 52% / 42% 40% 60% 58%',
          overflow: 'hidden', position: 'relative',
          boxShadow: '0 60px 140px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,167,107,0.1)',
        }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <RugObsidian style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
        {/* Floating label */}
        <div style={{
          position: 'absolute', bottom: '10%', right: '-5%',
          background: 'rgba(13,11,9,0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(196,167,107,0.2)',
          padding: '24px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, color: '#c4a76b', lineHeight: 1 }}>
            500+
          </div>
          <div style={{ fontSize: '9.5px', letterSpacing: '3px', color: 'rgba(240,234,216,0.5)', marginTop: '6px', fontFamily: 'Jost, sans-serif' }}>
            YEARS OF CRAFT
          </div>
        </div>
      </div>

      {/* Text */}
      <div>
        <div className="rev">
          <SectionLabel>The Carpet City</SectionLabel>
        </div>
        <h2 className="rev d1" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(30px,3.5vw,52px)',
          fontWeight: 300, lineHeight: 1.2,
          color: '#f0ead8', letterSpacing: '-0.01em',
          marginBottom: '36px',
        }}>
          Bhadohi —<br />
          <em style={{ fontStyle: 'italic', color: '#c4a76b' }}>The World's Carpet Capital</em>
        </h2>

        {[
          "Nestled in the sacred Gangetic plains of Uttar Pradesh, Bhadohi is globally revered as the carpet city of India. For over five centuries, this ancient town has been the heartland of handmade rug craftsmanship, with 85% of India's hand-knotted carpet exports originating from its looms.",
          "From the grand courts of the Mughal Empire to the penthouses of Manhattan and the palaces of the Middle East — Bhadohi's rugs have graced the most prestigious interiors in the world. The city's 50,000+ artisan families carry forward an unbroken lineage of weaving knowledge, where techniques, patterns, and secrets are passed from father to son across generations.",
          "At VEROMA, we are proud inheritors of this extraordinary legacy. Our roots are planted deep in Bhadohi's craft ecosystem, yet our vision extends to every corner of the globe where refined taste meets the desire for authentic luxury.",
        ].map((p, i) => (
          <p key={i} className={`rev d${i + 2}`} style={{
            fontSize: 'clamp(14px,1.3vw,15.5px)',
            color: 'rgba(240,234,216,0.6)',
            lineHeight: 1.95, marginBottom: '22px',
            fontFamily: 'Jost, sans-serif', fontWeight: 300,
          }}>
            {p}
          </p>
        ))}

        {/* Heritage stats */}
        <div className="rev d5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '48px' }}>
          {[['85%', 'India\'s Export Share'], ['50K+', 'Artisan Families'], ['30+', 'UNESCO Recognized']].map(([n, l], i) => (
            <div key={i} style={{
              borderTop: '1px solid rgba(196,167,107,0.25)',
              paddingTop: '20px',
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#c4a76b', lineHeight: 1 }}>
                {n}
              </div>
              <div style={{ fontSize: '9.5px', letterSpacing: '1.5px', color: 'rgba(240,234,216,0.45)', marginTop: '6px', fontFamily: 'Jost, sans-serif' }}>
                {l.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   CUSTOM MANUFACTURING
───────────────────────────────────────────── */
const Custom = () => (
  <section id="custom" style={{ background: '#0d0b09', padding: '120px 8%', position: 'relative', overflow: 'hidden' }}>
    {/* Top gold line */}
    <div style={{ width: '100%', height: '1px', background: 'rgba(196,167,107,0.1)', marginBottom: '80px' }} />

    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
      <div className="rev" style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <SectionLabel>Bespoke Manufacturing</SectionLabel>
      </div>
      <h2 className="rev d1" style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(32px,4.5vw,68px)',
        fontWeight: 300, lineHeight: 1.1,
        color: '#f0ead8', letterSpacing: '-0.01em',
        maxWidth: '720px', margin: '0 auto 28px',
      }}>
        Every Rug, <em style={{ fontStyle: 'italic', color: '#c4a76b' }}>Entirely Yours</em>
      </h2>
      <p className="rev d2" style={{
        fontSize: 'clamp(14px,1.3vw,16px)',
        color: 'rgba(240,234,216,0.55)',
        lineHeight: 1.9, maxWidth: '600px', margin: '0 auto',
        fontFamily: 'Jost, sans-serif', fontWeight: 300,
      }}>
        Our bespoke rug manufacturing service transforms your vision into a tangible luxury object. From concept to completion, every detail is controlled, customised, and crafted with absolute precision.
      </p>
    </div>

    {/* Process steps */}
    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginBottom: '80px' }}>
      {[
        { n: '01', title: 'Design Consultation', desc: 'We begin with your vision — mood boards, reference images, and spatial requirements. Our design team translates ideas into technical rug specifications.' },
        { n: '02', title: 'Material Selection', desc: 'Choose from premium New Zealand wool, Himalayan hand-spun silk, Egyptian cotton, jute, bamboo silk, or bespoke blended fibres. Every material is carefully sourced.' },
        { n: '03', title: 'Custom Configuration', desc: 'Define every parameter: exact dimensions (any size or shape), pile height, texture, density, weave technique, colour palette — all tailored to your project.' },
        { n: '04', title: 'Master Artisan Crafting', desc: 'Your rug is hand-woven by our master craftsmen using time-honoured techniques including hand-knotting, hand-tufting, flat-weave, and Tibetan knotting.' },
      ].map((s, i) => (
        <div key={i} className={`rev d${i + 1}`} style={{
          background: i % 2 === 0 ? 'rgba(240,234,216,0.03)' : 'rgba(196,167,107,0.04)',
          border: '1px solid rgba(240,234,216,0.06)',
          padding: '52px 48px',
          transition: 'border-color 0.3s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(196,167,107,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(240,234,216,0.06)'}
        >
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '56px', fontWeight: 300, color: 'rgba(196,167,107,0.18)', lineHeight: 1, marginBottom: '20px' }}>
            {s.n}
          </div>
          <div style={{ width: '30px', height: '1px', background: '#c4a76b', marginBottom: '20px' }} />
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '26px', fontWeight: 400, color: '#f0ead8', marginBottom: '16px' }}>
            {s.title}
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(240,234,216,0.55)', lineHeight: 1.85, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
            {s.desc}
          </p>
        </div>
      ))}
    </div>

    {/* Capabilities grid */}
    <div className="rev" style={{ marginBottom: '56px', textAlign: 'center' }}>
      <p style={{ fontSize: '11px', letterSpacing: '3px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
        We Serve
      </p>
    </div>
    <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
      {[
        { icon: '◈', title: 'Residential Projects', desc: 'Bespoke rugs crafted for private residences, villas, and luxury apartments worldwide.' },
        { icon: '◉', title: 'Hospitality & Hotels', desc: 'Large-scale custom production for hotels, resorts, and luxury hospitality brands.' },
        { icon: '◍', title: 'Designer Collaborations', desc: 'Exclusive partnerships with interior architects, set designers, and global design studios.' },
        { icon: '◫', title: 'Commercial Spaces', desc: 'Statement floor pieces for corporate offices, galleries, showrooms, and branded environments.' },
        { icon: '◬', title: 'Export Orders', desc: 'Seamless global export with full compliance, documentation, and white-label options.' },
        { icon: '◭', title: 'Yacht & Aviation', desc: 'Ultra-premium bespoke rugs for superyachts, private jets, and exclusive transport interiors.' },
      ].map((f, i) => (
        <div key={i} className={`feat-card rev d${(i % 3) + 1}`}>
          <div style={{ fontSize: '22px', marginBottom: '18px', color: '#c4a76b' }}>{f.icon}</div>
          <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 400, color: '#f0ead8', marginBottom: '12px' }}>
            {f.title}
          </h4>
          <p style={{ fontSize: '13.5px', color: 'rgba(240,234,216,0.5)', lineHeight: 1.8, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   DESIGN PHILOSOPHY (full-bleed quote)
───────────────────────────────────────────── */
const Philosophy = () => (
  <section style={{
    background: '#1a1510',
    padding: '140px 8%',
    position: 'relative', overflow: 'hidden',
    textAlign: 'center',
  }}>
    {/* Background blob */}
    <BlobGold style={{
      position: 'absolute', top: '-20%', left: '50%',
      transform: 'translateX(-50%)',
      width: '70%', height: '140%',
      opacity: 0.04, pointerEvents: 'none',
    }} />

    <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
      <div className="rev" style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
        <SectionLabel>Design Philosophy</SectionLabel>
      </div>

      {/* Large quote mark */}
      <div className="rev d1" style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '120px', color: '#c4a76b',
        opacity: 0.15, lineHeight: 0.7,
        marginBottom: '24px',
      }}>
        "
      </div>

      <blockquote className="rev d2" style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(26px,3.5vw,52px)',
        fontWeight: 300, lineHeight: 1.3,
        color: '#f0ead8', letterSpacing: '-0.01em',
        fontStyle: 'italic', marginBottom: '48px',
        maxWidth: '800px', margin: '0 auto 48px',
      }}>
        A rug is not merely a surface upon which one stands — it is the foundation of atmosphere, the whisper of culture beneath your feet.
      </blockquote>

      <div className="rev d3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '80px' }}>
        <div style={{ width: '40px', height: '1px', background: '#c4a76b' }} />
        <span style={{ fontSize: '11px', letterSpacing: '3px', color: '#c4a76b', fontFamily: 'Jost, sans-serif' }}>
          VEROMA DESIGN ATELIER
        </span>
        <div style={{ width: '40px', height: '1px', background: '#c4a76b' }} />
      </div>

      {/* Philosophy pillars */}
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '60px', textAlign: 'left', marginTop: '80px' }}>
        {[
          { title: 'Timeless Forms', body: 'We distil centuries of pattern vocabulary into shapes that will remain relevant long after trends have faded. Beauty that endures.' },
          { title: 'Material Truth', body: 'Only natural, premium fibres are selected — each material chosen for its tactile quality, durability, and the unique character it lends to the finished piece.' },
          { title: 'Cultural Depth', body: 'Every design is rooted in the rich visual heritage of Bhadohi\'s weaving tradition, translated through a contemporary lens for modern global spaces.' },
        ].map((p, i) => (
          <div key={i} className={`rev d${i + 1}`}>
            <div style={{ width: '24px', height: '1px', background: '#c4a76b', marginBottom: '24px' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', fontWeight: 400, color: '#f0ead8', marginBottom: '14px' }}>
              {p.title}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'rgba(240,234,216,0.55)', lineHeight: 1.9, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   FEATURED RUG CONCEPTS
───────────────────────────────────────────── */
const Collection = () => (
  <section id="collection" style={{ background: '#0d0b09', padding: '120px 8%', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '72px', flexWrap: 'wrap', gap: '24px' }}>
      <div>
        <div className="rev">
          <SectionLabel>Featured Concepts</SectionLabel>
        </div>
        <h2 className="rev d1" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(30px,4vw,60px)',
          fontWeight: 300, lineHeight: 1.1,
          color: '#f0ead8', letterSpacing: '-0.01em',
        }}>
          The VEROMA<br /><em style={{ fontStyle: 'italic', color: '#c4a76b' }}>Signature Series</em>
        </h2>
      </div>
      <p className="rev d2" style={{
        maxWidth: '360px', fontSize: '14px',
        color: 'rgba(240,234,216,0.5)', lineHeight: 1.85,
        fontFamily: 'Jost, sans-serif', fontWeight: 300,
      }}>
        A curated glimpse into our design sensibility — each concept is available as a fully customised bespoke commission.
      </p>
    </div>

    {/* Rug grid — asymmetric layout */}
    <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
      {[
        { component: RugSahara, name: 'The Sahara', material: 'New Zealand Wool', palette: 'Sand · Terracotta · Ivory', size: 'Custom Sizes', height: '340px' },
        { component: RugNomad, name: 'The Nomad', material: 'Hand-Spun Silk Blend', palette: 'Charcoal · Gold · Ebony', size: 'Custom Sizes', height: '440px' },
        { component: RugIvory, name: 'Ivory Garden', material: 'Egyptian Cotton + Wool', palette: 'Ivory · Ecru · Warm Brown', size: 'Custom Sizes', height: '380px' },
        { component: RugObsidian, name: 'Obsidian', material: 'Bamboo Silk', palette: 'Onyx · Champagne · Bronze', size: 'Custom Sizes', height: '440px' },
      ].map(({ component: Comp, name, material, palette, size, height }, i) => (
        <div key={i} className={`rug-card rev d${i + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="rug-inner" style={{
            height, borderRadius: '2px',
            overflow: 'hidden',
            border: '1px solid rgba(196,167,107,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            <Comp style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ padding: '24px 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 400, color: '#f0ead8' }}>
                {name}
              </h3>
              <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#c4a76b', fontFamily: 'Jost, sans-serif', textTransform: 'uppercase' }}>
                Bespoke
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(240,234,216,0.45)', fontFamily: 'Jost, sans-serif', marginBottom: '4px' }}>
              {material}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(196,167,107,0.6)', fontFamily: 'Jost, sans-serif', letterSpacing: '0.5px' }}>
              {palette}
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="rev" style={{ textAlign: 'center', marginTop: '72px' }}>
      <a href="#contact" className="btn-g"
        onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
        Commission a Custom Rug
      </a>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   WHY CHOOSE US
───────────────────────────────────────────── */
const WhyUs = () => (
  <section style={{ background: '#111009', padding: '120px 8%', overflow: 'hidden' }}>
    {/* Horizontal divider */}
    <div style={{ width: '100%', height: '1px', background: 'rgba(196,167,107,0.1)', marginBottom: '80px' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '72px', flexWrap: 'wrap', gap: '40px' }}>
      <div>
        <div className="rev">
          <SectionLabel>Why VEROMA</SectionLabel>
        </div>
        <h2 className="rev d1" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(30px,4vw,58px)',
          fontWeight: 300, lineHeight: 1.1,
          color: '#f0ead8',
          maxWidth: '460px',
        }}>
          The Standard of<br />
          <em style={{ fontStyle: 'italic', color: '#c4a76b' }}>Uncompromising Craft</em>
        </h2>
      </div>
      <div className="rev d2" style={{
        width: '120px', height: '120px',
        borderRadius: '50%',
        border: '1px solid rgba(196,167,107,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#c4a76b', lineHeight: 1 }}>V</div>
          <div style={{ fontSize: '7px', letterSpacing: '3px', color: 'rgba(240,234,216,0.4)', marginTop: '4px', fontFamily: 'Jost, sans-serif' }}>RUGS</div>
        </div>
      </div>
    </div>

    <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
      {[
        { n: '01', title: 'Bhadohi Provenance', desc: 'Every rug originates from Bhadohi — the indisputable heartland of India\'s handmade carpet industry, with direct access to the finest artisan talent and raw materials.' },
        { n: '02', title: 'Zero Compromises', desc: 'From fibre selection to final finishing, every step is conducted with absolute quality control. We do not mass-produce. Every piece receives individual artisan attention.' },
        { n: '03', title: 'Fully Bespoke', desc: 'No standard sizes, no fixed patterns. Every VEROMA rug is a unique commission — any size, any shape, any colour, any texture — designed around your exact specifications.' },
        { n: '04', title: 'Export Excellence', desc: 'With deep expertise in international logistics, documentation, and compliance, we deliver seamlessly to clients across Europe, the Americas, GCC, and the Asia-Pacific.' },
        { n: '05', title: 'Artisan Partnership', desc: 'We work in direct partnership with master weavers — ensuring fair trade practices, preservation of craft traditions, and the highest level of skill in every commission.' },
        { n: '06', title: 'Atelier Service', desc: 'We offer white-glove design consultation, sampling, digital visualisation, and dedicated project management — treating every client as a design partner.' },
      ].map((f, i) => (
        <div key={i} className={`feat-card rev d${(i % 3) + 1}`}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '14px', fontWeight: 400, color: 'rgba(196,167,107,0.5)', letterSpacing: '2px', marginBottom: '20px' }}>
            {f.n}
          </div>
          <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '23px', fontWeight: 400, color: '#f0ead8', marginBottom: '14px' }}>
            {f.title}
          </h4>
          <p style={{ fontSize: '13.5px', color: 'rgba(240,234,216,0.5)', lineHeight: 1.85, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' });
  const [sent, setSent] = useState(false);

  // Replace with your Web3Forms Access Key to enable direct background email delivery
  const WEB3FORMS_ACCESS_KEY = "6bf6e818-4a7e-41a2-957c-d2caea8a2916";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSent(true);

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || WEB3FORMS_ACCESS_KEY.trim() === "") {
      // Fallback to launching the default mail client if key is not configured
      const subject = `Rug Inquiry from ${form.name}`;
      const body = `Name: ${form.name}\nEmail: ${form.email}\nProject Type: ${form.project}\n\n${form.message}`;
      window.location.href = `mailto:veeram.bdh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setTimeout(() => setSent(false), 4000);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          subject: `New Rug Inquiry from ${form.name}`,
          message: `Project Type: ${form.project}\n\nMessage:\n${form.message}`,
          from_name: "Veroma Rugs Website"
        })
      });
      const result = await response.json();
      if (result.success) {
        setForm({ name: '', email: '', project: '', message: '' });
      } else {
        console.error("Form submission failed", result);
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }

    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" style={{ background: '#0d0b09', padding: '120px 8%', position: 'relative', overflow: 'hidden' }}>
      {/* Background blob */}
      <BlobGold style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '45%', height: '80%', opacity: 0.05,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '80px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <div className="rev">
            <SectionLabel>Begin Your Commission</SectionLabel>
          </div>
          <h2 className="rev d1" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(30px,4.5vw,68px)',
            fontWeight: 300, lineHeight: 1.1,
            color: '#f0ead8', maxWidth: '560px',
          }}>
            Let's Create<br />
            <em style={{ fontStyle: 'italic', color: '#c4a76b' }}>Something Exceptional</em>
          </h2>
        </div>
      </div>

      <div className="contact-layout" style={{ display: 'flex', gap: '80px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Form */}
        <div className="rev" style={{ flex: 1, minWidth: '300px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label style={{ fontSize: '9px', letterSpacing: '3px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', display: 'block', marginBottom: '8px' }}>
                  Full Name
                </label>
                <input className="fi" type="text" placeholder="Your name"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: '9px', letterSpacing: '3px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', display: 'block', marginBottom: '8px' }}>
                  Email
                </label>
                <input className="fi" type="email" placeholder="your@email.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '9px', letterSpacing: '3px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', display: 'block', marginBottom: '8px' }}>
                Project Type
              </label>
              <select className="fi" value={form.project}
                onChange={e => setForm({ ...form, project: e.target.value })}
                style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="">Select your project type</option>
                <option>Residential Interior</option>
                <option>Luxury Hotel / Hospitality</option>
                <option>Commercial Space</option>
                <option>Designer / Studio Collaboration</option>
                <option>Export / Wholesale</option>
                <option>Yacht / Aviation Interior</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '9px', letterSpacing: '3px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', display: 'block', marginBottom: '8px' }}>
                Tell Us About Your Vision
              </label>
              <textarea className="fi" rows={5} placeholder="Describe your project, desired sizes, materials, colours, and any inspiration..."
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ resize: 'none' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button type="submit" className="btn-s" style={{ cursor: 'pointer' }}>
                {sent ? 'Message Sent ✓' : 'Send Inquiry'}
              </button>
              <span style={{ fontSize: '12px', color: 'rgba(240,234,216,0.4)', fontFamily: 'Jost, sans-serif' }}>
                We respond within 24 hours
              </span>
            </div>
          </form>
        </div>

        {/* Contact info */}
        <div className="rev-r" style={{ width: '320px', flexShrink: 0 }}>
          {/* Rug preview */}
          <div style={{
            width: '100%', height: '200px',
            borderRadius: '4px', overflow: 'hidden',
            border: '1px solid rgba(196,167,107,0.12)',
            marginBottom: '48px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <RugSahara style={{ width: '100%', height: '100%' }} />
          </div>

          <div style={{ borderTop: '1px solid rgba(196,167,107,0.2)', paddingTop: '40px' }}>
            {[
              { icon: '✉', label: 'Email', val: 'veeram.bdh@gmail.com', href: 'mailto:veeram.bdh@gmail.com' },
              { icon: '☎', label: 'Phone / WhatsApp', val: '+91 83186 49904', href: 'tel:+918318649904' },
              { icon: '◎', label: 'Studio', val: 'Bhadohi, Uttar Pradesh, India', href: null },
            ].map(({ icon, label, val, href }, i) => (
              <div key={i} style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '9.5px', letterSpacing: '2.5px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', marginBottom: '8px' }}>
                  {label}
                </div>
                {href ? (
                  <a href={href} style={{ fontSize: '14px', color: '#f0ead8', fontFamily: 'Jost, sans-serif', fontWeight: 300, textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#c4a76b'}
                    onMouseLeave={e => e.currentTarget.style.color = '#f0ead8'}
                  >
                    {val}
                  </a>
                ) : (
                  <span style={{ fontSize: '14px', color: 'rgba(240,234,216,0.65)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                    {val}
                  </span>
                )}
              </div>
            ))}

            {/* WhatsApp quick link */}
            <a href="https://wa.me/918318649904?text=Hello%20VEROMA%20Rugs%2C%20I'm%20interested%20in%20a%20custom%20rug%20inquiry." target="_blank" rel="noreferrer"
              className="btn-g" style={{ display: 'block', textAlign: 'center', marginTop: '32px' }}>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => (
  <footer style={{
    background: '#080604',
    padding: '60px 8% 40px',
    borderTop: '1px solid rgba(196,167,107,0.12)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '48px', marginBottom: '60px' }}>
      {/* Brand */}
      <div style={{ maxWidth: '280px' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 400, letterSpacing: '8px', color: '#f0ead8', marginBottom: '4px' }}>
          VEROMA
        </div>
        <div style={{ fontSize: '9px', letterSpacing: '6px', color: '#c4a76b', marginBottom: '20px', fontFamily: 'Jost, sans-serif' }}>
          RUGS
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(240,234,216,0.4)', lineHeight: 1.85, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
          Handcrafted luxury rugs from Bhadohi, India — designed for the world's most discerning interiors.
        </p>
      </div>

      {/* Nav links */}
      <div>
        <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', marginBottom: '20px' }}>
          Navigate
        </div>
        {['About', 'Heritage', 'Custom Rugs', 'Collection', 'Contact'].map(l => (
          <div key={l} style={{ marginBottom: '10px' }}>
            <button onClick={() => document.getElementById(l.split(' ')[0].toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(240,234,216,0.45)', fontFamily: 'Jost, sans-serif', fontWeight: 300, padding: 0, transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#c4a76b'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,234,216,0.45)'}
            >
              {l}
            </button>
          </div>
        ))}
      </div>

      {/* Contact info */}
      <div>
        <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#c4a76b', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', marginBottom: '20px' }}>
          Contact
        </div>
        {[
          ['Email', 'veeram.bdh@gmail.com'],
          ['Phone', '+91 83186 49904'],
          ['Location', 'Bhadohi, UP, India'],
        ].map(([l, v]) => (
          <div key={l} style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(196,167,107,0.6)', fontFamily: 'Jost, sans-serif', display: 'block', letterSpacing: '1px' }}>{l}</span>
            <span style={{ fontSize: '13px', color: 'rgba(240,234,216,0.5)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Mini rug */}
      <div style={{
        width: '100px', height: '130px',
        borderRadius: '50% 50% 45% 55% / 40% 40% 60% 60%',
        overflow: 'hidden',
        border: '1px solid rgba(196,167,107,0.15)',
        opacity: 0.7,
      }}>
        <RugNomad style={{ width: '100%', height: '100%' }} />
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{ borderTop: '1px solid rgba(240,234,216,0.06)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <p style={{ fontSize: '12px', color: 'rgba(240,234,216,0.28)', fontFamily: 'Jost, sans-serif', fontWeight: 300, letterSpacing: '0.5px' }}>
        VEROMA RUGS — Crafted in Bhadohi, Designed for Global Spaces.
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(240,234,216,0.25)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
        © {new Date().getFullYear()} VEROMA RUGS. All rights reserved.
      </p>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────
   WHATSAPP FLOATING BUTTON
───────────────────────────────────────────── */
const WAButton = () => (
  <a
    href="https://wa.me/918318649904?text=Hello%20VEROMA%20Rugs%2C%20I'm%20interested%20in%20a%20custom%20rug%20inquiry."
    target="_blank" rel="noreferrer"
    className="wa-btn"
    title="Chat on WhatsApp"
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  </a>
);

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────── */
const useReveal = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const refresh = () => {
      document.querySelectorAll('.rev, .rev-l, .rev-r, .gold-line').forEach(el => obs.observe(el));
    };
    refresh();
    const t = setTimeout(refresh, 600);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);
};

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  useReveal();

  return (
    <div className="grain" style={{ minHeight: '100vh', background: '#0d0b09' }}>
      <style>{STYLES}</style>
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Heritage />
      <Custom />
      <Philosophy />
      <Collection />
      <WhyUs />
      <Contact />
      <Footer />
      <WAButton />
    </div>
  );
}
