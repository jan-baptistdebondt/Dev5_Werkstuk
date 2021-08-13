const helpers = require("../utils/helpers");

describe("does generateUUID return a UUID", () => {
  test("test if generateUUID() works", () => {
    expect(Helpers.generateUUID()).not.toBeUndefined();
  });

});