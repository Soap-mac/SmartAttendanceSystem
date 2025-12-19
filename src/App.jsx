import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { AttendancePage } from './pages/Attendance'
import { DashboardPage } from './pages/Dashboard'
import { LoginPage } from './pages/Login'
import { ReportsPage } from './pages/Reports'
import { StudentsPage } from './pages/Students'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AttendancePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
