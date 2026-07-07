/**
 * Client-side validation helpers for identity verification fields.
 */

import { MOBILE_REGEX } from './constants';
import type { InputState } from '@/types';

export function validateMobile(value: string): { state: InputState; error: string } {
  if (!value) return { state: 'default', error: '' };
  if (!MOBILE_REGEX.test(value)) return { state: 'error', error: 'Enter a valid 10-digit Indian mobile number' };
  return { state: 'success', error: '' };
}

export function validateCard(value: string): { state: InputState; error: string } {
  if (!value) return { state: 'default', error: '' };
  if (!/^\d{0,4}$/.test(value)) return { state: 'error', error: 'Only digits allowed' };
  if (value.length < 4) return { state: 'error', error: 'Enter exactly 4 digits' };
  return { state: 'success', error: '' };
}
