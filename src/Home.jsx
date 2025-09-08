import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------
// Animation presets
// ---------------------------------------------
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
  viewport: { once: true, amount: 0.3 },
});

const subtleFloat = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ---------------------------------------------
// Reusable UI bits
// ---------------------------------------------
function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
  );
}

function Badge({ icon: Icon, text }) {
  return (
    <motion.span
      {...fadeUp(0)}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm"
    >
      <Icon className="h-4 w-4" />
      {text}
    </motion.span>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay = 0 }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="group relative h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Timeline item
function TimelineItem({ step, title, desc, isLast = false }) {
  return (
    <motion.li variants={item} className="relative pl-10">
      {/* vertical line */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[15px] top-5 h-[calc(100%-20px)] w-px bg-gray-200"
        />
      )}
      {/* dot */}
      <motion.span
        className="absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold shadow"
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        {step}
      </motion.span>

      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </motion.li>
  );
}

// put these ABOVE `export default function LandingPage() { ... }`
const PHRASES = [
  "Quiz Master",
  "Revision is now effective",
  "Brush up.Retake.Master.",
  "Your learning trail, made clear.",
];

function useTypewriter(words, { typeSpeed = 52, deleteSpeed = 32, pauseMs = 1200 } = {}) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];

    if (!deleting && sub === current.length) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }
    if (deleting && sub === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }

    const timeout = setTimeout(() => {
      setSub((s) => s + (deleting ? -1 : 1));
    }, deleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [words, index, sub, deleting, typeSpeed, deleteSpeed, pauseMs]);

  return words[index % words.length].slice(0, sub);
}

// ---------------------------------------------
// Page
// ---------------------------------------------
export default function LandingPage() {
  const navigate = useNavigate();


const typed = useTypewriter(PHRASES, { typeSpeed: 46, deleteSpeed: 30, pauseMs: 1100 });

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      {/* ---- Fixed Nav (flush to top) ---- */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 h-14 border-b border-gray-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      >
        <Container className="h-full">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div {...subtleFloat} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white">
                <SparklesIcon className="h-5 w-5" />
              </motion.div>
              <span className="text-sm font-semibold tracking-tight">QuizMaster</span>
            </div>
            <nav className="hidden items-center gap-3 sm:flex">
              <button onClick={() => navigate("/create")} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Create
              </button>
              <button onClick={() => navigate("/list")} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Revise
              </button>
              <button onClick={() => navigate("/login")} className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-black">
                Sign in
              </button>
            </nav>
          </div>
        </Container>
      </motion.header>

      {/* Spacer for fixed header height */}
      <div className="h-14" />

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden mt-200">
        <Container className="py-14 sm:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <Badge icon={AcademicCapIcon} text="Revision-first quiz platform" />




<motion.h1
  {...fadeUp(0.05)}
  className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
  aria-live="polite"
>
  <span className="align-middle">{typed}</span>
  {/* blinking caret */}
  <motion.span
    className="inline-block w-[2px] h-[1em] align-middle bg-gray-900 ml-1"
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    aria-hidden="true"
  />
</motion.h1>

              <motion.p {...fadeUp(0.1)} className="mt-3 max-w-xl text-base leading-relaxed text-gray-600">
                Create and customise quizzes right after you learn a topic. Come back any time, retake your own quiz,
                and instantly see where you left your learning journey.
              </motion.p>

              <motion.div {...fadeUp(0.15)} className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/create")}
                  className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
                >
                  Start creating
                </button>
                <button
                  onClick={() => navigate("/list")}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Review my quizzes
                </button>
              </motion.div>

              <motion.div {...fadeUp(0.2)} className="mt-6 flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-gray-900" />
                  No fluff—clean UI
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <ClockIcon className="h-4 w-4 text-gray-900" />
                  Fast & distraction-free
                </div>
              </motion.div>
            </div>

            {/* Hero Illustration */}
            <motion.div
              {...fadeUp(0.1)}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="grid gap-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                    <PencilSquareIcon className="h-4 w-4 text-gray-900" /> New Quiz
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-8 rounded-lg bg-gray-100" />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                    <ArrowPathIcon className="h-4 w-4 text-gray-900" /> Quick Revisions
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 rounded-lg bg-gray-100" />
                    <div className="h-8 w-16 rounded-lg bg-gray-100" />
                    <div className="h-8 w-24 rounded-lg bg-gray-100" />
                  </div>
                </div>
              </div>
              {/* subtle floating accent */}
              <motion.div
                {...subtleFloat}
                className="pointer-events-none absolute -right-3 -top-3 hidden rounded-xl border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm md:block"
              >
                Save • Retake • Master
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ---- Features ---- */}
      <section>
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2 {...fadeUp(0)} className="text-2xl font-bold sm:text-3xl">
              Built for serious revision
            </motion.h2>
            <motion.p {...fadeUp(0.05)} className="mt-2 text-sm text-gray-600">
              Clean spacing. Professional typography. Just the tools you need to lock concepts into long-term memory.
            </motion.p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={PencilSquareIcon}
              title="Create & customise"
              desc="Write your own questions after learning a topic. Multiple choice or short answers—your call."
            />
            <FeatureCard
              icon={BookOpenIcon}
              title="Revisit anytime"
              desc="Return to your quizzes whenever you want. Perfect for quick brushing up before interviews or exams."
              delay={0.05}
            />
            <FeatureCard
              icon={ArrowPathIcon}
              title="Spaced repetition friendly"
              desc="Retake quizzes in cycles and reinforce the weak spots with immediate feedback."
              delay={0.1}
            />
          </div>
        </Container>
      </section>

      {/* ---- How it works (Animated Timeline) ---- */}
      <section className="border-t border-gray-100">
        <Container className="py-10 sm:py-14">
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <motion.h3 {...fadeUp(0)} className="text-xl font-bold sm:text-2xl">
                How it works
              </motion.h3>

              <motion.ol
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="mt-6 space-y-6"
              >
                <TimelineItem
                  step={1}
                  title="Capture what you just learned"
                  desc="Right after finishing a topic, jot down a handful of core questions. Keep them tight and concept-focused."
                />
                <TimelineItem
                  step={2}
                  title="Test yourself in minutes"
                  desc="Run through your questions. See instant feedback and identify the exact gaps in your understanding."
                />
                <TimelineItem
                  step={3}
                  title="Return and refine"
                  desc="Come back later and retake your quiz. Watch weak areas turn strong with each pass."
                  isLast
                />
              </motion.ol>
            </div>

            <motion.div
              {...fadeUp(0.1)}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <BookOpenIcon className="h-5 w-5" /> Your learning trail
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Every quiz you create becomes a timestamp in your journey. When you revisit, you instantly see where you
                left off—and what deserves another look.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.03 * i }}
                    className="h-16 rounded-xl border border-gray-200 bg-gray-50"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ---- CTA ---- */}
      <section>
        <Container className="py-12 sm:py-16">
          <motion.div
            {...fadeUp(0)}
            className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left"
          >
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900">
                Ready to turn knowledge into mastery?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Create your first revision quiz now and build momentum. Your future self will thank you.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/create")}
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
              >
                Create a quiz
              </button>
              <button
                onClick={() => navigate("/list")}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Review mine
              </button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-top border-gray-100">
        <Container className="py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
            <p>© {new Date().getFullYear()} QuizMaster. Built for focused revision.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-gray-700" href="#">Terms</a>
              <a className="hover:text-gray-700" href="#">Privacy</a>
              <a className="hover:text-gray-700" href="#">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
