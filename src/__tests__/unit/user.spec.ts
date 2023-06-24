import supertest from "supertest";
import { app } from "../../index";
const request = supertest(app);
import { dbConnect, dbDisconnect } from "../config/mongoMemory";
import { testUser } from "../config/helper";
describe("TESTING THE USER ENDPOINT", () => {
  beforeAll(async () => {
    await dbConnect();
  });
  afterAll(async () => {
    await dbDisconnect();
  });
  // let userID: string;
  it("Should create a new user", async () => {
    await request
      .post("/api/v1/user/signup")
      // .set("user-agent", "PostmanRuntime/7.29.2")
      .send(testUser)
      .expect("Content-Type", /json/)
      .expect(201)
      .then((res) => {
        // userID = res.body.data._id;
        expect(res.body).toEqual(
          expect.objectContaining({
            message: "Signup successful",
            status: "success",
            // token: expect.any(String),
            data: expect.objectContaining({}),
          })
        );
      });
  });
  // it("Should log a user in", async () => {
  //   await request
  //     .post("/api/v1/user/login")
  //     .send({ user: testUser.username, password: testUser.password })
  //     .expect("Content-Type", /json/)
  //     .expect(200)
  //     .then((res) => {
  //       expect(res.body).toEqual(
  //         expect.objectContaining({
  //           message: "Login successful",
  //           status: "success",
  //         })
  //       );
  //     });
  // });
});
