import app from "../server";
import supertest from "supertest";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6IkZpcnN0IFVzZXIiLCJmaXJzdF9uYW1lIjpudWxsLCJsYXN0X25hbWUiOm51bGwsInBhc3N3b3JkIjoiJDJiJDEwJFZ3VWJvYjQ0UHlBOHVuejBFSGhncXVwRlpKLzFranZQSWtUWEszWE00Uno1LnRpNTQ1U2lHIn0sImlhdCI6MTY3NDIyMTkyMH0.jO71FVr0BCuusfihV6IGs5kk6UT2whrNng3f5Tb9Dnk";


describe("Test endpoint responses", (): void => {
  const request = supertest(app);
  it("gets the api endpoint successfully", async (): Promise<void> => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
  });
});

describe("User endpoint", () => {
    const request = supertest(app);
  it("gets the index api endpoint successfully", async (): Promise<void> => {
    const response = await request
      .get("/users")
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  });

  it("gets the create api endpoint successfully", async (): Promise<void> => {
    const response = await request
      .post("/users")
      .send({
        username: "daniel.ibeh@gmail.com",
        first_name: "Daniel",
        last_name: "Ibeh",
        password: "charity",
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  });

  it("gets the show api endpoint successfully", async (): Promise<void> => {
    const response = await request
      .get("/users/1")
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  });

  it("gets the edit api endpoint successfully", async (): Promise<void> => {
    const response = await request.put("/users/1").send({
      username: "daniel.ibeh@gmail.com",
      first_name: "Michael",
      last_name: "Ibeh",
      password: "charity",
    });
    expect(response.status).toBe(200);
  });

  it("gets the delete api endpoint successfully", async (): Promise<void> => {
    const response = await request.delete("/users/1");
    expect(response.status).toBe(200);
  });
});
