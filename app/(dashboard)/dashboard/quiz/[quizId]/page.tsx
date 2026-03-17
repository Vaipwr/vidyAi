"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, ArrowRight, Trophy, RefreshCw } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  passing_score: number
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.quizId as string

  const { data: quiz, isLoading } = useSWR<Quiz>(`/api/quizzes/${quizId}`, fetcher)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [quizComplete, setQuizComplete] = useState(false)

  useEffect(() => {
    if (quiz) {
      setAnswers(new Array(quiz.questions.length).fill(null))
    }
  }, [quiz])

  if (isLoading || !quiz) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    setShowResult(true)
    
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(answers[currentQuestion + 1])
        setShowResult(false)
      } else {
        setQuizComplete(true)
      }
    }, 1500)
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++
    })
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
      passed: (correct / quiz.questions.length) * 100 >= quiz.passing_score,
    }
  }

  if (quizComplete) {
    const score = calculateScore()
    
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card className="text-center">
          <CardContent className="py-12">
            <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${
              score.passed ? "bg-success/20" : "bg-destructive/20"
            }`}>
              {score.passed ? (
                <Trophy className="h-12 w-12 text-success" />
              ) : (
                <RefreshCw className="h-12 w-12 text-destructive" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-foreground">
              {score.passed ? "Congratulations!" : "Keep Learning!"}
            </h2>
            
            <p className="mt-2 text-muted-foreground">
              {score.passed
                ? "You've passed the quiz!"
                : `You need ${quiz.passing_score}% to pass. Try again!`}
            </p>

            <div className="mt-8 flex justify-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{score.percentage}%</p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">
                  {score.correct}/{score.total}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/dashboard/courses")}>
                Back to Courses
              </Button>
              <Button onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswer(null)
                setShowResult(false)
                setAnswers(new Array(quiz.questions.length).fill(null))
                setQuizComplete(false)
              }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
        <p className="mt-1 text-muted-foreground">{quiz.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = showResult && index === question.correct_answer
            const isWrong = showResult && isSelected && index !== question.correct_answer

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                  isCorrect
                    ? "border-success bg-success/10"
                    : isWrong
                    ? "border-destructive bg-destructive/10"
                    : isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary hover:bg-muted"
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium ${
                  isCorrect
                    ? "border-success text-success"
                    : isWrong
                    ? "border-destructive text-destructive"
                    : isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                }`}>
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : isWrong ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            )
          })}

          {/* Explanation */}
          {showResult && (
            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-foreground">Explanation:</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {question.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="gap-2"
        >
          {currentQuestion < quiz.questions.length - 1 ? (
            <>
              Next Question
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            "Finish Quiz"
          )}
        </Button>
      </div>
    </div>
  )
}
