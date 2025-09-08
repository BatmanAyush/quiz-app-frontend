"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, BookOpenIcon } from "@heroicons/react/24/outline"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay },
})

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function UserQuiz({ userQuestions, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [checkedQuestions, setCheckedQuestions] = useState({})
  const [score, setScore] = useState(0)

  console.log(checkedQuestions)
  const questions = userQuestions || []

  const handleAnswerSelect = (answerIndex) => {
    if (checkedQuestions[currentQuestion]) return

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex,
    })
  }

  const checkAnswer = () => {
    setCheckedQuestions({
      ...checkedQuestions,
      [currentQuestion]: true,
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0
    questions.forEach((question, questionIndex) => {
      const selectedChoiceIndex = selectedAnswers[questionIndex]
      if (selectedChoiceIndex !== undefined && question.choices[selectedChoiceIndex]?.correct) {
        correctAnswers++
      }
    })
    setScore(Math.round((correctAnswers / questions.length) * 100))
    setShowResults(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setCheckedQuestions({})
    setScore(0)
  }

  const getCorrectAnswersCount = () => {
    return Object.entries(selectedAnswers).filter(([questionIndex, choiceIndex]) => {
      const question = questions[Number.parseInt(questionIndex)]
      return question?.choices[choiceIndex]?.correct
    }).length
  }

  if (showResults) {
    const correctCount = getCorrectAnswersCount()
    const incorrectCount = questions.length - correctCount

    return (
      <div className="min-h-screen w-full bg-white text-gray-900 flex items-center justify-center p-4">
        <motion.div
          {...fadeUp(0)}
          className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center"
        >
          <div className="mb-6">
            {score >= 70 ? (
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
            ) : (
              <XCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">You scored {score}% on this quiz</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Quizzes
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen w-full bg-white text-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpenIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">This quiz doesn't have any questions yet.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
          <motion.div {...fadeUp(0)} className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4" />
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{questions[currentQuestion]?.questionText}</h2>
              <p className="text-gray-600">
                {checkedQuestions[currentQuestion] ? "Answer revealed" : "Select the correct answer"}
              </p>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
              {questions[currentQuestion]?.choices?.map((choice, index) => {
                const isSelected = selectedAnswers[currentQuestion] === index
                const isChecked = checkedQuestions[currentQuestion]
                const isCorrect = choice.correct
                // console.log(choice)
                let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all "

                if (isChecked) {
                  if (isCorrect) {
                    buttonClass += "border-green-500 bg-green-50"
                  } else if (isSelected) {
                    buttonClass += "border-red-500 bg-red-50"
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 opacity-60"
                  }
                } else {
                  if (isSelected) {
                    buttonClass += "border-gray-900 bg-gray-50"
                  } else {
                    buttonClass += "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }
                }

                return (
                  <motion.button
                    key={index}
                    variants={item}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isChecked}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isChecked
                              ? isCorrect
                                ? "border-green-500 bg-green-500"
                                : isSelected
                                  ? "border-red-500 bg-red-500"
                                  : "border-gray-300"
                              : isSelected
                                ? "border-gray-900 bg-gray-900"
                                : "border-gray-300"
                          }`}
                        >
                          {((isSelected && !isChecked) || (isChecked && isCorrect)) && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">{choice.choiceText}</span>
                      </div>

                      {isChecked && (
                        <div className="flex-shrink-0">
                          {isCorrect ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : isSelected ? (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>

            <div className="flex justify-between pt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {!checkedQuestions[currentQuestion] ? (
                <button
                  onClick={checkAnswer}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
                >
                  {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
