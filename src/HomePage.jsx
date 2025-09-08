import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusCircleIcon,
  BookOpenIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

/* ------------ Small helpers for consistency ------------ */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, cta, onClick, delay = 0 }) {
  return (
    <motion.button
      {...fadeUp(delay)}
      onClick={onClick}
      className="group h-full text-left rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900/10"
    >
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gray-900 text-white">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{desc}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900">
            {cta}
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ------------ Home Page ------------ */
export default function HomePage() {
  const navigate = useNavigate();
  const isAuthed = Boolean(localStorage.getItem("jwt"));

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Top brand bar */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <Container className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="grid h-9 w-9 place-items-center rounded-lg bg-gray-900 text-white"
              >
                <SparklesIcon className="h-5 w-5" />
              </motion.div>
              <span className="text-sm font-semibold tracking-tight text-gray-900">
                QuizMaster
              </span>
            </div>

            {!isAuthed && (
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Sign in
              </button>
            )}
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section>
        <Container className="py-12 sm:py-16">
          <motion.div
            {...fadeUp(0)}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
              Focused revision starts here
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What would you like to do today?
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Create a fresh quiz for a topic you just learned, or revisit your
              own quizzes to brush up and track progress.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
                View my quizzes
              </button>
            </div>
          </motion.div>

          {/* Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2">
            <ActionCard
              icon={PlusCircleIcon}
              title="Create a new quiz"
              desc="Turn fresh learning into questions while it’s still top-of-mind. Customise options and mark the correct answers."
              cta="Start creating"
              onClick={() => navigate("/create")}
              delay={0.05}
            />
            <ActionCard
              icon={BookOpenIcon}
              title="My quizzes"
              desc="Revisit your saved quizzes any time. Retake them to reinforce concepts and see where you left off."
              cta="Open my quizzes"
              onClick={() => navigate("/list")}
              delay={0.1}
            />
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <Container className="py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
            <p>© {new Date().getFullYear()} QuizMaster. Built for focused revision.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-gray-700" href="#">
                Terms
              </a>
              <a className="hover:text-gray-700" href="#">
                Privacy
              </a>
              <a className="hover:text-gray-700" href="#">
                Contact
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
