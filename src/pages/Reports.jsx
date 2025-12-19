import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'

export function ReportsPage() {
  const { students, attendance } = useData()
  const classes = useMemo(() => Array.from(new Set(students.map((s) => s.className))).sort(), [students])
  const [classFilter, setClassFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const filteredRecords = useMemo(
    () =>
      attendance.filter(
        (r) => (!classFilter || r.className === classFilter) && (!dateFilter || r.date === dateFilter),
      ),
    [attendance, classFilter, dateFilter],
  )

  const rows = useMemo(() => {
    const list = students.filter((s) => !classFilter || s.className === classFilter)
    return list.map((student) => {
      const relevant = filteredRecords.filter((rec) => rec.className === student.className)
      const total = relevant.reduce(
        (sum, rec) => sum + (rec.entries.some((e) => e.studentId === student.id) ? 1 : 0),
        0,
      )
      const present = relevant.reduce(
        (sum, rec) =>
          sum + (rec.entries.find((e) => e.studentId === student.id)?.status === 'present' ? 1 : 0),
        0,
      )
      const percentage = total === 0 ? 0 : Math.round((present / total) * 100)
      return { ...student, total, present, percentage }
    })
  }, [students, classFilter, filteredRecords])

  const average = useMemo(() => {
    if (rows.length === 0) return 0
    const totalPercent = rows.reduce((sum, r) => sum + r.percentage, 0)
    return Math.round(totalPercent / rows.length)
  }, [rows])

  return (
    <div className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="eyebrow">Attendance reports</div>
            <h3>Filter by class and date</h3>
          </div>
          <div className="chips">
            <span className="chip">Avg: {average}%</span>
            <span className="chip">Records: {filteredRecords.length}</span>
          </div>
        </div>
        <div className="reports-filters">
          <label className="filter-field">
            <span className="eyebrow">Class filter</span>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="">All classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-field">
            <span className="eyebrow">Date filter</span>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </label>
        </div>

        {rows.length === 0 ? (
          <p className="helper-text">No students match this filter.</p>
        ) : (
          <div className="table">
            <div className="table-row head">
              <div>Name</div>
              <div>Class</div>
              <div>Present</div>
              <div>Total</div>
              <div>Percent</div>
            </div>
            {rows.map((row) => (
              <div className="table-row" key={row.id}>
                <div>{row.name}</div>
                <div>{row.className}</div>
                <div>{row.present}</div>
                <div>{row.total}</div>
                <div>{row.percentage}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
