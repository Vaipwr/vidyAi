import { openDB, DBSchema, IDBPDatabase } from "idb"

interface VidyaDB extends DBSchema {
  courses: {
    key: string
    value: {
      id: string
      title: string
      description: string
      thumbnail: string
      subject: string
      language: string
      syncedAt: number
    }
    indexes: { "by-subject": string }
  }
  videos: {
    key: string
    value: {
      id: string
      courseId: string
      title: string
      youtubeId: string
      duration: number
      syncedAt: number
    }
    indexes: { "by-course": string }
  }
  progress: {
    key: string
    value: {
      id: string
      videoId: string
      timestamp: number
      completed: boolean
      syncedAt: number
      needsSync: boolean
    }
    indexes: { "by-video": string; "needs-sync": number }
  }
  bookmarks: {
    key: string
    value: {
      id: string
      videoId: string
      timestamp: number
      note: string
      syncedAt: number
      needsSync: boolean
    }
    indexes: { "by-video": string; "needs-sync": number }
  }
}

let db: IDBPDatabase<VidyaDB> | null = null

export async function getDB(): Promise<IDBPDatabase<VidyaDB>> {
  if (db) return db

  db = await openDB<VidyaDB>("vidyai-offline", 1, {
    upgrade(db) {
      // Courses store
      const courseStore = db.createObjectStore("courses", { keyPath: "id" })
      courseStore.createIndex("by-subject", "subject")

      // Videos store
      const videoStore = db.createObjectStore("videos", { keyPath: "id" })
      videoStore.createIndex("by-course", "courseId")

      // Progress store
      const progressStore = db.createObjectStore("progress", { keyPath: "id" })
      progressStore.createIndex("by-video", "videoId")
      progressStore.createIndex("needs-sync", "needsSync")

      // Bookmarks store
      const bookmarkStore = db.createObjectStore("bookmarks", { keyPath: "id" })
      bookmarkStore.createIndex("by-video", "videoId")
      bookmarkStore.createIndex("needs-sync", "needsSync")
    },
  })

  return db
}

// Save course for offline viewing
export async function saveCourseOffline(course: {
  id: string
  title: string
  description: string
  thumbnail: string
  subject: string
  language: string
}) {
  const db = await getDB()
  await db.put("courses", {
    ...course,
    syncedAt: Date.now(),
  })
}

// Get offline courses
export async function getOfflineCourses() {
  const db = await getDB()
  return db.getAll("courses")
}

// Save video for offline
export async function saveVideoOffline(video: {
  id: string
  courseId: string
  title: string
  youtubeId: string
  duration: number
}) {
  const db = await getDB()
  await db.put("videos", {
    ...video,
    syncedAt: Date.now(),
  })
}

// Get offline videos for a course
export async function getOfflineVideos(courseId: string) {
  const db = await getDB()
  return db.getAllFromIndex("videos", "by-course", courseId)
}

// Save progress locally (works offline)
export async function saveProgressOffline(progress: {
  id: string
  videoId: string
  timestamp: number
  completed: boolean
}) {
  const db = await getDB()
  await db.put("progress", {
    ...progress,
    syncedAt: Date.now(),
    needsSync: true,
  })
}

// Get progress for a video
export async function getVideoProgress(videoId: string) {
  const db = await getDB()
  return db.getFromIndex("progress", "by-video", videoId)
}

// Save bookmark locally
export async function saveBookmarkOffline(bookmark: {
  id: string
  videoId: string
  timestamp: number
  note: string
}) {
  const db = await getDB()
  await db.put("bookmarks", {
    ...bookmark,
    syncedAt: Date.now(),
    needsSync: true,
  })
}

// Get bookmarks for a video
export async function getVideoBookmarks(videoId: string) {
  const db = await getDB()
  return db.getAllFromIndex("bookmarks", "by-video", videoId)
}

// Sync pending changes when online
export async function syncPendingChanges() {
  if (!navigator.onLine) return

  const db = await getDB()

  // Sync progress
  const pendingProgress = await db.getAllFromIndex("progress", "needs-sync", 1)
  for (const progress of pendingProgress) {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      })
      await db.put("progress", { ...progress, needsSync: false })
    } catch (error) {
      console.error("Failed to sync progress:", error)
    }
  }

  // Sync bookmarks
  const pendingBookmarks = await db.getAllFromIndex("bookmarks", "needs-sync", 1)
  for (const bookmark of pendingBookmarks) {
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookmark),
      })
      await db.put("bookmarks", { ...bookmark, needsSync: false })
    } catch (error) {
      console.error("Failed to sync bookmark:", error)
    }
  }
}

// Check if content is available offline
export async function isContentOffline(contentId: string, type: "course" | "video") {
  const db = await getDB()
  const store = type === "course" ? "courses" : "videos"
  const item = await db.get(store, contentId)
  return !!item
}

// Clear all offline data
export async function clearOfflineData() {
  const db = await getDB()
  await db.clear("courses")
  await db.clear("videos")
  await db.clear("progress")
  await db.clear("bookmarks")
}

// Get offline storage usage
export async function getOfflineStorageUsage() {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    return {
      used: estimate.usage || 0,
      available: estimate.quota || 0,
      percentage: estimate.quota ? (estimate.usage || 0) / estimate.quota * 100 : 0,
    }
  }
  return { used: 0, available: 0, percentage: 0 }
}
