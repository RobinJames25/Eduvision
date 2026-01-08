import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 👈 Import Router tools
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import AINotes from "./pages/AINotes";
import Library from "./pages/Library";
import DialogBox from "./components/Dialogbox";
import SignupDialog from "./components/SignupDialog";
import SigninDialog from "./components/SigninDialog";
import "./css/Homepage.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authDialog, setAuthDialog] = useState(null);

  return (
    <> 
      <DialogBox
        open={authDialog === "login"}
        onClose={() => setAuthDialog(null)}
        onRegisterClick={() => setAuthDialog("signup")}
        onEmailLoginClick={() => setAuthDialog("email-login")}
      />

      <SignupDialog
        key={authDialog === "signup" ? "signup-open" : "signup-closed"}
        open={authDialog === "signup"}
        onClose={() => setAuthDialog(null)}
        onBackToLogin={() => setAuthDialog("login")}
      />

      <SigninDialog
        key={authDialog === "email-login" ? "signin-open" : "signin-closed"}
        open={authDialog === "email-login"}
        onClose={() => setAuthDialog(null)}
        onBackToSignin={() => setAuthDialog("login")}
        onRegisterClick={() => setAuthDialog("signup")}
      />

      {/* Overlay for mobile */}
      <div
        className={`overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app">
        <Navbar 
          isOpen={sidebarOpen} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          onSignInClick={() => setAuthDialog("login")}
        />

        <div className="app-body">
          <Sidebar open={sidebarOpen} />

          <main className="app-content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/library" element={<Library />} />
              <Route path="/ai-notes" element={<AINotes />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}