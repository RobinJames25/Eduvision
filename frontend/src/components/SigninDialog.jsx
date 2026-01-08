import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../css/Signup.css";
import { useAuth } from "../../context/AuthContext";

export default function SigninDialog({ open, onClose, onBackToSignin, onRegisterClick }) {
  const { signin } = useAuth();

  const initialFormState = { email: "", password: ""};
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
        setFormData(initialFormState);
        setError("");
        setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const result = await signin(
          formData.email,
          formData.password
        );

        if (result.success){
          onClose();
        } else {
          setError(result.message);
        }
    } catch (error) {
        setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }

  };

  return ReactDOM.createPortal(
    <div className="Modal_overlay__PxHkA Modal_full-screen__WIwCi" onClick={onClose}>
      <dialog
        open
        className="Modal_modal__Ufdmt Modal_medium__HZarU Modal_hideable__7rASp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back Button */}
        <div className="Modal_header__YJVd5">
          <h1 className="TextStyles_root__ESLrv TextColors_title__3_lJF TextSizes_title-xxlarge__gbC6y TextStyles_bold__7KqgC TextStyles_dm-sans__s1K5W">
            <button 
              type="button" 
              className="Button_button__88E9y Button_pill__9vfK_ ButtonColors_tertiary-gray__FA7d9 ButtonSizes_small__ZbM_t"
              onClick={onBackToSignin}
            >
              <span className="Button_addon__LEr4y">
                <svg viewBox="0 0 320 512" width="16" fill="currentColor">
                  <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
                </svg>
              </span>
            </button>
            Signin with Email
          </h1>
        </div>

        <div className="Modal_body__7nSTF">
          {error && (
            <div style={{ color: "#d93025", backgroundColor: "#fdecea", padding: "10px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}
          <div className="MergedLoginRegisterBox_email-form-container__R3qz2">
            <form onSubmit={handleSubmit}>
              <div className="FormGroup_form-group__u5fIf">
                {/* Email */}
                <div className="FormField_field-wrapper__CGO3M">
                  <label className="FormFieldLabel_label___P3oR">
                    <span className="TextSizes_body-medium__vDuC4">E-mail address</span>
                  </label>
                  <div className="Input_input-wrapper__XGKui">
                    <input 
                      name="email"
                      value={formData.email}
                      className="Input_input__UQts3" 
                      placeholder="E-mail address" 
                      required
                      type="email" 
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="FormField_field-wrapper__CGO3M">
                  <label className="FormFieldLabel_label___P3oR">
                    <span className="TextSizes_body-medium__vDuC4">Password</span>
                  </label>
                  <div className="Input_input-wrapper__XGKui">
                    <input 
                      name="password"
                      value={formData.password}
                      className="Input_input__UQts3" 
                      placeholder="Password" 
                      required
                      type="password" 
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="Button_button__88E9y Button_pill__9vfK_ ButtonColors_primary-blue__1ou6K ButtonSizes_medium__llgmY ButtonSizes_full-width__HYGAn"
                >
                  <span className="Button_text__Pv_HU">
                    {loading ? "Signin in..." : "Sign in" }
                  </span>
                </button>
              </div>
            </form>
          </div>

          <div className="MergedLoginRegisterBox_login__JhDib">
            <span>Don't have an account?</span>
            <button 
              type="button" 
              className="MergedLoginRegisterBox_sign-in-button__ZZ7Fp Button_button__88E9y ButtonColors_plain-blue__CzJsi ButtonSizes_plain__e16oQ"
              onClick={onRegisterClick}
            >
              <span className="Button_text__Pv_HU">Get started for free</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button className="Modal_close-button__W9VYi Button_button__88E9y Button_plain__e16oQ" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 384 512" fill="currentColor">
                <path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path>
            </svg>
        </button>
      </dialog>
    </div>,
    document.body
  );
}