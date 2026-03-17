// In-memory data store - no native dependencies required
// This provides a simple, ready-to-use database that works in any environment

export interface User {
  id: string
  name: string
  email: string
  image?: string
  preferredLanguage: string
  role: 'student' | 'mentor' | 'admin'
  createdAt: Date
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  subject: string
  level: string
  language: string
  duration: string
  instructor: string
  rating: number
  enrolledCount: number
  videoCount: number
}

export interface Video {
  id: string
  courseId: string
  title: string
  description: string
  youtubeId: string
  duration: string
  order: number
  transcript?: string
}

export interface Mentor {
  id: string
  name: string
  avatar: string
  expertise: string[]
  languages: string[]
  bio: string
  rating: number
  sessionsCompleted: number
  available: boolean
  hourlyRate: number
}

export interface ForumPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  title: string
  content: string
  category: string
  upvotes: number
  replies: number
  createdAt: Date
  videoId?: string
  isAiGenerated?: boolean
  videoTitle?: string
  timestamp?: number
}

export interface Bookmark {
  id: string
  userId: string
  videoId: string
  timestamp: number
  note: string
  emotionState?: string
  createdAt: Date
}

export interface EmotionLog {
  id: string
  userId: string
  videoId: string
  emotion: string
  confidence: number
  timestamp: number
  createdAt: Date
}

// Generate random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Sample data - Ready to use immediately
const sampleCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Mathematics Fundamentals',
    description: 'Master basic mathematics concepts including algebra, geometry, and arithmetic. Perfect for building a strong foundation.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
    subject: 'Mathematics',
    level: 'Beginner',
    language: 'Hindi',
    duration: '12 hours',
    instructor: 'Dr. Ramesh Kumar',
    rating: 4.8,
    enrolledCount: 15420,
    videoCount: 24
  },
  {
    id: 'course-2',
    title: 'Science for Class 10',
    description: 'Complete science curriculum covering Physics, Chemistry, and Biology aligned with CBSE standards.',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
    subject: 'Science',
    level: 'Intermediate',
    language: 'English',
    duration: '20 hours',
    instructor: 'Prof. Sunita Sharma',
    rating: 4.9,
    enrolledCount: 23150,
    videoCount: 40
  },
  {
    id: 'course-3',
    title: 'English Grammar Mastery',
    description: 'Learn English grammar from basics to advanced. Includes speaking practice and writing exercises.',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop',
    subject: 'English',
    level: 'Beginner',
    language: 'Hindi',
    duration: '15 hours',
    instructor: 'Mrs. Priya Patel',
    rating: 4.7,
    enrolledCount: 18900,
    videoCount: 30
  },
  {
    id: 'course-4',
    title: 'Computer Basics',
    description: 'Introduction to computers, internet, and basic programming concepts for beginners.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    subject: 'Computer Science',
    level: 'Beginner',
    language: 'English',
    duration: '10 hours',
    instructor: 'Mr. Vikram Singh',
    rating: 4.6,
    enrolledCount: 12300,
    videoCount: 20
  },
  {
    id: 'course-5',
    title: 'Hindi Sahitya',
    description: 'Explore Hindi literature, poetry, and prose. Learn about famous Hindi authors and their works.',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
    subject: 'Hindi',
    level: 'Intermediate',
    language: 'Hindi',
    duration: '18 hours',
    instructor: 'Dr. Anjali Mishra',
    rating: 4.8,
    enrolledCount: 9800,
    videoCount: 35
  },
  {
    id: 'course-6',
    title: 'Social Studies - India',
    description: 'Learn about Indian history, geography, civics, and economics in an engaging way.',
    thumbnail: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=250&fit=crop',
    subject: 'Social Studies',
    level: 'Intermediate',
    language: 'Hindi',
    duration: '16 hours',
    instructor: 'Prof. Amit Verma',
    rating: 4.5,
    enrolledCount: 11200,
    videoCount: 28
  }
]

