import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   SECURITY GATE SCREEN
   ═══════════════════════════════════════════ */

function SecurityGate({ onPass }) {
  const [selectedNums, setSelectedNums] = useState(new Set());
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [numbersCorrect, setNumbersCorrect] = useState(false);
  const [genreCorrect, setGenreCorrect] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shakeNums, setShakeNums] = useState(false);
  const [shakeGenre, setShakeGenre] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleNum = (n) => {
    if (numbersCorrect) return;
    const next = new Set(selectedNums);
    if (next.has(n)) next.delete(n);
    else {
      if (next.size >= 2) {
        const first = [...next][0];
        next.delete(first);
      }
      next.add(n);
    }
    setSelectedNums(next);

    if (next.size === 2) {
      if (next.has(7) && next.has(9)) {
        setTimeout(() => setNumbersCorrect(true), 400);
      } else {
        setTimeout(() => {
          setShakeNums(true);
          setTimeout(() => { setShakeNums(false); setSelectedNums(new Set()); }, 600);
        }, 300);
      }
    }
  };

  const selectGenre = (g) => {
    if (genreCorrect) return;
    setSelectedGenre(g);
    if (g === "romance") {
      setTimeout(() => {
        setGenreCorrect(true);
        setTimeout(() => {
          setShowMessage(true);
          setTimeout(() => setCanContinue(true), 2200);
        }, 600);
      }, 400);
    } else {
      setTimeout(() => {
        setShakeGenre(true);
        setTimeout(() => { setShakeGenre(false); setSelectedGenre(null); }, 600);
      }, 300);
    }
  };

  const genres = [
    { id: "accion", label: "Acci\u00f3n" },
    { id: "romance", label: "Romance" },
    { id: "terror", label: "Terror" },
  ];

  return (
    <div className="min-h-screen w-full bg-black relative overflow-x-hidden overflow-y-auto flex items-start justify-center"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Grid */}
      <div className="absolute inset-0" style={{
        opacity: 0.18,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        animation: "breathe 8s ease-in-out infinite",
      }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(0,0,0,0.8) 100%)",
      }} />

      <div className="relative z-10 w-full max-w-sm px-5 py-14" style={{ paddingBottom: "max(56px, env(safe-area-inset-bottom, 56px))", marginTop: "auto", marginBottom: "auto" }}>

        {/* Header */}
        <div className="text-center mb-10" style={{
          opacity: 0,
          animation: mounted ? "fadeSlideUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" : "none",
        }}>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div style={{ width: "28px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12))" }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div style={{ width: "28px", height: "1px", background: "linear-gradient(270deg, transparent, rgba(255,255,255,0.12))" }} />
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "11px", fontWeight: 400,
            letterSpacing: "0.4em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}>
            Pregunta de Seguridad
          </h1>
        </div>

        {/* ── Question 1: Numbers ── */}
        <div style={{
          opacity: 0,
          animation: mounted ? "fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s forwards" : "none",
        }}>
          <div className="mb-5">
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "18px", fontWeight: 300,
              color: numbersCorrect ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)",
              letterSpacing: "0.03em", lineHeight: 1.6,
              transition: "color 0.6s ease",
            }}>
              Cu\u00e1les son tus n\u00fameros favoritos?
            </p>
          </div>

          {/* Number grid */}
          <div
            className="grid grid-cols-5 gap-2 mb-3"
            style={{
              animation: shakeNums ? "shakeX 0.5s ease-in-out" : "none",
            }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const isSelected = selectedNums.has(n);
              const isCorrectNum = numbersCorrect && (n === 7 || n === 9);
              const dimmed = numbersCorrect && !isCorrectNum;

              return (
                <button
                  key={n}
                  onClick={() => toggleNum(n)}
                  disabled={numbersCorrect}
                  className="relative focus:outline-none"
                  style={{
                    width: "100%", aspectRatio: "1",
                    border: `1px solid ${
                      isCorrectNum ? "rgba(255,255,255,0.2)"
                      : isSelected ? "rgba(255,255,255,0.25)"
                      : "rgba(255,255,255,0.06)"
                    }`,
                    borderRadius: "6px",
                    background: isCorrectNum
                      ? "rgba(255,255,255,0.04)"
                      : isSelected
                      ? "rgba(255,255,255,0.03)"
                      : "transparent",
                    cursor: numbersCorrect ? "default" : "pointer",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    opacity: dimmed ? 0.2 : 1,
                    transform: isCorrectNum ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "15px", fontWeight: 400,
                    color: isCorrectNum
                      ? "rgba(255,255,255,0.6)"
                      : isSelected
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(255,255,255,0.2)",
                    transition: "color 0.35s ease",
                  }}>
                    {n}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Numbers status */}
          <div className="flex items-center gap-2 mb-8" style={{
            opacity: numbersCorrect ? 1 : 0,
            transform: numbersCorrect ? "translateY(0)" : "translateY(6px)",
            transition: "all 0.6s ease",
          }}>
            <div style={{ width: "16px", height: "1px", background: "rgba(255,255,255,0.15)" }} />
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: "9px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}>correcto</span>
          </div>
        </div>

        {/* ── Question 2: Genre ── */}
        <div style={{
          opacity: 0,
          animation: numbersCorrect
            ? "fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s forwards"
            : mounted
            ? "fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s forwards"
            : "none",
          pointerEvents: numbersCorrect ? "auto" : "none",
          filter: numbersCorrect ? "none" : "blur(2px)",
          transition: "filter 0.6s ease",
        }}>
          <div className="mb-5">
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "18px", fontWeight: 300,
              color: genreCorrect ? "rgba(255,255,255,0.3)" : numbersCorrect ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
              letterSpacing: "0.03em", lineHeight: 1.6,
              transition: "color 0.6s ease",
            }}>
              De qu\u00e9 tem\u00e1tica eran los libros que le\u00edas antes?
            </p>
          </div>

          {/* Genre options */}
          <div
            className="flex flex-col gap-2 mb-3"
            style={{
              animation: shakeGenre ? "shakeX 0.5s ease-in-out" : "none",
            }}
          >
            {genres.map((g) => {
              const isSel = selectedGenre === g.id;
              const isCorrectG = genreCorrect && g.id === "romance";
              const dimmed = genreCorrect && !isCorrectG;

              return (
                <button
                  key={g.id}
                  onClick={() => selectGenre(g.id)}
                  disabled={genreCorrect}
                  className="relative w-full text-left focus:outline-none"
                  style={{
                    padding: "14px 18px",
                    border: `1px solid ${
                      isCorrectG ? "rgba(255,255,255,0.18)"
                      : isSel ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.05)"
                    }`,
                    borderRadius: "6px",
                    background: isCorrectG
                      ? "rgba(255,255,255,0.03)"
                      : isSel
                      ? "rgba(255,255,255,0.02)"
                      : "transparent",
                    cursor: genreCorrect ? "default" : "pointer",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    opacity: dimmed ? 0.15 : 1,
                    transform: isCorrectG ? "scale(1.01)" : "scale(1)",
                  }}
                >
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "15px", fontWeight: 300,
                    color: isCorrectG
                      ? "rgba(255,255,255,0.55)"
                      : isSel
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(255,255,255,0.2)",
                    letterSpacing: "0.08em",
                    transition: "color 0.35s ease",
                  }}>
                    {g.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Genre status */}
          <div className="flex items-center gap-2 mb-6" style={{
            opacity: genreCorrect ? 1 : 0,
            transform: genreCorrect ? "translateY(0)" : "translateY(6px)",
            transition: "all 0.6s ease",
          }}>
            <div style={{ width: "16px", height: "1px", background: "rgba(255,255,255,0.15)" }} />
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: "9px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}>correcto</span>
          </div>
        </div>

        {/* ── Reveal Message ── */}
        {showMessage && (
          <div className="mt-2 mb-8" style={{
            opacity: 0,
            animation: "fadeSlideUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s forwards",
          }}>
            <div style={{
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.01)",
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "15px", fontWeight: 300, fontStyle: "italic",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.8, letterSpacing: "0.02em",
              }}>
                QUE, literalmente me super copiaste mis n\u00fameros favoritos, pero digamos que no {'>'}:(
              </p>

              <div className="mt-4" style={{
                width: "30px", height: "1px",
                background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)",
              }} />

              <p className="mt-4" style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px", fontWeight: 400,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                opacity: 0,
                animation: "fadeSlideUp 0.8s ease-out 0.8s forwards",
              }}>
                QUE CURSI, LE\u00cdA LIBROS DE ROMANCE
              </p>
            </div>
          </div>
        )}

        {/* ── Continue Button ── */}
        {canContinue && (
          <div className="flex justify-center mt-4" style={{
            opacity: 0,
            animation: "fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s forwards",
          }}>
            <button
              onClick={onPass}
              className="relative group focus:outline-none"
              style={{ cursor: "pointer" }}
            >
              <div style={{
                padding: "14px 40px",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "4px",
                background: "transparent",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "12px", fontWeight: 400,
                  letterSpacing: "0.35em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}>
                  Continuar
                </span>
              </div>

              {/* Corner accents */}
              {[
                { top: -1, left: -1 },
                { bottom: -1, right: -1 },
              ].map((pos, i) => (
                <div key={i}>
                  <div className="absolute" style={{ ...pos, width: "10px", height: "1px", background: "rgba(255,255,255,0.2)" }} />
                  <div className="absolute" style={{ ...pos, width: "1px", height: "10px", background: "rgba(255,255,255,0.2)" }} />
                </div>
              ))}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   FLOATING PARTICLES
   ═══════════════════════════════════════════ */

function Particles({ active }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: `${1.5 + Math.random() * 1.5}px`,
          height: `${1.5 + Math.random() * 1.5}px`,
          background: `rgba(212,175,55,${0.25 + Math.random() * 0.45})`,
          left: `${15 + Math.random() * 70}%`, bottom: "35%",
          "--dx": `${-25 + Math.random() * 50}px`,
          animation: `floatParticle ${2.5 + Math.random() * 3}s ease-out ${Math.random() * 1.2}s forwards`,
        }} />
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════
   HIDDEN TULIP
   ═══════════════════════════════════════════ */

function HiddenTulip({ visible, found, onFind }) {
  const [hover, setHover] = useState(false);
  if (!visible) return null;

  return (
    <div className="relative flex flex-col items-center" style={{
      opacity: 0,
      animation: found ? "none" : "tulipAppear 2.5s cubic-bezier(0.16,1,0.3,1) 1.6s forwards",
    }}>
      {!found && (
        <div className="absolute -top-5 text-center w-full" style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "10px",
          letterSpacing: "0.3em", color: "rgba(255,255,255,0.06)",
          animation: "breatheSlow 3.5s ease-in-out infinite",
        }}>. . .</div>
      )}

      <button onClick={!found ? onFind : undefined}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="relative focus:outline-none" style={{
          cursor: found ? "default" : "pointer",
          transform: found ? "scale(1.15)" : hover ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="absolute inset-0 rounded-full" style={{
          transform: "scale(3)",
          background: found
            ? "radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 65%)"
            : hover ? "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)" : "none",
          transition: "all 0.8s ease",
        }} />

        <svg width="28" height="42" viewBox="0 0 28 42" fill="none" style={{
          filter: found ? "drop-shadow(0 0 14px rgba(212,175,55,0.45))"
            : hover ? "drop-shadow(0 0 8px rgba(212,175,55,0.2))" : "none",
          transition: "filter 0.6s ease",
        }}>
          <path d="M14 42 L14 19" stroke={found ? "rgba(212,175,55,0.55)" : "rgba(255,255,255,0.08)"} strokeWidth="1.2" strokeLinecap="round" style={{ transition: "stroke 0.8s" }} />
          <path d="M14 31 Q7 27 9 22" stroke={found ? "rgba(212,175,55,0.45)" : "rgba(255,255,255,0.06)"} strokeWidth="1" fill="none" strokeLinecap="round" style={{ transition: "stroke 0.8s" }} />
          <path d="M14 29 Q21 25 19 20" stroke={found ? "rgba(212,175,55,0.45)" : "rgba(255,255,255,0.06)"} strokeWidth="1" fill="none" strokeLinecap="round" style={{ transition: "stroke 0.8s" }} />
          <path d="M14 19 Q7 15 5 5 Q10 10 14 3 Q18 10 23 5 Q21 15 14 19Z"
            fill={found ? "rgba(212,175,55,0.22)" : "rgba(255,255,255,0.02)"}
            stroke={found ? "rgba(212,175,55,0.65)" : "rgba(255,255,255,0.08)"}
            strokeWidth="1" style={{ transition: "all 0.8s" }} />
          <path d="M14 17 Q10.5 13 9.5 6.5" stroke={found ? "rgba(212,175,55,0.35)" : "rgba(255,255,255,0.03)"} strokeWidth="0.7" fill="none" style={{ transition: "stroke 0.8s" }} />
          <path d="M14 17 Q17.5 13 18.5 6.5" stroke={found ? "rgba(212,175,55,0.35)" : "rgba(255,255,255,0.03)"} strokeWidth="0.7" fill="none" style={{ transition: "stroke 0.8s" }} />
        </svg>

        {found && (
          <div className="absolute -bottom-8 left-1/2 whitespace-nowrap" style={{
            transform: "translateX(-50%)",
            fontFamily: "'Cormorant Garamond', serif", fontSize: "10px",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(212,175,55,0.45)", opacity: 0,
            animation: "fadeSlideUp 0.8s ease-out 0.2s forwards",
          }}>descubierto</div>
        )}
      </button>
    </div>
  );
}


/* ═══════════════════════════════════════════
   LOCK ICON
   ═══════════════════════════════════════════ */

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ color: "rgba(255,255,255,0.1)" }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}


/* ═══════════════════════════════════════════
   MYSTERY BOX
   ═══════════════════════════════════════════ */

function MysteryBox({ data, index, isOpen, onOpen, isLocked }) {
  const [hovered, setHovered] = useState(false);
  const [ripple, setRipple] = useState(false);
  const isThird = data.id === 3;
  const accent = isThird && !isLocked;

  const handleClick = () => {
    if (isLocked || isOpen) return;
    setRipple(true);
    setTimeout(() => { onOpen(data.id); setRipple(false); }, 350);
  };

  return (
    <div className="relative w-full" style={{
      opacity: 0, animation: `fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 0.2 + 0.4}s forwards`,
    }}>
      <button onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        disabled={isLocked} className="relative w-full text-left focus:outline-none"
        style={{ cursor: isLocked ? "not-allowed" : isOpen ? "default" : "pointer" }}
      >
        {hovered && !isLocked && !isOpen && (
          <div className="absolute -inset-1 rounded-xl pointer-events-none" style={{
            background: accent
              ? "linear-gradient(135deg, rgba(212,175,55,0.04), transparent)"
              : "linear-gradient(135deg, rgba(255,255,255,0.025), transparent)",
            filter: "blur(14px)",
          }} />
        )}

        <div className="relative rounded-lg overflow-hidden" style={{
          border: `1px solid ${
            isOpen ? (accent ? "rgba(212,175,55,0.14)" : "rgba(255,255,255,0.1)")
            : isLocked ? "rgba(255,255,255,0.025)"
            : hovered ? (accent ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.16)")
            : "rgba(255,255,255,0.06)"
          }`,
          background: isOpen ? (accent ? "rgba(212,175,55,0.015)" : "rgba(255,255,255,0.015)") : "transparent",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
          animation: accent && !isOpen ? "subtleGoldPulse 4s ease-in-out infinite" : "none",
        }}>
          {ripple && (
            <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
              background: accent
                ? "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
              animation: "rippleExpand 0.6s ease-out forwards",
            }} />
          )}

          {hovered && !isLocked && !isOpen && (
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
              <div className="absolute w-full h-px" style={{
                background: accent
                  ? "linear-gradient(90deg, transparent, rgba(212,175,55,0.14), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)",
                animation: "scanLine 2.2s ease-in-out infinite",
              }} />
            </div>
          )}

          {/* Closed */}
          <div className="flex items-center justify-between" style={{
            padding: isOpen ? "0" : "26px 24px",
            maxHeight: isOpen ? "0" : "120px",
            opacity: isOpen ? 0 : 1, overflow: "hidden",
            transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <div className="flex items-center gap-3">
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", fontWeight: 400,
                letterSpacing: "0.2em",
                color: isLocked ? "rgba(255,255,255,0.08)" : accent ? "rgba(212,175,55,0.55)" : "rgba(255,255,255,0.4)",
                transition: "color 0.5s",
              }}>{data.label}</span>
              <div style={{
                width: hovered && !isLocked ? "32px" : "20px", height: "1px",
                background: isLocked ? "rgba(255,255,255,0.03)" : accent ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.1)",
                transition: "all 0.5s",
              }} />
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: "9.5px", letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: isLocked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.2)",
                transition: "color 0.5s",
              }}>
                {isLocked ? (isThird ? "requiere llave" : "bloqueado") : "toca para revelar"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isLocked && <LockIcon />}
              {!isLocked && !isOpen && (
                <div className="flex items-center gap-1" style={{
                  opacity: hovered ? 0.5 : 0.15,
                  transform: hovered ? "translateX(0)" : "translateX(-3px)",
                  transition: "all 0.5s",
                }}>
                  {[0.5, 0.3, 0.12].map((op, i) => (
                    <div key={i} className="w-1 h-1 rounded-full" style={{
                      background: accent ? `rgba(212,175,55,${op})` : `rgba(255,255,255,${op})`,
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Open */}
          <div style={{
            padding: isOpen ? "30px 24px" : "0 24px",
            maxHeight: isOpen ? "800px" : "0",
            opacity: isOpen ? 1 : 0, overflow: "hidden",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <div className="flex items-center gap-2.5 mb-2">
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "11px", letterSpacing: "0.3em",
                color: accent ? "rgba(212,175,55,0.35)" : "rgba(255,255,255,0.18)", textTransform: "uppercase",
              }}>{data.label}</span>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "0.14em",
                color: accent ? "rgba(212,175,55,0.22)" : "rgba(255,255,255,0.1)", textTransform: "uppercase",
              }}>{data.subtitle}</span>
            </div>
            <div className="mb-5" style={{
              width: isOpen ? "44px" : "0", height: "1px",
              background: accent
                ? "linear-gradient(90deg, rgba(212,175,55,0.28), transparent)"
                : "linear-gradient(90deg, rgba(255,255,255,0.18), transparent)",
              transition: "width 0.8s ease 0.3s",
            }} />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 300,
              lineHeight: 1.75, letterSpacing: "0.02em", whiteSpace: "pre-line",
              color: accent ? "rgba(212,175,55,0.72)" : "rgba(255,255,255,0.6)",
              opacity: 0, animation: isOpen ? "fadeSlideUp 0.7s ease-out 0.35s forwards" : "none",
            }}>{data.content}</p>
            {data.hint && isOpen && (
              <p className="mt-5" style={{
                fontFamily: "'Inter', sans-serif", fontSize: "9.5px", letterSpacing: "0.1em",
                lineHeight: 1.8, color: "rgba(255,255,255,0.12)", fontStyle: "italic",
                opacity: 0, animation: "fadeSlideUp 0.7s ease-out 2.2s forwards",
              }}>{data.hint}</p>
            )}
          </div>

          {/* Corners */}
          {[{ top: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => {
            const c = isLocked ? "rgba(255,255,255,0.02)" : accent ? "rgba(212,175,55,0.22)" : "rgba(255,255,255,0.16)";
            return (
              <div key={i}>
                <div className="absolute" style={{ ...pos, width: isOpen ? "26px" : "12px", height: "1px", background: c, transition: "all 0.5s" }} />
                <div className="absolute" style={{ ...pos, width: "1px", height: isOpen ? "26px" : "12px", background: c, transition: "all 0.5s" }} />
              </div>
            );
          })}
        </div>
      </button>
    </div>
  );
}


/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

const BOX_MESSAGES = [
  { id: 1, label: "I", subtitle: "El Inicio", content: "A veces los d\u00edas son muy cansados, a veces el mundo es feo y gris... Lo lindo es saber que siempre, al final del d\u00eda, tengo mi raz\u00f3n para sonre\u00edr." },
  { id: 2, label: "II", subtitle: "El Camino", content: "No busco ser cursi ni nada por el estilo. Solo quiero recordarte lo importante que eres para m\u00ed, cu\u00e1nto significas en mi vida y lo mucho que te quiero. Cr\u00e9eme: conocerte es lo mejor que me ha pasado... y creo que no soy el \u00fanico; para muchos tenerte en sus vidas es algo realmente bonito, porque eres alguien muy especial boba.", hint: "Observa con cuidado. No todo lo que aparece es lo \u00fanico que existe." },
  { id: 3, label: "III", subtitle: "La Verdad", content: "Hay muchas cosas que quisiera decirte, pero la verdad es que no encuentro las palabras ni el momento justo. Sent\u00ed que de coraz\u00f3n necesitaba hacerte llegar esto.\n\nSolo quiero que sepas que cuentas conmigo en las buenas y en las malas. Cuando los momentos se pongan dif\u00edciles y te sientas triste, ah\u00ed estar\u00e9 para recordarte siempre lo grandiosa que eres. Tienes un lugar muy grande en mi coraz\u00f3n, porque para m\u00ed eres alguien incre\u00edble. Estoy m\u00e1s que agradecido con Dios por haberte puesto en mi camino, boba.\n\nCr\u00e9eme que no hay nada m\u00e1s lindo que verte feliz. Espero que te vaya s\u00faper bien esta semana, porque cada pasito cuenta y s\u00e9 que vas a lograr cosas grandes.\n\nTe quiero mucho cachetona (aunque te tengas los calzones al rev\u00e9s)" },
];

const GlobalStyles = () => (
  <style>{`
    @keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes scanLine { 0% { top:-1px; } 100% { top:calc(100% + 1px); } }
    @keyframes rippleExpand { from { opacity:1; transform:scale(0.85); } to { opacity:0; transform:scale(1.15); } }
    @keyframes breathe { 0%,100% { opacity:0.18; } 50% { opacity:0.28; } }
    @keyframes breatheSlow { 0%,100% { opacity:0.05; } 50% { opacity:0.12; } }
    @keyframes subtleGoldPulse { 0%,100% { box-shadow:0 0 0 0 rgba(212,175,55,0); } 50% { box-shadow:0 0 50px -15px rgba(212,175,55,0.07); } }
    @keyframes flashAnim { 0% { opacity:0; } 20% { opacity:1; } 100% { opacity:0; } }
    @keyframes tulipAppear { 0% { opacity:0; transform:translateY(10px) scale(0.88); } 100% { opacity:1; transform:translateY(0) scale(1); } }
    @keyframes floatParticle {
      0% { transform:translateY(0) translateX(0) scale(1); opacity:0; }
      12% { opacity:0.6; } 75% { opacity:0.25; }
      100% { transform:translateY(-130px) translateX(var(--dx,15px)) scale(0.2); opacity:0; }
    }
    @keyframes revealComplete { 0% { opacity:0; transform:translateY(8px); letter-spacing:0.5em; } 100% { opacity:1; transform:translateY(0); letter-spacing:0.3em; } }
    @keyframes shakeX {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(7px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(3px); }
    }
    * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
    html, body { background: #000; overflow-x: hidden; }
    button { touch-action: manipulation; -webkit-user-select: none; user-select: none; }
  `}</style>
);

export default function App() {
  const [screen, setScreen] = useState("gate"); // "gate" | "boxes"
  const [fadeOut, setFadeOut] = useState(false);

  const handlePass = () => {
    setFadeOut(true);
    setTimeout(() => setScreen("boxes"), 800);
  };

  if (screen === "gate") {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
        <GlobalStyles />
        <div style={{
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.8s ease",
        }}>
          <SecurityGate onPass={handlePass} />
        </div>
      </>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
      <GlobalStyles />
      <BoxesScreen />
    </>
  );
}

function BoxesScreen() {
  const [opened, setOpened] = useState(new Set());
  const [tulipFound, setTulipFound] = useState(false);
  const [flash, setFlash] = useState(null);
  const [particles, setParticles] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isLocked = (id) => {
    if (id === 1) return false;
    if (id === 2) return !opened.has(1);
    if (id === 3) return !(opened.has(1) && opened.has(2) && tulipFound);
    return true;
  };

  const handleOpen = (id) => {
    const next = new Set(opened);
    next.add(id);
    setOpened(next);
    setFlash("white");
    setTimeout(() => setFlash(null), 900);
  };

  const handleTulipFind = () => {
    setTulipFound(true);
    setFlash("gold");
    setParticles(true);
    setTimeout(() => setFlash(null), 1400);
    setTimeout(() => setParticles(false), 4500);
  };

  const allRevealed = opened.size === 3;
  const showTulipArea = opened.has(1) && opened.has(2) && !opened.has(3);

  return (
    <>
      <div className="min-h-screen w-full bg-black relative overflow-x-hidden overflow-y-auto"
        style={{ opacity: 0, animation: "fadeSlideUp 1s ease-out 0s forwards", WebkitOverflowScrolling: "touch" }}
      >
        <div className="absolute inset-0" style={{
          opacity: 0.18,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px", animation: "breathe 8s ease-in-out infinite",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 50% 25%, transparent 20%, rgba(0,0,0,0.8) 100%)",
        }} />

        {flash && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: flash === "gold"
              ? "radial-gradient(circle at 50% 68%, rgba(212,175,55,0.12), transparent 55%)"
              : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05), transparent 55%)",
            animation: `flashAnim ${flash === "gold" ? "1.4" : "0.9"}s ease-out forwards`, zIndex: 20,
          }} />
        )}

        <Particles active={particles} />

        <div className="relative z-10 flex flex-col items-center px-5 py-14" style={{ minHeight: "100vh", justifyContent: "center" }}>
          <div className="text-center mb-12" style={{
            opacity: 0, animation: mounted ? "fadeSlideUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s forwards" : "none",
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "10px",
              letterSpacing: "0.45em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.13)", marginBottom: "12px",
            }}>Una secuencia de tres</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(26px, 7vw, 38px)", fontWeight: 300,
              color: "rgba(255,255,255,0.78)", letterSpacing: "0.08em", lineHeight: 1.2,
            }}>Abre en Orden</h1>
            <div className="mx-auto mt-5" style={{
              width: "34px", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
            }} />
          </div>

          <div className="w-full max-w-md flex flex-col gap-4">
            {BOX_MESSAGES.map((msg, i) => (
              <MysteryBox key={msg.id} data={msg} index={i}
                isOpen={opened.has(msg.id)} onOpen={handleOpen} isLocked={isLocked(msg.id)}
              />
            ))}
          </div>

          {showTulipArea && (
            <div className="w-full max-w-md mt-5 flex flex-col items-center"
              style={{ opacity: 0, animation: "fadeSlideUp 1s ease-out 0.6s forwards" }}>
              <div className="w-full rounded-lg py-7 flex flex-col items-center relative" style={{
                border: tulipFound ? "1px solid rgba(212,175,55,0.1)" : "1px solid rgba(255,255,255,0.02)",
                background: tulipFound ? "rgba(212,175,55,0.01)" : "transparent",
                transition: "all 1s ease",
              }}>
                {!tulipFound && (
                  <p className="mb-3" style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: "10px",
                    letterSpacing: "0.22em", color: "rgba(255,255,255,0.08)",
                    textTransform: "uppercase", animation: "breatheSlow 3.5s ease-in-out infinite",
                  }}>algo se oculta aqu\u00ed</p>
                )}
                <HiddenTulip visible={true} found={tulipFound} onFind={handleTulipFind} />
                {tulipFound && (
                  <p className="mt-10" style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: "10px",
                    letterSpacing: "0.22em", color: "rgba(212,175,55,0.32)",
                    textTransform: "uppercase", opacity: 0,
                    animation: "fadeSlideUp 0.8s ease-out 0.5s forwards",
                  }}>la tercera caja ha sido liberada</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-9 flex items-center gap-3" style={{
            opacity: 0, animation: mounted ? "fadeSlideUp 0.8s ease-out 1s forwards" : "none",
          }}>
            {[1, 2, 3].map((id) => (
              <div key={id} style={{
                width: opened.has(id) ? "22px" : "5px", height: "2px", borderRadius: "1px",
                background: opened.has(id)
                  ? id === 3 ? "rgba(212,175,55,0.38)" : "rgba(255,255,255,0.28)"
                  : "rgba(255,255,255,0.05)",
                transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
              }} />
            ))}
          </div>

          {allRevealed && (
            <div className="mt-7 text-center" style={{ animation: "revealComplete 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "10px",
                letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.28)",
              }}>todo ha sido revelado</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
