const { User, Assessment } = require('../models');
const { sequelize } = require('../config/database');

class DataService {
  constructor() {
    this.usePostgreSQL = sequelize && sequelize.authenticate;
    this.inMemoryDB = global.inMemoryDB || {
      users: new Map(),
      assessments: new Map(),
      anonymousAssessments: new Map() // For non-authenticated users
    };
  }

  // User Management
  async findUserByEmail(email) {
    if (this.usePostgreSQL) {
      try {
        return await User.findOne({ where: { email } });
      } catch (error) {
        console.error('PostgreSQL user lookup failed:', error);
        // Fallback to in-memory
      }
    }
    
    // In-memory fallback
    return this.inMemoryDB.users.get(email) || null;
  }

  async findUserById(id) {
    if (this.usePostgreSQL) {
      try {
        return await User.findByPk(id);
      } catch (error) {
        console.error('PostgreSQL user lookup failed:', error);
      }
    }
    
    // In-memory fallback
    for (const [email, user] of this.inMemoryDB.users) {
      if (user.id === id) return user;
    }
    return null;
  }

  async createUser(userData) {
    if (this.usePostgreSQL) {
      try {
        return await User.create(userData);
      } catch (error) {
        console.error('PostgreSQL user creation failed:', error);
      }
    }
    
    // In-memory fallback
    const user = {
      id: userData.id || Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.inMemoryDB.users.set(user.email, user);
    return user;
  }

  async updateUser(email, updates) {
    if (this.usePostgreSQL) {
      try {
        const user = await User.findOne({ where: { email } });
        if (user) {
          return await user.update(updates);
        }
      } catch (error) {
        console.error('PostgreSQL user update failed:', error);
      }
    }
    
    // In-memory fallback
    const user = this.inMemoryDB.users.get(email);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      this.inMemoryDB.users.set(email, updatedUser);
      return updatedUser;
    }
    return null;
  }

  // Assessment Management
  async saveAssessment(assessmentData, userId = null) {
    if (this.usePostgreSQL && userId) {
      try {
        return await Assessment.create({
          ...assessmentData,
          userId
        });
      } catch (error) {
        console.error('PostgreSQL assessment save failed:', error);
      }
    }
    
    // In-memory fallback
    const assessment = {
      id: Date.now().toString(),
      ...assessmentData,
      userId: userId || 'anonymous',
      createdAt: new Date().toISOString()
    };
    
    if (userId) {
      // Authenticated user - save to main assessments
      this.inMemoryDB.assessments.set(assessment.id, assessment);
    } else {
      // Anonymous user - save to anonymous assessments
      this.inMemoryDB.anonymousAssessments.set(assessment.id, assessment);
    }
    
    return assessment;
  }

  async getUserAssessments(userId) {
    if (this.usePostgreSQL) {
      try {
        return await Assessment.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']]
        });
      } catch (error) {
        console.error('PostgreSQL assessment lookup failed:', error);
      }
    }
    
    // In-memory fallback
    const userAssessments = [];
    for (const [id, assessment] of this.inMemoryDB.assessments) {
      if (assessment.userId === userId) {
        userAssessments.push(assessment);
      }
    }
    return userAssessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getAnonymousAssessments() {
    return Array.from(this.inMemoryDB.anonymousAssessments.values());
  }

  // Migration: Move anonymous assessments to user account
  async migrateAnonymousAssessments(userId, sessionId = null) {
    const anonymousAssessments = Array.from(this.inMemoryDB.anonymousAssessments.values());
    const migratedAssessments = [];
    
    for (const assessment of anonymousAssessments) {
      // Only migrate if sessionId matches or no sessionId specified
      if (!sessionId || assessment.sessionId === sessionId) {
        const migratedAssessment = {
          ...assessment,
          userId,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
        
        if (this.usePostgreSQL) {
          try {
            await Assessment.create(migratedAssessment);
          } catch (error) {
            console.error('Failed to migrate assessment to PostgreSQL:', error);
          }
        }
        
        // Move to main assessments in memory
        this.inMemoryDB.assessments.set(migratedAssessment.id, migratedAssessment);
        this.inMemoryDB.anonymousAssessments.delete(assessment.id);
        
        migratedAssessments.push(migratedAssessment);
      }
    }
    
    return migratedAssessments;
  }

  // Session Management for Anonymous Users
  createAnonymousSession() {
    const sessionId = 'anon_' + Date.now().toString() + Math.random().toString(36).substr(2, 9);
    return sessionId;
  }

  // Health Check
  async healthCheck() {
    if (this.usePostgreSQL) {
      try {
        await sequelize.authenticate();
        return { status: 'healthy', database: 'postgresql' };
      } catch (error) {
        return { status: 'unhealthy', database: 'postgresql', error: error.message };
      }
    }
    return { status: 'healthy', database: 'in-memory' };
  }
}

module.exports = new DataService();
