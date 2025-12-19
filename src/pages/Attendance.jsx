import { useEffect, useMemo, useState } from 'react'
import { useData } from '../context/DataContext'

export function AttendancePage() {
  const { students, attendance, upsertAttendance } = useData()
  const classes = useMemo(() => Array.from(new Set(students.map((s) => s.className))).sort(), [students])

  const [className, setClassName] = useState(classes[0] || '')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [statuses, setStatuses] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const existing = attendance.find((r) => r.date === date && r.className === className)
    if (existing) {
      const map = existing.entries.reduce((acc, entry) => {
        acc[entry.studentId] = entry.status
        return acc
      }, {})
      setStatuses(map)
    } else {
      setStatuses({})
    }
  }, [attendance, className, date])

  useEffect(() => {
    if (classes.length && !className) {
      setClassName(classes[0])
    }
  }, [classes, className])

  const studentsInClass = students.filter((s) => !className || s.className === className)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!className) {
      setMessage('Choose a class before marking attendance.')
      return
    }
    if (studentsInClass.length === 0) {
      setMessage('No students in this class yet.')
      return
    }
    upsertAttendance(date, className, statuses)
    setMessage('Attendance saved. Existing records for this date/class were updated (no duplicates).')
  }

  const toggleStatus = (studentId, status) => {
    setStatuses((prev) => ({ ...prev, [studentId]: status }))
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="eyebrow">Mark attendance</div>
            <h3>By class and date</h3>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="grid two">
            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label>
              Class
              <select value={className} onChange={(e) => setClassName(e.target.value)} required>
                <option value="" disabled>
                  Select class
                </option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {studentsInClass.length === 0 ? (
            <p className="helper-text">Add students to this class first.</p>
          ) : (
            <div className="table">
              <div className="table-row head">
                <div>Name</div>
                <div>Roll</div>
                <div>Status</div>
              </div>
              {studentsInClass.map((student) => (
                <div className="table-row" key={student.id}>
                  <div>{student.name}</div>
                  <div>{student.rollNumber || '-'}</div>
                  <div className="row-actions">
                    <button
                      type="button"
                      className={
                        statuses[student.id] === 'present' ? 'btn pill selected success' : 'btn pill ghost'
                      }
                      onClick={() => toggleStatus(student.id, 'present')}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      className={statuses[student.id] === 'absent' ? 'btn pill selected danger' : 'btn pill ghost'}
                      onClick={() => toggleStatus(student.id, 'absent')}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn primary">
            Save attendance
          </button>
          {message && <div className="alert info">{message}</div>}
        </form>
      </div>
    </div>
  )
}
