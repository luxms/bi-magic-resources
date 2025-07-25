// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

const CI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 6, // '50%',

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html', { outputFolder: './result/report', open: 'never' }]],
  preserveOutput: 'failures-only',
  outputDir: './result/out',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 120 * 1000,

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // Убедитесь, что эти параметры есть
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // trace: 'retain-on-failure',
    // video: {
    //   mode: 'retain-on-failure',
    //   size: {
    //     width: 1280,
    //     height: 720,
    //   },
    // },
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
    contextOptions: {
      reducedMotion: 'reduce',
    },
    launchOptions: {
      ignoreDefaultArgs: ['--hide-scrollbars'],
      args: ['--disable-spell-checking', 
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'],
    },
    actionTimeout: 10 * 1000,
  },
  expect: {
    timeout: 15 * 1000,
    toHaveScreenshot: {
      threshold: 0.01,
      maxDiffPixels: 1,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        viewport: {
          width: 1680,
          height: 1050,
        },
      },
    },
    {
      name: 'chromium-dark',

      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        viewport: {
          width: 1680,
          height: 1050,
        },
      },
    }]
});
