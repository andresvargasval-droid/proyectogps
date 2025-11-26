// src/common/utils/response.util.ts
import { ApiResponse } from '../dto/api-response.dto';

export const ok = <T = any>(
  message: string,
  data?: T,
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});
