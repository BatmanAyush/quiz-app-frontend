"use client"

import { useEffect, useState } from "react"
import { PlusIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"
import QuizQuestion from "./QuizCreator"
import SessionTimeout from "./SessionTimeout"
import { useNavigate } from "react-router-dom"

// ----------------------------
// Success banner
// ----------------------------
const TitleSuccessAnimation = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-6"
    >
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 240, delay: 0.1 }}
            className="mt-0.5"
          >
            <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-emerald-800">Quiz "{title}" created successfully!</p>
            <p className="mt-0.5 text-xs text-emerald-700">You can now start adding questions to your quiz.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ----------------------------
// Sticky header (shows after title is set)
// ----------------------------
const QuizHeader = ({ title, isAnimating }) => {
  return (
    <motion.div
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 mb-6 border-b border-gray-200 bg-white/80 backdrop-blur"
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isAnimating ? 360 : 0, scale: isAnimating ? [1, 1.06, 1] : 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
          </motion.div>
          <div>
            <h1 className="text-sm font-semibold leading-5 text-gray-900 capitalize">{title}</h1>
            <p className="text-xs text-gray-500">Creating quiz</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ----------------------------
// Page
// ----------------------------
export default function TitleChoosing() {
  const [sessionState, setSessionState] = useState("loading")
  const [questionId, setQuestionId] = useState(0)
  const [title, setTitle] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const navigate = useNavigate("")
  const [passTitle, setPassTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  

  // Validate token once on mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem("jwt")
      if (!token) {
        setSessionState("expired")
        return
      }
      try {
        const response = await fetch("https://quiz-app-backend-uk30.onrender.com/checkToken", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })
        setSessionState(response.ok ? "valid" : "expired")
      } catch (error) {
        console.error("Failed to check token:", error)
        setSessionState("expired")
      }
    }
    checkTokenValidity()
  }, [])

  // Submit title and create quiz shell
  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    setIsAnimating(true)

    const titleName = title.toLowerCase()

    try {
      const token = localStorage.getItem("jwt")
      const res = await fetch("https://quiz-app-backend-uk30.onrender.com/quiz/saveTitle", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: titleName,
          difficulty:difficulty
         }),
      })

      if (res.ok) {
        const savedQuiz = await res.json()
        setQuestionId(savedQuiz.id)
        setPassTitle(titleName)

        // success feedback
        setTimeout(() => {
          setShowSuccess(true)
          setIsAnimating(false)
          // hide success after a few seconds
          setTimeout(() => setShowSuccess(false), 3000)
        }, 600)
      }

      setTitle("")
      setDifficulty("medium")
    } catch (err) {
      console.error("Title uploading failed", err)
      setIsAnimating(false)
    } finally {
      setTimeout(() => setIsSubmitting(false), 600)
    }
  }

  // ---- States: loading / expired ----
  if (sessionState === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mx-auto mb-4 h-10 w-10 rounded-full border-b-4 border-gray-900"
          />
          <p className="text-sm font-medium text-gray-700">Loading…</p>
        </motion.div>
      </div>
    )
  }

  if (sessionState === "expired") {
    console.log("Helo")
    return <SessionTimeout onLogin={navigate("/login")} onRetry={window.location.reload()} />
  }

  // ---- Main ----
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <AnimatePresence>{passTitle && <QuizHeader title={passTitle} isAnimating={isAnimating} />}</AnimatePresence>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <AnimatePresence>{passTitle && showSuccess && <TitleSuccessAnimation title={passTitle} />}</AnimatePresence>

        <AnimatePresence mode="wait">
          {!passTitle ? (
            <motion.div
              key="title-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              {/* header */}
              <div className="mb-8 text-center">
                <motion.div
                  animate={{ rotate: isSubmitting ? 360 : 0, scale: isSubmitting ? [1, 1.08, 1] : 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-gray-100"
                >
                  <PlusIcon className="h-7 w-7 text-gray-900" />
                </motion.div>
                <h1 className="text-xl font-semibold text-gray-900">Create new quiz</h1>
                <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
                  Give your quiz a short, descriptive title. You can edit this later.
                </p>
              </div>

              {/* form */}
              <form onSubmit={handleSubmit} className="mx-auto max-w-md">
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
                  Quiz title
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Spring Security Basics"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  required
                  disabled={isSubmitting}
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-500">Make it clear and easy to recognize later.</p>

                {/* difficulty selection section */}
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-medium text-gray-700">Difficulty level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "Easy", label: "Easy", emoji: "🟢", color: "emerald" },
                      { value: "Medium", label: "Medium", emoji: "🟡", color: "amber" },
                      { value: "Hard", label: "Hard", emoji: "🔴", color: "red" },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDifficulty(option.value)}
                        disabled={isSubmitting}
                        className={`relative rounded-lg border-2 p-3 text-center transition-all ${
                          difficulty === option.value
                            ? option.color === "emerald"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : option.color === "amber"
                                ? "border-amber-500 bg-amber-50 text-amber-700"
                                : "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div className="text-xs font-medium">{option.label}</div>
                        {difficulty === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gray-900 flex items-center justify-center"
                          >
                            <CheckCircleIcon className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Choose the appropriate difficulty for your quiz content.</p>
                </div>

                <motion.button
                  whileHover={{ scale: !title.trim() || isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: !title.trim() || isSubmitting ? 1 : 0.99 }}
                  type="submit"
                  disabled={!title.trim() || isSubmitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isSubmitting ? (
                      <motion.span
                        key="creating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-2"
                      >
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-b-2 border-white"
                        />
                        Creating…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="create"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-2"
                      >
                        <PlusIcon className="h-5 w-5" /> Create quiz
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="quiz-questions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {passTitle && <QuizQuestion title={passTitle} quizId={questionId} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
