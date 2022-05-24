global.console = {
  ...console,
  log: jest.fn(),
};

jest.mock('../src/lib/objects/nats/stan-singleton');
jest.mock('../src/lib/bull/queues/expiration-queue/index');

beforeAll(async () => {});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {});
