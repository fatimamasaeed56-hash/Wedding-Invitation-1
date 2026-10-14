import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ExternalLink, ChevronDown } from 'lucide-react';

const PHOTO = `${import.meta.env.BASE_URL}images/childhood.jpeg`;
const TARGET = new Date('2026-11-11T19:00:00+02:00').getTime();
const toAr = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 12 H92" />
        <path d="M148 12 H240" />
        <path d="M92 12 q14 -12 28 0 q14 12 28 0" />
        <path d="M92 12 q14 12 28 0 q14 -12 28 0" />
      </g>
      <circle cx="120" cy="12" r="3" fill="currentColor" />
      <circle cx="84" cy="12" r="1.6" fill="currentColor" />
      <circle cx="156" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function Rosette({ className = '' }: { className?: string }) {
  const petals = Array.from({ length: 12 });
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth=".6">
        {petals.map((_, i) => (
          <ellipse key={i} rx="9" ry="36" transform={`rotate(${i * 15})`} />
        ))}
        <circle r="46" />
        <circle r="12" />
      </g>
    </svg>
  );
}

function Seal({ onOpen, broken }: { onOpen: () => void; broken: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="افتحوا الرسالة: ختم ليالي $عمار"
      data-testid="button-wax-seal"
      className="group relative grid place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[hsl(38_60%_70%)] focus-visible:ring-offset-4 focus-visible:ring-offset-[hsl(26_38%_44%)]"
    >
      <motion.span
        animate={broken ? { scale: 1.15, opacity: 0, rotate: -12 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="breathe relative grid h-32 w-32 place-items-center rounded-full transition-transform duration-500 group-hover:scale-105 sm:h-40 sm:w-40"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, hsl(8 55% 46%), hsl(6 60% 28%) 60%, hsl(4 60% 18%))',
          boxShadow:
            'inset 0 -6px 14px hsl(4 60% 12% / .6), inset 0 6px 10px hsl(10 60% 60% / .35), 0 10px 24px hsl(20 50% 12% / .45)',
          borderRadius: '48% 52% 50% 50% / 52% 48% 52% 48%',
        }}
      >
        <span className="absolute inset-3 rounded-full border border-[hsl(38_55%_62%/.55)]" />
        <span className="absolute inset-5 rounded-full border border-dashed border-[hsl(38_55%_62%/.35)]" />
        <span
          className="font-ruqaa relative text-[1.65rem] leading-none sm:text-[2rem]"
          style={{
            color: 'hsl(38 60% 68%)',
            textShadow: '0 1px 0 hsl(4 60% 14%), 0 -1px 0 hsl(10 60% 55% / .5)',
          }}
        >
          ليالي $عمار
        </span>
      </motion.span>
    </button>
  );
}

function PhotoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[hsl(22_40%_10%/.72)] p-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-caption"
            data-testid="modal-photo"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 120, scale: 0.85, rotate: -4, opacity: 0 }}
            animate={{ y: 0, scale: 1, rotate: -1.5, opacity: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.15 }}
            className="relative w-full max-w-sm bg-[hsl(38_45%_93%)] p-4 pb-6 shadow-[0_30px_60px_hsl(20_50%_8%/.55)]"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="إغلاق الصورة"
              data-testid="button-close-modal"
              className="absolute -top-4 -left-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-[hsl(6_58%_30%)] text-[hsl(38_60%_80%)] shadow-lg transition hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(38_60%_70%)]"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative overflow-hidden border border-[hsl(30_30%_70%)]">
              <img
                src={PHOTO}
                alt="ليالي $عمار في طفولتهما، متعانقين ومبتسمين"
                className="block w-full object-cover sepia-[.35]"
                data-testid="img-childhood"
              />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_hsl(25_50%_15%/.5)]" />
            </div>
            <p
              id="photo-caption"
              className="font-ruqaa mt-5 text-center text-3xl text-[hsl(14_52%_28%)]"
              data-testid="text-caption"
            >
              يا أجمل حكايات العمر
            </p>
            <Ornament className="mx-auto mt-2 h-4 w-40 text-[hsl(38_52%_50%)]" />
            <button
              type="button"
              onClick={onClose}
              data-testid="button-continue"
              className="font-kufi mx-auto mt-4 flex items-center gap-2 rounded-full border border-[hsl(14_52%_32%)] px-5 py-2 text-sm text-[hsl(14_52%_28%)] transition hover:bg-[hsl(14_52%_32%)] hover:text-[hsl(38_50%_92%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(38_60%_60%)]"
            >
              تابعوا قراءة الرسالة
              <ChevronDown className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, TARGET - now);
  if (diff === 0)
    return <p className="font-ruqaa text-2xl text-[hsl(14_52%_30%)]">حلّ يوم الفرح</p>;
  const units = [
    ['يوم', Math.floor(diff / 864e5)],
    ['ساعة', Math.floor(diff / 36e5) % 24],
    ['دقيقة', Math.floor(diff / 6e4) % 60],
    ['ثانية', Math.floor(diff / 1e3) % 60],
  ] as const;
  return (
    <div className="flex justify-center gap-2 sm:gap-4" aria-live="off" data-testid="countdown">
      {units.map(([l, n]) => (
        <div key={l} className="min-w-[4.2rem] rounded-t-full border border-[hsl(38_52%_52%/.6)] bg-[hsl(36_48%_94%/.6)] px-2 pb-3 pt-5 text-center sm:min-w-[5.5rem]">
          <div className="font-kufi text-2xl tabular-nums text-[hsl(14_52%_28%)] sm:text-3xl">{toAr(String(n).padStart(2, '0'))}</div>
          <div className="mt-1 text-sm text-[hsl(24_22%_36%)]">{l}</div>
        </div>
      ))}
    </div>
  );
}

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const LINES = [
  'إلى من لامست قلوبهم شغاف قلوبنا',
  'اليوم نقاسمكم سرورنا وجميل شعورنا، صحبة العمر',
  'أحباء الروح',
  'بكل الود والمحبة، أتشرف بدعوتكم لحضور',
  'حفل زفافي، ومشاركتكم فرحتي، وأتشرف',
  'بحضوركم',
];

