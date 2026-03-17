-- VidyAI++ Database Schema
-- SQLite Database for AI-Powered Multilingual Tutoring Platform

-- Users table (for NextAuth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified INTEGER,
  image TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'student' CHECK(role IN ('student', 'mentor', 'admin')),
  preferred_language TEXT DEFAULT 'en',
  streak_count INTEGER DEFAULT 0,
  total_watch_time INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Accounts table (for OAuth providers)
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
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TEXT NOT NULL
);

-- Verification tokens
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TEXT NOT NULL,
  PRIMARY KEY(identifier, token)
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
  difficulty TEXT DEFAULT 'beginner' CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')),
  total_videos INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_hi TEXT,
  title_mr TEXT,
  title_ta TEXT,
  description TEXT,
  youtube_id TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  transcript TEXT,
  transcript_hi TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  watched_duration INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0,
  completion_percentage REAL DEFAULT 0,
  last_position INTEGER DEFAULT 0,
  confusion_points TEXT DEFAULT '[]',
  is_completed INTEGER DEFAULT 0,
  completed_at TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, video_id)
);

-- Bookmarks table (Task 1: Progress Bookmarking)
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  timestamp INTEGER NOT NULL,
  note TEXT,
  is_confusion_point INTEGER DEFAULT 0,
  emotion_state TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- AI Explanations table
