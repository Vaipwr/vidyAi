import Database from "better-sqlite3"
import { randomUUID } from "crypto"

const db = new Database("vidyai.db")

// Create tables
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    email_verified INTEGER,
    image TEXT,
    role TEXT DEFAULT 'student',
    preferred_language TEXT DEFAULT 'en',
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Accounts table for OAuth
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT
  );

  -- Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires INTEGER NOT NULL
  );

  -- Courses table
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_hi TEXT,
    title_mr TEXT,
    title_ta TEXT,
    description TEXT,
    description_hi TEXT,
    description_mr TEXT,
    description_ta TEXT,
    thumbnail TEXT,
    category TEXT,
    difficulty TEXT DEFAULT 'beginner',
    language TEXT DEFAULT 'en',
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Videos table
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_hi TEXT,
    title_mr TEXT,
    title_ta TEXT,
    youtube_id TEXT NOT NULL,
    duration INTEGER,
    order_index INTEGER DEFAULT 0,
    transcript TEXT,
    transcript_hi TEXT,
    transcript_mr TEXT,
    transcript_ta TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Progress tracking
  CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    watched_seconds INTEGER DEFAULT 0,
    total_seconds INTEGER DEFAULT 0,
    last_position INTEGER DEFAULT 0,
    confusion_timestamps TEXT,
    completed INTEGER DEFAULT 0,
    updated_at INTEGER DEFAULT (unixepoch())
  );

  -- Emotion logs
  CREATE TABLE IF NOT EXISTS emotion_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    timestamp INTEGER NOT NULL,
    emotion TEXT NOT NULL,
    confidence REAL,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- AI Explanations
  CREATE TABLE IF NOT EXISTS ai_explanations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    timestamp INTEGER NOT NULL,
    question TEXT,
    explanation TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    upvotes INTEGER DEFAULT 0,
    is_shared INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Explanation upvotes
  CREATE TABLE IF NOT EXISTS explanation_upvotes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    explanation_id TEXT NOT NULL REFERENCES ai_explanations(id) ON DELETE CASCADE,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Forum posts
  CREATE TABLE IF NOT EXISTS forum_posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id TEXT REFERENCES videos(id) ON DELETE SET NULL,
    course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Forum replies
  CREATE TABLE IF NOT EXISTS forum_replies (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Mentors table
  CREATE TABLE IF NOT EXISTS mentors (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expertise TEXT NOT NULL,
    bio TEXT,
    languages TEXT,
    rating REAL DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    hourly_rate INTEGER DEFAULT 0,
    is_available INTEGER DEFAULT 1
  );

  -- Mentor bookings
  CREATE TABLE IF NOT EXISTS mentor_bookings (
    id TEXT PRIMARY KEY,
    mentor_id TEXT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_at INTEGER NOT NULL,
    duration INTEGER DEFAULT 30,
    status TEXT DEFAULT 'pending',
    topic TEXT,
    notes TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Quizzes
  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    video_id TEXT REFERENCES videos(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    questions TEXT NOT NULL,
    passing_score INTEGER DEFAULT 70,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Quiz attempts
  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    answers TEXT NOT NULL,
    completed_at INTEGER DEFAULT (unixepoch())
  );

  -- Nudges/Notifications
  CREATE TABLE IF NOT EXISTS nudges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- User streaks
  CREATE TABLE IF NOT EXISTS user_streaks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active_date TEXT,
    total_points INTEGER DEFAULT 0
  );

  -- Certificates
  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    issued_at INTEGER DEFAULT (unixepoch()),
    certificate_url TEXT
  );
