import { UserStore } from "../models/user";

describe("User Model", () => {
  const store = new UserStore();
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a update method", () => {
    expect(store.edit).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("create method should add a user", async () => {
    const result = await store.create({
      id: 2,
      username: "daniel.ibeh@gmail.com",
      first_name: "Daniel",
      last_name: "Ibeh",
      password: "charity",
    });
    expect(result).toBeDefined();
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result.length).toEqual(1);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(2);
    expect(result.username).toEqual("daniel.ibeh@gmail.com");
  });

  it("delete method should remove the user", async () => {
    await store.delete(2);
    const result = await store.index();

    expect(result).toEqual([]);
  });
});
