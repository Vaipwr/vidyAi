import { NextRequest, NextResponse } from "next/server"

// Sample quiz data
const sampleQuizzes: Record<string, {
  id: string
  title: string
  description: string
  passingScore: number
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }[]
}> = {
  "quiz-algebra": {
    id: "quiz-algebra",
    title: "Algebra Basics Quiz",
    description: "Test your understanding of basic algebraic concepts",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "What is the value of x in the equation: 2x + 5 = 15?",
        options: ["3", "5", "7", "10"],
        correctAnswer: 1,
        explanation: "2x + 5 = 15, so 2x = 10, therefore x = 5"
      },
      {
        id: "q2",
        question: "Simplify: 3(x + 4) - 2x",
        options: ["x + 12", "5x + 4", "x + 4", "5x + 12"],
        correctAnswer: 0,
        explanation: "3x + 12 - 2x = x + 12"
      },
      {
        id: "q3",
        question: "Which expression is equivalent to (a + b)^2?",
        options: ["a^2 + b^2", "a^2 + 2ab + b^2", "2a + 2b", "a^2 - b^2"],
        correctAnswer: 1,
        explanation: "(a + b)^2 = a^2 + 2ab + b^2 is the algebraic identity"
      },
      {
        id: "q4",
        question: "If y = 3x - 7, what is y when x = 4?",
        options: ["5", "7", "12", "19"],
        correctAnswer: 0,
        explanation: "y = 3(4) - 7 = 12 - 7 = 5"
      },
      {
        id: "q5",
        question: "Solve for x: x/4 = 8",
        options: ["2", "12", "32", "4"],
        correctAnswer: 2,
        explanation: "x = 8 * 4 = 32"
      }
    ]
  },
  "quiz-physics": {
    id: "quiz-physics",
    title: "Laws of Motion Quiz",
    description: "Test your knowledge of Newton's Laws of Motion",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "According to Newton's First Law, an object at rest will:",
        options: [
          "Always start moving",
          "Stay at rest unless acted upon by a force",
          "Move in a circle",
          "Accelerate constantly"
        ],
        correctAnswer: 1,
        explanation: "Newton's First Law states that an object at rest stays at rest unless acted upon by an external force"
      },
      {
        id: "q2",
        question: "The formula F = ma represents:",
        options: [
          "Newton's First Law",
          "Newton's Second Law",
          "Newton's Third Law",
          "Law of Gravitation"
        ],
        correctAnswer: 1,
        explanation: "F = ma is the mathematical expression of Newton's Second Law"
      },
      {
        id: "q3",
        question: "For every action, there is an equal and opposite:",
        options: ["Force", "Mass", "Reaction", "Acceleration"],
        correctAnswer: 2,
        explanation: "Newton's Third Law states that for every action, there is an equal and opposite reaction"
      }
    ]
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params
    const quiz = sampleQuizzes[quizId]

    if (!quiz) {
      // Return a default quiz if not found
      return NextResponse.json(sampleQuizzes["quiz-algebra"])
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}
