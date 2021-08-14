const helpers = require("../utils/helpers");

describe("does generateUUID return a UUID", () => {
  test("test if generateUUID() works", () => {
    expect(helpers.generateUUID()).not.toBeUndefined();
  });

});