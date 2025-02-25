import sendResponse from "../../src/utils/send-response";

describe("sendResponse", () => {
  let res: any;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("It should call res.status and res.send with the correct parameters", () => {
    const statusCode = 200;
    const responseBody = {
      status: "success",
      message: "Test message",
      data: { key: "value" },
      pagination: {},
      errors: {},
    };

    sendResponse(res, statusCode, {
      data: { key: "value" },
      message: "Test message",
    });

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.send).toHaveBeenCalledWith(responseBody);
  });

  it("It should use default values", () => {
    const statusCode = 400;

    sendResponse(res, statusCode, {});

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      message: "",
      data: {},
      pagination: {},
      errors: {},
    });
  });
});
