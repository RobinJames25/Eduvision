import React from "react";
import ReactDOM from "react-dom";
import "../css/DialogBox.css";


export default function DialogBox({ open, onClose, onRegisterClick, onEmailLoginClick }) {

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="Modal_overlay__PxHkA Modal_full-screen__WIwCi"
      role="presentation"
      onClick={onClose}
    >
      <dialog
        open
        className="Modal_modal__Ufdmt Modal_medium__HZarU Modal_hideable__7rASp"
        aria-labelledby="auth-modal-title"
        onClick={(e) => e.stopPropagation()} // prevent overlay click
      >
        {/* Header */}
        <div className="Modal_header__YJVd5">
          <h1
            id="auth-modal-title"
            className="TextStyles_root__ESLrv TextColors_title__3_lJF TextSizes_title-xxlarge__gbC6y TextStyles_bold__7KqgC TextStyles_dm-sans__s1K5W"
          >
            Welcome to Eduvision
          </h1>
        </div>

        {/* Body */}
        <div className="Modal_body__7nSTF">
          <p className="AuthenticationModal_subtitle__A5_p7">
            Sign in to access study resources
          </p>

          {/* OAuth buttons */}
          <ul className="AuthButtons_list__kJvIt">
            <li>
              <button
                type="button"
                className="Button_button__88E9y Button_pill__9vfK_ ButtonColors_secondary-gray__bU9gA ButtonSizes_medium__llgmY ButtonSizes_full-width__HYGAn"
              >
                <span className="Button_addon__LEr4y">
                  {/* Google SVG */}
                  <svg height="16" viewBox="0 0 48 48" width="16">
                    <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335"></path>
                    <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4"></path>
                    <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05"></path>
                    <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853"></path>
                </svg>
                </span>
                <span className="Button_text__Pv_HU">Continue with Google</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className="Button_button__88E9y Button_pill__9vfK_ ButtonColors_secondary-gray__bU9gA ButtonSizes_medium__llgmY ButtonSizes_full-width__HYGAn"
              >
                <span className="Button_addon__LEr4y">
                  {/* Apple SVG */}
                  <svg height="16px" viewBox="0 0 814 1000" width="16px">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" fill="black"></path>
                 </svg>
                </span>
                <span className="Button_text__Pv_HU">Continue with Apple</span>
              </button>
            </li>
          </ul>

          {/* Separator */}
          <div className="Separator_separator__I0WCq MergedLoginRegisterBox_separator__dx7_z">
            <span className="Separator_text__E91Un">
              or continue with email
            </span>
          </div>

          {/* Email buttons */}
          <div className="MergedLoginRegisterBox_merged-buttons__8Liaz">
            <button 
              className="MergedLoginRegisterBox_merged-button__6mDmd Button_button__88E9y Button_pill__9vfK_ ButtonColors_secondary-gray__bU9gA ButtonSizes_medium__llgmY"
              onClick={onEmailLoginClick}
            >
              <span className="Button_text__Pv_HU">Sign in with Email</span>
            </button>

            <button 
              className="MergedLoginRegisterBox_merged-button__6mDmd Button_button__88E9y Button_pill__9vfK_ ButtonColors_secondary-gray__bU9gA ButtonSizes_medium__llgmY"
              onClick={onRegisterClick}
            >
              <span className="Button_text__Pv_HU">Register with Email</span>
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          aria-label="Close"
          className="Modal_close-button__W9VYi Button_button__88E9y Button_pill__9vfK_ ButtonColors_plain-gray__yMyNb ButtonSizes_medium__llgmY ButtonSizes_plain__e16oQ"
          onClick={onClose}
        >
          <svg data-prefix="fas" data-icon="xmark" className="svg-inline--fa fa-xmark Icon_icon__Rm_O3 Icon_scale-1-5x__PVUOD Icon_padding-medium___wjS_" role="img" viewBox="0 0 384 512" aria-hidden="true">
            <path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path>
          </svg>
        </button>
      </dialog>
    </div>,
    document.body
  );
}
