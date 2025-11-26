// src/utils/response.util.ts
import { ApiResponse } from '../common/dto/api-response.dto';

export const ok = <T = any>(
  message: string,
  data?: T,
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});
