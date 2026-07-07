/**
 * JWT payload stored in auth token after verification.
 */

export interface JwtPayload {
  sub: string;
  customerId: string;
  mobile: string;
  sessionId: string;
}
