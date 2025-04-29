import { useState, useEffect } from "react";
import { Mail, User, Lock, Eye, EyeOff, ArrowRight, Briefcase, Check } from "lucide-react";
import "../styles/Signup.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from "../context/Authcontext";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      // Password strength checker
      let strength = 0;
      if (value.length > 6) strength += 1;
      if (value.match(/[A-Z]/)) strength += 1;
      if (value.match(/[0-9]/)) strength += 1;
      if (value.match(/[^A-Za-z0-9]/)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // Update user profile with username
      await updateProfile(userCredential.user, { displayName: formData.username });
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center rounded-lg" style={{ width: "3rem", height: "3rem", background: "var(--primary-color)" }}>
              <span className="text-xl font-bold text-white">IJ</span>
            </div>
            <span className="text-3xl font-bold text-primary">IntelliJob</span>
          </div>

          <h1>Create your account</h1>
          <p className="signup-subtitle">Join thousands of job seekers finding their perfect match</p>

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-container">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className={`strength-bar ${index < passwordStrength ? `strength-${passwordStrength}` : ""}`}
                      ></div>
                    ))}
                  </div>
                  <span className="strength-text">
                    {passwordStrength === 0 && "Weak"}
                    {passwordStrength === 1 && "Fair"}
                    {passwordStrength === 2 && "Good"}
                    {passwordStrength === 3 && "Strong"}
                    {passwordStrength === 4 && "Very strong"}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`signup-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>

        <div className="signup-right">
          <div className="benefits">
            <h2>Why join IntelliJob?</h2>

            <div className="benefit-item">
              <div className="benefit-icon">
                <Briefcase size={24} />
              </div>
              <div>
                <h3>Access to Premium Jobs</h3>
                <p>Browse thousands of curated job listings tailored to your profile</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <Check size={24} />
              </div>
              <div>
                <h3>Smart Job Matching</h3>
                <p>Our AI technology matches you with jobs that fit your skills and preferences</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <User size={24} />
              </div>
              <div>
                <h3>Build Your Professional Profile</h3>
                <p>Showcase your skills and experience to stand out to employers</p>
              </div>
            </div>

            <div className="testimonial">
              <p>"IntelliJob helped me land my dream job in just two weeks. The platform is intuitive and the job matches were spot-on!"</p>
              <div className="testimonial-author">
                <p className="author-name">Sarah Johnson</p>
                <p className="author-title">Software Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}