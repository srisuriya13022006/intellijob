import { useState, useEffect } from "react";
import { ArrowRight, Upload, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);

  // Sample data for recent jobs - would normally come from API/localStorage
  useEffect(() => {
    // Simulating fetched data
    const sampleRecentJobs = [
      {
        id: 1,
        title: "Machine Learning Engineer",
        company: "TechCorp",
        location: "San Francisco, CA",
        matchScore: 89,
        viewedAt: "2025-04-26T15:30:00",
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "WebSolutions Inc.",
        location: "Remote",
        matchScore: 92,
        viewedAt: "2025-04-25T10:15:00",
      },
      {
        id: 3,
        title: "Data Scientist",
        company: "DataDrive Analytics",
        location: "New York, NY",
        matchScore: 85,
        viewedAt: "2025-04-24T09:45:00",
      },
    ];
    
    setRecentJobs(sampleRecentJobs);
  }, []);

  // Carousel slides content
  const carouselSlides = [
    {
      title: "Smart Job Matching",
      description: "Upload your resume and we'll find the perfect jobs matching your skills and experience from across the internet.",
      icon: <Upload className="w-12 h-12 text-primary" />
    },
    {
      title: "Advanced ATS Analysis",
      description: "Our AI analyzes your resume against job descriptions to provide detailed feedback on how to improve your chances of getting through ATS systems.",
      icon: <CheckCircle className="w-12 h-12 text-primary" />
    },
    {
      title: "Role-Specific Optimization",
      description: "Get tailored recommendations for specific roles like ML Engineer, Software Developer, Data Scientist, and more.",
      icon: <ArrowRight className="w-12 h-12 text-primary" />
    }
  ];

  // Handle carousel navigation
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="home-container">
      {/* Header with Logo */}
      <header className="header">
        <div className="flex items-center gap-2">
          <div className="logo-container">
            <span className="logo-text">IJ</span>
          </div>
          <span className="company-name">IntelliJob</span>
        </div>
        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </header>

      {/* Hero Section with Carousel */}
      <section className="hero-section">
        <div className="carousel-container">
          <button onClick={prevSlide} className="carousel-button prev">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="carousel-content">
            {carouselSlides.map((slide, index) => (
              <div 
                key={index} 
                className={`carousel-slide ${index === activeSlide ? "active" : ""}`}
                style={{ transform: `translateX(${(index - activeSlide) * 100}%)` }}
              >
                <div className="slide-icon">{slide.icon}</div>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
              </div>
            ))}
          </div>
          
          <button onClick={nextSlide} className="carousel-button next">
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="carousel-indicators">
            {carouselSlides.map((_, index) => (
              <button 
                key={index}
                className={`indicator ${index === activeSlide ? "active" : ""}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="cta-section">
        <div className="cta-card upload">
          <div className="cta-icon-container">
            <Upload className="cta-icon" />
          </div>
          <h3>Upload Resume</h3>
          <p>Upload your resume and get matched with jobs that fit your skills and experience.</p>
          <Link to="/upload-resume" className="cta-button">
            Upload Now <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="cta-card ats">
          <div className="cta-icon-container">
            <CheckCircle className="cta-icon" />
          </div>
          <h3>ATS Resume Check</h3>
          <p>Analyze your resume against ATS systems and get feedback to improve your chances.</p>
          <Link to="/ats" className="cta-button">
            Check Resume <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Recently Viewed Jobs Section */}
      {recentJobs.length > 0 && (
        <section className="recent-jobs-section">
          <div className="section-header">
            <h2>Recently Viewed Jobs</h2>
            <Link to="/job-history" className="view-all">View All</Link>
          </div>
          
          <div className="recent-jobs-list">
            {recentJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <p className="job-location">{job.location}</p>
                </div>
                <div className="job-meta">
                  <div className="match-score">
                    <div className="score-circle" style={{ 
                      background: `conic-gradient(var(--primary-color) ${job.matchScore * 3.6}deg, #e9ecef 0deg)`
                    }}>
                      <span>{job.matchScore}%</span>
                    </div>
                    <p>Match</p>
                  </div>
                  <div className="viewed-time">
                    <Clock className="w-4 h-4" />
                    <span>{formatRelativeTime(job.viewedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose IntelliJob?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Smart Job Matching</h3>
            <p>Our AI scans thousands of job postings to find the perfect match for your skills and experience.</p>
          </div>
          <div className="feature-card">
            <h3>Role-Based ATS Analysis</h3>
            <p>Get specific feedback for different career paths like ML Engineering, Software Development, and more.</p>
          </div>
          <div className="feature-card">
            <h3>Resume Enhancement</h3>
            <p>Receive actionable suggestions to improve your resume and increase your chances of getting noticed.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Updates</h3>
            <p>Stay updated with the latest job postings that match your profile and interests.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">
          <div className="logo-container footer-logo-container">
            <span className="logo-text">IJ</span>
          </div>
          <span className="company-name">IntelliJob</span>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Resources</h4>
            <Link to="/blog">Blog</Link>
            <Link to="/guides">Guides</Link>
            <Link to="/templates">Resume Templates</Link>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/careers">Careers</Link>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 IntelliJob. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;