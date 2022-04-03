import request from 'supertest';
import app from '../../../../../../../src/app';
import { ApplicationResponseTypes } from '../../../../../../../src/lib/types/objects/application-response';

const route = '/auth/health/healthz';

describe('Tests for the GET /auth/health/healthz endpoint.', () => {
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
