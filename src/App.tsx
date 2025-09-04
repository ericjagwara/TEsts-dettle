import { LoginForm } from "./components/LoginForm"
import { FloatingShapes } from "./components/FloatingShapes"
import "./App.css"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 relative overflow-hidden flex items-center justify-center p-4">
      <FloatingShapes />

      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}

export default App
