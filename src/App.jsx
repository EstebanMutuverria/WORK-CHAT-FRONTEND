import { Route, Routes } from "react-router"
import LoginScreen from "./screens/Login/LoginScreen"
import HomeScreen from "./screens/HomeScreen/HomeScreen"
import RegisterScreen from "./screens/Register/RegisterScreen"
import ResetPasswordRequestScreen from "./screens/ResetPasswordRequestScreen/ResetPasswordRequestScreen"
import AuthMiddleware from "./Middlewares/AuthMiddleware"
import CreateWorkspaceScreen from "./screens/CreateWorkspaceScreen/CreateWorkspaceScreen"
import WorkspaceScreen from "./screens/Workspace/WorkspaceScreen"
import CreateChannelScreen from "./screens/CreateChannelScreen/CreateChannelScreen"

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route element={<AuthMiddleware />}>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/create-workspace" element={<CreateWorkspaceScreen />} />
        <Route path="/workspaces/:workspace_id" element={<WorkspaceScreen />} />
        <Route path="/workspaces/:workspace_id/:channel_id" element={<WorkspaceScreen />} />
        <Route path="/workspaces/:workspace_id/create-channel" element={<CreateChannelScreen />} />
      </Route>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/reset-password-request" element={<ResetPasswordRequestScreen />} />
    </Routes>
  )
}

export default App
