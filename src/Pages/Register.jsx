import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

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

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  const onSubmit = () => {
    navigate("/login");
  };

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2>

        <label className="field-label">Username</label>
        <input
          type="text"
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "Username must be at least 3 characters" },
          })}
        />
        {errors.username && <p className="error-text">{errors.username.message}</p>}

        <label className="field-label">Email Address</label>
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}

        <label className="field-label">Mobile Number</label>
        <input
          type="tel"
          placeholder="Mobile Number"
          maxLength="10"
          {...register("mobile", {
            required: "Mobile number is required",
            pattern: {
              value: /^[6-9][0-9]{9}$/,
              message: "Enter a valid 10-digit mobile number",
            },
          })}
        />
        {errors.mobile && <p className="error-text">{errors.mobile.message}</p>}

        <label className="field-label">Address</label>
        <input
          type="text"
          placeholder="Address"
          {...register("address", {
            required: "Address is required",
            minLength: { value: 5, message: "Address must be at least 5 characters" },
          })}
        />
        {errors.address && <p className="error-text">{errors.address.message}</p>}

        <label className="field-label">Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          <span className="password-eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </span>
        </div>
        {errors.password && <p className="error-text">{errors.password.message}</p>}

        <label className="field-label">Confirm Password</label>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />
          <span className="password-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </span>
        </div>
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}

        <label className="terms-check">
          <input
            type="checkbox"
            {...register("terms", { required: "You must agree to the Terms & Conditions" })}
          />
          <span>I agree to the Terms & Conditions</span>
        </label>
        {errors.terms && <p className="error-text">{errors.terms.message}</p>}

        <button type="submit" disabled={!isValid}>
          Register
        </button>

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;