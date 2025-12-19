import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [students, setStudents] = useLocalStorage('sa-students', [])
  const [attendance, setAttendance] = useLocalStorage('sa-attendance', [])

  const addStudent = (student) => {
    const newStudent = { ...student, id: crypto.randomUUID() }
    setStudents((prev) => [...prev, newStudent])
  }

  const updateStudent = (id, updates) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    setAttendance((prev) => prev.map((record) => ({
      ...record,
      entries: record.entries.filter((e) => e.studentId !== id),
    })))
  }

  const upsertAttendance = (date, className, statuses) => {
    const entries = Object.entries(statuses).map(([studentId, status]) => ({ studentId, status }))
    const keyMatch = (record) => record.date === date && record.className === className

    setAttendance((prev) => {
      const existing = prev.find(keyMatch)
      if (existing) {
        return prev.map((record) => (keyMatch(record) ? { ...record, entries } : record))
      }
      return [...prev, { id: crypto.randomUUID(), date, className, entries }]
    })
  }

  const value = useMemo(
    () => ({ students, attendance, addStudent, updateStudent, deleteStudent, upsertAttendance }),
    [students, attendance],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
