/**
 * Server entry point.
 */

import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  console.log(`Loan Repayment API running on http://localhost:${env.port}`);
  console.log(`Health check: http://localhost:${env.port}/health`);
  console.log(`CORS allowed origin: ${env.frontendUrl}`);
});
