const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  testType: {
    type: DataTypes.ENUM('iq', 'adhd', 'asd', 'anxiety'),
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxScore: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  answers: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  detailedResults: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  aiRecommendations: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'For anonymous assessments before login'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'assessments',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['testType']
    },
    {
      fields: ['completedAt']
    },
    {
      fields: ['sessionId']
    }
  ]
});

module.exports = Assessment; 