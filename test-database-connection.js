#!/usr/bin/env node

/**
 * Database Connection Test
 * Tests if SQLite database can be initialized properly
 */

const path = require('path');

// Mock Electron for testing
require.cache[require.resolve('electron')] = {
  exports: {
    app: {
      getPath: (name) => {
        if (name === 'userData') {
          return path.join(__dirname, 'test-data');
        }
        return '/tmp';
      },
      getAppPath: () => __dirname,
      isPackaged: false
    }
  }
};

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test SQLite Client
    const SQLiteClient = require('./src/features/common/services/sqliteClient');
    console.log('✅ SQLiteClient loaded');
    
    // Test database initialization
    const databaseInitializer = require('./src/features/common/services/databaseInitializer');
    console.log('✅ DatabaseInitializer loaded');
    
    // Initialize database
    await databaseInitializer.initialize();
    console.log('✅ Database initialized');
    
    // Test activity repository
    const activityRepo = require('./src/features/activity/repositories');
    console.log('✅ Activity repository loaded');
    
    await activityRepo.initialize();
    console.log('✅ Activity repository initialized');
    
    // Test creating an activity
    const testActivity = {
      title: 'Test Activity',
      category: 'focus',
      start_time: new Date().toISOString(),
      end_time: null,
      duration_ms: 0,
      status: 'active',
      metadata: { test: true }
    };
    
    const created = await activityRepo.createActivity(testActivity);
    console.log('✅ Test activity created:', created.id);
    
    // Test retrieving activities
    const activities = await activityRepo.getActivitiesBetweenDates(
      new Date().toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    );
    console.log('✅ Activities retrieved:', activities.length);
    
    console.log('🎉 Database connection test PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ Database connection test FAILED:', error.message);
    console.error(error.stack);
    return false;
  }
}

if (require.main === module) {
  testDatabaseConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testDatabaseConnection };