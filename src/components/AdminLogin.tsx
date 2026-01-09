// import { useState } from "react";
// import { Shield, Mail, Lock, ArrowLeft, Key } from "lucide-react";
// import { loginAdmin } from "../services/auth";
// import { useNavigate } from "react-router-dom";
// import { sendEmail } from "../services/email";

// export default function AdminLogin() {
//   const [view, setView] = useState<"login" | "forgot" | "code">("login");
//   const [email, setEmail] = useState("dinanthemika.personal@gmail.com");
//   const [password, setPassword] = useState("");
//   const [code, setCode] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const navigation = useNavigate();

//   const handleLogin = async () => {
//     setError("");
//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }
//     console.log(email);
//     console.log(password);
//     const data = await loginAdmin({ email, password });
//     localStorage.setItem("admin_email", data.data.email);
//     localStorage.setItem("admin_token", data.data.token);
//     localStorage.setItem("admin_refresh_token", data.data.refresh_token);

//     if (data.data.email && data.data.token && data.data.refresh_token) {
//       navigation(`/admin`);
//     }
//   };

//   function generateNumericCode(length = 6): string {
//     const array = new Uint32Array(length);
//     crypto.getRandomValues(array);
//     return Array.from(array, (n) => (n % 10).toString()).join("");
//   }

//   const handleForgotPassword = async () => {
//     setError("");
//     setSuccess("");
//     if (!email) {
//       setError("Please enter your email address");
//       return;
//     }

//     await sendEmail(generateNumericCode());
//     console.log("Send reset code to:", email);
//     setSuccess("Reset code sent to your email");
//     setTimeout(() => setView("code"), 1500);
//   };

//   const handleCodeChange = (index: number, value: string) => {
//     if (value.length > 1) return;
//     if (!/^\d*$/.test(value)) return;

//     const newCode = [...code];
//     newCode[index] = value;
//     setCode(newCode);

//     // Auto-focus next input
//     if (value && index < 5) {
//       const nextInput = document.getElementById(`code-${index + 1}`);
//       nextInput?.focus();
//     }
//   };

//   const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === "Backspace" && !code[index] && index > 0) {
//       const prevInput = document.getElementById(`code-${index - 1}`);
//       prevInput?.focus();
//     }
//   };

//   const handleVerifyCode = async () => {
//     setError("");
//     const fullCode = code.join("");
//     if (fullCode.length !== 6) {
//       setError("Please enter the complete 6-digit code");
//       return;
//     }
//     // Add your code verification API call here
//     console.log("Verify code:", fullCode, "for email:", email);
//   };

//   return (
//     <div className="h-full w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 absolute top-0">
//       <div className="w-full max-w-md">
//         {/* Login View */}
//         {view === "login" && (
//           <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
//             <div className="flex flex-col items-center mb-8">
//               <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
//                 <Shield className="text-white" size={32} />
//               </div>
//               <h1 className="text-3xl font-bold text-white mb-2">
//                 Admin Portal
//               </h1>
//               <p className="text-slate-400 text-sm">Authorized access only</p>
//             </div>

//             <div className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="admin@example.com"
//                     className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
//                     size={18}
//                   />
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     onKeyPress={(e) => e.key === "Enter" && handleLogin()}
//                   />
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
//                   {error}
//                 </div>
//               )}

//               <button
//                 onClick={handleLogin}
//                 className="w-full py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 Sign In
//               </button>

//               <div className="text-center">
//                 <button
//                   onClick={() => setView("forgot")}
//                   className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Forgot Password View */}
//         {view === "forgot" && (
//           <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
//             <button
//               onClick={() => {
//                 setView("login");
//                 setError("");
//                 setSuccess("");
//               }}
//               className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
//             >
//               <ArrowLeft size={18} className="mr-2" />
//               Back to login
//             </button>

//             <div className="flex flex-col items-center mb-8">
//               <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
//                 <Mail className="text-white" size={32} />
//               </div>
//               <h1 className="text-3xl font-bold text-white mb-2">
//                 Reset Password
//               </h1>
//               <p className="text-slate-400 text-sm text-center">
//                 Enter your email to receive a verification code
//               </p>
//             </div>

//             <div className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={"dina***************@gmail.com"}
//                     contentEditable={false}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="admin@example.com"
//                     className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   />
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
//                   {error}
//                 </div>
//               )}

//               {success && (
//                 <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
//                   {success}
//                 </div>
//               )}

