import { test, expect, type Page } from '@playwright/test';

// Increase timeout for these tests since they involve 3D rendering
test.setTimeout(60000);

test.describe('Property Blinking Debug', () => {
  let consoleLogs: Array<{ type: string; text: string; timestamp: number }> = [];
  let renderCount = 0;
  let renderTimestamps: number[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset logs for each test
    consoleLogs = [];
    renderCount = 0;
    renderTimestamps = [];

    // Capture all console messages
    page.on('console', (msg) => {
      const text = msg.text();
      const timestamp = Date.now();

      consoleLogs.push({
        type: msg.type(),
        text,
        timestamp
      });

      // Count PropertyViz3D renders
      if (text.includes('[PropertyViz3D]') && text.includes('RENDER')) {
        renderCount++;
        renderTimestamps.push(timestamp);
      }

      // Print important logs immediately
      if (text.includes('[PropertyViz3D]') || text.includes('areEqual')) {
        console.log(`[${new Date(timestamp).toISOString()}] ${text}`);
      }
    });

    // Navigate to the app
    await page.goto('http://localhost:3000');

    // Wait for the app to load (use domcontentloaded instead of networkidle for faster tests)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Give extra time for 3D scene to initialize
  });

  test('should detect re-renders during camera pan', async ({ page }) => {
    console.log('\n=== Starting Camera Pan Test ===\n');

    // Clear initial render logs
    const initialRenderCount = renderCount;
    consoleLogs = [];
    renderTimestamps = [];

    // Find the canvas element
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Get canvas bounding box
    const box = await canvas.boundingBox();
    if (!box) {
      throw new Error('Canvas not found');
    }

    console.log('Canvas found, starting camera pan simulation...\n');

    // Simulate camera pan with mouse drag
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = startX + 200; // Pan 200px to the right
    const endY = startY;

    // Start the drag
    await page.mouse.move(startX, startY);
    await page.mouse.down();

    // Record start time
    const panStartTime = Date.now();

    // Perform the pan slowly over 3 seconds (60 steps @ 50ms each)
    const steps = 60;
    const duration = 3000;
    const stepDuration = duration / steps;

    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;

      await page.mouse.move(currentX, currentY);
      await page.waitForTimeout(stepDuration);
    }

    // End the drag
    await page.mouse.up();
    const panEndTime = Date.now();

    console.log(`\nCamera pan completed (${panEndTime - panStartTime}ms)\n`);

    // Wait a bit more to capture any trailing renders
    await page.waitForTimeout(1000);

    // Analyze results
    console.log('\n=== Test Results ===\n');
    console.log(`Total renders during pan: ${renderCount}`);
    console.log(`Initial render count: ${initialRenderCount}`);
    console.log(`New renders: ${renderCount - initialRenderCount}`);

    if (renderTimestamps.length > 1) {
      // Calculate render frequency
      const panDuration = panEndTime - panStartTime;
      const rendersPerSecond = (renderTimestamps.length / panDuration) * 1000;
      console.log(`Renders per second during pan: ${rendersPerSecond.toFixed(2)}`);

      // Calculate time between renders
      const intervals = [];
      for (let i = 1; i < renderTimestamps.length; i++) {
        intervals.push(renderTimestamps[i] - renderTimestamps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      console.log(`Average time between renders: ${avgInterval.toFixed(2)}ms`);
    }

    // Check for areEqual logs
    const areEqualLogs = consoleLogs.filter(log => log.text.includes('areEqual'));
    console.log(`\nareEqual logs found: ${areEqualLogs.length}`);

    if (areEqualLogs.length > 0) {
      console.log('\nSample areEqual logs:');
      areEqualLogs.slice(0, 5).forEach(log => {
        console.log(`  ${log.text}`);
      });
    }

    // Check for specific prop change indicators
    const propChangeLogs = consoleLogs.filter(log =>
      log.text.includes('Changed') ||
      log.text.includes('different') ||
      log.text.includes('propertyDimensionsChanged') ||
      log.text.includes('domainDimensionsChanged')
    );

    if (propChangeLogs.length > 0) {
      console.log('\nProp change indicators:');
      propChangeLogs.slice(0, 10).forEach(log => {
        console.log(`  ${log.text}`);
      });
    }

    // Print summary
    console.log('\n=== Analysis ===\n');

    if (renderCount - initialRenderCount === 0) {
      console.log('✓ GOOD: No re-renders detected during camera pan');
    } else if (renderCount - initialRenderCount < 5) {
      console.log('⚠ MODERATE: Few re-renders detected, might be acceptable');
    } else {
      console.log('✗ BAD: Many re-renders detected during camera pan');
      console.log('  This indicates the blinking issue is present');
    }

    // Save full logs to file for detailed analysis
    const fs = require('fs');
    const logOutput = {
      summary: {
        totalRenders: renderCount,
        initialRenders: initialRenderCount,
        newRenders: renderCount - initialRenderCount,
        panDuration: panEndTime - panStartTime,
        renderTimestamps
      },
      consoleLogs: consoleLogs.map(log => ({
        ...log,
        relativeTime: log.timestamp - panStartTime
      }))
    };

    fs.writeFileSync(
      'tests/debug-blinking-results.json',
      JSON.stringify(logOutput, null, 2)
    );

    console.log('\nFull logs saved to: tests/debug-blinking-results.json\n');
  });

  test('should detect re-renders when camera is stationary', async ({ page }) => {
    console.log('\n=== Testing Stationary Camera ===\n');

    // Clear logs
    const beforeCount = renderCount;

    // Wait 3 seconds without any interaction
    await page.waitForTimeout(3000);

    const afterCount = renderCount;
    const stationaryRenders = afterCount - beforeCount;

    console.log(`\nRenders during 3s stationary: ${stationaryRenders}`);

    if (stationaryRenders === 0) {
      console.log('✓ GOOD: No re-renders when camera is stationary');
    } else {
      console.log('✗ BAD: Re-renders occurring even without camera movement');
      console.log('  This suggests continuous re-rendering, not just pan-related');
    }
  });
});
