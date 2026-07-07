/**
 * Application route path constants.
 * Centralizes URL definitions for React Router navigation.
 */

export const ROUTES = {
  HOME: '/',
  VERIFICATION: '/verification',
  LOAN_DETAILS: '/loan-details',
  REVIEW: '/review',
  GATEWAY: '/gateway',
  PAYMENT: '/payment',
  ONEPAY: '/onepay',
  PROCESSING: '/processing',
  PAYMENT_SUCCESS: '/payment-success',
  PAYMENT_HISTORY: '/payment-history',
  PAYMENT_FAILURE: '/payment-failure',
  RETRYING: '/retrying',
  FAILURE_RECEIPT: '/failure-receipt',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
