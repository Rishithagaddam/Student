const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const app = require("../server");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("student endpoints create, read, update, and delete a student", async () => {
  const student = { id: 987654, name: "Test Student" };

  const createResponse = await fetch(`${baseUrl}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  assert.equal(createResponse.status, 201);
  assert.deepEqual(await createResponse.json(), student);

  const listResponse = await fetch(`${baseUrl}/students`);
  assert.equal(listResponse.status, 200);
  assert.ok((await listResponse.json()).some((item) => item.id === student.id));

  const updateResponse = await fetch(`${baseUrl}/students/${student.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Updated Student" }),
  });
  assert.equal(updateResponse.status, 200);
  assert.deepEqual(await updateResponse.json(), {
    id: student.id,
    name: "Updated Student",
  });

  const deleteResponse = await fetch(`${baseUrl}/students/${student.id}`, {
    method: "DELETE",
  });
  assert.equal(deleteResponse.status, 200);

  const finalListResponse = await fetch(`${baseUrl}/students`);
  assert.ok(
    !(await finalListResponse.json()).some((item) => item.id === student.id),
  );
});

test("updating a missing student returns 404", async () => {
  const response = await fetch(`${baseUrl}/students/987655`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Missing Student" }),
  });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { message: "Student not found" });
});
