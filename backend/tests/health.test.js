import request from "supertest";
import app from "../app.js";

describe("Health route", () => {
  it("should return server running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Server is running!");
  });
});