import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLessonById } from '@/services/content/contentRepository'
import { useAppStore } from '@/state/store'
import { LessonPlayer } from '@/components/lesson/LessonPlayer'
import type { Lesson } from '@/domain/learning/types'

export function LessonRoute() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const setActiveLesson = useAppStore((s) => s.setActiveLesson)
  const setLastSession = useAppStore((s) => s.setLastSession)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!lessonId) { setNotFound(true); setLoading(false); return }
    getLessonById(lessonId).then((l) => {
      if (l) {
        setLesson(l)
        setActiveLesson(l)
        setLastSession({ type: 'lesson', id: lessonId })
      } else {
        setNotFound(true)
      }
      setLoading(false)
    })
    return () => { setActiveLesson(null) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  if (loading) return <div className="loading">Loading lesson…</div>
  if (notFound || !lesson) return (
    <div className="lesson-route">
      <Link to="/learn" className="back-link">← Back to Plans</Link>
      <p>Lesson not found.</p>
    </div>
  )

  return (
    <div className="lesson-route">
      <Link to="/learn" className="back-link">← Back to Plans</Link>
      <LessonPlayer lesson={lesson} />
    </div>
  )
}
