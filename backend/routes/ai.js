const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to get user from token
const getUserFromToken = (req) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
    const users = global.inMemoryDB?.users || new Map();
    
    for (const [email, userData] of users) {
      if (userData.id === decoded.id) {
        return userData;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

// @route   POST /api/ai/generate-recommendations
// @desc    Generate AI recommendations for assessment
// @access  Private
router.post('/generate-recommendations', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { assessmentId, testType, score, answers, detailedResults } = req.body;

    // For development, we'll generate mock AI recommendations
    const recommendations = {
      performanceAnalysis: `Based on your ${testType.toUpperCase()} assessment score of ${score}%, you show ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'moderate' : 'room for improvement'} performance in this area.`,
      strengths: [
        'Strong pattern recognition abilities',
        'Good logical reasoning skills',
        'Effective problem-solving approach'
      ],
      areasForImprovement: [
        'Time management during assessments',
        'Attention to detail in complex questions',
        'Speed of processing information'
      ],
      recommendations: [
        'Practice similar questions regularly',
        'Focus on time management techniques',
        'Consider taking breaks during long sessions',
        'Review incorrect answers to understand patterns'
      ],
      resources: [
        'Online cognitive training exercises',
        'Mindfulness and focus techniques',
        'Speed reading and comprehension practice',
        'Logic and reasoning games'
      ],
      timeline: '3-6 months for noticeable improvement',
      motivation: 'Consistent practice and targeted exercises can significantly improve your performance in this area.'
    };

    res.json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Generate recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during recommendation generation'
    });
  }
});

// @route   GET /api/ai/recommendations/:assessmentId
// @desc    Get AI recommendations for specific assessment
// @access  Private
router.get('/recommendations/:assessmentId', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { assessmentId } = req.params;

    // Get assessment from storage
    const assessments = global.inMemoryDB?.assessments || new Map();
    const assessment = assessments.get(assessmentId);

    if (!assessment || assessment.userId !== user.id) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Generate recommendations based on assessment data
    const recommendations = {
      performanceAnalysis: `Your ${assessment.testType.toUpperCase()} assessment shows a score of ${assessment.percentage}%.`,
      strengths: [
        'Consistent performance patterns',
        'Good understanding of core concepts',
        'Effective test-taking strategies'
      ],
      areasForImprovement: [
        'Speed and efficiency',
        'Complex problem solving',
        'Pattern recognition in advanced scenarios'
      ],
      recommendations: [
        'Practice with time constraints',
        'Focus on challenging question types',
        'Review and analyze mistakes',
        'Build foundational knowledge'
      ],
      resources: [
        'Practice tests and simulations',
        'Educational materials and tutorials',
        'Peer study groups',
        'Professional assessment tools'
      ],
      timeline: '2-4 months for significant improvement',
      motivation: 'Your current performance provides a solid foundation for growth and improvement.'
    };

    res.json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/ai/analyze-patterns
// @desc    Analyze user performance patterns
// @access  Private
router.post('/analyze-patterns', async (req, res) => {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get user's assessment history
    const assessments = global.inMemoryDB?.assessments || new Map();
    const userAssessments = [];

    for (const [id, assessment] of assessments) {
      if (assessment.userId === user.id) {
        userAssessments.push(assessment);
      }
    }

    if (userAssessments.length === 0) {
      return res.json({
        success: true,
        patterns: {
          message: 'No assessment data available for pattern analysis',
          recommendations: ['Complete more assessments to get personalized insights']
        }
      });
    }

    // Analyze patterns
    const patterns = {
      totalAssessments: userAssessments.length,
      averageScore: Math.round(userAssessments.reduce((sum, a) => sum + a.percentage, 0) / userAssessments.length),
      bestTestType: userAssessments.reduce((best, current) => 
        current.percentage > best.percentage ? current : best
      ).testType,
      improvementTrend: userAssessments.length >= 2 ? 'positive' : 'insufficient data',
      recommendations: [
        'Focus on your strongest areas for confidence building',
        'Practice in weaker areas for balanced development',
        'Maintain consistent assessment schedule',
        'Review detailed results for targeted improvement'
      ]
    };

    res.json({
      success: true,
      patterns
    });

  } catch (error) {
    console.error('Analyze patterns error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during pattern analysis'
    });
  }
});

module.exports = router; 