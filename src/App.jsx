import { Route, Routes } from "react-router"
import LoginScreen from "./screens/Login/LoginScreen"
import HomeScreen from "./screens/HomeScreen/HomeScreen"
import RegisterScreen from "./screens/Register/RegisterScreen"
import ResetPasswordRequestScreen from "./screens/ResetPasswordRequestScreen/ResetPasswordRequestScreen"
import AuthMiddleware from "./Middlewares/AuthMiddleware"
import CreateWorkspaceScreen from "./screens/CreateWorkspaceScreen/CreateWorkspaceScreen"

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route element={<AuthMiddleware />}>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/create-workspace" element={<CreateWorkspaceScreen />} />
      </Route>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/reset-password-request" element={<ResetPasswordRequestScreen />} />
    </Routes>
  )
}

export default App
