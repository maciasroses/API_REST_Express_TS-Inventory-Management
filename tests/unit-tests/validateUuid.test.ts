import validateUuid from "../../src/utils/uuid-validator";

describe("validateUuid", () => {
  it("It should return true for a valid UUID", () => {
    const validUuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    expect(validateUuid(validUuid)).toBe(true);
  });

  it("It should return false for an invalid UUID", () => {
    const invalidUuid = "invalid-uuid";
    expect(validateUuid(invalidUuid)).toBe(false);
  });
});
