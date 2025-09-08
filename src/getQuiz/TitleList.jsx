"use client"

  
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  BookOpenIcon,
  TrashIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline"
import UserQuiz from "./UserQuiz"
import SessionTimeout from "../quizCreation/SessionTimeout"
import { useNavigate } from "react-router-dom"

// Animation presets matching landing page
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
})

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function TitleList() {
  const [titleList, setTitleList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [userQuestions, setUserQuestions] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sessionState, setSessionState] = useState("loading")
  const navigate = useNavigate("")


  // Advanced Options State
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent") // recent, alphabetical, difficulty
  const [filterBy, setFilterBy] = useState("all") // all, completed, incomplete
  // const [viewMode, setViewMode] = useState("grid") // if you add list mode later

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



  useEffect(() => {
    const getList = async () => {
      const token = localStorage.getItem("jwt")
      if (!token) {
        setError("Session expired. Please log in again.")
        setIsLoading(false)
        return
      }

      try {
        // 1) Fetch quizzes
        const response = await fetch("https://quiz-app-backend-uk30.onrender.com/getTitle", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Failed to fetch quiz list.")

        const quizzes = await response.json()
        console.log(quizzes)
         // [{ id, title }, ...]
        if (!Array.isArray(quizzes)) {
          setTitleList([])
          setFilteredList([])
          return
        }

        // 2) Enrich each quiz (fetch questions to count them)
        //    Do this in parallel for performance.
        const enriched = await Promise.all(
          quizzes.map(async (quiz, index) => {
            let questionsCount = 0
            let difficulty = "Easy"
            try {
              const res = await fetch(`https://quiz-app-backend-uk30.onrender.com/${quiz.id}/getQuestions`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              })
              if (res.ok) {
                const userQuiz = await res.json()
                questionsCount = Array.isArray(userQuiz) ? userQuiz.length : 0
                difficulty = Array.isArray(quizzes) ? quiz.difficulty : "Easy"
              }
            } catch {
              // ignore per-quiz failure, keep 0 count
            }

            // mock/derived fields (keep or remove as needed)
            
            const completed = Math.random() > 0.5
            const lastAttempt = new Date(
              Date.now() 
            ) // random date in last 30 days
           
            return {
              ...quiz,
              difficulty,
              completed,
              lastAttempt,
              questionsCount,
           
            }
          })
        )

        setTitleList(enriched)
        setFilteredList(enriched)
      } catch (err) {
        setError(err.message || "Something went wrong.")
      } finally {
        setIsLoading(false)
      }
    }

    getList()
  }, [])

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...titleList]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((quiz) => quiz.title?.toLowerCase().includes(q))
    }

    // Filter
    if (filterBy !== "all") {
      filtered = filtered.filter((quiz) =>
        filterBy === "completed" ? quiz.completed : !quiz.completed
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return (a.title || "").localeCompare(b.title || "")
        case "difficulty": {
          const order = { Easy: 1, Medium: 2, Hard: 3 }
          return (order[a.difficulty] || 99) - (order[b.difficulty] || 99)
        }
        case "recent":
        default:
          return new Date(b.lastAttempt) - new Date(a.lastAttempt)
      }
    })

    setFilteredList(filtered)
  }, [titleList, searchQuery, sortBy, filterBy])

  const getUserQuestions = async (quizId) => {
    setIsLoading(true)
    setUserQuestions(null)
    const token = localStorage.getItem("jwt")

    try {
      const response = await fetch(`https://quiz-app-backend-uk30.onrender.com/${quizId}/getQuestions`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch questions for this quiz.")

      const userQuiz = await response.json()
      setUserQuestions(Array.isArray(userQuiz) ? userQuiz : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToList = () => {
    setUserQuestions(null)
    setError(null)
  }

  const handleDelete = async (quizId) => {
    const token = localStorage.getItem("jwt")
    
    try {
      const response = await fetch(`https://quiz-app-backend-uk30.onrender.com/quiz/${quizId}/delete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch questions for this quiz.")
      
      setTitleList((prev) => prev.filter((q) => q.id !== quizId));
      
    } catch (error) {
      console.error("Error in deleting the card :"+error)
      setError(error.message);
    }

  }
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "Hard":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const QuizCard = ({ quiz }) => (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02, y: -4 }}
      exit={{ opacity: 0, y: -8 }}
      className="group relative h-full"
    >
      {/* Outer container is NOT a <button>. It's a div behaving like one. */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open quiz ${quiz.title ?? quiz.id}`}
        onClick={() => getUserQuestions(quiz.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            getUserQuestions(quiz.id)
          }
        }}
        className="w-full h-full bg-white rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-all duration-300 hover:border-gray-300 outline-none focus:ring-2 focus:ring-gray-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-800 group-hover:bg-gray-900 group-hover:text-white transition-colors">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {quiz.title}
              </h3>
              <p className="text-xs text-gray-500">Quiz ID: {quiz.id}</p>
            </div>
          </div>
  
          <div className="flex items-center gap-2">
            {quiz.completed && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
            <button
              type="button"
              title="Delete quiz"
              aria-label="Delete quiz"
              onClick={(e) => {
                e.stopPropagation()         // don't trigger the card click
                handleDelete(quiz.id)
              }}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
  
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpenIcon className="h-4 w-4" />
            <span>{quiz.questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>{quiz.lastAttempt ? new Date(quiz.lastAttempt).toLocaleDateString() : "—"}</span>
          </div>
        </div>
  
        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty || "—"}
          </span>
        </div>
      </div>
    </motion.div>
  )
  

  console.log(sessionState)
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
    return <SessionTimeout onLogin={()=>navigate("/login")} />
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <AnimatePresence mode="wait">
        {userQuestions ? (
          <motion.div key="quiz">
            <UserQuiz userQuestions={userQuestions} onBack={handleBackToList} />
          </motion.div>
        ) : (
          <motion.div key="title-list" className="w-full">
            {/* Header */}
            <div className="border-b border-gray-100 bg-white/80 backdrop-blur">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
                <motion.div {...fadeUp(0)} className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Your Quizzes</h1>
                    <p className="mt-1 text-sm text-gray-600">
                      {filteredList.length} quiz{filteredList.length !== 1 ? "es" : ""} available
                    </p>
                  </div>

                  <motion.button
                    {...fadeUp(0.1)}
                    onClick={() => setShowAdvancedOptions((v) => !v)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      showAdvancedOptions
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4" />
                    Advanced Options
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Advanced Options Panel */}
            <AnimatePresence>
              {showAdvancedOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="border-b border-gray-100 bg-gray-50/50 overflow-hidden"
                >
                  <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Search */}
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search quizzes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                      </div>

                      {/* Sort */}
                      <div className="relative">
                        <ArrowsUpDownIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-8 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 appearance-none"
                        >
                          <option value="recent">Most Recent</option>
                          <option value="alphabetical">Alphabetical</option>
                          <option value="difficulty">Difficulty</option>
                        </select>
                      </div>

                      {/* Filter */}
                      <div className="relative">
                        <FunnelIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <select
                          value={filterBy}
                          onChange={(e) => setFilterBy(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-8 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 appearance-none"
                        >
                          <option value="all">All Quizzes</option>
                          <option value="completed">Completed</option>
                          <option value="incomplete">Not Completed</option>
                        </select>
                      </div>

                      {/* Clear Filters */}
                      <button
                        onClick={() => {
                          setSearchQuery("")
                          setSortBy("recent")
                          setFilterBy("all")
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        Clear
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
              {isLoading && (
                <motion.div {...fadeUp(0)} className="text-center py-12">
                  <div className="inline-flex items-center gap-2 text-gray-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                    Loading your quizzes...
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div {...fadeUp(0)} className="text-center py-12">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
                </motion.div>
              )}

              {!isLoading && !error && filteredList.length === 0 && (
                <motion.div {...fadeUp(0)} className="text-center py-12">
                  <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters.</p>
                </motion.div>
              )}

              {!isLoading && !error && filteredList.length > 0 && (
               // In the grid
<motion.div variants={staggerContainer} initial="hidden" animate="show"
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <AnimatePresence>
    {filteredList.map((quiz) => (
      <QuizCard key={quiz.id} quiz={quiz} />
    ))}
  </AnimatePresence>
</motion.div>

              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
