import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Check, Briefcase, AlertCircle, Clock, 
  DollarSign, MapPin, Search, File, BarChart2,
  ChevronRight, X, ChevronDown, Award
} from 'lucide-react';
import '../styles/uploadresume.css';

const UploadResume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('jobs');
  const [expandedJobId, setExpandedJobId] = useState(null);
  const fileInputRef = useRef(null);
  const uploadAreaRef = useRef(null);

  // Animation for progress bar during analysis
  useEffect(() => {
    if (analyzing) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = oldProgress + 2;
          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
      }, 50);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [analyzing]);

  // When analysis reaches 100%, move to analyzed state
  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setAnalyzing(false);
        setAnalyzed(true);
        setJobs(mockJobs);
      }, 500);
    }
  }, [progress]);

  // Reset progress when not analyzing
  useEffect(() => {
    if (!analyzing) {
      setProgress(0);
    }
  }, [analyzing]);

  // Mock job data - in real implementation, this would come from an API
  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "April 25, 2025",
      salary: "$120,000 - $150,000",
      description: "We are seeking an experienced Frontend Developer proficient in React.js to join our innovative team. The ideal candidate will design and implement user interface components using React.js principles and workflow. You'll be responsible for building reusable components and front-end libraries for future use, translating designs and wireframes into high-quality code, and optimizing components for maximum performance across devices and browsers.",
      requirements: [
        "5+ years of experience in modern JavaScript frameworks, specifically React",
        "Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model",
        "Experience with popular React workflows (Redux, Hooks, etc)",
        "Experience with RESTful APIs and GraphQL",
        "Understanding of server-side rendering and its benefits"
      ],
      matchPercentage: 94,
      skills: ["React", "JavaScript", "Redux", "TypeScript", "HTML/CSS", "Git"],
      logo: "/api/placeholder/40/40"
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "InnovateTech",
      location: "Remote",
      type: "Full-time",
      postedDate: "April 23, 2025",
      salary: "$110,000 - $140,000",
      description: "We are looking for a Full Stack Developer who is passionate about building exceptional web applications from front to back. You'll work with our product team to implement new features and maintain existing ones, ensuring the entire stack is well-designed, efficient, and testable. This role requires proficiency in both frontend and backend technologies.",
      requirements: [
        "4+ years of experience with React.js and Node.js",
        "Experience with MongoDB, PostgreSQL, or similar databases",
        "Understanding of CI/CD pipelines and DevOps practices",
        "Experience with AWS or Azure cloud services",
        "Strong problem-solving skills and attention to detail"
      ],
      matchPercentage: 87,
      skills: ["React", "Node.js", "MongoDB", "Express", "AWS", "Git"],
      logo: "/api/placeholder/40/40"
    },
    {
      id: 3,
      title: "UI/UX Developer",
      company: "DesignFirst Co.",
      location: "New York, NY",
      type: "Contract",
      postedDate: "April 24, 2025",
      salary: "$95,000 - $120,000",
      description: "Join our team to create beautiful and functional user interfaces using modern web technologies. We're looking for someone who can bridge the gap between design and development, ensuring a seamless user experience that meets both aesthetic and functional requirements.",
      requirements: [
        "3+ years of experience in UI/UX design and frontend development",
        "Proficiency in React.js and modern CSS frameworks",
        "Experience with design tools like Figma or Adobe XD",
        "Understanding of accessibility standards and best practices",
        "Portfolio demonstrating strong UI/UX work"
      ],
      matchPercentage: 81,
      skills: ["UI/UX", "Design Systems", "React", "CSS", "Figma"],
      logo: "/api/placeholder/40/40"
    },
    {
      id: 4,
      title: "Frontend React Developer",
      company: "Enterprise Solutions",
      location: "Chicago, IL",
      type: "Full-time",
      postedDate: "April 26, 2025",
      salary: "$105,000 - $130,000",
      description: "We're looking for a talented React developer to join our collaborative team. You'll be responsible for building user-facing features and optimizing application performance while working closely with our UX/UI team to implement design specifications accurately.",
      requirements: [
        "3+ years of experience with React.js and modern JavaScript",
        "Experience with state management libraries like Redux or Context API",
        "Understanding of responsive design principles",
        "Experience with testing frameworks like Jest or Enzyme",
        "Knowledge of browser rendering behavior and performance optimization"
      ],
      matchPercentage: 90,
      skills: ["React", "JavaScript", "TypeScript", "CSS", "Redux", "Jest"],
      logo: "/api/placeholder/40/40"
    }
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResumeFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
        type: file.type
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.add('drag-over');
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.remove('drag-over');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (uploadAreaRef.current) {
      uploadAreaRef.current.classList.remove('drag-over');
    }
    
    const file = event.dataTransfer.files[0];
    if (file) {
      setResumeFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // Convert to MB
        type: file.type
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = () => {
    if (!resumeFile) return;
    setAnalyzing(true);
  };

  const handleClearResume = () => {
    setResumeFile(null);
    setAnalyzed(false);
    setJobs([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleJobExpand = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
    }
  };

  const getMatchLevelClass = (percentage) => {
    if (percentage >= 90) return 'match-excellent';
    if (percentage >= 80) return 'match-good';
    if (percentage >= 70) return 'match-average';
    return 'match-low';
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return "PDF";
      case 'doc':
      case 'docx':
        return "DOC";
      default:
        return "FILE";
    }
  };

  const resumeStrengths = [
    { label: "Technical Skills", value: 92 },
    { label: "Experience Match", value: 85 },
    { label: "Education Match", value: 90 },
    { label: "Industry Relevance", value: 88 }
  ];

  const improvementAreas = [
    "Add more quantifiable achievements to highlight your impact",
    "Include specific project outcomes using metrics where possible",
    "Emphasize leadership experience and team collaboration examples",
    "Add relevant certifications or continuous learning activities",
    "Update skills section with more industry-specific keywords"
  ];

  const skillGaps = [
    { skill: "GraphQL", priority: "High" },
    { skill: "TypeScript", priority: "High" },
    { skill: "CI/CD Pipelines", priority: "Medium" },
    { skill: "AWS/Cloud Services", priority: "Medium" },
    { skill: "Testing Frameworks", priority: "Medium" }
  ];

  return (
    <div className="resume-analyzer-container">
      <header className="app-header">
        <h1>
          <Briefcase size={24} className="header-icon" />
          Professional Resume Analyzer
        </h1>
        <p className="header-subtitle">Upload your resume to find matching opportunities tailored to your professional profile</p>
      </header>

      <main className="app-main">
        {!analyzed ? (
          <div className="upload-section">
            <div className="upload-card">
              <div className="card-header">
                <h2>Resume Upload</h2>
                <p>Upload your resume to analyze its match with current job market opportunities</p>
              </div>

              <div 
                className={`upload-area ${resumeFile ? 'has-file' : ''}`}
                ref={uploadAreaRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx" 
                  className="file-input"
                />
                
                {!resumeFile ? (
                  <div className="upload-content">
                    <div className="upload-icon">
                      <Upload size={28} />
                    </div>
                    <h3>Upload Resume</h3>
                    <p>Drag and drop your resume file here or <span className="browse-text">browse</span></p>
                    <div className="supported-formats">Supported formats: PDF, DOC, DOCX</div>
                  </div>
                ) : (
                  <div className="file-details">
                    <div className="file-icon">
                      {getFileIcon(resumeFile.name)}
                    </div>
                    <div className="file-info">
                      <p className="file-name">{resumeFile.name}</p>
                      <span className="file-size">{resumeFile.size} MB</span>
                    </div>
                    <button className="remove-file" onClick={(e) => { e.stopPropagation(); handleClearResume(); }}>
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {analyzing ? (
                <div className="analyzing-status">
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="progress-info">
                      <div className="progress-steps">
                        <div className={`step ${progress >= 25 ? 'complete' : ''}`}>
                          <div className="step-indicator"></div>
                          <span>Parsing</span>
                        </div>
                        <div className={`step ${progress >= 50 ? 'complete' : ''}`}>
                          <div className="step-indicator"></div>
                          <span>Analyzing</span>
                        </div>
                        <div className={`step ${progress >= 75 ? 'complete' : ''}`}>
                          <div className="step-indicator"></div>
                          <span>Matching</span>
                        </div>
                        <div className={`step ${progress >= 100 ? 'complete' : ''}`}>
                          <div className="step-indicator"></div>
                          <span>Complete</span>
                        </div>
                      </div>
                      <div className="progress-percent">{progress}%</div>
                    </div>
                  </div>
                  <p className="analyzing-message">Analyzing your resume and finding relevant job opportunities...</p>
                </div>
              ) : (
                resumeFile && (
                  <button className="analyze-button" onClick={handleAnalyze}>
                    <span>Analyze Resume</span>
                    <Search size={18} />
                  </button>
                )
              )}
            </div>
            
            <div className="features-section">
              <div className="feature-card">
                <div className="feature-icon">
                  <Search size={24} />
                </div>
                <h3>AI-Powered Analysis</h3>
                <p>Our advanced AI thoroughly analyzes your resume to identify key skills, experience, and qualifications.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Briefcase size={24} />
                </div>
                <h3>Job Matching</h3>
                <p>Get matched with relevant job opportunities based on your resume's content and career profile.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <BarChart2 size={24} />
                </div>
                <h3>Detailed Insights</h3>
                <p>Receive professional recommendations to improve your resume and enhance your job market competitiveness.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="results-section">
            <div className="sidebar">
              <div className="file-summary">
                <div className="file-icon large">
                  {getFileIcon(resumeFile?.name)}
                </div>
                <div className="file-meta">
                  <h3 className="file-name">{resumeFile?.name}</h3>
                  <p className="file-size">Uploaded: {new Date().toLocaleDateString()}</p>
                </div>
                <button className="change-file" onClick={handleClearResume}>Change</button>
              </div>

              <div className="overall-match">
                <div className="match-circle">
                  <svg viewBox="0 0 36 36">
                    <path className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle-progress"
                      strokeDasharray="86, 100"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="19" className="circle-text">86%</text>
                  </svg>
                </div>
                <h3>Overall Match Score</h3>
                <p>Your resume matches 86% of current job market requirements</p>
              </div>

              <div className="strength-areas">
                <h3>Key Strength Areas</h3>
                {resumeStrengths.map((strength, index) => (
                  <div key={index} className="strength-item">
                    <div className="strength-info">
                      <span className="strength-label">{strength.label}</span>
                      <span className="strength-value">{strength.value}%</span>
                    </div>
                    <div className="strength-bar">
                      <div className="strength-progress" style={{ width: `${strength.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-area">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('jobs')}
                >
                  <Briefcase size={18} />
                  <span>Job Matches</span>
                </button>
                <button 
                  className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
                  onClick={() => setActiveTab('insights')}
                >
                  <BarChart2 size={18} />
                  <span>Resume Insights</span>
                </button>
              </div>

              {activeTab === 'jobs' && (
                <div className="jobs-panel">
                  <div className="panel-header">
                    <h2>{jobs.length} Job Matches Found</h2>
                    <p>Based on your skills, experience, and qualifications</p>
                  </div>

                  <div className="job-list">
                    {jobs.map(job => (
                      <div 
                        key={job.id} 
                        className={`job-card ${expandedJobId === job.id ? 'expanded' : ''}`}
                      >
                        <div className="job-summary" onClick={() => toggleJobExpand(job.id)}>
                          <div className="company-logo">
                            <img src={job.logo} alt={job.company} />
                          </div>
                          
                          <div className="job-info">
                            <h3>{job.title}</h3>
                            <div className="company-info">
                              <span className="company-name">{job.company}</span>
                              <span className="job-location">
                                <MapPin size={14} />
                                {job.location}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`match-score ${getMatchLevelClass(job.matchPercentage)}`}>
                            <span className="match-value">{job.matchPercentage}%</span>
                            <span className="match-label">Match</span>
                          </div>
                          
                          <button className="expand-button">
                            <ChevronDown size={20} className={expandedJobId === job.id ? 'rotate' : ''} />
                          </button>
                        </div>
                        
                        {expandedJobId === job.id && (
                          <div className="job-details">
                            <div className="details-section">
                              <div className="job-meta">
                                <div className="meta-item">
                                  <DollarSign size={16} />
                                  <span>{job.salary}</span>
                                </div>
                                <div className="meta-item">
                                  <Clock size={16} />
                                  <span>{job.type}</span>
                                </div>
                                <div className="meta-item">
                                  <Calendar size={16} />
                                  <span>Posted: {job.postedDate}</span>
                                </div>
                              </div>
                              
                              <div className="description">
                                <h4>Job Description</h4>
                                <p>{job.description}</p>
                              </div>
                              
                              <div className="requirements">
                                <h4>Requirements</h4>
                                <ul>
                                  {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="skills-match">
                                <h4>Skills Match</h4>
                                <div className="skills-list">
                                  {job.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="job-actions">
                                <button className="apply-button">Apply Now</button>
                                <button className="save-button">Save Job</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="insights-panel">
                  <div className="panel-header">
                    <h2>Resume Insights</h2>
                    <p>Professional analysis and recommendations for your resume</p>
                  </div>
                  
                  <div className="insights-grid">
                    <div className="insight-card">
                      <div className="card-header">
                        <Award size={20} />
                        <h3>Resume Strengths</h3>
                      </div>
                      <div className="strength-chart">
                        <div className="chart-bars">
                          {resumeStrengths.map((strength, index) => (
                            <div key={index} className="chart-bar">
                              <div className="bar-label">{strength.label}</div>
                              <div className="bar-container">
                                <div 
                                  className="bar-fill" 
                                  style={{ width: `${strength.value}%` }}
                                ></div>
                              </div>
                              <div className="bar-value">{strength.value}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="insight-card">
                      <div className="card-header">
                        <AlertCircle size={20} />
                        <h3>Improvement Areas</h3>
                      </div>
                      <ul className="improvement-list">
                        {improvementAreas.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="insight-card full-width">
                      <div className="card-header">
                        <File size={20} />
                        <h3>Skill Gap Analysis</h3>
                      </div>
                      <p className="gap-intro">
                        Based on current market trends and job requirements, consider adding these skills to your resume:
                      </p>
                      <div className="skill-gaps">
                        <table className="gap-table">
                          <thead>
                            <tr>
                              <th>Skill</th>
                              <th>Priority</th>
                              <th>Recommendation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {skillGaps.map((gap, index) => (
                              <tr key={index}>
                                <td>{gap.skill}</td>
                                <td>
                                  <span className={`priority-tag ${gap.priority.toLowerCase()}`}>
                                    {gap.priority}
                                  </span>
                                </td>
                                <td>
                                  {gap.priority === "High" 
                                    ? "Add immediately to improve job match rate" 
                                    : "Consider adding to expand job opportunities"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="insight-card">
                      <div className="card-header">
                        <BarChart2 size={20} />
                        <h3>Industry Alignment</h3>
                      </div>
                      <div className="industry-comparison">
                        <div className="industry-item">
                          <h4>Technology</h4>
                          <div className="industry-bar">
                            <div className="industry-fill" style={{ width: "92%" }}></div>
                          </div>
                          <span>92%</span>
                        </div>
                        <div className="industry-item">
                          <h4>Finance</h4>
                          <div className="industry-bar">
                            <div className="industry-fill" style={{ width: "65%" }}></div>
                          </div>
                          <span>65%</span>
                        </div>
                        <div className="industry-item">
                          <h4>Healthcare</h4>
                          <div className="industry-bar">
                            <div className="industry-fill" style={{ width: "40%" }}></div>
                          </div>
                          <span>40%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="insight-card">
                      <div className="card-header">
                        <Briefcase size={20} />
                        <h3>Career Path Suggestions</h3>
                      </div>
                      <div className="career-paths">
                        <div className="path-item">
                          <h4>Senior Developer</h4>
                          <div className="path-match">95% match</div>
                        </div>
                        <div className="path-item">
                          <h4>Technical Lead</h4>
                          <div className="path-match">82% match</div>
                        </div>
                        <div className="path-item">
                          <h4>Product Manager</h4>
                          <div className="path-match">68% match</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Import statement for Calendar component which is missing above
const Calendar = Clock;

export default UploadResume;