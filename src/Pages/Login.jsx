import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import users from "../data/users";

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    const userFound = users.find((u) => u.username === data.username);

    if (!userFound) {
      setError("username", { type: "manual", message: "Invalid username" });
      return;
    }

    if (userFound.password !== data.password) {
      setError("password", { type: "manual", message: "Invalid password" });
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(userFound));

    if (userFound.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h2>Login</h2>

        <label className="field-label">Username</label>
        <input
          type="text"
          placeholder="Username"
          autoComplete="off"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && <p className="error-text">{errors.username.message}</p>}

        <label className="field-label">Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            {...register("password", { required: "Password is required" })}
          />
          <span className="password-eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </span>
        </div>
        {errors.password && <p className="error-text">{errors.password.message}</p>}

        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;