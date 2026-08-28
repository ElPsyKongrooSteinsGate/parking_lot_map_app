import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Dashboard } from './pages/Parking_manager_user/Dashboard'
import { Login } from './pages/Login'
import { ParkingSpaces } from './pages/Parking_manager_user/Parking_spaces'
import { DriverUser } from './pages/Driver_user'
import { store } from './store'
import { useAppSelector } from './store/hooks'
import { selectAccessToken } from './store/selectors'
import type { FC } from 'react'
import type { MockPrivilege, MockUserRole } from './mockApi'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </Provider>
  )
}
const AppWrapper: FC = function () {
  const accessToken = useAppSelector(selectAccessToken)
  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = Boolean(accessToken)

  function canAccess(roles: MockUserRole[], privileges: MockPrivilege[] = []) {
    return Boolean(user && (roles.includes(user.role) || privileges.some((privilege) => user.privileges.includes(privilege))))
  }

  const landingPath = user?.role === 'driver' ? '/driver' : '/dashboard'

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? landingPath : '/login'} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={landingPath} replace /> : <Login />} />
      <Route path="/dashboard" element={isAuthenticated && canAccess(['developer', 'admin', 'parking_manager'], ['superadmin', 'admin']) ? <Dashboard /> : <Navigate to={isAuthenticated ? landingPath : '/login'} replace />} />
      <Route path="/parking-spaces" element={isAuthenticated && canAccess(['developer', 'admin', 'parking_manager'], ['superadmin', 'admin']) ? <ParkingSpaces /> : <Navigate to={isAuthenticated ? landingPath : '/login'} replace />} />
      <Route path="/parking-manager" element={isAuthenticated && canAccess(['parking_manager']) ? <Navigate to="/dashboard" replace /> : <Navigate to={isAuthenticated ? landingPath : '/login'} replace />} />
      <Route path="/driver" element={isAuthenticated && canAccess(['driver']) ? <DriverUser /> : <Navigate to={isAuthenticated ? landingPath : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
