const axios = require('axios');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid'); // Add uuid for fallback job_id

const matchJobs = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ error: 'Unauthorized: No valid user ID found' });
    }

    let skills;
    if (req.method === 'POST') {
      skills = req.body.skills;
      if (!skills || !Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills array required for POST request' });
      }
    } 
    else {
      // For GET /jobs, fetch skills from the user's latest resume
      const user = await User.findOne({ firebaseUid: req.user.uid });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const resume = await Resume.findOne({ user: user._id }).sort({ createdAt: -1 });
      if (!resume) {
        return res.status(404).json({ error: 'No resume found for this user' });
      }
      skills = resume.skills || [];
    }

    // Query JSearch API
    const query = skills.length > 0 ? skills.join(' ') : 'software engineer';
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query,
        page: '1',
        num_pages: '1',
      },
      headers: {
        'X-RapidAPI-Key':"3990a54875msh521a769ff321ab6p1e20c2jsne1f7bc06336c",
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    console.log('JSearch API response:', JSON.stringify(response.data, null, 2));

    const jsearchJobs = response.data.data || [];
    const jobs = jsearchJobs
      .map((job, index) => ({
        id: job.job_id || uuidv4(), // Fallback to UUID if job_id is missing
        title: job.job_title || 'Unknown Title',
        company: job.employer_name || 'Unknown Company',
        location: job.job_city ? `${job.job_city}, ${job.job_state || job.job_country}` : job.job_country || 'Unknown',
        type: job.job_employment_type || 'Full-time',
        postedDate: job.job_posted_at_datetime_utc?.split('T')[0] || 'Recent',
        salary: job.job_min_salary && job.job_max_salary 
          ? `$${job.job_min_salary} - $${job.job_max_salary}`
          : 'Not specified',
        description: job.job_description || 'No description available',
        requirements: (job.job_description?.match(/.*?\.\s/g) || []).slice(0, 5),
        skills: (job.job_description?.match(/\b(React|JavaScript|Node\.js|MongoDB|TypeScript|AWS|GraphQL|Python|Java|CSS|HTML|communication|excel)\b/gi) || []),
        job_url: job.job_apply_link,
        logo: job.employer_logo || '/api/placeholder/40/40',
        fetchedAt: new Date(),
      }))
      .filter(job => job.id); // Ensure no jobs with undefined id

    if (jobs.length === 0) {
      console.warn('No valid jobs found after mapping');
      return res.status(200).json({ jobs: [] });
    }

    // Save to MongoDB
    console.log('Saving jobs to MongoDB:', jobs.length);
    await Job.deleteMany({}); // Clear old jobs (optional, consider removing for production)
    await Job.insertMany(jobs);

    // Calculate match percentage
    const matchedJobs = jobs.map(job => {
      const matchedSkills = job.skills.filter(skill =>
        skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );
      const matchPercentage = job.skills.length > 0 
        ? Math.min(Math.round((matchedSkills.length / job.skills.length) * 100), 95) 
        : 80;
      return { ...job, matchPercentage };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({ jobs: matchedJobs });
  } catch (error) {
    console.error('Job matching error:', error.message);
    res.status(500).json({ error: `Failed to fetch jobs: ${error.message}` });
  }
};

module.exports = { matchJobs };