const sampleVideos: Video[] = [
  {
    id: 'video-1',
    courseId: 'course-1',
    title: 'Introduction to Algebra',
    description: 'Learn the basics of algebraic expressions and equations.',
    youtubeId: 'NybHckSEQBI',
    duration: '15:30',
    order: 1,
    transcript: 'Welcome to algebra basics. Today we will learn about variables and expressions...'
  },
  {
    id: 'video-2',
    courseId: 'course-1',
    title: 'Solving Linear Equations',
    description: 'Step by step guide to solving linear equations.',
    youtubeId: 'Qyd_v3DGzTM',
    duration: '20:15',
    order: 2,
    transcript: 'In this lesson, we will learn how to solve linear equations step by step...'
  },
  {
    id: 'video-3',
    courseId: 'course-1',
    title: 'Quadratic Equations',
    description: 'Understanding and solving quadratic equations.',
    youtubeId: 'IlNAJl36-10',
    duration: '25:00',
    order: 3,
    transcript: 'Quadratic equations are polynomial equations of degree 2...'
  },
  {
    id: 'video-4',
    courseId: 'course-2',
    title: 'Laws of Motion',
    description: "Newton's three laws of motion explained with examples.",
    youtubeId: 'kKKM8Y-u7ds',
    duration: '22:45',
    order: 1,
    transcript: "Newton's laws of motion form the foundation of classical mechanics..."
  },
  {
    id: 'video-5',
    courseId: 'course-2',
    title: 'Chemical Reactions',
    description: 'Types of chemical reactions and how to balance equations.',
    youtubeId: 'TStjgUmL1RQ',
    duration: '18:30',
    order: 2,
    transcript: 'Chemical reactions involve the transformation of substances...'
  },
  {
    id: 'video-6',
    courseId: 'course-3',
    title: 'Parts of Speech',
    description: 'Learn nouns, verbs, adjectives, and more.',
    youtubeId: 'SceDmiBEESI',
    duration: '16:00',
    order: 1,
    transcript: 'In English grammar, parts of speech are categories of words...'
  }
]

const sampleMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Dr. Ramesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    expertise: ['Mathematics', 'Physics', 'JEE Preparation'],
    languages: ['Hindi', 'English'],
    bio: 'IIT Delhi alumnus with 15+ years of teaching experience. Helped 500+ students crack JEE.',
    rating: 4.9,
    sessionsCompleted: 1250,
    available: true,
    hourlyRate: 0
  },
  {
    id: 'mentor-2',
    name: 'Prof. Sunita Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    expertise: ['Biology', 'Chemistry', 'NEET Preparation'],
    languages: ['English', 'Hindi', 'Marathi'],
    bio: 'MBBS from AIIMS with passion for teaching. Specializes in medical entrance preparation.',
    rating: 4.8,
    sessionsCompleted: 890,
    available: true,
    hourlyRate: 0
  },
  {
    id: 'mentor-3',
    name: 'Mrs. Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    expertise: ['English', 'Communication', 'IELTS'],
    languages: ['English', 'Hindi', 'Gujarati'],
    bio: 'Cambridge certified English trainer. Expert in spoken English and competitive exam preparation.',
    rating: 4.7,
    sessionsCompleted: 720,
    available: true,
    hourlyRate: 0
  },
  {
    id: 'mentor-4',
    name: 'Mr. Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    expertise: ['Computer Science', 'Programming', 'Web Development'],
    languages: ['Hindi', 'English', 'Punjabi'],
    bio: 'Software engineer at Google. Passionate about teaching coding to rural students.',
    rating: 4.9,
    sessionsCompleted: 560,
    available: false,
    hourlyRate: 0
  }
]

const sampleForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    userId: 'user-1',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=50&h=50&fit=crop&crop=face',
    title: 'How to solve quadratic equations easily?',
    content: 'I am struggling with quadratic equations. Can someone explain the formula method in simple words?',
    category: 'Mathematics',
    upvotes: 45,
    replies: 12,
    createdAt: new Date('2026-03-14'),
    videoId: 'video-3'
  },
  {
    id: 'post-2',
    userId: 'user-2',
    userName: 'Priya Kumari',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face',
    title: 'Best way to memorize chemical formulas?',
    content: 'I keep forgetting chemical formulas. Any tips or tricks to remember them?',
    category: 'Science',
    upvotes: 38,
    replies: 8,
    createdAt: new Date('2026-03-15'),
    videoId: 'video-5'
  },
  {
    id: 'post-3',
    userId: 'user-3',
    userName: 'Amit Kumar',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    title: 'English tenses - Past Perfect confusion',
    content: 'When should I use past perfect vs simple past? Getting confused with examples.',
    category: 'English',
    upvotes: 29,
    replies: 15,
    createdAt: new Date('2026-03-16')
  }
]

// In-memory data storage
class DataStore {
  users: Map<string, User> = new Map()
  courses: Map<string, Course> = new Map()
  videos: Map<string, Video> = new Map()
  mentors: Map<string, Mentor> = new Map()
  forumPosts: Map<string, ForumPost> = new Map()
  bookmarks: Map<string, Bookmark> = new Map()
  emotionLogs: Map<string, EmotionLog> = new Map()

