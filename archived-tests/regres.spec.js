const { expect, test } = require("@playwright/test");
const reqresBaseUrl = "https://reqres.in";
var userId;

test("listUsers", async ({ request }) => {
  const response = await request.get(reqresBaseUrl + "/api/users?page=2");
  expect(response.status()).toBe(200);
});

test("createUser", async ({ request }) => {
  const response = await request.post(reqresBaseUrl + "/api/users", {
    data: { name: "morpheus", job: "leader" },
    headers: { Accept: "applications/json" },
  });
  expect(response.status()).toBe(201);
  const res = await response.json();
  userId = res.id;
});

test("updateUser", async ({ request }) => {
  const response = await request.post(reqresBaseUrl + "/api/users/" + userId, {
    data: { name: "morpheus", job: "leader" },
    headers: { Accept: "applications/json" },
  });
  expect(response.status()).toBe(201);
});

test("deleteUser", async ({ request }) => {
  const response = await request.delete(reqresBaseUrl + "/api/users/" + userId);
  expect(response.status()).toBe(204);
});
