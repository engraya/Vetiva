import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * [DEMO] slide imagery — placeholder photography layered over gradient
 * fallbacks, exactly as in the approved web flow. Swap for real
 * Vetiva/Dangote campaign imagery.
 */
const SLIDES = [
  {
    img: 'https://picsum.photos/seed/dangote-refinery/1200/1600',
    gradient: 'linear-gradient(135deg,#2C3018 0%,#78814B 60%,#A8B26B 100%)',
    title: 'Own a piece of the Dangote Refinery.',
    desc: "Africa's largest single-train refinery is open for public investment — subscribe from ₦100,000. [DEMO]",
  },
  {
    img: 'https://picsum.photos/seed/vetiva-fund/1200/1600',
    gradient: 'linear-gradient(150deg,#1E2013 0%,#5F673A 70%,#8D9760 100%)',
    title: 'From savings to strategy — start investing today.',
    desc: 'Explore stocks, bonds, and funds — all curated for performance and ease. [DEMO]',
  },
  {
    img: 'https://picsum.photos/seed/diaspora-usd/1200/1600',
    gradient: 'linear-gradient(160deg,#191B10 0%,#3A3D2A 60%,#6E7643 100%)',
    title: 'Invest from anywhere.',
    desc: 'Fund your subscription in USD via Flutterwave — the FX rate is shown before you confirm. [DEMO]',
  },
];

const ROTATE_MS = 6000;

/** The auth shell's inset image-slider card (client.vetiva.com style). */
export function HeroSlider({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useReducedMotion();

  function arm() {
    if (timer.current) clearInterval(timer.current);
    if (reduced) return;
    timer.current = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), ROTATE_MS);
  }

  useEffect(() => {
    arm();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <section
      aria-label="Vetiva highlights"
      className={cn(
        'relative m-7 mr-0 w-[32%] min-w-[340px] shrink-0 overflow-hidden rounded-lg bg-[#1E2013]',
        'shadow-[0_24px_60px_-18px_rgb(24_26_16/0.35)]',
        className,
      )}
    >
      <div className="absolute left-6 top-[22px] z-10 flex items-center gap-2 text-[17px] font-extrabold tracking-tight text-white">
        <span aria-hidden>Ⓥ</span> VETIVA
      </div>

      {SLIDES.map((slide, i) => (
        <div
          key={slide.title}
          aria-hidden={i !== active}
          className={cn(
            'absolute inset-0 flex items-end transition-opacity duration-1000',
            i === active ? 'z-[2] opacity-100' : 'opacity-0',
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.img}'),${slide.gradient}` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top,rgb(14 15 9/0.55) 0%,rgb(14 15 9/0.12) 45%,rgb(14 15 9/0.08) 100%)',
            }}
          />
          <div
            className="relative z-[2] m-[22px] w-full rounded-btn px-6 pb-[18px] pt-[22px] text-white"
            style={{
              background: 'rgb(30 32 19/0.38)',
              backdropFilter: 'blur(10px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(10px) saturate(1.2)',
            }}
          >
            <div className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold leading-tight tracking-[-0.02em]">
              {slide.title}
            </div>
            <div className="mt-2 text-sm leading-normal opacity-[0.94]">{slide.desc}</div>
            <div className="mt-3.5 flex gap-1.5" role="tablist" aria-label="Slides">
              {SLIDES.map((_, j) => (
                <button
                  key={j}
                  type="button"
                  role="tab"
                  aria-selected={j === active}
                  aria-label={`Slide ${j + 1}`}
                  onClick={() => {
                    setActive(j);
                    arm();
                  }}
                  className={cn(
                    'h-[7px] cursor-pointer rounded-[5px] border-none p-0 transition-all duration-250',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                    j === active ? 'w-[22px] bg-white' : 'w-[7px] rounded-full bg-white/40',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