  constructor() {
    // Initialize with sample data
    sampleCourses.forEach(c => this.courses.set(c.id, c))
    sampleVideos.forEach(v => this.videos.set(v.id, v))
    sampleMentors.forEach(m => this.mentors.set(m.id, m))
    sampleForumPosts.forEach(p => this.forumPosts.set(p.id, p))
    
    // Create default user
    this.users.set('default-user', {
      id: 'default-user',
      name: 'Demo Student',
      email: 'demo@vidyai.com',
      preferredLanguage: 'en',
      role: 'student',
      createdAt: new Date()
    })
  }

  // Users
  getUser(id: string): User | undefined {
    return this.users.get(id) || this.users.get('default-user')
  }

  getDefaultUser(): User {
    return this.users.get('default-user')!
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: new Date()
    }
    this.users.set(newUser.id, newUser)
    return newUser
  }

  // Courses
  getAllCourses(filters?: { subject?: string; level?: string; language?: string }): Course[] {
    let courses = Array.from(this.courses.values())
    if (filters?.subject) {
      courses = courses.filter(c => c.subject === filters.subject)
    }
    if (filters?.level) {
      courses = courses.filter(c => c.level === filters.level)
    }
    if (filters?.language) {
      courses = courses.filter(c => c.language === filters.language)
    }
    return courses
  }

  getCourse(id: string): Course | undefined {
    return this.courses.get(id)
  }

  // Videos
  getVideo(id: string): Video | undefined {
    return this.videos.get(id)
  }

  getVideosByCourse(courseId: string): Video[] {
    return Array.from(this.videos.values())
      .filter(v => v.courseId === courseId)
      .sort((a, b) => a.order - b.order)
  }

  getAllVideos(): Video[] {
    return Array.from(this.videos.values())
  }

  // Mentors
  getAllMentors(filters?: { expertise?: string; language?: string }): Mentor[] {
    let mentors = Array.from(this.mentors.values())
    if (filters?.expertise) {
      mentors = mentors.filter(m => m.expertise.includes(filters.expertise!))
    }
    if (filters?.language) {
      mentors = mentors.filter(m => m.languages.includes(filters.language!))
    }
    return mentors
  }

  getMentor(id: string): Mentor | undefined {
    return this.mentors.get(id)
  }

  // Forum Posts
  getAllForumPosts(filters?: { category?: string; videoId?: string }): ForumPost[] {
    let posts = Array.from(this.forumPosts.values())
    if (filters?.category) {
      posts = posts.filter(p => p.category === filters.category)
    }
    if (filters?.videoId) {
      posts = posts.filter(p => p.videoId === filters.videoId)
    }
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getForumPost(id: string): ForumPost | undefined {
    return this.forumPosts.get(id)
  }

  createForumPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'replies'>): ForumPost {
    const newPost: ForumPost = {
      ...post,
      id: generateId(),
      upvotes: 0,
      replies: 0,
      createdAt: new Date()
    }
    this.forumPosts.set(newPost.id, newPost)
    return newPost
  }

  upvotePost(id: string): ForumPost | undefined {
    const post = this.forumPosts.get(id)
    if (post) {
      post.upvotes++
      this.forumPosts.set(id, post)
    }
    return post
  }

  // Bookmarks
  getBookmarks(userId: string): Bookmark[] {
    return Array.from(this.bookmarks.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getBookmarksByVideo(videoId: string): Bookmark[] {
    return Array.from(this.bookmarks.values())
      .filter(b => b.videoId === videoId)
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  createBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: generateId(),
      createdAt: new Date()
    }
    this.bookmarks.set(newBookmark.id, newBookmark)
    return newBookmark
  }

  deleteBookmark(id: string): boolean {
    return this.bookmarks.delete(id)
  }

  // Emotion Logs
  logEmotion(log: Omit<EmotionLog, 'id' | 'createdAt'>): EmotionLog {
    const newLog: EmotionLog = {
      ...log,
      id: generateId(),
      createdAt: new Date()
    }
    this.emotionLogs.set(newLog.id, newLog)
    return newLog
  }

  getEmotionLogs(userId: string, videoId?: string): EmotionLog[] {
    let logs = Array.from(this.emotionLogs.values()).filter(l => l.userId === userId)
    if (videoId) {
      logs = logs.filter(l => l.videoId === videoId)
    }
    return logs.sort((a, b) => a.timestamp - b.timestamp)
  }

  getEmotionStats(userId: string): { emotion: string; count: number }[] {
    const logs = this.getEmotionLogs(userId)
    const stats: Record<string, number> = {}
    logs.forEach(log => {
      stats[log.emotion] = (stats[log.emotion] || 0) + 1
    })
    return Object.entries(stats).map(([emotion, count]) => ({ emotion, count }))
  }
}

// Singleton instance
export const db = new DataStore()

// Helper to generate IDs
export { generateId }
