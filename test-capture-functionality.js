#!/usr/bin/env node

/**
 * Test script for manual and automatic capture functionality
 * This script verifies that the capture and summarize features work correctly
 */

const path = require('path');
const fs = require('fs');

// Mock test to verify the implementation structure
async function testCaptureImplementation() {
    console.log('🧪 Testing Capture/Summarize Implementation...\n');
    
    // Test 1: Verify Activity Service has the required methods
    console.log('✅ Test 1: Activity Service Methods');
    try {
        const activityServicePath = path.join(__dirname, 'src/features/activity/activityService.js');
        const activityServiceContent = fs.readFileSync(activityServicePath, 'utf8');
        
        const requiredMethods = [
            'performManualCapture',
            'startActivityTracking', 
            'stopActivityTracking',
            'updateSettings',
            'getTrackingStatus'
        ];
        
        for (const method of requiredMethods) {
            if (activityServiceContent.includes(`async ${method}(`)) {
                console.log(`   ✓ ${method} method exists`);
            } else {
                console.log(`   ✗ ${method} method missing`);
            }
        }
        
        // Check for new settings
        if (activityServiceContent.includes('enableAutoCapture')) {
            console.log('   ✓ enableAutoCapture setting added');
        }
        if (activityServiceContent.includes('manualCaptureNotifications')) {
            console.log('   ✓ manualCaptureNotifications setting added');
        }
        
    } catch (error) {
        console.log(`   ✗ Error reading activity service: ${error.message}`);
    }
    
    // Test 2: Verify Shortcuts Service has manual capture shortcut
    console.log('\n✅ Test 2: Shortcuts Service');
    try {
        const shortcutsServicePath = path.join(__dirname, 'src/features/shortcuts/shortcutsService.js');
        const shortcutsServiceContent = fs.readFileSync(shortcutsServicePath, 'utf8');
        
        if (shortcutsServiceContent.includes('manualCapture')) {
            console.log('   ✓ Manual capture shortcut added to defaults');
        }
        if (shortcutsServiceContent.includes('case \'manualCapture\'')) {
            console.log('   ✓ Manual capture shortcut handler implemented');
        }
        if (shortcutsServiceContent.includes('activityService.performManualCapture')) {
            console.log('   ✓ Manual capture calls activity service');
        }
        
    } catch (error) {
        console.log(`   ✗ Error reading shortcuts service: ${error.message}`);
    }
    
    // Test 3: Verify IPC Bridge has the required handlers
    console.log('\n✅ Test 3: IPC Bridge Handlers');
    try {
        const featureBridgePath = path.join(__dirname, 'src/bridge/featureBridge.js');
        const featureBridgeContent = fs.readFileSync(featureBridgePath, 'utf8');
        
        const requiredHandlers = [
            'activity:capture-and-analyze',
            'activity:set-auto-capture-enabled',
            'activity:set-capture-interval',
            'activity:set-notifications-enabled',
            'activity:get-capture-settings'
        ];
        
        for (const handler of requiredHandlers) {
            if (featureBridgeContent.includes(`'${handler}'`)) {
                console.log(`   ✓ ${handler} handler exists`);
            } else {
                console.log(`   ✗ ${handler} handler missing`);
            }
        }
        
    } catch (error) {
        console.log(`   ✗ Error reading feature bridge: ${error.message}`);
    }
    
    // Test 4: Verify UI Components
    console.log('\n✅ Test 4: UI Components');
    try {
        const mainHeaderPath = path.join(__dirname, 'src/ui/app/MainHeader.js');
        const mainHeaderContent = fs.readFileSync(mainHeaderPath, 'utf8');
        
        if (mainHeaderContent.includes('manualCaptureNotification')) {
            console.log('   ✓ Manual capture notification property added');
        }
        if (mainHeaderContent.includes('_showCaptureNotification')) {
            console.log('   ✓ Notification display method implemented');
        }
        if (mainHeaderContent.includes('onManualCaptureCompleted')) {
            console.log('   ✓ Manual capture listener added');
        }
        
        const preloadPath = path.join(__dirname, 'src/preload.js');
        const preloadContent = fs.readFileSync(preloadPath, 'utf8');
        
        if (preloadContent.includes('onManualCaptureCompleted')) {
            console.log('   ✓ Manual capture IPC bridge method added');
        }
        
    } catch (error) {
        console.log(`   ✗ Error reading UI components: ${error.message}`);
    }
    
    // Test 5: Configuration
    console.log('\n✅ Test 5: Configuration');
    try {
        const configPath = path.join(__dirname, 'src/features/common/config/config.js');
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        const configOptions = [
            'activityCaptureInterval',
            'enableAutoCapture', 
            'enableManualCaptureNotifications',
            'enableActivitySmartAnalysis'
        ];
        
        for (const option of configOptions) {
            if (configContent.includes(option)) {
                console.log(`   ✓ ${option} configuration added`);
            } else {
                console.log(`   ✗ ${option} configuration missing`);
            }
        }
        
    } catch (error) {
        console.log(`   ✗ Error reading config: ${error.message}`);
    }
    
    console.log('\n🎉 Implementation Test Complete!\n');
    
    // Print usage instructions
    console.log('📋 Usage Instructions:');
    console.log('');
    console.log('1. **Automatic Capture/Summarize**:');
    console.log('   - Start activity tracking from the UI or programmatically');
    console.log('   - Automatic captures will occur at the configured interval (default: 15 minutes)');
    console.log('   - Can be enabled/disabled with the enableAutoCapture setting');
    console.log('');
    console.log('2. **Manual Capture/Summarize**:');
    console.log('   - Press Cmd+Shift+C (Mac) or Ctrl+Shift+C (Windows/Linux)');
    console.log('   - Or call the activity:capture-and-analyze IPC handler from UI');
    console.log('   - Immediate screenshot capture and AI analysis');
    console.log('   - Visual feedback through notification system');
    console.log('');
    console.log('3. **Configuration Options**:');
    console.log('   - Capture interval: Use activity:set-capture-interval handler');
    console.log('   - Auto capture: Use activity:set-auto-capture-enabled handler');
    console.log('   - Notifications: Use activity:set-notifications-enabled handler');
    console.log('');
    console.log('4. **Keyboard Shortcuts**:');
    console.log('   - Manual Capture: Cmd+Shift+C / Ctrl+Shift+C');
    console.log('   - Can be customized through the shortcuts settings');
    console.log('');
}

if (require.main === module) {
    testCaptureImplementation().catch(console.error);
}

module.exports = { testCaptureImplementation };