export default function Invitation() {
  const [opened, setOpened] = useState(false);
  const [modal, setModal] = useState(false);
  const reduce = useReducedMotion();
  const letterRef = useRef<HTMLElement>(null);

  const open = () => {
    if (opened) { setModal(true); return; }
    setOpened(true);
    setTimeout(() => setModal(true), reduce ? 0 : 1100);
  };
  const close = () => {
    setModal(false);
    setTimeout(() => letterRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 300);
  };

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden text-[hsl(22_40%_16%)]">
      {/* Envelope scene */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 py-12">
        <Rosette className="spin-slow pointer-events-none absolute -top-32 -right-32 h-96 w-96 text-[hsl(30_35%_55%/.25)]" />
        <Rosette className="spin-slow pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] text-[hsl(30_35%_55%/.2)]" />

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-kufi mb-8 text-center text-sm tracking-wide text-[hsl(24_30%_34%)]"
        >
          رسالة خاصة، مختومة بالمحبة
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative w-full max-w-[34rem]"
          style={{ perspective: 1400 }}
        >
          <div
            className="relative aspect-[1.45] w-full rounded-md shadow-[0_30px_50px_hsl(22_45%_18%/.4),0_4px_8px_hsl(22_45%_18%/.25)]"
            style={{ background: 'linear-gradient(160deg,hsl(28 42% 52%),hsl(24 40% 38%))' }}
          >
            {/* inner letter peeking */}
            <motion.div
              animate={opened ? { y: '-42%' } : { y: '0%' }}
              transition={{ duration: 1, delay: 0.5, ease: [0.3, 0.7, 0.2, 1] }}
              className="absolute inset-x-[6%] top-[6%] bottom-[8%] z-0 rounded-sm bg-[hsl(38_45%_93%)] p-4 text-center"
            >
              <Ornament className="mx-auto h-4 w-32 text-[hsl(38_52%_50%)]" />
              <p className="font-ruqaa mt-2 text-xl text-[hsl(14_52%_30%)]">دعوة زفاف</p>
            </motion.div>
            {/* side and bottom flaps */}
            <svg viewBox="0 0 145 100" preserveAspectRatio="none" className="absolute inset-0 z-10 h-full w-full" aria-hidden="true">
              <path d="M0 0 L72.5 58 L0 100 Z" fill="hsl(26 40% 44%)" />
              <path d="M145 0 L72.5 58 L145 100 Z" fill="hsl(26 40% 42%)" />
              <path d="M0 100 L72.5 50 L145 100 Z" fill="hsl(27 40% 48%)" />
              <path d="M0 100 L72.5 50 L145 100" fill="none" stroke="hsl(38 52% 60% / .5)" strokeWidth=".4" />
            </svg>
            {/* top flap */}
            <motion.div
              className="absolute inset-x-0 top-0 z-20 h-[62%] origin-top"
              animate={opened ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
              transition={{ duration: 0.9, ease: [0.5, 0, 0.2, 1], zIndex: { delay: 0.45 } }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <svg viewBox="0 0 145 62" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_4px_4px_hsl(22_45%_15%/.35)]" aria-hidden="true">
                <path d="M0 0 H145 L72.5 62 Z" fill="hsl(28 42% 50%)" />
                <path d="M6 2 H139 L72.5 58 Z" fill="none" stroke="hsl(38 52% 62% / .55)" strokeWidth=".5" strokeDasharray="1.5 1.5" />
              </svg>
            </motion.div>
            {/* seal */}
            <div className="absolute left-1/2 top-[62%] z-30 -translate-x-1/2 -translate-y-1/2">
              <Seal onOpen={open} broken={opened} />
            </div>
            {opened && (
              <button
                type="button"
                onClick={() => setModal(true)}
                data-testid="button-reopen-photo"
                className="font-kufi absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[hsl(36_48%_94%/.9)] px-4 py-1.5 text-xs text-[hsl(14_52%_28%)] transition hover:bg-[hsl(36_48%_98%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(38_60%_65%)]"
              >
                عرض الصورة مجددًا
              </button>
            )}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="font-kufi mt-10 text-center text-sm text-[hsl(24_30%_34%)]"
        >
          {opened ? 'انزلوا لقراءة الرسالة' : 'المسوا الختم لفتح الرسالة'}
        </motion.p>
      </section>

      <PhotoModal open={modal} onClose={close} />

      {/* Letter */}
      <section ref={letterRef} className="relative px-4 pb-16 pt-6 sm:px-6" aria-label="نص الدعوة">
        <div className="relative mx-auto max-w-2xl bg-[hsl(38_45%_93%)] px-6 py-14 shadow-[0_24px_60px_hsl(22_45%_18%/.25)] sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute inset-3 border border-[hsl(38_52%_52%/.55)]" />
          <div className="pointer-events-none absolute inset-5 border border-[hsl(38_52%_52%/.25)]" />
          {[ 'top-2 right-2', 'top-2 left-2 -scale-x-100', 'bottom-2 right-2 -scale-y-100', 'bottom-2 left-2 -scale-100' ].map((p) => (
            <svg key={p} viewBox="0 0 40 40" className={`pointer-events-none absolute h-10 w-10 text-[hsl(38_52%_48%)] ${p}`} aria-hidden="true">
              <path d="M38 4 H12 Q4 4 4 12 V38" fill="none" stroke="currentColor" />
              <path d="M30 8 Q8 8 8 30" fill="none" stroke="currentColor" strokeWidth=".6" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          ))}

          <Reveal className="text-center">
            <Rosette className="mx-auto h-16 w-16 text-[hsl(38_52%_50%)]" />
            <h1 className="font-ruqaa mt-4 text-5xl text-[hsl(14_52%_28%)] sm:text-6xl" data-testid="text-names">
              ليالي <span className="text-[hsl(38_52%_48%)]">$</span>عمار
            </h1>
            <Ornament className="mx-auto mt-4 h-5 w-56 text-[hsl(38_52%_50%)]" />
          </Reveal>

          <div className="mt-10 space-y-3 text-center text-xl leading-[2.1] sm:text-2xl" data-testid="text-invitation">
            {LINES.map((l, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <p className={i === 2 || i === 5 ? 'font-ruqaa text-2xl text-[hsl(14_52%_30%)] sm:text-3xl' : ''}>{l}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <Ornament className="mx-auto h-5 w-56 text-[hsl(38_52%_50%)]" />
            <dl className="mt-8 grid gap-6 text-center sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-x-reverse sm:divide-[hsl(38_52%_52%/.45)]">
              {[
                ['التاريخ', '١١/١١/٢٠٢٦', 'date'],
                ['المكان', 'قاعة الحياة', 'venue'],
                ['الموعد', 'من ٧ إلى ٩ مساءً', 'time'],
              ].map(([k, v, id]) => (
                <div key={id} className="px-3">
                  <dt className="font-kufi text-sm text-[hsl(38_52%_40%)]">{k}</dt>
                  <dd className="font-ruqaa mt-2 text-2xl text-[hsl(14_52%_26%)]" data-testid={`text-${id}`}>{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="mt-14 text-center">
            <p className="font-kufi mb-5 text-sm text-[hsl(24_22%_36%)]">حتى نلتقي</p>
            <Countdown />
          </Reveal>
        </div>
      </section>

      {/* Song */}
      <section className="px-4 pb-20 sm:px-6" aria-labelledby="song-title">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="song-title" className="font-ruqaa text-3xl text-[hsl(14_52%_28%)]">أغنية حكايتنا</h2>
          <p className="mt-2 text-base text-[hsl(24_22%_36%)]">اضغطوا زر التشغيل في المشغّل للاستماع</p>
          <div className="mt-6 overflow-hidden rounded-xl border border-[hsl(38_52%_52%/.5)] bg-[hsl(24_35%_30%)] p-2 shadow-lg">
            <iframe
              title="مشغّل سبوتيفاي لأغنية الدعوة"
              src="https://open.spotify.com/embed/track/6lanRgr6wXibZr8KgzXxBl?utm_source=generator"
              width="100%"
              height="152"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block rounded-lg"
              style={{ border: 0 }}
              data-testid="iframe-spotify"
            />
          </div>
          <a
            href="https://open.spotify.com/track/6lanRgr6wXibZr8KgzXxBl"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="link-spotify"
            className="font-kufi mt-5 inline-flex items-center gap-2 rounded-full border border-[hsl(14_52%_32%)] px-5 py-2 text-sm text-[hsl(14_52%_28%)] transition hover:bg-[hsl(14_52%_32%)] hover:text-[hsl(38_50%_92%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(38_60%_60%)]"
          >
            الاستماع في سبوتيفاي
            <ExternalLink className="h-4 w-4" />
          </a>
        </Reveal>
      </section>

      <footer className="pb-12 text-center">
        <Ornament className="mx-auto h-4 w-40 text-[hsl(38_52%_45%)]" />
        <p className="font-ruqaa mt-3 text-xl text-[hsl(14_52%_30%)]">ليالي $عمار</p>
      </footer>
    </main>
  );
}
