import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ isOpen, toggleSidebar, onSignInClick }) {
  const { user, signout, loading } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="menu-btn" 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {/* Conditional Rendering: If open, show Times (X), else show Bars (Hamburger) */}
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          <span className="logo">Eduvision</span>
        </div>

        <div className="header-actions">
          {
            !loading && (
              <>
                {user ? (
                  <button className="signin-btn" onClick={signout}>
                    Sign out
                  </button>
                ): (
                  <button className="signin-btn" onClick={onSignInClick}>
                    Sign in
                  </button>
                )}
              </>
            )
          }
          
        </div>
      </div>
    </header>
  );
}
