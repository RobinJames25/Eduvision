import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open }) {
  const { user } = useAuth();

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="sidebar-profile">
      <div className="usercard">
        <button aria-label="User avatar" type="button" className="Avatar_avatar__yZNjf Avatar_turquoise__Ti4sq Avatar_large__8U8Tv UserCardLoggedOut_avatar__HZW__ Button_button__88E9y Button_pill__9vfK_ ButtonColors_plain-blue__CzJsi ButtonSizes_micro__MFpSO ButtonSizes_plain__e16oQ" data-focus-visible="false">
          <span className="Button_text__Pv_HU" data-content="true">
            <div className="Blob_blob-wrapper__tMUCP">
              <div className="Blob_blob-shape__SBfwC Blob_shape-9__EucAg">
                <span className="Avatar_avatar-icon__tWaEL">
                  {user ? (
                    <span style={{ fontWeight: 'bold' }}>
                      {user.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  ): (
                    <svg data-prefix="fas" data-icon="user" className="svg-inline--fa fa-user Icon_icon__Rm_O3 Icon_scale-1x__raNpf Icon_padding-medium___wjS_" role="img" viewBox="0 0 448 512" aria-hidden="true">
                      <path fill="currentColor" d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"></path>
                    </svg>
                  )}
                  
                </span>
              </div>
            </div>
          </span>
        </button>
        <div className="usercard-loggedOut">
          <span className="TextColors_black__Bjsbh TextSizes_normal__Cpa9w TextWeights_bold__q7wtq">
            {user ? user.full_name : "Guest user"}</span>
          <button tabIndex="0" type="button" className="Button_button__88E9y Button_pill__9vfK_ ButtonColors_plain-blue__CzJsi ButtonSizes_micro__MFpSO ButtonSizes_plain__e16oQ add_user_btn" data-focus-visible="false">
            <span className="welcome_button" data-content="true">
              <span className="TextSizes_extra-small__vPcuJ TextWeights_medium__jhPBA">
                {user ? `Welcome, ${user.full_name}` : "Welcome Guest User"}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
    <nav className="sidebar-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-house"></i> Home
        </NavLink>

        <NavLink to="/library" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-book"></i> My Library
        </NavLink>

        <NavLink to="/ai-notes" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-robot"></i> AI Notes
        </NavLink>

        <NavLink to="/ask-ai" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-comments"></i> Ask AI
        </NavLink>

        <NavLink to="/ai-quiz" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-clipboard-list"></i> AI Quiz
        </NavLink>

        <NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-folder"></i> Courses
        </NavLink>
    </nav>
  </aside>
  );
}
