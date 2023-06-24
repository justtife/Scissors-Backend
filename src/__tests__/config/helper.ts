import { faker } from "@faker-js/faker";
export const testUser = {
  email: faker.internet.email,
  firstname: faker.person.firstName,
  lastname: faker.person.lastName,
  username: faker.person.middleName,
  sex: faker.person.sex,
  nationality: faker.location.country,
  password: "testing@1234",
  repeat_password: "testing@1234",
};
