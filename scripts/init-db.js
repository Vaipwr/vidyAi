import Database from 'better-sqlite3';

const db = new Database('./vidyai.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  image TEXT,
  password_hash TEXT,
  preferred_language TEXT DEFAULT 'en',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  last_active_date TEXT,
  role TEXT DEFAULT 'student',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table (for OAuth)
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  expires TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner',
  total_videos INTEGER DEFAULT 0,
  total_duration_mins INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  title_hi TEXT,
  title_mr TEXT,
  title_ta TEXT,
  description TEXT,
  youtube_video_id TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  transcript TEXT,
  transcript_hi TEXT,
  transcript_mr TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Video Progress table
CREATE TABLE IF NOT EXISTS video_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  watched_seconds INTEGER DEFAULT 0,
  total_seconds INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  confusion_timestamps TEXT,
  is_completed INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Emotion Logs table
CREATE TABLE IF NOT EXISTS emotion_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  timestamp_seconds INTEGER NOT NULL,
  emotion TEXT NOT NULL,
  confidence REAL,
  ai_explanation_triggered INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- AI Explanations table
CREATE TABLE IF NOT EXISTS ai_explanations (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  timestamp_seconds INTEGER NOT NULL,
  user_query TEXT,
  explanation TEXT NOT NULL,
  explanation_language TEXT DEFAULT 'en',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_shared INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  expertise TEXT NOT NULL,
  languages TEXT NOT NULL,
  avatar_url TEXT,
  hourly_rate INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Mentor Sessions table
CREATE TABLE IF NOT EXISTS mentor_sessions (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  duration_mins INTEGER DEFAULT 30,
  status TEXT DEFAULT 'pending',
  meeting_link TEXT,
  notes TEXT,
  rating INTEGER,
  feedback TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Forum Posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id TEXT PRIMARY KEY,
  video_id TEXT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'discussion',
  upvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Forum Replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  is_accepted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  questions TEXT NOT NULL,
  passing_score INTEGER DEFAULT 70,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

-- Quiz Attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  answers TEXT NOT NULL,
  passed INTEGER DEFAULT 0,
  completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  certificate_url TEXT,
  issued_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Learning Nudges table
CREATE TABLE IF NOT EXISTS learning_nudges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  scheduled_for TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  timestamp_seconds INTEGER NOT NULL,
  note TEXT,
  bookmark_type TEXT DEFAULT 'manual',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);
`);

// Seed sample data
const generateId = () => Math.random().toString(36).substring(2, 15);

// Insert sample courses
const courses = [
  {
    id: generateId(),
    title: 'Mathematics Fundamentals',
    title_hi: 'गणित की मूल बातें',
    title_mr: 'गणिताची मूलभूत माहिती',
    description: 'Learn basic mathematics concepts from scratch',
    description_hi: 'शुरू से बुनियादी गणित अवधारणाएं सीखें',
    description_mr: 'सुरुवातीपासून मूलभूत गणित संकल्पना शिका',
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    category: 'mathematics',
    difficulty_level: 'beginner',
    total_videos: 5,
    total_duration_mins: 120
  },
  {
    id: generateId(),
    title: 'Science Explorations',
    title_hi: 'विज्ञान अन्वेषण',
    title_mr: 'विज्ञान अन्वेषण',
    description: 'Discover the wonders of science through interactive lessons',
    description_hi: 'इंटरैक्टिव पाठों के माध्यम से विज्ञान के चमत्कार खोजें',
    description_mr: 'परस्परसंवादी धड्यांद्वारे विज्ञानाचे आश्चर्य शोधा',
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    category: 'science',
    difficulty_level: 'beginner',
    total_videos: 4,
    total_duration_mins: 90
  },
  {
    id: generateId(),
    title: 'English Communication',
    title_hi: 'अंग्रेजी संचार',
    title_mr: 'इंग्रजी संवाद',
    description: 'Improve your English speaking and writing skills',
    description_hi: 'अपनी अंग्रेजी बोलने और लिखने की क्षमता में सुधार करें',
    description_mr: 'तुमचे इंग्रजी बोलणे आणि लिहिण्याचे कौशल्य सुधारा',
    thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    category: 'language',
    difficulty_level: 'intermediate',
    total_videos: 6,
    total_duration_mins: 150
  },
  {
    id: generateId(),
    title: 'Computer Basics',
    title_hi: 'कंप्यूटर की मूल बातें',
    title_mr: 'संगणकाची मूलभूत माहिती',
    description: 'Introduction to computers and digital literacy',
    description_hi: 'कंप्यूटर और डिजिटल साक्षरता का परिचय',
    description_mr: 'संगणक आणि डिजिटल साक्षरतेची ओळख',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    category: 'technology',
    difficulty_level: 'beginner',
    total_videos: 5,
    total_duration_mins: 100
  }
];

const insertCourse = db.prepare(`
  INSERT OR REPLACE INTO courses (id, title, title_hi, title_mr, description, description_hi, description_mr, thumbnail_url, category, difficulty_level, total_videos, total_duration_mins)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const course of courses) {
  insertCourse.run(
    course.id, course.title, course.title_hi, course.title_mr,
    course.description, course.description_hi, course.description_mr,
    course.thumbnail_url, course.category, course.difficulty_level,
    course.total_videos, course.total_duration_mins
  );
}

// Insert sample videos for each course
const videos = [
  // Math course videos
  { course_idx: 0, title: 'Introduction to Numbers', title_hi: 'संख्याओं का परिचय', youtube_video_id: 'dQw4w9WgXcQ', duration_seconds: 600, order_index: 1 },
  { course_idx: 0, title: 'Addition and Subtraction', title_hi: 'जोड़ और घटाव', youtube_video_id: 'L_jWHffIx5E', duration_seconds: 720, order_index: 2 },
  { course_idx: 0, title: 'Multiplication Basics', title_hi: 'गुणा की मूल बातें', youtube_video_id: 'fJ9rUzIMcZQ', duration_seconds: 840, order_index: 3 },
  // Science course videos
  { course_idx: 1, title: 'What is Science?', title_hi: 'विज्ञान क्या है?', youtube_video_id: 'NKmGVE85GUU', duration_seconds: 540, order_index: 1 },
  { course_idx: 1, title: 'The Solar System', title_hi: 'सौर मंडल', youtube_video_id: 'libKVRa01L8', duration_seconds: 900, order_index: 2 },
  // English course videos  
  { course_idx: 2, title: 'Basic Greetings', title_hi: 'बुनियादी अभिवादन', youtube_video_id: 'oHg5SJYRHA0', duration_seconds: 480, order_index: 1 },
  { course_idx: 2, title: 'Common Phrases', title_hi: 'सामान्य वाक्यांश', youtube_video_id: 'kJQP7kiw5Fk', duration_seconds: 600, order_index: 2 },
  // Computer course videos
  { course_idx: 3, title: 'What is a Computer?', title_hi: 'कंप्यूटर क्या है?', youtube_video_id: 'O5nskjZ_GoI', duration_seconds: 660, order_index: 1 },
  { course_idx: 3, title: 'Using a Mouse and Keyboard', title_hi: 'माउस और कीबोर्ड का उपयोग', youtube_video_id: 'nKIu9yen5nc', duration_seconds: 720, order_index: 2 },
];

const insertVideo = db.prepare(`
  INSERT OR REPLACE INTO videos (id, course_id, title, title_hi, youtube_video_id, duration_seconds, order_index)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const video of videos) {
  insertVideo.run(
    generateId(),
    courses[video.course_idx].id,
    video.title,
    video.title_hi,
    video.youtube_video_id,
    video.duration_seconds,
    video.order_index
  );
}

// Insert sample mentors
const mentors = [
  {
    id: generateId(),
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@vidyai.com',
    bio: 'PhD in Mathematics with 10+ years of teaching experience',
    expertise: 'Mathematics, Statistics',
    languages: 'English, Hindi, Marathi',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    hourly_rate: 0,
    rating: 4.8,
    total_sessions: 156
  },
  {
    id: generateId(),
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@vidyai.com',
    bio: 'Science educator passionate about making learning fun',
    expertise: 'Physics, Chemistry, Biology',
    languages: 'English, Hindi, Tamil',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    hourly_rate: 0,
    rating: 4.9,
    total_sessions: 203
  },
  {
    id: generateId(),
    name: 'Anita Desai',
    email: 'anita.desai@vidyai.com',
    bio: 'English language specialist helping students communicate confidently',
    expertise: 'English, Communication Skills',
    languages: 'English, Hindi, Bengali',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    hourly_rate: 0,
    rating: 4.7,
    total_sessions: 178
  },
  {
    id: generateId(),
    name: 'Vikram Patel',
    email: 'vikram.patel@vidyai.com',
    bio: 'Software engineer turned educator, making tech accessible to all',
    expertise: 'Computer Science, Programming',
    languages: 'English, Hindi, Gujarati',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    hourly_rate: 0,
    rating: 4.6,
    total_sessions: 134
  }
];

const insertMentor = db.prepare(`
  INSERT OR REPLACE INTO mentors (id, name, email, bio, expertise, languages, avatar_url, hourly_rate, rating, total_sessions)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const mentor of mentors) {
  insertMentor.run(
    mentor.id, mentor.name, mentor.email, mentor.bio,
    mentor.expertise, mentor.languages, mentor.avatar_url,
    mentor.hourly_rate, mentor.rating, mentor.total_sessions
  );
}

// Insert sample forum posts
const forumPosts = [
  {
    id: generateId(),
    title: 'How to solve quadratic equations easily?',
    content: 'I am struggling with quadratic equations. Can someone explain the factoring method in simple terms?',
    category: 'question',
    upvotes: 15
  },
  {
    id: generateId(),
    title: 'Tips for learning English pronunciation',
    content: 'Here are some tips that helped me improve my English pronunciation...',
    category: 'tips',
    upvotes: 23
  },
  {
    id: generateId(),
    title: 'Science experiment ideas for home',
    content: 'Looking for simple science experiments that can be done at home with basic materials.',
    category: 'discussion',
    upvotes: 18
  }
];

const insertPost = db.prepare(`
  INSERT OR REPLACE INTO forum_posts (id, user_id, title, content, category, upvotes)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Create a demo user first
const demoUserId = generateId();
db.prepare(`
  INSERT OR REPLACE INTO users (id, name, email, preferred_language, role)
  VALUES (?, ?, ?, ?, ?)
`).run(demoUserId, 'Demo Student', 'demo@vidyai.com', 'en', 'student');

for (const post of forumPosts) {
  insertPost.run(post.id, demoUserId, post.title, post.content, post.category, post.upvotes);
}

db.close();

console.log('Database setup completed successfully!');
console.log('Created tables: users, accounts, sessions, courses, videos, video_progress, emotion_logs, ai_explanations, mentors, mentor_sessions, forum_posts, forum_replies, quizzes, quiz_attempts, certificates, learning_nudges, bookmarks');
console.log('Seeded sample data: 4 courses, 9 videos, 4 mentors, 3 forum posts');
