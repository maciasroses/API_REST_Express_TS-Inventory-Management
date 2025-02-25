import { z } from "zod";
import validateSchema from "../../src/utils/validate-schema";

describe("validateSchema", () => {
  const schema1 = z.object({
    name: z.string(),
    age: z.number(),
  });

  const schemas = {
    action1: schema1,
  };

  it("It should return an empty object for valid data", () => {
    const validData = {
      name: "John Doe",
      age: 30,
    };

    const result = validateSchema(schemas, "action1", validData);
    expect(result).toEqual({});
  });

  it("It should return errors for invalid data", () => {
    const invalidData = {
      name: "John Doe",
      age: "invalid-age",
    };

    const result = validateSchema(schemas, "action1", invalidData);
    expect(result).toEqual({
      age: "Expected number, received string",
    });
  });

  it("It should throw an error if the action is invalid", () => {
    const invalidAction = "invalidAction";
    const validData = {
      name: "John Doe",
      age: 30,
    };

    expect(() =>
      validateSchema(schemas, invalidAction, validData)
    ).toThrowError("Invalid action: invalidAction");
  });
});
