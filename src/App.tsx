import './App.css'
import { AppRouter } from "./routes/AppRouter.tsx";
import { AuthProvider } from "./routes/AuthContext.tsx";
import { ChatProvider } from "./contexts/ChatContext.tsx";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppRouter />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App
