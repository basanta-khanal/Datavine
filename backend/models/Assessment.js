const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  answers: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  detailedResults: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  aiRecommendations: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  timeSpent: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

// Define relationship
Assessment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Assessment, { foreignKey: 'userId' });

module.exports = Assessment; 