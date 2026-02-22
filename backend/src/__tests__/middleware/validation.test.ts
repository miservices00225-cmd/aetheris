/**
 * Validation middleware tests
 * Context7 patterns: Jest fixtures, Supertest async/await
 * 
 * Tests:
 * - Valid payload passes validation
 * - Invalid payload returns 422 with details array
 * - Error details include field paths for form mapping
 */

import request from 'supertest';
import { app } from '../../server';
import { authHeader, generateTestJWT } from '../helpers';
import { VALID_ACCOUNT_PAYLOAD, INVALID_ACCOUNT_PAYLOAD } from '../fixtures';

describe('Validation Middleware', () => {
  const token = generateTestJWT();
  const headers = authHeader(token);

  describe('Schema validation', () => {
    it('should accept valid payload', async () => {
      const response = await request(app)
        .post('/api/v1/accounts')
        .set(headers)
        .send(VALID_ACCOUNT_PAYLOAD)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.account_name).toBe(VALID_ACCOUNT_PAYLOAD.account_name);
    });

    it('should reject invalid payload with 422', async () => {
      const response = await request(app)
        .post('/api/v1/accounts')
        .set(headers)
        .send(INVALID_ACCOUNT_PAYLOAD)
        .expect(422);

      expect(response.status).toBe(422);
    });

    it('should include details array in 422 response', async () => {
      const response = await request(app)
        .post('/api/v1/accounts')
        .set(headers)
        .send(INVALID_ACCOUNT_PAYLOAD)
        .expect(422);

      // Details array for form field mapping
      expect(response.body.details).toBeDefined();
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should include field paths in error details', async () => {
      const response = await request(app)
        .post('/api/v1/accounts')
        .set(headers)
        .send(INVALID_ACCOUNT_PAYLOAD)
        .expect(422);

      // Each detail should have path array for nested field mapping
      const invalidTypeError = response.body.details.find((d: any) =>
        d.path?.includes('account_type')
      );
      expect(invalidTypeError).toBeDefined();
      expect(invalidTypeError.path).toEqual(['account_type']);
      expect(invalidTypeError.message).toBeDefined();
    });
  });

  describe('Missing required fields', () => {
    it('should reject missing account_name', async () => {
      const payload = { ...VALID_ACCOUNT_PAYLOAD };
      delete (payload as any).account_name;

      const response = await request(app)
        .post('/api/v1/accounts')
        .set(headers)
        .send(payload)
        .expect(422);

      expect(response.body.details).toBeDefined();
      const nameError = response.body.details.find((d: any) =>
        d.path?.includes('account_name')
      );
      expect(nameError).toBeDefined();
    });

    it('should reject missing account_type', async () => {
      const payload = { ...VALID_ACCOUNT_PAYLOAD };
      delete (payload as any).account_type;

      const response = await request(app)
        .post('/api/v1/accounts')
        .set(headers)
        .send(payload)
        .expect(422);

      const typeError = response.body.details.find((d: any) =>
        d.path?.includes('account_type')
      );
      expect(typeError).toBeDefined();
    });
  });

  describe('Type coercion and validation', () => {
    it('should reject non-numeric leverage', async () => {
      const payload = {
        ...VALID_ACCOUNT_PAYLOAD,
        leverage: 'not-a-number',
      };

      await request(app)
        .post('/api/v1/accounts')
        .set(headers)
        .send(payload)
        .expect(422);
    });

    it('should reject invalid enum values', async () => {
      const payload = {
        ...VALID_ACCOUNT_PAYLOAD,
        account_type: 'invalid_type',
      };

      const response = await request(app)
        .post('/api/v1/accounts')
        .set(headers)
        .send(payload)
        .expect(422);

      const typeError = response.body.details.find((d: any) =>
        d.path?.includes('account_type')
      );
      expect(typeError).toBeDefined();
    });
  });
});
