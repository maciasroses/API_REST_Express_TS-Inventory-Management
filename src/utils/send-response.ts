import { Response } from "express";

export default function sendResponse(
  res: Response,
  statusCode: number,
  { data = {}, status = "success", message = "", errors = {}, pagination = {} }
) {
  res.status(statusCode).send({
    status,
    message,
    data,
    pagination,
    errors,
  });
}
