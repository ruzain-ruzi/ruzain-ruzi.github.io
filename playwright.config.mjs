import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests',
  outputDir:'.qa/test-results',
  timeout:30000,
  workers:2,
  reporter:[['list'],['json',{outputFile:'.qa/browser-results.json'}]],
  use:{ baseURL:'http://127.0.0.1:4173',browserName:process.env.PORTFOLIO_BROWSER||'chromium',...(process.env.PORTFOLIO_BROWSER?{}:{channel:'chrome'}),headless:true,viewport:{width:1440,height:1000},screenshot:'only-on-failure',trace:'retain-on-failure' },
  webServer:{ command:`"${process.execPath}" scripts/serve.mjs`,url:'http://127.0.0.1:4173',reuseExistingServer:true,timeout:20000 }
});
