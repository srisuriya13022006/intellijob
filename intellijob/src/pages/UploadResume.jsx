import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
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
  const [resumeAnalysis, setResumeAnalysis] = useState({
    strengths: [],
    improvementAreas: [],
    skillGaps: [],
    overallMatch: 0,
    industryAlignment: {},
    careerPaths: []
  });
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('jobs');
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [error, setError] = useState(null);
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
      return () => clearInterval(timer);
    }
  }, [analyzing]);

  // When analysis reaches 100%, fetch job matches
  useEffect(() => {
    if (progress === 100) {
      const fetchJobs = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) {
            setError('Please log in to fetch job matches.');
            setAnalyzing(false);
            return;
          }
          const token = await user.getIdToken();
          console.log('Firebase token:', token);
          
          const response = await axios.get('http://localhost:5000/api/resume/jobs', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setJobs(response.data.jobs || []);
          setAnalyzing(false);
          setAnalyzed(true);
        } catch (err) {
          console.error('Error fetching jobs:', err);
          setError(err.response?.data?.error || 'Failed to fetch job matches. Please try again.');
          setAnalyzing(false);
        }
      };
      
      setTimeout(fetchJobs, 500);
    }
  }, [progress]);

  // Reset progress when not analyzing
  useEffect(() => {
    if (!analyzing) {
      setProgress(0);
    }
  }, [analyzing]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResumeFile({
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
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
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
        type: file.type
      });
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = async () => {
    if (!resumeFile) return;
    setAnalyzing(true);
    setError(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError('Please log in to analyze your resume.');
        setAnalyzing(false);
        return;
      }
      const token = await user.getIdToken();
      console.log('Firebase token:', token);

      const formData = new FormData();
      formData.append('resume', resumeFile.file);

      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setResumeAnalysis({
        strengths: response.data.strengths || [],
        improvementAreas: response.data.improvementAreas || [],
        skillGaps: response.data.skillGaps || [],
        overallMatch: response.data.overallMatch || 0,
        industryAlignment: response.data.industryAlignment || {},
        careerPaths: response.data.careerPaths || []
      });
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(err.response?.data?.error || 'Failed to analyze resume.');
      setAnalyzing(false);
    }
  };

  const handleClearResume = () => {
    setResumeFile(null);
    setAnalyzed(false);
    setJobs([]);
    setResumeAnalysis({ strengths: [], improvementAreas: [], skillGaps: [], overallMatch: 0, industryAlignment: {}, careerPaths: [] });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleJobExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
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
        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

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
                      strokeDasharray={`${resumeAnalysis.overallMatch || 86}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="19" className="circle-text">{resumeAnalysis.overallMatch || 86}%</text>
                  </svg>
                </div>
                <h3>Overall Match Score</h3>
                <p>Your resume matches {resumeAnalysis.overallMatch || 86}% of current job market requirements</p>
              </div>

              <div className="strength-areas">
                <h3>Key Strength Areas</h3>
                {resumeAnalysis.strengths.map((strength, index) => (
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
                    {jobs.length === 0 && !error ? (
                      <p>No job matches found.</p>
                    ) : (
                      jobs.map(job => (
                        <div 
                          key={job.id} 
                          className={`job-card ${expandedJobId === job.id ? 'expanded' : ''}`}
                        >
                          <div className="job-summary" onClick={() => toggleJobExpand(job.id)}>
                            <div className="company-logo">
                              <img src={job.logo || '/api/placeholder/40/40'} alt={job.company} />
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
                                    <Clock size={16} />
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
                                  <button onClick={handleapply} className="apply-button">Apply Now</button>
                                  <button className="save-button">Save Job</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
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
                          {resumeAnalysis.strengths.map((strength, index) => (
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
                        {resumeAnalysis.improvementAreas.map((item, index) => (
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
                            {resumeAnalysis.skillGaps.map((gap, index) => (
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
                            <div className="industry-fill" style={{ width: resumeAnalysis.industryAlignment?.technology || "92%" }}></div>
                          </div>
                          <span>{resumeAnalysis.industryAlignment?.technology || 92}%</span>
                        </div>
                        <div className="industry-item">
                          <h4>Finance</h4>
                          <div className="industry-bar">
                            <div className="industry-fill" style={{ width: resumeAnalysis.industryAlignment?.finance || "65%" }}></div>
                          </div>
                          <span>{resumeAnalysis.industryAlignment?.finance || 65}%</span>
                        </div>
                        <div className="industry-item">
                          <h4>Healthcare</h4>
                          <div className="industry-bar">
                            <div className="industry-fill" style={{ width: resumeAnalysis.industryAlignment?.healthcare || "40%" }}></div>
                          </div>
                          <span>{resumeAnalysis.industryAlignment?.healthcare || 40}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="insight-card">
                      <div className="card-header">
                        <Briefcase size={20} />
                        <h3>Career Path Suggestions</h3>
                      </div>
                      <div className="career-paths">
                        {resumeAnalysis.careerPaths?.map((path, index) => (
                          <div key={index} className="path-item">
                            <h4>{path.title}</h4>
                            <div className="path-match">{path.match}% match</div>
                          </div>
                        )) || (
                          <>
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
                          </>
                        )}
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

// Import statement for Calendar component
const Calendar = Clock;

export default UploadResume;