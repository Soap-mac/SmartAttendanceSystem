import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'

const emptyForm = { name: '', className: '', registrationNumber: '' }

export function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent } = useData()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const classes = useMemo(() => Array.from(new Set(students.map((s) => s.className))).sort(), [students])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateStudent(editingId, form)
    } else {
      addStudent(form)
    }
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      className: student.className,
      registrationNumber: student.registrationNumber || student.rollNumber || '',
    })
    setEditingId(student.id)
  }

  return (
    <div className="grid two">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="eyebrow">{editingId ? 'Edit student' : 'Add student'}</div>
            <h3>Student details</h3>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Branch
            <input
              value={form.className}
              onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
              required
            />
          </label>
          <label>
            Registration number
            <input
              value={form.registrationNumber}
              onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))}
              placeholder="Optional"
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn primary">
              {editingId ? 'Update' : 'Add student'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setForm(emptyForm)
                  setEditingId(null)
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="eyebrow">Students</div>
            <h3>All students</h3>
          </div>
          <div className="chips">
            {classes.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        </div>
        {students.length === 0 ? (
          <p className="helper-text">Add students to start marking attendance.</p>
        ) : (
          <div className="table">
            <div className="table-row head">
              <div>Name</div>
              <div>Branch</div>
              <div>Registration</div>
              <div>Actions</div>
            </div>
            {students.map((s) => (
              <div className="table-row" key={s.id}>
                <div>{s.name}</div>
                <div>{s.className}</div>
                <div>{s.registrationNumber || s.rollNumber || '-'}</div>
                <div className="row-actions">
                  <button className="btn text" onClick={() => handleEdit(s)}>
                    Edit
                  </button>
                  <button className="btn text danger" onClick={() => deleteStudent(s.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