//               <button
//                 onClick={() => {
//                   handleForgotPassword;
//                   setEmail("dinanthemika.personal@gmail.com");
//                 }}
//                 className="w-full py-3 bg-linear-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 Send Reset Code
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Code Verification View */}
//         {view === "code" && (
//           <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
//             <button
//               onClick={() => {
//                 setView("forgot");
//                 setError("");
//                 setCode(["", "", "", "", "", ""]);
//               }}
//               className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
//             >
//               <ArrowLeft size={18} className="mr-2" />
//               Back
//             </button>

//             <div className="flex flex-col items-center mb-8">
//               <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
//                 <Key className="text-white" size={32} />
//               </div>
//               <h1 className="text-3xl font-bold text-white mb-2">Enter Code</h1>
//               <p className="text-slate-400 text-sm text-center">
//                 We sent a 6-digit code to
//                 <br />
//                 <span className="text-blue-400 font-medium">{email}</span>
//               </p>
//             </div>

//             <div className="space-y-6">
//               <div className="flex justify-center gap-2">
//                 {code.map((digit, index) => (
//                   <input
//                     key={index}
//                     id={`code-${index}`}
//                     type="text"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => handleCodeChange(index, e.target.value)}
//                     onKeyDown={(e) => handleCodeKeyDown(index, e)}
//                     className="w-12 h-14 text-center text-2xl font-bold bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                   />
//                 ))}
//               </div>

//               {error && (
//                 <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
//                   {error}
//                 </div>
//               )}

//               <button
//                 onClick={handleVerifyCode}
//                 className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 Verify Code
//               </button>

//               <div className="text-center">
//                 <button
//                   onClick={handleForgotPassword}
//                   className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
//                 >
//                   Resend code
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <p className="text-slate-500 text-xs text-center mt-6">
//           © 2024 NewsHub Admin. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { Shield, Mail, Lock, ArrowLeft, Key, Loader2 } from "lucide-react";
import { loginAdmin } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { sendEmail } from "../services/email";

export default function AdminLogin() {
  const [view, setView] = useState<"login" | "forgot" | "code">("login");
  const [email, setEmail] = useState("dinanthemika.personal@gmail.com");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await loginAdmin({ email, password });
      
      localStorage.setItem("admin_email", data.data.email);
      localStorage.setItem("admin_token", data.data.token);
      localStorage.setItem("admin_refresh_token", data.data.refresh_token);

      if (data.data.email && data.data.token && data.data.refresh_token) {
        navigate(`/admin`);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  function generateNumericCode(length = 6): string {
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (n) => (n % 10).toString()).join("");
  }

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendEmail(generateNumericCode());
      console.log("Send reset code to:", email);
      setSuccess("Reset code sent to your email");
      setTimeout(() => setView("code"), 1500);
    } catch (error) {
      setError("Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyCode = async () => {
    setError("");
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    
    setIsLoading(true);
    try {
      // Add your code verification API call here
      console.log("Verify code:", fullCode, "for email:", email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 absolute top-0">
      <div className="w-full max-w-md">
        {/* Login View */}
        {view === "login" && (
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin Portal
              </h1>
              <p className="text-slate-400 text-sm">Authorized access only</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onKeyPress={(e) => e.key === "Enter" && !isLoading && handleLogin()}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setView("forgot")}
                  disabled={isLoading}
                  className="text-blue-400 hover:text-blue-300 disabled:text-blue-500 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forgot Password View */}
        {view === "forgot" && (
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <button
              onClick={() => {
                setView("login");
                setError("");
                setSuccess("");
              }}
              disabled={isLoading}
              className="flex items-center text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed mb-6 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to login
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Mail className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Reset Password
              </h1>
              <p className="text-slate-400 text-sm text-center">
                Enter your email to receive a verification code
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="email"
                    value={"dina***************@gmail.com"}
                    contentEditable={false}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                onClick={() => {
                  handleForgotPassword();
                  setEmail("dinanthemika.personal@gmail.com");
                }}
                disabled={isLoading}
                className="w-full py-3 bg-linear-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Code Verification View */}
        {view === "code" && (
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <button
              onClick={() => {
                setView("forgot");
                setError("");
                setCode(["", "", "", "", "", ""]);
              }}
              disabled={isLoading}
              className="flex items-center text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed mb-6 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Key className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Enter Code</h1>
              <p className="text-slate-400 text-sm text-center">
                We sent a 6-digit code to
                <br />
                <span className="text-blue-400 font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:border-slate-800 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyCode}
                disabled={isLoading}
                className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-emerald-400 hover:text-emerald-300 disabled:text-emerald-600 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  Resend code
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-slate-500 text-xs text-center mt-6">
          © 2024 NewsHub Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}