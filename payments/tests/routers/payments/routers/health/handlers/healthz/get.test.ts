import request from 'supertest';
import { ApplicationResponseTypes } from '@msnr-ticketing-app/common';
import app from '../../../../../../../src/app';

const route = '/payments/health/healthz';

describe('Tests for the GET /payments/health/healthz endpoint.', () => {
  describe('Success cases', () => {
    it('Should return an APPLICATION_HEALTHY code when accessed,', async () => {
      const response = await request(app).get(route).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<undefined, undefined>;
      expect(applicationResponse.status).toBe(200);
      expect(applicationResponse.code).toBe('APPLICATION_HEALTHY');
    });
  });
});
