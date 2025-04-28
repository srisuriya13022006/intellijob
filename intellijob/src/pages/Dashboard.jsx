import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import { 
  Bell, 
  Bookmark, 
  Briefcase, 
  CheckSquare, 
  Filter, 
  PieChart, 
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'react-feather';

const Dashboard = () => {
  // Sample data - replace with API calls in production
  const [metrics, setMetrics] = useState({
    appliedJobs: 12,
    jobMatches: 34,
    savedJobs: 8,
    interviewsScheduled: 3
  });

  const [applications, setApplications] = useState([
    { 
      id: 1, 
      company: 'TechCorp', 
      position: 'Frontend Developer', 
      type: 'Full-time',
      location: 'San Francisco, CA', 
      status: 'Applied', 
      appliedDate: '2025-04-15',
      logo: 'https://via.placeholder.com/40'
    },
    { 
      id: 2, 
      company: 'InnovateSoft', 
      position: 'UI/UX Designer', 
      type: 'Full-time',
      location: 'Remote', 
      status: 'Interview', 
      appliedDate: '2025-04-10',
      logo: 'https://via.placeholder.com/40'
    },
    { 
      id: 3, 
      company: 'GrowthStartup', 
      position: 'Software Engineering Intern', 
      type: 'Internship',
      location: 'New York, NY', 
      status: 'Rejected', 
      appliedDate: '2025-04-05',
      logo: 'https://via.placeholder.com/40'
    },
    { 
      id: 4, 
      company: 'DataAnalytics Inc.', 
      position: 'Junior Developer', 
      type: 'Full-time',
      location: 'Austin, TX', 
      status: 'Offer', 
      appliedDate: '2025-03-20',
      logo: 'https://via.placeholder.com/40'
    },
  ]);

  const [savedJobs, setSavedJobs] = useState([
    { 
      id: 1, 
      company: 'CloudTech', 
      position: 'Backend Developer', 
      type: 'Full-time',
      location: 'Seattle, WA', 
      salary: '$110,000 - $140,000',
      datePosted: '2025-04-22',
      logo: 'https://via.placeholder.com/40'
    },
    { 
      id: 2, 
      company: 'EduTech Solutions', 
      position: 'Product Manager', 
      type: 'Full-time',
      location: 'Chicago, IL', 
      salary: '$95,000 - $120,000',
      datePosted: '2025-04-20',
      logo: 'https://via.placeholder.com/40'
    },
    { 
      id: 3, 
      company: 'Fintech Innovations', 
      position: 'Summer Intern', 
      type: 'Internship',
      location: 'Boston, MA', 
      salary: '$25/hr',
      datePosted: '2025-04-18',
      logo: 'https://via.placeholder.com/40'
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'You have an interview scheduled with TechCorp on April 30, 2025',
      time: '1 hour ago',
      read: false,
      type: 'interview'
    },
    {
      id: 2,
      message: 'Your application for Software Engineer at DevCompany was viewed',
      time: '1 day ago',
      read: true,
      type: 'application'
    },
    {
      id: 3,
      message: '5 new jobs match your profile',
      time: '2 days ago',
      read: true,
      type: 'match'
    }
  ]);

  // Filter states
  const [activeTab, setActiveTab] = useState('applications');
  const [applicationsFilter, setApplicationsFilter] = useState('all');
  const [savedJobsFilter, setSavedJobsFilter] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Filter applications based on selected filter
  const filteredApplications = applications.filter(app => {
    if (applicationsFilter === 'all') return true;
    return app.type.toLowerCase() === applicationsFilter.toLowerCase();
  });

  // Filter saved jobs based on selected filter
  const filteredSavedJobs = savedJobs.filter(job => {
    if (savedJobsFilter === 'all') return true;
    return job.type.toLowerCase() === savedJobsFilter.toLowerCase();
  });

  // Calculate unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Status color mapping
  const getStatusStyles = (status) => {
    switch(status.toLowerCase()) {
      case 'applied':
        return { color: '#3498db', icon: <Clock size={16} /> };
      case 'interview':
        return { color: '#f39c12', icon: <Calendar size={16} /> };
      case 'offer':
        return { color: '#2ecc71', icon: <CheckCircle size={16} /> };
      case 'rejected':
        return { color: '#e74c3c', icon: <XCircle size={16} /> };
      default:
        return { color: '#95a5a6', icon: <AlertCircle size={16} /> };
    }
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(n => ({...n, read: true}));
    setNotifications(updatedNotifications);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'interview':
        return <Calendar size={16} />;
      case 'application':
        return <Briefcase size={16} />;
      case 'match':
        return <CheckSquare size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <div className="dashboard-actions">
          <div className="search-container">
            <Search size={18} />
            <input type="text" placeholder="Search jobs..." />
          </div>
          <div className="notification-container">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button className="read-all-btn" onClick={markAllNotificationsAsRead}>
                    Mark all as read
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-icon">
            <Briefcase size={24} color="#3498db" />
          </div>
          <div className="metric-content">
            <h3>{metrics.appliedJobs}</h3>
            <p>Applied Jobs</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <CheckSquare size={24} color="#2ecc71" />
          </div>
          <div className="metric-content">
            <h3>{metrics.jobMatches}</h3>
            <p>Job Matches</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <Bookmark size={24} color="#f39c12" />
          </div>
          <div className="metric-content">
            <h3>{metrics.savedJobs}</h3>
            <p>Saved Jobs</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">
            <Calendar size={24} color="#9b59b6" />
          </div>
          <div className="metric-content">
            <h3>{metrics.interviewsScheduled}</h3>
            <p>Interviews</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <Briefcase size={16} />
          Applications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={16} />
          Saved Jobs
        </button>
      </div>

      {activeTab === 'applications' && (
        <div className="section-container">
          <div className="section-header">
            <h2>My Applications</h2>
            <div className="filter-container">
              <Filter size={16} />
              <select 
                value={applicationsFilter}
                onChange={(e) => setApplicationsFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
          
          <div className="applications-container">
            {filteredApplications.length > 0 ? (
              filteredApplications.map(application => {
                const statusStyle = getStatusStyles(application.status);
                return (
                  <div key={application.id} className="application-card">
                    <div className="company-logo">
                      <img src={application.logo} alt={`${application.company} logo`} />
                    </div>
                    <div className="application-details">
                      <h3>{application.position}</h3>
                      <p className="company-name">{application.company}</p>
                      <div className="job-meta">
                        <span className="job-location">{application.location}</span>
                        <span className="job-type">{application.type}</span>
                      </div>
                    </div>
                    <div className="application-status">
                      <span className="applied-date">
                        Applied: {application.appliedDate}
                      </span>
                      <div className="status-badge" style={{ backgroundColor: statusStyle.color + '20', color: statusStyle.color }}>
                        {statusStyle.icon}
                        {application.status}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="empty-state">
                <Briefcase size={48} />
                <h3>No applications yet</h3>
                <p>When you apply for jobs, they will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="section-container">
          <div className="section-header">
            <h2>Saved Jobs</h2>
            <div className="filter-container">
              <Filter size={16} />
              <select 
                value={savedJobsFilter}
                onChange={(e) => setSavedJobsFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
          
          <div className="saved-jobs-container">
            {filteredSavedJobs.length > 0 ? (
              filteredSavedJobs.map(job => (
                <div key={job.id} className="saved-job-card">
                  <div className="company-logo">
                    <img src={job.logo} alt={`${job.company} logo`} />
                  </div>
                  <div className="job-details">
                    <h3>{job.position}</h3>
                    <p className="company-name">{job.company}</p>
                    <div className="job-meta">
                      <span className="job-location">{job.location}</span>
                      <span className="job-type">{job.type}</span>
                    </div>
                    <div className="job-salary">{job.salary}</div>
                  </div>
                  <div className="saved-job-actions">
                    <span className="posted-date">Posted: {job.datePosted}</span>
                    <div className="action-buttons">
                      <button className="apply-btn">Apply Now</button>
                      <button className="unsave-btn">
                        <Bookmark size={16} fill="#f39c12" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Bookmark size={48} />
                <h3>No saved jobs</h3>
                <p>Jobs you save will appear here for easy access</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="activity-chart-container">
        <div className="chart-header">
          <h2>Application Activity</h2>
          <select defaultValue="month">
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>
        </div>
        
        <div className="activity-chart">
          {/* Placeholder for chart - would integrate with a charting library like recharts */}
          <div className="chart-placeholder">
            <PieChart size={48} />
            <p>Application activity chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;