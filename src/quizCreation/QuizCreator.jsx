import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  SparklesIcon,
  ArrowPathIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

/* ---------- Helpers ---------- */
const createBlankQuestion = () => ({
  questionText: "",
  choices: [
    { choiceText: "", correct: false },
    { choiceText: "", correct: false },
    { choiceText: "", correct: false },
  ],
});

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({ x: direction < 0 ? 40 : -40, opacity: 0, scale: 0.98 }),
};

const ProgressBar = ({ current, total }) => {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full h-2 rounded-full bg-gray-200">
      <motion.div
        className="h-2 rounded-full bg-gray-900"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
};

const QuestionCounter = ({ current, total }) => (
  <div className="mt-4 mb-6 flex justify-center">
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
      <QuestionMarkCircleIcon className="h-4 w-4 text-gray-900" />
      Question {current} of {total}
    </div>
  </div>
);

/* ---------- Main ---------- */
export default function QuizCreator({ passTitle, quizId }) {
  const [questions, setQuestions] = useState([createBlankQuestion()]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [direction, setDirection] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* Handlers */
  const handleQuestionTextChange = useCallback((qi, text) => {
    setQuestions((prev) => {
      const next = [...prev];
      if (!next[qi]) return prev;
      next[qi] = { ...next[qi], questionText: text };
      return next;
    });
  }, []);

  const handleChoiceTextChange = useCallback((qi, ci, text) => {
    setQuestions((prev) => {
      const next = [...prev];
      const q = next[qi];
      if (!q) return prev;
      const choices = q.choices.map((c, i) => (i === ci ? { ...c, choiceText: text } : c));
      next[qi] = { ...q, choices };
      return next;
    });
  }, []);

  const handleCorrectChoiceChange = useCallback((qi, ci) => {
    setQuestions((prev) => {
      const next = [...prev];
      const q = next[qi];
      if (!q) return prev;
      const choices = q.choices.map((c, i) => ({ ...c, correct: i === ci }));
      next[qi] = { ...q, choices };
      return next;
    });
  }, []);

  /* Navigation */
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setQuestions((prev) => {
      if (currentIndex === prev.length - 1) return [...prev, createBlankQuestion()];
      return prev;
    });
    setCurrentIndex((i) => i + 1);
  };

  /* Delete (with confirm + safe index math) */
  const confirmDelete = () => {
    if (questions.length <= 1) return; // guard: keep at least one
    const updated = [...questions];
    updated.splice(currentIndex, 1);
    const newLen = updated.length;
    const newIndex = Math.max(0, Math.min(currentIndex, newLen - 1));
    setQuestions(updated);
    setCurrentIndex(newIndex);
    setShowDeleteConfirm(false);
  };

  /* Submit */
  const handleSubmitAllQuestions = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // light validation
    const invalid = questions.some(
      (q) =>
        !q.questionText.trim() ||
        q.choices.some((c) => !c.choiceText.trim()) ||
        !q.choices.some((c) => c.correct)
    );
    if (invalid) {
      setErrorMsg("Please fill all question texts, all options, and select a correct answer for each question.");
      return;
    }

    setStatus("saving");
    const token = localStorage.getItem("jwt");

    try {
      const res = await fetch(`https://quiz-app-backend-uk30.onrender.com/quiz/${quizId}/saveQuestions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questions),
      });
      if (!res.ok) throw new Error("Server error");

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to save questions:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  /* Safe current */
  const safeIndex = Math.min(Math.max(currentIndex, 0), Math.max(questions.length - 1, 0));
  const currentQuestion = questions[safeIndex] ?? createBlankQuestion();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Brand header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 sm:px-6 py-3 mt-20">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gray-900 text-white">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">QuizMaster</div>
              {passTitle ? (
                <div className="text-xs text-gray-500">Title: <span className="capitalize">{passTitle}</span></div>
              ) : null}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600">
            <BookOpenIcon className="h-4 w-4 text-gray-900" />
            Create questions
            <span className="mx-1">•</span>
            ID <span className="font-mono text-gray-900">#{quizId}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* Section header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gray-900 text-white">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Questions</h2>
              <p className="text-sm text-gray-500">Clean, distraction-free editor</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-medium text-gray-900">{questions.length}</span>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar current={safeIndex + 1} total={questions.length} />
        <QuestionCounter current={safeIndex + 1} total={questions.length} />

        {/* Error toast */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmitAllQuestions} className="mt-4 space-y-8">
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={safeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 260, damping: 24 },
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.25 },
                }}
                className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm"
              >
                {/* Question */}
                <div className="mb-6">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-800">
                    <SparklesIcon className="h-5 w-5 text-gray-900" />
                    Question text
                  </label>
                  <textarea
                    value={currentQuestion.questionText}
                    onChange={(e) => handleQuestionTextChange(safeIndex, e.target.value)}
                    placeholder="Type your question…"
                    rows={4}
                    required
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                {/* Choices */}
                <fieldset>
                  <legend className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-800">
                    <CheckCircleIcon className="h-5 w-5 text-gray-900" />
                    Answer options
                    <span className="ml-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-normal text-gray-600">
                      Select the correct answer
                    </span>
                  </legend>

                  <div className="space-y-3">
                    {currentQuestion.choices.map((choice, cIndex) => (
                      <div
                        key={cIndex}
                        className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-3 py-3 transition-colors hover:bg-gray-50"
                      >
                        {/* Custom radio */}
                        <button
                          type="button"
                          aria-pressed={choice.correct}
                          onClick={() => handleCorrectChoiceChange(safeIndex, cIndex)}
                          className={`relative grid h-6 w-6 place-items-center rounded-full border transition ${
                            choice.correct ? "border-emerald-500" : "border-gray-300"
                          }`}
                        >
                          <span
                            className={`h-3.5 w-3.5 rounded-full transition ${
                              choice.correct ? "bg-emerald-500" : "bg-transparent"
                            }`}
                          />
                        </button>

                        {/* Input */}
                        <input
                          type="text"
                          value={choice.choiceText}
                          onChange={(e) => handleChoiceTextChange(safeIndex, cIndex, e.target.value)}
                          placeholder={`Option ${cIndex + 1}`}
                          required
                          className="flex-1 rounded-lg border border-transparent bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        />

                        {/* Option badge */}
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
                            choice.correct ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {String.fromCharCode(65 + cIndex)}
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav / actions row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                Previous
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={questions.length <= 1}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                title={questions.length <= 1 ? "Keep at least one question" : "Delete this question"}
              >
                <TrashIcon className="h-5 w-5" />
                Delete
              </button>
            </div>

            <div className="text-center text-xs text-gray-500">Navigate between questions</div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={goToNext}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
              >
                {currentIndex === questions.length - 1 ? (
                  <>
                    Add new question
                    <PlusIcon className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    Next question
                    <ChevronRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="border-top border-gray-200 pt-6 text-center">
            <motion.button
              whileHover={{ scale: status === "saving" ? 1 : 1.01 }}
              whileTap={{ scale: status === "saving" ? 1 : 0.99 }}
              type="submit"
              disabled={status === "saving"}
              className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === "saving" ? (
                  <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Saving questions…
                  </motion.span>
                ) : status === "success" ? (
                  <motion.span key="success" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    Questions saved successfully
                  </motion.span>
                ) : status === "error" ? (
                  <motion.span key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                    ❌ Error saving questions. Try again.
                  </motion.span>
                ) : (
                  <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5" />
                    Save all questions ({questions.length})
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </form>
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600">
                  <TrashIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Delete this question?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This action will remove the current question. You can’t undo it.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
