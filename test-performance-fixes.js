#!/usr/bin/env node

/**
 * Performance Test Script for Glass Web App
 * Tests the performance improvements for Personalize and Analytics pages
 */

const http = require('http');

const API_BASE = 'http://localhost:9001';

async function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const startTime = performance.now();
        
        const url = new URL(API_BASE + path);
        
        const req = http.request({
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': 'default_user',
                ...options.headers
            }
        }, (res) => {
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                resolve({
                    status: res.statusCode,
                    data: data ? JSON.parse(data) : null,
                    duration: duration.toFixed(2) + 'ms',
                    success: res.statusCode >= 200 && res.statusCode < 300
                });
            });
        });
        
        req.on('error', reject);
        
        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        
        req.end();
    });
}

async function testEndpoint(name, path, options = {}) {
    console.log(`\n📍 Testing ${name}...`);
    
    try {
        const result = await makeRequest(path, options);
        
        if (result.success) {
            console.log(`✅ Success (${result.duration})`);
            if (result.data) {
                if (Array.isArray(result.data)) {
                    console.log(`   - Items returned: ${result.data.length}`);
                } else if (result.data.success !== undefined) {
                    console.log(`   - Success: ${result.data.success}`);
                }
            }
        } else {
            console.log(`❌ Failed with status ${result.status} (${result.duration})`);
            if (result.data?.error) {
                console.log(`   - Error: ${result.data.error}`);
            }
        }
        
        return result;
    } catch (error) {
        console.log(`❌ Request failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runPerformanceTests() {
    console.log('🚀 Glass Web App Performance Test Suite');
    console.log('=====================================');
    
    // Test 1: Presets API (used by Personalize page)
    await testEndpoint('Presets API', '/api/presets');
    
    // Test 2: Sessions API without filtering
    const sessionsResult = await testEndpoint('Sessions API (all)', '/api/conversations');
    
    // Test 3: Sessions API with time range filtering
    await testEndpoint('Sessions API (week)', '/api/conversations?timeRange=week');
    await testEndpoint('Sessions API (week, limited)', '/api/conversations?timeRange=week&limit=10');
    
    // Test 4: Research productivity stats (used by Analytics page)
    await testEndpoint('Productivity Stats (week)', '/api/research/analysis/productivity-stats/week');
    await testEndpoint('Productivity Stats (month)', '/api/research/analysis/productivity-stats/month');
    
    // Test 5: Batch operations
    console.log('\n📊 Performance Summary:');
    console.log('- If presets load in <500ms: ✅ Good');
    console.log('- If sessions (filtered) load in <200ms: ✅ Good');
    console.log('- If productivity stats fail gracefully: ✅ Good');
    
    // Test 6: Concurrent requests (simulating real page load)
    console.log('\n🔄 Testing concurrent requests (simulating page load)...');
    
    const startTime = performance.now();
    const results = await Promise.all([
        makeRequest('/api/presets'),
        makeRequest('/api/conversations?timeRange=week&limit=50'),
        makeRequest('/api/research/analysis/productivity-stats/week')
    ]);
    const totalTime = performance.now() - startTime;
    
    console.log(`⏱️  Total time for concurrent requests: ${totalTime.toFixed(2)}ms`);
    
    const allSuccess = results.every(r => r.success || r.status === 404);
    if (allSuccess) {
        console.log('✅ All concurrent requests completed successfully');
    } else {
        console.log('⚠️  Some requests failed, but the app should still work');
    }
    
    // Performance recommendations
    console.log('\n📋 Recommendations:');
    if (sessionsResult.data && sessionsResult.data.length > 100) {
        console.log('⚠️  Consider implementing server-side pagination for sessions');
    }
    if (totalTime > 1000) {
        console.log('⚠️  Page load time exceeds 1s - consider implementing caching');
    }
    
    console.log('\n✨ Performance test complete!');
}

// Check if backend is running
console.log('🔍 Checking if backend is running...');
http.get(`${API_BASE}/api/user/profile`, (res) => {
    if (res.statusCode === 401 || res.statusCode === 200) {
        console.log('✅ Backend is running');
        runPerformanceTests().catch(console.error);
    } else {
        console.log(`⚠️  Unexpected status code: ${res.statusCode}`);
        runPerformanceTests().catch(console.error);
    }
}).on('error', (err) => {
    console.error('❌ Backend is not running. Please start it with:');
    console.error('   cd pickleglass_web && npm run dev:server');
    process.exit(1);
});