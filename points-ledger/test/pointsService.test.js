const { getPointsBalance, getAllAccounts, pointsAccExist, updatePoints, createAccount, deleteAccount } = require("../queries/query");
const {Redis} = require("../modules/CacheProvider/Redis");
const CacheProvider = Redis.getInstance();

const mockRedis = {
    get: jest.fn(),
    write: jest.fn(),
    remove: jest.fn(),
  };
// Mock the CacheProvider methods
jest.mock("../modules/CacheProvider/Redis", () => ({
  getInstance: jest.fn().mockReturnValue({
    get: jest.fn(),
    write: jest.fn()
  })
}));

describe("getAllAccounts", () => {
  it("should fetch all accounts for a user from cache if available", async () => {
    const mockUserId = "user123";
    const mockResponse = [{ id: "account1", balance: 100 }];

    require("../modules/CacheProvider/Redis").getInstance().get.mockResolvedValueOnce(JSON.stringify(mockResponse));

    const result = await getAllAccounts(mockUserId);
    expect(result).toEqual(mockResponse);
  });

  // ...more tests e.g., for DynamoDB fetch if cache is empty, cache writing, etc.
});
