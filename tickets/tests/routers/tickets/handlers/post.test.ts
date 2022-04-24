import request from 'supertest';
import app from '../../../../src/app';

const route = '/tickets';

describe('Tests for the POST /tickets endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /tickets for POST requests.', async () => {});
    it('Should persist a new ticket if all parameters are valid', async () => {});
  });

  describe('Handler logic errors', () => {
    it('Should deny access if user is not signed in.', async () => {});
    it('Should return a request validation error if an invalid title is provided.', async () => {});
    it('Should return a request validation error if an invalid price is provided.', async () => {});
  });
});