`)

// Seed sample data
const courses_data = [
  {
    id: randomUUID(),
    title: "Mathematics for Class 10",
    title_hi: "कक्षा 10 के लिए गणित",
    title_mr: "इयत्ता 10 साठी गणित",
    description: "Complete mathematics course covering algebra, geometry, and trigonometry",
    description_hi: "बीजगणित, ज्यामिति और त्रिकोणमिति को कवर करने वाला पूर्ण गणित पाठ्यक्रम",
    description_mr: "बीजगणित, भूमिती आणि त्रिकोणमिती समाविष्ट संपूर्ण गणित अभ्यासक्रम",
    category: "Mathematics",
    difficulty: "intermediate",
    thumbnail: "/images/math-course.jpg"
  },
  {
    id: randomUUID(),
    title: "Science - Physics Fundamentals",
    title_hi: "विज्ञान - भौतिकी की मूल बातें",
    title_mr: "विज्ञान - भौतिकशास्त्राची मूलतत्त्वे",
    description: "Learn the basics of physics including motion, force, and energy",
    description_hi: "गति, बल और ऊर्जा सहित भौतिकी की मूल बातें सीखें",
    description_mr: "गती, बल आणि ऊर्जा यासह भौतिकशास्त्राची मूलतत्त्वे शिका",
    category: "Science",
    difficulty: "beginner",
    thumbnail: "/images/physics-course.jpg"
  },
  {
    id: randomUUID(),
    title: "English Grammar & Communication",
    title_hi: "अंग्रेजी व्याकरण और संचार",
    title_mr: "इंग्रजी व्याकरण आणि संवाद",
    description: "Master English grammar and improve your communication skills",
    description_hi: "अंग्रेजी व्याकरण में महारत हासिल करें और अपने संचार कौशल में सुधार करें",
    description_mr: "इंग्रजी व्याकरणावर प्रभुत्व मिळवा आणि तुमची संवाद कौशल्ये सुधारा",
    category: "Languages",
    difficulty: "beginner",
    thumbnail: "/images/english-course.jpg"
  },
  {
    id: randomUUID(),
    title: "Computer Science Basics",
    title_hi: "कंप्यूटर विज्ञान की मूल बातें",
    title_mr: "संगणक विज्ञानाची मूलतत्त्वे",
    description: "Introduction to programming, algorithms, and computer fundamentals",
    description_hi: "प्रोग्रामिंग, एल्गोरिदम और कंप्यूटर की मूल बातों का परिचय",
    description_mr: "प्रोग्रामिंग, अल्गोरिदम आणि संगणक मूलतत्त्वांचा परिचय",
    category: "Technology",
    difficulty: "beginner",
    thumbnail: "/images/cs-course.jpg"
  }
]

const insert_course = db.prepare(\`
  INSERT OR IGNORE INTO courses (id, title, title_hi, title_mr, description, description_hi, description_mr, category, difficulty, thumbnail)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
\`)

for (const course of courses_data) {
  insert_course.run(
    course.id,
    course.title,
    course.title_hi,
    course.title_mr,
    course.description,
    course.description_hi,
    course.description_mr,
    course.category,
    course.difficulty,
    course.thumbnail
  )
}

// Get inserted course IDs for videos
const math_course = db.prepare("SELECT id FROM courses WHERE category = 'Mathematics'").get()
const physics_course = db.prepare("SELECT id FROM courses WHERE category = 'Science'").get()
const english_course = db.prepare("SELECT id FROM courses WHERE category = 'Languages'").get()
const cs_course = db.prepare("SELECT id FROM courses WHERE category = 'Technology'").get()

// Seed sample videos
const videos_data = [
  // Math videos
  {
    id: randomUUID(),
    course_id: math_course?.id,
    title: "Introduction to Algebra",
    title_hi: "बीजगणित का परिचय",
    title_mr: "बीजगणिताचा परिचय",
    youtube_id: "NybHckSEQBI",
    duration: 1200,
    order_index: 1
  },
  {
    id: randomUUID(),
    course_id: math_course?.id,
    title: "Quadratic Equations",
    title_hi: "द्विघात समीकरण",
    title_mr: "वर्गसमीकरणे",
    youtube_id: "IlNAJl36-10",
    duration: 1500,
    order_index: 2
  },
  // Physics videos
  {
    id: randomUUID(),
    course_id: physics_course?.id,
    title: "Laws of Motion",
    title_hi: "गति के नियम",
    title_mr: "गतीचे नियम",
    youtube_id: "kKKM8Y-u7ds",
    duration: 1100,
    order_index: 1
  },
  {
    id: randomUUID(),
    course_id: physics_course?.id,
    title: "Work, Energy and Power",
    title_hi: "कार्य, ऊर्जा और शक्ति",
    title_mr: "कार्य, ऊर्जा आणि शक्ती",
    youtube_id: "w4QFJb9a8vo",
    duration: 1300,
    order_index: 2
  },
  // English videos
  {
    id: randomUUID(),
    course_id: english_course?.id,
    title: "Parts of Speech",
    title_hi: "वाक्य के भाग",
    title_mr: "वाक्याचे भाग",
    youtube_id: "SceDmiBEhNI",
    duration: 900,
    order_index: 1
  },
  // CS videos
  {
    id: randomUUID(),
    course_id: cs_course?.id,
    title: "What is Programming?",
    title_hi: "प्रोग्रामिंग क्या है?",
    title_mr: "प्रोग्रामिंग म्हणजे काय?",
    youtube_id: "FCMxA3m_Imc",
    duration: 800,
    order_index: 1
  }
]

const insert_video = db.prepare(\`
  INSERT OR IGNORE INTO videos (id, course_id, title, title_hi, title_mr, youtube_id, duration, order_index)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
\`)

for (const video of videos_data) {
  if (video.course_id) {
    insert_video.run(
      video.id,
      video.course_id,
      video.title,
      video.title_hi,
      video.title_mr,
      video.youtube_id,
      video.duration,
      video.order_index
    )
  }
}

// Create a demo user
const demo_user_id = randomUUID()
db.prepare(\`
  INSERT OR IGNORE INTO users (id, name, email, role, preferred_language)
  VALUES (?, ?, ?, ?, ?)
\`).run(demo_user_id, "Demo Student", "demo@vidyai.com", "student", "en")

// Create demo streak
db.prepare(\`
  INSERT OR IGNORE INTO user_streaks (id, user_id, current_streak, longest_streak, total_points, last_active_date)
  VALUES (?, ?, ?, ?, ?, ?)
\`).run(randomUUID(), demo_user_id, 5, 12, 450, new Date().toISOString().split('T')[0])

// Create a demo mentor
const mentor_user_id = randomUUID()
db.prepare(\`
  INSERT OR IGNORE INTO users (id, name, email, role, preferred_language, image)
  VALUES (?, ?, ?, ?, ?, ?)
\`).run(mentor_user_id, "Dr. Priya Sharma", "priya@vidyai.com", "mentor", "hi", "/images/mentor-priya.jpg")

db.prepare(\`
  INSERT OR IGNORE INTO mentors (id, user_id, expertise, bio, languages, rating, total_sessions, is_available)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
\`).run(
  randomUUID(),
  mentor_user_id,
  "Mathematics, Physics",
  "PhD in Mathematics with 10+ years of teaching experience",
  JSON.stringify(["en", "hi", "mr"]),
  4.8,
  156,
  1
)

// Create another mentor
const mentor2_user_id = randomUUID()
db.prepare(\`
  INSERT OR IGNORE INTO users (id, name, email, role, preferred_language, image)
  VALUES (?, ?, ?, ?, ?, ?)
\`).run(mentor2_user_id, "Prof. Rajesh Kumar", "rajesh@vidyai.com", "mentor", "en", "/images/mentor-rajesh.jpg")

db.prepare(\`
  INSERT OR IGNORE INTO mentors (id, user_id, expertise, bio, languages, rating, total_sessions, is_available)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
\`).run(
  randomUUID(),
  mentor2_user_id,
  "Computer Science, Programming",
  "Software Engineer turned educator, passionate about teaching coding",
  JSON.stringify(["en", "hi", "ta"]),
  4.9,
  203,
  1
)

console.log("Database setup completed successfully!")
console.log("Tables created and sample data seeded.")
db.close()