CREATE TABLE IF NOT EXISTS ai_explanations (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timestamp INTEGER NOT NULL,
  question TEXT NOT NULL,
  explanation TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  upvotes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Forum Posts table (Task 2: Community Forum)
CREATE TABLE IF NOT EXISTS forum_posts (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion' CHECK(post_type IN ('discussion', 'question', 'explanation', 'resource')),
  upvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Forum Replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  is_accepted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Forum Votes table
CREATE TABLE IF NOT EXISTS forum_votes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id TEXT REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id TEXT REFERENCES forum_replies(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK(vote_type IN (-1, 1)),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, reply_id)
);

-- Emotion Logs table (Task 4: Emotion Analytics)
CREATE TABLE IF NOT EXISTS emotion_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  timestamp INTEGER NOT NULL,
  emotion TEXT NOT NULL CHECK(emotion IN ('happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral', 'confused')),
  confidence REAL NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Learning Nudges table (Task 3: Daily Learning Nudges)
CREATE TABLE IF NOT EXISTS learning_nudges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nudge_type TEXT NOT NULL CHECK(nudge_type IN ('daily_reminder', 'streak_warning', 'course_completion', 'new_content', 'personalized_recap')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  scheduled_for TEXT,
  sent_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  expertise TEXT NOT NULL,
  languages TEXT DEFAULT '["en"]',
  hourly_rate REAL DEFAULT 0,
  rating REAL DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  availability TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Mentor Sessions table
CREATE TABLE IF NOT EXISTS mentor_sessions (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at TEXT NOT NULL,
  duration INTEGER DEFAULT 30,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_link TEXT,
  notes TEXT,
  rating INTEGER,
  feedback TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  questions TEXT NOT NULL,
  passing_score INTEGER DEFAULT 70,
  time_limit INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Quiz Attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers TEXT NOT NULL,
  score INTEGER NOT NULL,
  is_passed INTEGER DEFAULT 0,
  time_taken INTEGER,
  completed_at TEXT DEFAULT (datetime('now'))
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TEXT DEFAULT (datetime('now')),
  pdf_url TEXT
);

-- Offline Sync Queue table (Task 5: Offline Content Sync)
CREATE TABLE IF NOT EXISTS offline_sync_queue (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK(action_type IN ('progress_update', 'bookmark_add', 'emotion_log', 'quiz_submit')),
  payload TEXT NOT NULL,
  synced INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  synced_at TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_video ON user_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_video ON bookmarks(video_id);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_user ON emotion_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_video ON emotion_logs(video_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_video ON forum_posts(video_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_course ON forum_posts(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_course ON videos(course_id);

-- Insert sample data

-- Sample Courses
INSERT OR IGNORE INTO courses (id, title, title_hi, title_mr, title_ta, description, description_hi, category, difficulty, total_videos, thumbnail_url) VALUES
('course-math-10', 'Mathematics Class 10', 'गणित कक्षा 10', 'गणित इयत्ता 10', 'கணிதம் வகுப்பு 10', 'Complete Mathematics course for Class 10 covering all NCERT topics', 'कक्षा 10 के लिए संपूर्ण गणित पाठ्यक्रम', 'Mathematics', 'intermediate', 5, '/images/courses/math-10.jpg'),
('course-science-10', 'Science Class 10', 'विज्ञान कक्षा 10', 'विज्ञान इयत्ता 10', 'அறிவியல் வகுப்பு 10', 'Physics, Chemistry and Biology for Class 10', 'कक्षा 10 के लिए भौतिकी, रसायन और जीव विज्ञान', 'Science', 'intermediate', 5, '/images/courses/science-10.jpg'),
('course-english-10', 'English Class 10', 'अंग्रेजी कक्षा 10', 'इंग्रजी इयत्ता 10', 'ஆங்கிலம் வகுப்பு 10', 'English Grammar and Literature for Class 10', 'कक्षा 10 के लिए अंग्रेजी व्याकरण और साहित्य', 'English', 'intermediate', 4, '/images/courses/english-10.jpg'),
('course-hindi-10', 'Hindi Class 10', 'हिंदी कक्षा 10', 'हिंदी इयत्ता 10', 'இந்தி வகுப்பு 10', 'Hindi Literature and Grammar for Class 10', 'कक्षा 10 के लिए हिंदी साहित्य और व्याकरण', 'Hindi', 'intermediate', 4, '/images/courses/hindi-10.jpg'),
('course-coding-basics', 'Coding Basics', 'कोडिंग मूल बातें', 'कोडिंग मूलभूत', 'குறியீட்டு அடிப்படைகள்', 'Learn programming fundamentals with Python', 'पायथन के साथ प्रोग्रामिंग की मूल बातें सीखें', 'Computer Science', 'beginner', 6, '/images/courses/coding.jpg');

-- Sample Videos for Math Course
INSERT OR IGNORE INTO videos (id, course_id, title, title_hi, title_mr, youtube_id, duration, order_index, description) VALUES
('vid-math-1', 'course-math-10', 'Real Numbers - Introduction', 'वास्तविक संख्याएँ - परिचय', 'वास्तविक संख्या - परिचय', 'dQw4w9WgXcQ', 1200, 1, 'Introduction to Real Numbers and Euclid Division Lemma'),
('vid-math-2', 'course-math-10', 'Polynomials - Basics', 'बहुपद - मूल बातें', 'बहुपदी - मूलभूत', 'dQw4w9WgXcQ', 1500, 2, 'Understanding Polynomials and their types'),
('vid-math-3', 'course-math-10', 'Pair of Linear Equations', 'रैखिक समीकरण युग्म', 'रेखीय समीकरणाची जोडी', 'dQw4w9WgXcQ', 1800, 3, 'Solving pair of linear equations in two variables'),
('vid-math-4', 'course-math-10', 'Quadratic Equations', 'द्विघात समीकरण', 'वर्गसमीकरणे', 'dQw4w9WgXcQ', 1600, 4, 'Solving quadratic equations using different methods'),
('vid-math-5', 'course-math-10', 'Arithmetic Progressions', 'समांतर श्रेढ़ी', 'समांतर श्रेणी', 'dQw4w9WgXcQ', 1400, 5, 'Understanding AP and its applications');

-- Sample Videos for Science Course
INSERT OR IGNORE INTO videos (id, course_id, title, title_hi, title_mr, youtube_id, duration, order_index, description) VALUES
('vid-sci-1', 'course-science-10', 'Chemical Reactions', 'रासायनिक अभिक्रियाएँ', 'रासायनिक अभिक्रिया', 'dQw4w9WgXcQ', 1300, 1, 'Types of chemical reactions and equations'),
('vid-sci-2', 'course-science-10', 'Acids, Bases and Salts', 'अम्ल, क्षार और लवण', 'आम्ल, आम्लारी आणि क्षार', 'dQw4w9WgXcQ', 1500, 2, 'Properties and uses of acids, bases and salts'),
('vid-sci-3', 'course-science-10', 'Life Processes', 'जीवन प्रक्रियाएँ', 'जीवन प्रक्रिया', 'dQw4w9WgXcQ', 1700, 3, 'Nutrition, respiration, transportation and excretion'),
('vid-sci-4', 'course-science-10', 'Electricity', 'विद्युत', 'विद्युत', 'dQw4w9WgXcQ', 1400, 4, 'Electric current, resistance and Ohms law'),
('vid-sci-5', 'course-science-10', 'Light - Reflection', 'प्रकाश - परावर्तन', 'प्रकाश - परावर्तन', 'dQw4w9WgXcQ', 1600, 5, 'Reflection of light and mirrors');

-- Sample Videos for English Course
INSERT OR IGNORE INTO videos (id, course_id, title, title_hi, title_mr, youtube_id, duration, order_index, description) VALUES
('vid-eng-1', 'course-english-10', 'A Letter to God', 'भगवान को पत्र', 'देवाला पत्र', 'dQw4w9WgXcQ', 1100, 1, 'First Flight - A Letter to God by G.L. Fuentes'),
('vid-eng-2', 'course-english-10', 'Nelson Mandela', 'नेल्सन मंडेला', 'नेल्सन मंडेला', 'dQw4w9WgXcQ', 1200, 2, 'Long Walk to Freedom summary and analysis'),
('vid-eng-3', 'course-english-10', 'Tenses - Complete Guide', 'काल - संपूर्ण मार्गदर्शिका', 'काळ - संपूर्ण मार्गदर्शक', 'dQw4w9WgXcQ', 1500, 3, 'All tenses explained with examples'),
('vid-eng-4', 'course-english-10', 'Letter Writing', 'पत्र लेखन', 'पत्र लेखन', 'dQw4w9WgXcQ', 1000, 4, 'Formal and informal letter writing');

-- Sample Videos for Coding Course
INSERT OR IGNORE INTO videos (id, course_id, title, title_hi, title_mr, youtube_id, duration, order_index, description) VALUES
('vid-code-1', 'course-coding-basics', 'What is Programming?', 'प्रोग्रामिंग क्या है?', 'प्रोग्रामिंग म्हणजे काय?', 'dQw4w9WgXcQ', 900, 1, 'Introduction to programming and computers'),
('vid-code-2', 'course-coding-basics', 'Python Installation', 'पायथन इंस्टॉलेशन', 'पायथन इंस्टॉलेशन', 'dQw4w9WgXcQ', 600, 2, 'How to install Python on your computer'),
('vid-code-3', 'course-coding-basics', 'Variables and Data Types', 'वेरिएबल और डेटा टाइप', 'व्हेरिएबल आणि डेटा प्रकार', 'dQw4w9WgXcQ', 1200, 3, 'Understanding variables and data types in Python'),
('vid-code-4', 'course-coding-basics', 'Conditional Statements', 'सशर्त कथन', 'सशर्त विधाने', 'dQw4w9WgXcQ', 1100, 4, 'If-else statements in Python'),
('vid-code-5', 'course-coding-basics', 'Loops in Python', 'पायथन में लूप', 'पायथनमध्ये लूप', 'dQw4w9WgXcQ', 1300, 5, 'For and while loops explained'),
('vid-code-6', 'course-coding-basics', 'Functions', 'फंक्शन', 'फंक्शन', 'dQw4w9WgXcQ', 1400, 6, 'Creating and using functions');

-- Sample Users (for demo)
INSERT OR IGNORE INTO users (id, name, email, role, preferred_language, streak_count) VALUES
('user-demo-student', 'Demo Student', 'student@demo.com', 'student', 'en', 5),
('user-demo-mentor', 'Dr. Sharma', 'mentor@demo.com', 'mentor', 'hi', 0),
('user-mentor-2', 'Prof. Patel', 'patel@demo.com', 'mentor', 'mr', 0),
('user-mentor-3', 'Mrs. Kumar', 'kumar@demo.com', 'mentor', 'ta', 0);

-- Sample Mentors
INSERT OR IGNORE INTO mentors (id, user_id, bio, expertise, languages, hourly_rate, rating, total_sessions, is_available) VALUES
('mentor-1', 'user-demo-mentor', 'PhD in Mathematics with 15 years of teaching experience. Specialized in making complex concepts simple.', 'Mathematics, Physics', '["en", "hi"]', 0, 4.8, 150, 1),
('mentor-2', 'user-mentor-2', 'MSc in Chemistry, passionate about helping students understand science through experiments.', 'Chemistry, Biology', '["en", "mr", "hi"]', 0, 4.6, 89, 1),
('mentor-3', 'user-mentor-3', 'MA in English Literature, expert in grammar and creative writing.', 'English, Hindi', '["en", "ta", "hi"]', 0, 4.9, 200, 1);

-- Sample Quiz for Math
INSERT OR IGNORE INTO quizzes (id, video_id, course_id, title, questions, passing_score) VALUES
('quiz-math-1', 'vid-math-1', 'course-math-10', 'Real Numbers Quiz', '[{"id":"q1","question":"What is the HCF of 12 and 18?","options":["2","3","6","12"],"correct":2,"explanation":"HCF of 12 and 18 is 6"},{"id":"q2","question":"Every positive integer can be expressed as product of primes. This is called?","options":["Euclid Lemma","Fundamental Theorem","Prime Factorization","None"],"correct":1,"explanation":"This is the Fundamental Theorem of Arithmetic"},{"id":"q3","question":"√2 is a _____ number","options":["Rational","Irrational","Integer","Natural"],"correct":1,"explanation":"√2 cannot be expressed as p/q, hence irrational"}]', 70);

SELECT 'Database setup completed successfully!' as message;
