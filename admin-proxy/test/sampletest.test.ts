interface IUser {
  name: string;
  age: number;
}

describe("Sample Test", () => {
  it("should test that true === true", () => {
    expect(true).toBe(true);
  });
});

describe("User", () => {
  it("should be able to create a user", () => {
    const user: IUser = { name: "John", age: 25 };
    expect(user.name).toBe("John");
    expect(user.age).toBe(25);
  });
});
