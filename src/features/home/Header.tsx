import { useRef, useState } from "react";
import "./Header.css";
import { RootState } from "../../Store";
import { useSelector } from "react-redux";

export default function Header() {
  const isLogged = useSelector((state: RootState) => state.credentials.token === null);
  const [showOptions, setShowOptions] = useState(false);
  const timeoutRef = useRef(setTimeout(() => {}, 0));

  const handleMouseEnter = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    setShowOptions(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowOptions(false);
    }, 200); // Adjust the delay time as needed
  };

  const handleOptionsMouseEnter = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
  };

  const handleOptionsMouseLeave = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowOptions(false);
    }, 200); // Adjust the delay time as needed
  };

  return (
    <header>
      <div className="logo">Logo</div>
      <nav className="navigation">
        <a href="/home">Accueil</a>
        <a href="/exercises">Exercices</a>
        <a href="/contact">Contact</a>
      </nav>
      <a href="/login"
        className="login-button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLogged ? (
          <>
            Login
            {showOptions && (
              <div
                className="options"
                onMouseEnter={handleOptionsMouseEnter}
                onMouseLeave={handleOptionsMouseLeave}
              >
                <a href="/register" className="option">
                  Register
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            Account
            {showOptions && (
              <div
                className="options"
                onMouseEnter={handleOptionsMouseEnter}
                onMouseLeave={handleOptionsMouseLeave}
              >
                <a href="logout" className="option">
                  Logout
                </a>
              </div>
            )}
          </>
        )}
      </a>
    </header>
  );
}
