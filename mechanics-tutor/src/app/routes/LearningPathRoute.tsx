import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadLessonPlans, loadLessons } from '@/services/content/contentRepository'
import { sequencePlan } from '@/domain/learning/planSequencer'
import { useAppStore } from '@/state/store'
import { LessonPlanSelector } from '@/components/lesson/LessonPlanSelector'
import type { LessonPlan, LessonStatus } from '@/domain/learning/types'

export function LearningPathRoute() {
  const navigate = useNavigate()
  const progress = useAppStore((s) => s.progress)
  const setActivePlan = useAppStore((s) => s.setActivePlan)

  const [plans, setPlans] = useState<LessonPlan[]>([])
  const [lessonStatuses, setLessonStatuses] = useState<Record<string, LessonStatus>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([loadLessonPlans(), loadLessons()]).then(([allPlans, allLessons]) => {
      setPlans(allPlans)
      const statuses: Record<string, LessonStatus> = {}
      for (const plan of allPlans) {
        const sequenced = sequencePlan(plan, allLessons, progress)
        for (const s of sequenced) {
          statuses[s.lesson.id] = s.status
        }
      }
      setLessonStatuses(statuses)
      setLoading(false)
    })
  }, [progress])

  const handleSelect = (plan: LessonPlan) => {
    setActivePlan(plan)
    const firstId = plan.lessonIds[0]
    if (firstId) navigate(`/lesson/${firstId}`)
  }

  if (loading) return <div className="loading">Loading lesson plans…</div>

  return (
    <div className="learning-path-route">
      <h1>Learning Path</h1>
      <LessonPlanSelector
        plans={plans}
        lessonStatuses={lessonStatuses}
        onSelectPlan={handleSelect}
      />
    </div>
  )
}
