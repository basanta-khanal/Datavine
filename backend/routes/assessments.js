const express = require('express');
const jwt = require('jsonwebtoken');
const dataService = require('../services/dataService');

const router = express.Router();

// Middleware to get user from token
const getUserFromToken = async (req) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Authorization header:', req.header('Authorization'));
    console.log('Token:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('No token found in request');
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
    console.log('Decoded token:', decoded);
    
    const user = await dataService.findUserById(decoded.id);
    console.log('User found:', user ? user.email : 'not found');
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// @route   POST /api/assessments/save-result
// @desc    Save assessment result
// @access  Private
router.post('/save-result', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { testType, score, maxScore, answers, detailedResults, sessionId } = req.body;

    // Validate required fields
    if (!testType || score === undefined || !maxScore) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Save assessment using data service
    const assessment = await dataService.saveAssessment({
      testType,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      answers: answers || [],
      detailedResults: detailedResults || {},
      sessionId
    }, user.id);

    res.status(201).json({
      success: true,
      message: 'Assessment result saved successfully',
      assessment
    });

  } catch (error) {
    console.error('Save assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during save'
    });
  }
});

// @route   POST /api/assessments/save-anonymous
// @desc    Save anonymous assessment result (before login)
// @access  Public
router.post('/save-anonymous', async (req, res) => {
  try {
    const { testType, score, maxScore, answers, detailedResults, sessionId } = req.body;

    // Validate required fields
    if (!testType || score === undefined || !maxScore) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Save anonymous assessment
    const assessment = await dataService.saveAssessment({
      testType,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      answers: answers || [],
      detailedResults: detailedResults || {},
      sessionId
    });

    res.status(201).json({
      success: true,
      message: 'Anonymous assessment result saved successfully',
      assessment
    });

  } catch (error) {
    console.error('Save anonymous assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during save'
    });
  }
});

// @route   POST /api/assessments/migrate-anonymous
// @desc    Migrate anonymous assessments to user account after login
// @access  Private
router.post('/migrate-anonymous', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { sessionId } = req.body;

    // Migrate anonymous assessments to user account
    const migratedAssessments = await dataService.migrateAnonymousAssessments(user.id, sessionId);

    res.json({
      success: true,
      message: `Migrated ${migratedAssessments.length} assessments to your account`,
      migratedCount: migratedAssessments.length
    });

  } catch (error) {
    console.error('Migrate anonymous assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during migration'
    });
  }
});

// @route   GET /api/assessments/history
// @desc    Get user's assessment history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { testType, limit = 10, page = 1 } = req.query;

    // Get user's assessments using data service
    let userAssessments = await dataService.getUserAssessments(user.id);

    // Filter by test type if specified
    if (testType) {
      userAssessments = userAssessments.filter(assessment => assessment.testType === testType);
    }

    // Sort by completion date (newest first)
    userAssessments.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAssessments = userAssessments.slice(startIndex, endIndex);

    res.json({
      success: true,
      assessments: paginatedAssessments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userAssessments.length / limit),
        totalAssessments: userAssessments.length,
        hasNextPage: endIndex < userAssessments.length,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get assessment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/assessments/stats
// @desc    Get user's assessment statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get user's assessments
    const assessments = global.inMemoryDB?.assessments || new Map();
    const userAssessments = [];

    for (const [id, assessment] of assessments) {
      if (assessment.userId === user.id) {
        userAssessments.push(assessment);
      }
    }

    // Calculate statistics
    const totalAssessments = userAssessments.length;
    const averageScore = totalAssessments > 0 
      ? Math.round(userAssessments.reduce((sum, a) => sum + a.percentage, 0) / totalAssessments)
      : 0;
    const bestScore = totalAssessments > 0 
      ? Math.max(...userAssessments.map(a => a.percentage))
      : 0;

    // Performance by test type
    const performanceByType = {
      iq: 0,
      adhd: 0,
      asd: 0,
      anxiety: 0
    };

    const typeCounts = { iq: 0, adhd: 0, asd: 0, anxiety: 0 };
    
    userAssessments.forEach(assessment => {
      if (performanceByType.hasOwnProperty(assessment.testType)) {
        performanceByType[assessment.testType] += assessment.percentage;
        typeCounts[assessment.testType]++;
      }
    });

    // Calculate averages
    Object.keys(performanceByType).forEach(type => {
      if (typeCounts[type] > 0) {
        performanceByType[type] = Math.round(performanceByType[type] / typeCounts[type]);
      }
    });

    // Recent activity (last 5 assessments)
    const recentActivity = userAssessments
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        testType: a.testType,
        score: a.percentage,
        date: a.completedAt
      }));

    res.json({
      success: true,
      stats: {
        totalAssessments,
        averageScore,
        bestScore,
        performanceByType,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Get assessment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 