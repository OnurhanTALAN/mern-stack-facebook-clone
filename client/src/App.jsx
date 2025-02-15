import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppRouter from "./routes/AppRouter";

const App = () => {
  return (
    <div className="w-dvw h-dvh box-content m-0 p-0">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter/>
        </AuthProvider>  
      </BrowserRouter>
    </div>
  );
}
export default App;