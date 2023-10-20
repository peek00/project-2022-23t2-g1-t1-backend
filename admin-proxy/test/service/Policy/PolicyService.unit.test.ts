import { PolicyService } from "../../../src/services/Policy/PolicyService";
import { DynamoDB } from "../../../src/modules/DatabaseProvider/DynamoDB";
import { Redis } from "../../../src/modules/CacheProvider/Redis";

const mockDynamoDB = {
  createTable: jest.fn(),
  deleteTable: jest.fn(),
  listTables: jest.fn(),
  findAll: jest.fn(),
  add: jest.fn(),
  updateBy: jest.fn(),
  deleteBy: jest.fn(),
};

const mockRedis = {
  get: jest.fn(),
  write: jest.fn(),
  remove: jest.fn(),
};

const mockPolicy = {
  endpoint: "/test",
  GET: ["superadmin", "admin"],
  POST: ["superadmin", "admin"],
  PUT: ["superadmin", "admin"],
  DELETE: ["superadmin", "admin"],
};

const defaultPolicy = {
  endpoint: "*",
  GET: ["superadmin", "admin"],
  POST: ["superadmin", "admin"],
  PUT: ["superadmin", "admin"],
  DELETE: ["superadmin", "admin"],
};

describe("PolicyService", () => {
  let policyService: PolicyService;

  beforeAll(() => {
    DynamoDB.getInstance = jest.fn().mockReturnValue(mockDynamoDB);
    Redis.getInstance = jest.fn().mockReturnValue(mockRedis);
    policyService = PolicyService.getInstance();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be a singleton', () => {
    const policyService2 = PolicyService.getInstance();
    expect(policyService).toBe(policyService2);
  });

  describe('tearDown', () => {
    beforeEach(() => {
      mockDynamoDB.listTables.mockReset();
      mockDynamoDB.deleteTable.mockReset();
    });
    it('should check for list of existing tables and delete policy table if it exists', async () => {
      mockDynamoDB.listTables = jest.fn().mockResolvedValue({ TableNames: ['policy'] });
      await PolicyService.tearDown();
      expect(mockDynamoDB.listTables).toHaveBeenCalled(); 
      expect(mockDynamoDB.deleteTable).toHaveBeenCalledWith('policy');
    });

    it('should not delete policy table if it doesnt exist', async () => {
      mockDynamoDB.listTables = jest.fn().mockResolvedValue({ TableNames: [] });
      await PolicyService.tearDown();
      expect(mockDynamoDB.listTables).toHaveBeenCalled();
      expect(mockDynamoDB.deleteTable).not.toHaveBeenCalled();
    });
  });

  describe('initialization', () => {
    beforeEach(() => {
      mockDynamoDB.createTable.mockReset();
      mockDynamoDB.listTables.mockReset();
      mockDynamoDB.findAll.mockReset();
      mockDynamoDB.add.mockReset();
      mockDynamoDB.deleteTable.mockReset();
    });

    it('if restart is false, will not tearDown first', async () => {
      PolicyService.tearDown = jest.fn();
      await PolicyService.initialize(false);
      expect(PolicyService.tearDown).not.toHaveBeenCalled();
    });

    it('if restart is true, should call tearDown first', async () => {
      PolicyService.tearDown = jest.fn();
      await PolicyService.initialize(true);
      expect(PolicyService.tearDown).toHaveBeenCalled();
    });

    it('should first check for list of existing tables and create policy table if it doesnt exist', async () => {
      mockDynamoDB.listTables = jest.fn().mockResolvedValue({ TableNames: [] });
      await PolicyService.initialize();
      expect(mockDynamoDB.listTables).toHaveBeenCalled();
      expect(mockDynamoDB.createTable).toHaveBeenCalledWith('policy', {
        KeySchema: [
          {
            AttributeName: "endpoint",
            KeyType: "HASH",
          }
        ],
        AttributeDefinitions: [
          {
            AttributeName: "endpoint",
            AttributeType: "S",
          }
        ],
      });
    });

    it('should not create policy table if it already exists', async () => {
      mockDynamoDB.listTables = jest.fn().mockResolvedValue({ TableNames: ['policy'] });
      await PolicyService.initialize();
      expect(mockDynamoDB.listTables).toHaveBeenCalled();
      expect(mockDynamoDB.createTable).not.toHaveBeenCalled();
    });

    it('should also findAll policies and add default policies if there are none', async () => {
      mockDynamoDB.listTables = jest.fn().mockResolvedValue({ TableNames: ['policy'] });
      mockDynamoDB.findAll = jest.fn().mockResolvedValue([]);
      await PolicyService.initialize();
      expect(mockDynamoDB.findAll).toHaveBeenCalled();
      expect(mockDynamoDB.add).toHaveBeenCalledWith("policy", {
        endpoint: "*",
        GET: ["superadmin", "admin"],
        POST: ["superadmin", "admin"],
        PUT: ["superadmin", "admin"],
        DELETE: ["superadmin", "admin"],
      });
      expect(mockDynamoDB.add).toHaveBeenCalledWith("policy", {
        endpoint: "/auth",
        GET: [],
        POST: [],
        PUT: [],
        DELETE: [],
      });
    });
  });

  describe('findAll', () => {
    it('should call dynamoDB findAll', async () => {
      mockDynamoDB.findAll = jest.fn().mockResolvedValue([]);
      await policyService.findAll();
      expect(mockDynamoDB.findAll).toHaveBeenCalledWith('policy', {});
    });
  });

  describe('add', () => {
    it('should call dynamoDB add and drop policy key in cache', async () => {
      mockDynamoDB.add = jest.fn().mockResolvedValue({});
      mockRedis.remove = jest.fn().mockResolvedValue({});
      await policyService.add(mockPolicy);
      expect(mockRedis.remove).toHaveBeenCalledWith('policies');
      expect(mockDynamoDB.add).toHaveBeenCalledWith('policy', mockPolicy);
    });
  });

  describe('update', () => {
    it('should call dynamoDB updateBy and drop policy key in cache', async () => {
      mockDynamoDB.updateBy = jest.fn().mockResolvedValue({});
      mockRedis.remove = jest.fn().mockResolvedValue({});
      await policyService.update(mockPolicy);
      expect(mockRedis.remove).toHaveBeenCalledWith('policies');
      expect(mockDynamoDB.updateBy).toHaveBeenCalledWith('policy', {
        Key: { endpoint: mockPolicy.endpoint },
        ExpressionAttributeNames: {
          '#GET': 'GET',
          '#POST': 'POST',
          '#PUT': 'PUT',
          '#DELETE': 'DELETE'
        },
        UpdateExpression: 'SET #GET = :GET, #POST = :POST, #PUT = :PUT, #DELETE = :DELETE',
        ExpressionAttributeValues: {
          ':GET': mockPolicy.GET,
          ':POST': mockPolicy.POST,
          ':PUT': mockPolicy.PUT,
          ':DELETE': mockPolicy.DELETE
        }
      });
    });

    it('should throw error if policy does not have endpoint', async () => {
      await expect(policyService.update({})).rejects.toThrowError('Nothing to update');
    });
  });

  describe('delete', () => {
    it('should call dynamoDB deleteBy and drop policy key in cache', async () => {
      mockDynamoDB.deleteBy = jest.fn().mockResolvedValue({});
      mockRedis.remove = jest.fn().mockResolvedValue({});
      await policyService.delete(mockPolicy);
      expect(mockRedis.remove).toHaveBeenCalledWith('policies');
      expect(mockDynamoDB.deleteBy).toHaveBeenCalledWith('policy', {
        Key: { endpoint: mockPolicy.endpoint }
      });
    });
  });

  describe('getAllPolicies', () => {
    beforeEach(() => {
      mockRedis.get.mockReset();
      mockDynamoDB.findAll.mockReset();
    });
    it('should read from redis and not make a db call if it exists', async () => {
      mockRedis.get = jest.fn().mockResolvedValue(JSON.stringify([mockPolicy]));
      const result = await policyService.getAllPolicies();
      expect(mockRedis.get).toHaveBeenCalledWith('policies');
      expect(result).toEqual([mockPolicy]);
      expect(mockDynamoDB.findAll).not.toHaveBeenCalled();
    })
    
    it('should read from db and write to redis if it does not exist', async () => {
      mockRedis.get = jest.fn().mockResolvedValue(null);
      mockDynamoDB.findAll = jest.fn().mockResolvedValue([mockPolicy]);
      mockRedis.write = jest.fn().mockResolvedValue({});
      const result = await policyService.getAllPolicies();
      expect(mockRedis.get).toHaveBeenCalledWith('policies');
      expect(mockDynamoDB.findAll).toHaveBeenCalledWith('policy', {});
      expect(mockRedis.write).toHaveBeenCalledWith('policies', JSON.stringify([mockPolicy]), -1);
      expect(result).toEqual([mockPolicy]);
    });

  });

  describe('getPolicy', () => {
    it('should call redis get and return exact policy if it exists', async () => {
      mockRedis.get = jest.fn().mockResolvedValue(JSON.stringify([mockPolicy,defaultPolicy]));
      const result = await policyService.getPolicy('/test', 'GET');
      expect(mockRedis.get).toHaveBeenCalledWith('policies');
      expect(result).toEqual(mockPolicy.GET);
    });

    it('should call redis get and return nearest parent policy if exact doesn\'t exists', async () => {
      mockRedis.get = jest.fn().mockResolvedValue(JSON.stringify([mockPolicy,defaultPolicy]));
      const result = await policyService.getPolicy('/test/123', 'GET');
      expect(mockRedis.get).toHaveBeenCalledWith('policies');
      expect(result).toEqual(mockPolicy.GET);
    });

    it('should call redis get and return default policy if exact policy does not exist', async () => {
      mockRedis.get = jest.fn().mockResolvedValue(JSON.stringify([defaultPolicy]));
      const result = await policyService.getPolicy('/random', 'GET');
      expect(mockRedis.get).toHaveBeenCalledWith('policies');
      expect(result).toEqual(defaultPolicy.GET);
    });

  });
});

