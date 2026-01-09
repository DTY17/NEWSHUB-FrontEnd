import { useEffect, useState, type FC } from "react";
import {
  User,
  LogOut,
  Bookmark,
  Menu,
  X,
  Newspaper,
  CircleUserRound,
  Loader2,
} from "lucide-react"; // Added Loader2
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
  setShowLoginModal,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Login loading state

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false); // Signup loading state

  const [email, setEmail] = useState("null");

  const navigation = useNavigate();
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function getEmail() {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");

    if (!email || !token || !refresh_token) {
      setIsLoggedIn(false);
      setShowDropdown(false);
      return;
    }

    try {
      const isValid = await isTokenValid(token, refresh_token);
      console.log("isValid:", isValid);

      if (!isValid) {
        setIsLoggedIn(false);
        setShowDropdown(false);
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        return;
      }

      const data = await getUser(email, token);

      if (data.image) {
        setDP(data.image);
      } else {
        setDP("");
      }

      setIsLoggedIn(true);
      setShowLoginModal(false);

      setEmail(email);
    } catch (error) {
      console.error("Error validating token or getting user:", error);
      setIsLoggedIn(false);
      setShowDropdown(false);
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  }
  
  useEffect(() => {
    console.log(email);
    getEmail();
  }, []);

  useEffect(() => {
    console.log(email);
    getEmail();
  }, [isLoggedIn]);

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
    
    setIsLoggingIn(true);
    setLoginError("");
    
    try {
      const result = await login({
        email: loginEmail.trim(),
        password: loginPassword.trim(),
      });

      console.log("Login result:", result);

      if (result.token && result.refresh_token) {
        setIsLoggedIn(true);
        setShowLoginModal(false);

        localStorage.setItem("email", result.email);
        localStorage.setItem("token", result.token);
        localStorage.setItem("refresh_token", result.refresh_token);

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
    } finally {
      setIsLoggingIn(false);
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
    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    setIsSigningUp(true);
    
    try {
      const result = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: signupEmail.trim(),
        password: signupPassword.trim(),
      });
      console.log(result)
      if (result === 200) {
        setShowSignupModal(false);

        setFirstName("");
        setLastName("");
        setSignupEmail("");
        setSignupPassword("");
        setConfirmPassword("");

        setShowLoginModal(true);
      } else {
        setSignupError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setSignupError(
        "An error occurred during registration. Please try again."
      );
    } finally {
      setIsSigningUp(false);
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
    setIsLoggingIn(false);
    setIsSigningUp(false);
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
            <div
              className="flex items-center space-x-3 hover:cursor-pointer"
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

            <nav className="hidden nav-break:flex space-x-1">
              {["home", "about", "contact"].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={` hover:text-black px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:cursor-pointer ${
                    currentPage === p
                      ? "text-black bg-white bg-opacity-20 shadow-md hover:text-black"
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

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="relative flex-row items-center justify-center hover:cursor-pointer">
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
                        className="h-8 w-8 rounded-full "
                      />
                    )}
                  </div>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-lg shadow-2xl py-2 text-gray-800">
                      <button
                        className="hover:cursor-pointer hover:text-black w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-200"
                        onClick={() => {
                          goToProfile();
                          setShowDropdown(false);
                        }}
                      >
                        <User size={18} className="text-blue-600" />
                        <span className="font-medium">Profile</span>
                      </button>
                      <button
                        className="hover:cursor-pointer hover:text-black w-full px-4 py-3 text-left border-none hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-200"
                        onClick={() => {
                          setShowDropdown(false);
                          navigation(`/home/watchlist`);
                        }}
                      >
                        <Bookmark size={18} className="text-blue-600" />
                        <span className="font-medium">Watchlist</span>
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="hover:cursor-pointer hover:text-black w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600 transition-colors duration-200"
                      >
                        <LogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden nav-break:flex space-x-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="hover:cursor-pointer px-6 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold shadow-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="hover:cursor-pointer px-6 py-2.5 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowMobileMenu((s) => !s)}
                className="hover:cursor-pointer hover:text-black nav-break:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="nav-break:hidden mt-4 pb-4 border-t border-blue-400 pt-4">
              <nav className="flex flex-col space-y-2">
                {["home", "about", "contact"].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setCurrentPage(p);
                      setShowMobileMenu(false);
                    }}
                    className={`hover:cursor-pointer hover:text-black text-left px-4 py-3 text-white rounded-lg transition-colors duration-200 text-sm font-medium outline-none focus:outline-none focus:border-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                      currentPage === p
                        ? "bg-blue-500 bg-opacity-20 text-white shadow-sm border-none"
                        : "text-blue-500 hover:text-black hover:bg-white hover:bg-opacity-10 border-none"
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
                      className="hover:cursor-pointer w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowSignupModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full hover:cursor-pointer px-4 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
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
              className="hover:cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200"
              aria-label="Close login"
              disabled={isLoggingIn}
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoggingIn}
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoggingIn}
                />
              </div>

              {loginError && (
                <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded border border-red-200">
                  {loginError}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="hover:cursor-pointer w-full py-3.5 bg-black text-white rounded-sm hover:bg-gray-800 transition-all duration-300 font-bold uppercase tracking-wide text-sm border-0 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-700 text-center">
              Don't have an account?{" "}
              <button
                className="hover:cursor-pointer text-black font-bold hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                disabled={isLoggingIn}
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
              className="hover:cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200"
              aria-label="Close signup"
              disabled={isSigningUp}
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSigningUp}
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSigningUp}
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSigningUp}
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSigningUp}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 border-2 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                    confirmPassword && signupPassword !== confirmPassword
                      ? "border-red-500 bg-red-50"
                      : confirmPassword && signupPassword === confirmPassword
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  disabled={isSigningUp}
                />
                {confirmPassword && signupPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && signupPassword === confirmPassword && (
                  <p className="text-green-600 text-sm mt-1">
                    Passwords match ✓
                  </p>
                )}
              </div>
            </div>

            {signupError && (
              <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded border border-red-200 mt-4">
                {signupError}
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={isSigningUp}
              className="hover:cursor-pointer mt-6 w-full py-3.5 bg-black text-white rounded-sm hover:bg-gray-800 transition-all duration-300 font-bold uppercase tracking-wide text-sm disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="mt-6 text-sm text-gray-700 text-center">
              Already have an account?{" "}
              <button
                className="hover:cursor-pointer text-black font-bold hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
                disabled={isSigningUp}
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

/////////////////////////////////////////////////

// import { useEffect, useState, type FC } from "react";
// import {
//   User,
//   LogOut,
//   Bookmark,
//   Menu,
//   X,
//   Newspaper,
//   CircleUserRound,
//   Moon,
//   Sun,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { getUser, isTokenValid, login, register } from "../services/auth";
// import { toggleTheme } from "../../store/modeSlice";
// import type { RootState } from "../../store/store";

// interface Props {
//   currentPage: string;
//   setCurrentPage: (p: any) => void;
//   isLoggedIn: boolean;
//   setIsLoggedIn: (v: boolean) => void;
//   setDP: (p: string) => void;
//   dp: string;
//   showLoginModal: boolean;
//   setShowLoginModal: (p: boolean) => void;
// }

// export const Header: FC<Props> = ({
//   currentPage,
//   setCurrentPage,
//   isLoggedIn,
//   setIsLoggedIn,
//   setDP,
//   dp,
//   showLoginModal,
//   setShowLoginModal,
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [showSignupModal, setShowSignupModal] = useState(false);

//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [loginError, setLoginError] = useState("");

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");
//   const [signupError, setSignupError] = useState("");

//   const [email, setEmail] = useState("null");

//   const dispatch = useDispatch();
//   const navigation = useNavigate();
//   const validateEmail = (email: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   // Redux theme mode: "light" | "dark"
//   const mode = useSelector((state: RootState) => state.theme.mode);

//   // Apply dark mode to root html element
//   useEffect(() => {
//     console.log("🎨 Theme effect triggered. Mode:", mode);
//     console.log("📝 Current HTML classes BEFORE:", document.documentElement.className);
//     console.log(email)
//     const html = document.documentElement;
//     const body = document.body;

//     // Completely remove and re-add classes
//     html.classList.remove("dark", "light");
//     body.classList.remove("dark", "light");

//     if (mode === "dark") {
//       console.log("🌙 Setting DARK mode");
//       html.classList.add("dark");
//       body.classList.add("dark");
//       html.style.colorScheme = "dark";
//       body.style.backgroundColor = "#111827";
//     } else {
//       console.log("☀️ Setting LIGHT mode");
//       html.classList.remove("dark");
//       body.classList.remove("dark");
//       html.style.colorScheme = "light";
//       body.style.backgroundColor = "#ffffff";
//     }

//     console.log("📝 Current HTML classes AFTER:", document.documentElement.className);
//     console.log("✅ HTML has 'dark' class?", html.classList.contains("dark"));

//     // Also save to localStorage for persistence
//     // localStorage.setItem("theme-mode", mode);

//   }, [mode]);

//   async function getEmail() {
//     const email = localStorage.getItem("email");
//     const token = localStorage.getItem("token");
//     const refresh_token = localStorage.getItem("refresh_token");

//     if (!email || !token || !refresh_token) {
//       setIsLoggedIn(false);
//       setShowDropdown(false);
//       return;
//     }

//     try {
//       const isValid = await isTokenValid(token, refresh_token);

//       if (!isValid) {
//         setIsLoggedIn(false);
//         setShowDropdown(false);
//         localStorage.removeItem("email");
//         localStorage.removeItem("token");
//         localStorage.removeItem("refresh_token");
//         return;
//       }

//       const data = await getUser(email, token);
//       setDP(data.image ? data.image : "");
//       setIsLoggedIn(true);
//       setShowLoginModal(false);
//       setEmail(email);
//     } catch (error) {
//       setIsLoggedIn(false);
//       setShowDropdown(false);
//       localStorage.removeItem("email");
//       localStorage.removeItem("token");
//       localStorage.removeItem("refresh_token");
//     }
//   }

//   useEffect(() => {
//     getEmail();
//   }, []);

//   useEffect(() => {
//     getEmail();
//   }, [isLoggedIn]);

//   function goToProfile() {
//     navigation(`/home/profile/${localStorage.getItem("email")}`);
//   }

//   const handleLogin = async () => {
//     if (!validateEmail(loginEmail)) {
//       setLoginError("Please enter a valid email.");
//       return;
//     }
//     if (loginPassword.length < 6) {
//       setLoginError("Password must be at least 6 characters.");
//       return;
//     }
//     try {
//       const result = await login({
//         email: loginEmail.trim(),
//         password: loginPassword.trim(),
//       });

//       if (result.token && result.refresh_token) {
//         setIsLoggedIn(true);
//         setShowLoginModal(false);

//         localStorage.setItem("email", result.email);
//         localStorage.setItem("token", result.token);
//         localStorage.setItem("refresh_token", result.refresh_token);

//         setLoginEmail("");
//         setLoginPassword("");
//         setLoginError("");
//       } else {
//         setLoginError("Login failed. Please try again.");
//       }
//     } catch {
//       setLoginError("An error occurred during login. Please try again.");
//     }
//   };

//   useEffect(() => {
//     if (currentPage === "home") {
//       directToHome();
//     } else if (currentPage === "about") {
//       directToAbout();
//     } else if (currentPage === "contact") {
//       directToContact();
//     }
//   }, [currentPage]);

//   const directToHome = () => {
//     navigation("/home");
//   };
//   const directToAbout = () => {
//     navigation("/home/aboutme");
//   };
//   const directToContact = () => {
//     navigation("/home/contactme");
//   };

//   const handleSignup = async () => {
//     setSignupError("");
//     if (!firstName.trim() || !lastName.trim()) {
//       setSignupError("First name and last name are required.");
//       return;
//     }
//     if (!validateEmail(signupEmail)) {
//       setSignupError("Please enter a valid email.");
//       return;
//     }
//     if (signupPassword.length < 6) {
//       setSignupError("Password must be at least 6 characters.");
//       return;
//     }

//     try {
//       const result = await register({
//         firstName: firstName.trim(),
//         lastName: lastName.trim(),
//         email: signupEmail.trim(),
//         password: signupPassword.trim(),
//       });
//       if (result === true) {
//         setShowSignupModal(false);

//         setFirstName("");
//         setLastName("");
//         setSignupEmail("");
//         setSignupPassword("");

//         setShowLoginModal(true);
//       } else {
//         setSignupError("Registration failed. Please try again.");
//       }
//     } catch {
//       setSignupError(
//         "An error occurred during registration. Please try again."
//       );
//     }
//   };

//   const clickHome = () => {
//     navigation(`/home`);
//   };

//   const closeAllModals = () => {
//     setShowLoginModal(false);
//     setShowSignupModal(false);
//     setLoginError("");
//     setSignupError("");
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setShowDropdown(false);
//     setDP("");
//     setEmail("null");
//     localStorage.removeItem("email");
//     localStorage.removeItem("token");
//     localStorage.removeItem("refresh_token");
//   };

//   return (
//     <>
//       <header className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg sticky top-0 z-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
//         <div className="w-full px-4 py-4">
//           <div className="flex items-center justify-between max-w-[1600px] mx-auto">
//             <div
//               className="flex items-center space-x-3 hover: cursor-pointer"
//               onClick={clickHome}
//             >
//               <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center font-bold text-2xl text-blue-600 shadow-md dark:bg-gray-100 dark:text-blue-700">
//                 N
//               </div>
//               <span className="text-2xl font-bold tracking-tight">NewsHub</span>
//               <div className="hidden sm:block w-px h-6 bg-blue-400 ml-2 dark:bg-gray-400"></div>
//               <span className="hidden sm:block text-xs text-blue-100 uppercase tracking-widest dark:text-gray-200">
//                 Latest Stories
//               </span>
//             </div>

//             {/* Navigation */}
//             <nav className="hidden md:flex space-x-1">
//               {["home", "about", "contact"].map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => setCurrentPage(p)}
//                   className={`px-6 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
//                     currentPage === p
//                       ? "text-black bg-white bg-opacity-20 shadow-md dark:text-white dark:bg-gray-700 dark:bg-opacity-60"
//                       : "text-blue-100 hover:text-black hover:bg-white hover:bg-opacity-10 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-700 dark:hover:bg-opacity-60"
//                   }`}
//                 >
//                   {p === "home"
//                     ? "Home"
//                     : p === "about"
//                     ? "About Me"
//                     : "Contact"}
//                 </button>
//               ))}
//             </nav>

//             {/* User Actions */}
//             <div className="flex items-center space-x-4">
//               {isLoggedIn ? (
//                 <div className="relative hover:cursor-pointer">
//                   <div
//                     onClick={() => {
//                       setShowDropdown((s) => !s);
//                     }}
//                     className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold p-0 hover:bg-blue-50 transition-all duration-300 shadow-md dark:bg-gray-100 dark:hover:bg-gray-200"
//                   >
//                     {dp === "" ? (
//                       <CircleUserRound className="text-black h-10 w-8 size-8 dark:text-gray-900" />
//                     ) : (
//                       <img
//                         src={dp}
//                         alt="icon"
//                         className="h-8 w-8 rounded-full"
//                       />
//                     )}
//                   </div>
//                   {showDropdown && (
//                     <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-lg shadow-2xl py-2 text-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
//                       <button
//                         onClick={() => {
//                           dispatch(toggleTheme());
//                         }}
//                         className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-200"
//                       >
//                         {mode === "light" ? (
//                           <>
//                             <Moon size={18} className="text-blue-600 dark:text-blue-400" />
//                             <span className="font-medium">Dark Mode</span>
//                           </>
//                         ) : (
//                           <>
//                             <Sun size={18} className="text-blue-600 dark:text-blue-400" />
//                             <span className="font-medium">Light Mode</span>
//                           </>
//                         )}
//                       </button>
//                       <button
//                         className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-200"
//                         onClick={() => {
//                           goToProfile();
//                           setShowDropdown(false);
//                         }}
//                       >
//                         <User
//                           size={18}
//                           className="text-blue-600 dark:text-blue-400"
//                         />
//                         <span className="font-medium">Profile</span>
//                       </button>
//                       <button
//                         className="w-full px-4 py-3 text-left border-none hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors duration-200"
//                         onClick={() => {
//                           setShowDropdown(false);
//                           navigation(`/home/watchlist`);
//                         }}
//                       >
//                         <Bookmark
//                           size={18}
//                           className="text-blue-600 dark:text-blue-400"
//                         />
//                         <span className="font-medium">Watchlist</span>
//                       </button>
//                       <div className="border-t border-gray-200 my-1 dark:border-gray-700"></div>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-gray-700 flex items-center space-x-3 text-red-600 transition-colors duration-200"
//                       >
//                         <LogOut size={18} className="dark:text-red-400" />
//                         <span className="font-medium">Logout</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="hidden md:flex space-x-3">
//                   <button
//                     onClick={() => {
//                       dispatch(toggleTheme());
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
//                   >
//                     {mode === "light" ? (
//                       <>
//                         <Moon size={18} />
//                         <span>Dark Mode</span>
//                       </>
//                     ) : (
//                       <>
//                         <Sun size={18} />
//                         <span>Light Mode</span>
//                       </>
//                     )}
//                   </button>
//                   <button
//                     onClick={() => setShowLoginModal(true)}
//                     className="px-6 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold shadow-md dark:bg-gray-100 dark:text-blue-600 dark:hover:bg-gray-200"
//                   >
//                     Login
//                   </button>
//                   <button
//                     onClick={() => setShowSignupModal(true)}
//                     className="px-6 py-2.5 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-blue-700"
//                   >
//                     Sign Up
//                   </button>
//                 </div>
//               )}
//               <button
//                 onClick={() => setShowMobileMenu((s) => !s)}
//                 className="md:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200 dark:hover:bg-gray-700 dark:hover:bg-opacity-60"
//               >
//                 {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {showMobileMenu && (
//             <div className="md:hidden mt-4 pb-4 border-t border-blue-400 pt-4 dark:border-gray-700">
//               <nav className="flex flex-col space-y-2">
//                 {["home", "about", "contact"].map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => {
//                       setCurrentPage(p);
//                       setShowMobileMenu(false);
//                     }}
//                     className={`text-left px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${
//                       currentPage === p
//                         ? "bg-white bg-opacity-20 text-white shadow-sm dark:bg-gray-700 dark:text-white"
//                         : "text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-700 dark:hover:bg-opacity-60"
//                     }`}
//                   >
//                     {p === "home"
//                       ? "Home"
//                       : p === "about"
//                       ? "About Me"
//                       : "Contact"}
//                   </button>
//                 ))}
//                 {!isLoggedIn && (
//                   <div className="flex flex-col space-y-2 pt-3 border-t border-blue-400 mt-2 dark:border-gray-700">
//                     <button
//                       onClick={() => dispatch(toggleTheme())}
//                       className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
//                     >
//                       {mode === "light" ? (
//                         <>
//                           <Moon size={18} />
//                           <span>Dark Mode</span>
//                         </>
//                       ) : (
//                         <>
//                           <Sun size={18} />
//                           <span>Light Mode</span>
//                         </>
//                       )}
//                     </button>
//                     <button
//                       onClick={() => {
//                         setShowLoginModal(true);
//                         setShowMobileMenu(false);
//                       }}
//                       className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md dark:bg-gray-100 dark:text-blue-600 dark:hover:bg-gray-200"
//                     >
//                       Login
//                     </button>
//                     <button
//                       onClick={() => {
//                         setShowSignupModal(true);
//                         setShowMobileMenu(false);
//                       }}
//                       className="w-full px-4 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-blue-700"
//                     >
//                       Sign Up
//                     </button>
//                   </div>
//                 )}
//               </nav>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Login Modal */}
//       {showLoginModal && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-60"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) closeAllModals();
//           }}
//         >
//           <div className="bg-white rounded-sm shadow-2xl w-[95%] max-w-md p-8 relative border-t-4 border-black dark:bg-gray-800 dark:border-gray-600">
//             <button
//               onClick={() => setShowLoginModal(false)}
//               className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
//               aria-label="Close login"
//             >
//               <X size={22} />
//             </button>
//             <div className="flex items-center space-x-2 mb-3">
//               <Newspaper size={28} className="text-black dark:text-gray-100" />
//               <h2 className="text-3xl font-bold text-black dark:text-white">
//                 Login
//               </h2>
//             </div>
//             <p className="text-sm text-gray-600 mb-6 leading-relaxed dark:text-gray-300">
//               Welcome back to NewsHub. Enter your credentials to continue
//               reading.
//             </p>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide dark:text-gray-200">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={loginEmail}
//                   onChange={(e) => setLoginEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-gray-300 dark:focus:border-gray-300"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide dark:text-gray-200">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   value={loginPassword}
//                   onChange={(e) => setLoginPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-gray-300 dark:focus:border-gray-300"
//                 />
//               </div>

//               {loginError && (
//                 <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded border border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-700">
//                   {loginError}
//                 </div>
//               )}

//               <button
//                 onClick={handleLogin}
//                 className="w-full py-3.5 bg-black text-white rounded-sm hover:bg-gray-800 transition-all duration-300 font-bold uppercase tracking-wide text-sm border-0 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-300"
//               >
//                 Login
//               </button>
//             </div>

//             <div className="mt-6 text-sm text-gray-700 text-center dark:text-gray-300">
//               Don't have an account?{" "}
//               <button
//                 className="text-black font-bold hover:underline dark:text-white"
//                 onClick={() => {
//                   setShowLoginModal(false);
//                   setShowSignupModal(true);
//                 }}
//               >
//                 Sign up here
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Signup Modal */}
//       {showSignupModal && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-60"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) closeAllModals();
//           }}
//         >
//           <div className="bg-white rounded-sm shadow-2xl w-[95%] max-w-md p-8 relative border-t-4 border-black dark:bg-gray-800 dark:border-gray-600">
//             <button
//               onClick={() => setShowSignupModal(false)}
//               className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
//               aria-label="Close signup"
//             >
//               <X size={22} />
//             </button>
//             <div className="flex items-center space-x-2 mb-3">
//               <Newspaper size={28} className="text-black dark:text-gray-100" />
//               <h2 className="text-3xl font-bold text-black dark:text-white">
//                 Create Account
//               </h2>
//             </div>
//             <p className="text-sm text-gray-600 mb-6 leading-relaxed dark:text-gray-300">
//               Join NewsHub today and stay informed with the latest stories.
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="sm:col-span-1">
//                 <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide dark:text-gray-200">
//                   First name
//                 </label>
//                 <input
//                   type="text"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   placeholder="Jane"
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-gray-300 dark:focus:border-gray-300"
//                 />
//               </div>
//               <div className="sm:col-span-1">
//                 <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide dark:text-gray-200">
//                   Last name
//                 </label>
//                 <input
//                   type="text"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   placeholder="Doe"
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-gray-300 dark:focus:border-gray-300"
//                 />
//               </div>
//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide dark:text-gray-200">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={signupEmail}
//                   onChange={(e) => setSignupEmail(e.target.value)}
//                   placeholder="jane.doe@example.com"
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-gray-300 dark:focus:border-gray-300"
//                 />
//               </div>
//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide dark:text-gray-200">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   value={signupPassword}
//                   onChange={(e) => setSignupPassword(e.target.value)}
//                   placeholder="At least 6 characters"
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-sm focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 transition-all duration-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-gray-300 dark:focus:border-gray-300"
//                 />
//               </div>
//             </div>

//             {signupError && (
//               <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded border border-red-200 mt-4 dark:text-red-400 dark:bg-red-900/20 dark:border-red-700">
//                 {signupError}
//               </div>
//             )}

//             <button
//               onClick={handleSignup}
//               className="mt-6 w-full py-3.5 bg-black text-white rounded-sm hover:bg-gray-800 transition-all duration-300 font-bold uppercase tracking-wide text-sm dark:bg-gray-900 dark:hover:bg-gray-700"
//             >
//               Create Account
//             </button>

//             <div className="mt-6 text-sm text-gray-700 text-center dark:text-gray-300">
//               Already have an account?{" "}
//               <button
//                 className="text-black font-bold hover:underline dark:text-white"
//                 onClick={() => {
//                   setShowSignupModal(false);
//                   setShowLoginModal(true);
//                 }}
//               >
//                 Log in here
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
