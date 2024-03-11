import request from "supertest";
import { app } from ".";

test("GET /", async () => {
  const response = await request(app.callback()).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Hello World!");
});
