const PDFParser = require('pdf2json');
const Resume = require('../models/Resume');
const User = require('../models/User');
const axios = require('axios');

const uploadResume = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ error: 'Unauthorized: No valid user ID found' });
    }

    const firebaseUid = req.user.uid;
    const email = req.user.email;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    // Find or create user
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = new User({
        firebaseUid,
        email
      });
      await user.save();
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    // Extract file details from req.file
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size; // Size in bytes

    // Parse PDF
    const pdfParser = new PDFParser();
    const pdfPath = req.file.path;

    pdfParser.on('pdfParser_dataError', (errData) => {
      console.error('PDF parsing error:', errData.parserError);
      res.status(500).json({ error: 'Error parsing PDF' });
    });

    pdfParser.on('pdfParser_dataReady', async (pdfData) => {
      try {
        let parsedText = '';
        for (const page of pdfData.Pages) {
          for (const text of page.Texts) {
            parsedText += decodeURIComponent(text.R[0].T) + ' ';
          }
        }

        // Mock analysis (replace with actual logic)
        const skills = parsedText.match(/React|JavaScript|Node\.js|TypeScript|Python/gi) || [];
        const analysis = {
          strengths: [
            { label: 'Technical Skills', value: skills.length > 3 ? 92 : 85 },
            { label: 'Experience Match', value: 85 },
            { label: 'Education Match', value: 90 },
            { label: 'Industry Relevance', value: 88 }
          ],
          improvementAreas: [
            'Add more quantifiable achievements',
            'Include specific project outcomes'
          ],
          skillGaps: [
            { skill: 'GraphQL', priority: 'High' },
            { skill: 'TypeScript', priority: 'High' }
          ],
          overallMatch: skills.length > 3 ? 86 : 80,
          industryAlignment: { technology: 92, finance: 65, healthcare: 40 },
          careerPaths: [
            { title: 'Senior Developer', match: 95 },
            { title: 'Technical Lead', match: 82 }
          ]
        };

        // Save resume to MongoDB
        const resume = new Resume({
          user: user._id, // Use User document's _id
          fileName,
          fileType,
          fileSize,
          filePath: pdfPath,
          parsedContent: parsedText,
          analysis,
          skills
        });
        await resume.save();

        // Update user's resumes array
        user.resumes = user.resumes || [];
        user.resumes.push(resume._id);
        await user.save();

        res.json(analysis);
      } catch (error) {
        console.error('Error processing resume:', error);
        res.status(500).json({ error: error.message || 'Error processing resume' });
      }
    });

    pdfParser.loadPDF(pdfPath);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
};

module.exports = { uploadResume };