import { useMemo } from 'react'
import { useData } from '../context/DataContext'

export function DashboardPage() {
  const { students, attendance } = useData()
  const today = new Date().toISOString().slice(0, 10)

  const { presentToday, totalMarkedToday } = useMemo(() => {
    const records = attendance.filter((a) => a.date === today)
    const total = records.reduce((sum, r) => sum + r.entries.length, 0)
    const present = records.reduce((sum, r) => sum + r.entries.filter((e) => e.status === 'present').length, 0)
    return { presentToday: present, totalMarkedToday: total }
  }, [attendance, today])

  const recent = [...attendance]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div className="stack">
      <div className="grid stats">
        <div className="card stat">
          <div className="eyebrow">Total students</div>
          <div className="stat-value">{students.length}</div>
          <div className="helper-text">Across all classes</div>
        </div>
        <div className="card stat">
          <div className="eyebrow">Today marked</div>
          <div className="stat-value">{totalMarkedToday}</div>
          <div className="helper-text">Entries for {today}</div>
        </div>
        <div className="card stat">
          <div className="eyebrow">Present today</div>
          <div className="stat-value">{presentToday}</div>
          <div className="helper-text">All classes combined</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="eyebrow">Recent attendance</div>
            <h3>Last 5 records</h3>
          </div>
        </div>
        {recent.length === 0 ? (
          <p className="helper-text">No attendance recorded yet.</p>
        ) : (
          <div className="table">
            <div className="table-row head">
              <div>Date</div>
              <div>Class</div>
              <div>Present</div>
              <div>Total</div>
            </div>
            {recent.map((record) => {
              const present = record.entries.filter((e) => e.status === 'present').length
              return (
                <div className="table-row" key={record.id}>
                  <div>{record.date}</div>
                  <div>{record.className}</div>
                  <div>{present}</div>
                  <div>{record.entries.length}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
