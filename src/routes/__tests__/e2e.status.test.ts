import app from "../../app";
import supertest from "supertest";

test("GET /api/status 200", async () => {
  const expectedStatus = { status: "running" };

  await supertest(app)
    .get("/api/status")
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(response.text).toEqual(JSON.stringify(expectedStatus));
    });
});
