import type { Response } from 'express';

type SuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

type ErrorResponse = {
  success: false;
  data: null;
  message: string;
  details?: unknown;
};

export const ok = <T>(res: Response, data: T, message = 'OK') =>
  res.status(200).json({ success: true, data, message } as SuccessResponse<T>);

export const created = <T>(res: Response, data: T, message = 'Created') =>
  res.status(201).json({ success: true, data, message } as SuccessResponse<T>);

export const noContent = (res: Response) => res.status(204).send();

export const error = (res: Response, statusCode: number, message: string, details?: unknown) =>
  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    ...(details ? { details } : {}),
  } as ErrorResponse);

