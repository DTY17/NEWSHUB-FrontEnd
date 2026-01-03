import { useEffect, useState, type FC } from "react";
import {
  User,
  LogOut,
  Bookmark,
  Menu,
  X,
  Newspaper,
  CircleUserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser, isTokenValid, login, register } from "../services/auth";

interface Props {
  currentPage: string;
  setCurrentPage: (p: any) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  setDP: (p: string) => void;
  dp: string;
  showLoginModal: boolean;
  setShowLoginModal: (p: boolean) => void;
}

export const Header: FC<Props> = ({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  setIsLoggedIn,
  setDP,
  dp,
  showLoginModal,
  setShowLoginModal
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  //const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  const [email, setEmail] = useState("null");

  const navigation = useNavigate();
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    async function getEmail() {
      
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      const refresh_token = localStorage.getItem("refresh_token");

      // If no tokens or email in localStorage, set not logged in
      if (!email || !token || !refresh_token) {
        setIsLoggedIn(false);
        setShowDropdown(false);
        return;
      }

      try {
        // Check token validity
        const isValid = await isTokenValid(token, refresh_token);
        console.log("isValid:", isValid);

        if (!isValid) {
          // Token is invalid, clear localStorage and set logged out
          setIsLoggedIn(false);
          setShowDropdown(false);
          localStorage.removeItem("email");
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          return;
        }

        // Token is valid, get user data
        const data = await getUser(email, token);
        
        if (data.image) {
          setDP(data.image);
        } else {
          setDP("");
        }

        // Set logged in state
        setIsLoggedIn(true);
        setShowLoginModal(false);
        
        // Set email state
        setEmail(email);
      } catch (error) {
        console.error("Error validating token or getting user:", error);
        // On error, clear localStorage and set logged out
        setIsLoggedIn(false);
        setShowDropdown(false);
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      }
    }
    console.log(email)
    getEmail();
  }, []); // Empty dependency array - runs only on mount

  function goToProfile() {
    console.log("Go to Profile");
    navigation(`/home/profile/${localStorage.getItem("email")}`);
  }

  const handleLogin = async () => {
    if (!validateEmail(loginEmail)) {
      setLoginError("Please enter a valid email.");
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError("Password must be at least 6 characters.");
      return;
    }
    try {
      const result = await login({
        email: loginEmail.trim(),
        password: loginPassword.trim(),
      });
      
      console.log("Login result:", result);
      
      // Assuming result has properties: email, token, refresh_token
      if (result.token && result.refresh_token) {
        setIsLoggedIn(true);
        setShowLoginModal(false);

        localStorage.setItem("email", result.email);
        localStorage.setItem("token", result.token);
        localStorage.setItem("refresh_token", result.refresh_token);
        
        // Clear form fields
        setLoginEmail("");
        setLoginPassword("");
        setLoginError("");
      } else if (result.condition === 401 || result.condition === 403) {
        setLoginError("Please enter a valid email and password.");
      } else {
        setLoginError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("An error occurred during login. Please try again.");
    }
  };

  useEffect(() => {
    if (currentPage === "home") {
      directToHome();
    } else if (currentPage === "about") {
      directToAbout();
    } else if (currentPage === "contact") {
      directToContact();
    }
  }, [currentPage]);

  const directToHome = () => {
    navigation("/home");
  };
  const directToAbout = () => {
    navigation("/home/aboutme");
  };
  const directToContact = () => {
    navigation("/home/contactme");
  };

  const handleSignup = async () => {
    setSignupError("");
    if (!firstName.trim() || !lastName.trim()) {
      setSignupError("First name and last name are required.");
      return;
    }
    if (!validateEmail(signupEmail)) {
      setSignupError("Please enter a valid email.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }

    try {
      const result = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: signupEmail.trim(),
        password: signupPassword.trim(),
      });
      
      // Assuming register returns true on success
      if (result === true) {
        // After successful signup, you might want to automatically log the user in
        // or redirect to login. For now, just close the modal and clear form
        setShowSignupModal(false);
        
        // Clear form fields
        setFirstName("");
        setLastName("");
        setSignupEmail("");
        setSignupPassword("");
        
        // Optionally show login modal after successful signup
        setShowLoginModal(true);
      } else {
        setSignupError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setSignupError("An error occurred during registration. Please try again.");
    }
  };

  const clickHome = () => {
    navigation(`/home`);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setLoginError("");
    setSignupError("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
    setDP("");
    setEmail("null");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <>
      <header className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between max-w-[1600px] mx-auto">
            {/* Logo and Brand */}
            <div
              className="flex items-center space-x-3 hover: cursor-pointer"
              onClick={clickHome}
            >
              <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center font-bold text-2xl text-blue-600 shadow-md">
                N
              </div>
              <span className="text-2xl font-bold tracking-tight">NewsHub</span>
              <div className="hidden sm:block w-px h-6 bg-blue-400 ml-2"></div>
              <span className="hidden sm:block text-xs text-blue-100 uppercase tracking-widest">
                Latest Stories
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {["home", "about", "contact"].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    currentPage === p
                      ? "text-black bg-white bg-opacity-20 shadow-md"
                      : "text-blue-100 hover:text-black hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  {p === "home"
                    ? "Home"
                    : p === "about"
                    ? "About Me"
                    : "Contact"}
                </button>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative hover:cursor-pointer">
                  <div
                    onClick={() => {
                      setShowDropdown((s) => !s);
                    }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold p-0 hover:bg-blue-50 transition-all duration-300 shadow-md"
                  >
                    {dp === "" ? (
                      <CircleUserRound className="text-black h-10 w-8 size-8" />
                    ) : (
                      <img
                        src={dp}
                        alt="icon"
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                  </div>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-lg shadow-2xl py-2 text-gray-800">
                      <button
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-200"
                        onClick={() => {
                          goToProfile();
                          setShowDropdown(false);
                        }}
                      >
                        <User size={18} className="text-blue-600" />
                        <span className="font-medium">Profile</span>
                      </button>
                      <button
                        className="w-full px-4 py-3 text-left border-none hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-200"
                        onClick={() => {
                          setShowDropdown(false);
                        }}
                      >
                        <Bookmark size={18} className="text-blue-600" />
                        <span className="font-medium">Watchlist</span>
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600 transition-colors duration-200"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex space-x-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-6 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold shadow-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="px-6 py-2.5 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowMobileMenu((s) => !s)}
                className="md:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-blue-400 pt-4">
              <nav className="flex flex-col space-y-2">
                {["home", "about", "contact"].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setCurrentPage(p);
                      setShowMobileMenu(false);
                    }}
                    className={`text-left px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${
                      currentPage === p
                        ? "bg-white bg-opacity-20 text-white shadow-sm"
                        : "text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    {p === "home"
                      ? "Home"
                      : p === "about"
                      ? "About Me"
                      : "Contact"}
                  </button>
                ))}
                {!isLoggedIn && (
                  <div className="flex flex-col space-y-2 pt-3 border-t border-blue-400 mt-2">
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowSignupModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-4 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-60"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAllModals();
          }}
        >
          <div className="bg-white rounded-sm shadow-2xl w-[95%] max-w-md p-8 relative border-t-4 border-black">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200"
              aria-label="Close login"
            >
              <X size={22} />
            </button>
            <div className="flex items-center space-x-2 mb-3">
              <Newspaper size={28} className="text-black" />
              <h2 className="text-3xl font-bold text-black">Login</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Welcome back to NewsHub. Enter your credentials to continue
              reading.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200"
                />
              </div>

              {loginError && (
                <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded border border-red-200">
                  {loginError}
                </div>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-3.5 bg-black text-white rounded-sm hover:bg-gray-800 transition-all duration-300 font-bold uppercase tracking-wide text-sm border-0 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Login
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-700 text-center">
              Don't have an account?{" "}
              <button
                className="text-black font-bold hover:underline"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
              >
                Sign up here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-60"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAllModals();
          }}
        >
          <div className="bg-white rounded-sm shadow-2xl w-[95%] max-w-md p-8 relative border-t-4 border-black">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200"
              aria-label="Close signup"
            >
              <X size={22} />
            </button>
            <div className="flex items-center space-x-2 mb-3">
              <Newspaper size={28} className="text-black" />
              <h2 className="text-3xl font-bold text-black">Create Account</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Join NewsHub today and stay informed with the latest stories.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200"
                />
              </div>
            </div>

            {signupError && (
              <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded border border-red-200 mt-4">
                {signupError}
              </div>
            )}

            <button
              onClick={handleSignup}
              className="mt-6 w-full py-3.5 bg-black text-white rounded-sm hover:bg-gray-800 transition-all duration-300 font-bold uppercase tracking-wide text-sm"
            >
              Create Account
            </button>

            <div className="mt-6 text-sm text-gray-700 text-center">
              Already have an account?{" "}
              <button
                className="text-black font-bold hover:underline"
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
              >
                Log in here
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};