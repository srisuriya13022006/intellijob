import React, { useState, useRef } from 'react';
import { Upload, Check, X, AlertTriangle, FileText, ChevronDown, ArrowUpRight, Award, PieChart, BarChart2, List } from 'lucide-react';
import '../styles/ats.css';

const ATSResumeChecker = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);

  const jobRoles = [
    'Software Engineer',
    'ML Engineer',
    'Data Scientist',
    'Full Stack Developer',
    'DevOps Engineer',
    'Product Manager',
    'UX Designer',
    'Marketing Specialist',
    'Financial Analyst',
    'Project Manager'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsRoleDropdownOpen(false);
  };

  const analyzeResume = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulating API call with timeout
    setTimeout(() => {
      // Mock response data
      const mockResults = {
        overallScore: 78,
        keywordMatch: 72,
        formatCompatibility: 85,
        skillsRelevance: 81,
        experienceAlignment: 76,
        educationMatch: 90,
        missingKeywords: ['docker', 'kubernetes', 'CI/CD', 'agile methodology'],
        improvementAreas: [
          { name: 'Technical Skills', score: 76 },
          { name: 'Experience Description', score: 68 },
          { name: 'Quantifiable Achievements', score: 62 },
          { name: 'Resume Format', score: 85 },
          { name: 'Education Relevance', score: 90 },
        ],
        recommendations: [
          'Add more specific technical skills related to the job description',
          'Quantify your achievements with metrics and results',
          'Use more industry-specific keywords in your experience descriptions',
          'Ensure your resume is in a simple, scannable format',
          'Highlight projects relevant to the selected job role'
        ]
      };
      
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="ats-container">
      <header className="ats-header">
        <h1>ATS Resume Checker</h1>
        <p>Optimize your resume for Applicant Tracking Systems</p>
      </header>

      <div className="ats-main">
        <section className="upload-section">
          <div className="role-selector">
            <label>Select Job Role</label>
            <div className="dropdown">
              <button 
                className="dropdown-toggle" 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              >
                {selectedRole} <ChevronDown className="dropdown-icon" size={16} />
              </button>
              {isRoleDropdownOpen && (
                <div className="dropdown-menu">
                  {jobRoles.map((role) => (
                    <div 
                      key={role} 
                      className="dropdown-item"
                      onClick={() => handleRoleSelect(role)}
                    >
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div 
            className="file-upload-box"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx" 
              style={{ display: 'none' }}
            />
            {!file ? (
              <>
                <Upload size={48} className="upload-icon" />
                <p className="upload-text">Drag & drop your resume or click to browse</p>
                <p className="upload-format">Accepted formats: PDF, DOC, DOCX</p>
              </>
            ) : (
              <div className="file-selected">
                <FileText size={32} className="file-icon" />
                <p className="file-name">{fileName}</p>
                <button 
                  className="remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setFileName('');
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <button 
            className={`analyze-btn ${!file ? 'disabled' : ''}`}
            onClick={analyzeResume}
            disabled={!file || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </section>

        {results && (
          <section className="results-section">
            <div className="results-header">
              <h2>ATS Analysis Results</h2>
              <p>For {selectedRole} position</p>
            </div>

            <div className="score-overview">
              <div className="overall-score">
                <div className="score-circle">
                  <svg viewBox="0 0 100 100" className="score-chart">
                    <circle cx="50" cy="50" r="45" className="score-background" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      className="score-indicator" 
                      style={{ 
                        strokeDasharray: `${results.overallScore * 2.83} 283`,
                      }} 
                    />
                    <text x="50" y="55" className="score-text">{results.overallScore}%</text>
                  </svg>
                </div>
                <h3>Overall ATS Score</h3>
                <p className="score-description">
                  {results.overallScore >= 80 ? 'Great!' : 
                   results.overallScore >= 60 ? 'Good, but could improve' : 
                   'Needs significant improvement'}
                </p>
              </div>

              <div className="score-metrics">
                <div className="metric">
                  <div className="metric-header">
                    <h4>Keyword Match</h4>
                    <span className={`metric-score ${results.keywordMatch >= 70 ? 'good' : 'warning'}`}>
                      {results.keywordMatch}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${results.keywordMatch}%` }}></div>
                  </div>
                </div>

                <div className="metric">
                  <div className="metric-header">
                    <h4>Format Compatibility</h4>
                    <span className={`metric-score ${results.formatCompatibility >= 70 ? 'good' : 'warning'}`}>
                      {results.formatCompatibility}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${results.formatCompatibility}%` }}></div>
                  </div>
                </div>

                <div className="metric">
                  <div className="metric-header">
                    <h4>Skills Relevance</h4>
                    <span className={`metric-score ${results.skillsRelevance >= 70 ? 'good' : 'warning'}`}>
                      {results.skillsRelevance}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${results.skillsRelevance}%` }}></div>
                  </div>
                </div>

                <div className="metric">
                  <div className="metric-header">
                    <h4>Experience Alignment</h4>
                    <span className={`metric-score ${results.experienceAlignment >= 70 ? 'good' : 'warning'}`}>
                      {results.experienceAlignment}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${results.experienceAlignment}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="improvement-areas">
              <h3><PieChart size={18} /> Areas for Improvement</h3>
              <div className="improvement-chart">
                {results.improvementAreas.map((area, index) => (
                  <div key={index} className="improvement-item">
                    <div className="improvement-label">{area.name}</div>
                    <div className="improvement-bar-container">
                      <div 
                        className="improvement-bar" 
                        style={{ width: `${area.score}%` }}
                      ></div>
                    </div>
                    <div className="improvement-score">{area.score}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="recommendations">
              <h3><List size={18} /> Recommendations</h3>
              <ul className="recommendations-list">
                {results.recommendations.map((recommendation, index) => (
                  <li key={index} className="recommendation-item">
                    <Check size={16} className="check-icon" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="missing-keywords">
              <h3><AlertTriangle size={18} /> Missing Keywords</h3>
              <div className="keyword-tags">
                {results.missingKeywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-btn primary">
                <span>Download Report</span>
                <ArrowUpRight size={16} />
              </button>
              <button className="action-btn secondary">
                <span>Get Resume Tips</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </section>
        )}
      </div>

      <footer className="ats-footer">
        <p>Professional ATS Resume Checker © 2025</p>
      </footer>
    </div>
  );
};

export default ATSResumeChecker;