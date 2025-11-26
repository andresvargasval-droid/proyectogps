// src/common/constants/messages.ts

export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Usuario registrado correctamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
    REFRESH_SUCCESS: 'Token renovado correctamente',
    PROFILE_SUCCESS: 'Perfil obtenido correctamente',

    INVALID_CREDENTIALS: 'Credenciales inválidas',
    USER_NOT_FOUND: 'Usuario no encontrado',
    USER_ALREADY_EXISTS: 'Ya existe un usuario con este email',
    UNAUTHORIZED: 'No autorizado',
  },

  VEHICLES: {
    CREATE_SUCCESS: 'Vehículo creado correctamente',
    LIST_SUCCESS: 'Vehículos obtenidos correctamente',
    ASSIGN_DEVICE_SUCCESS: 'Dispositivo asignado correctamente',
    UNASSIGN_DEVICE_SUCCESS: 'Dispositivo desasignado correctamente',

    NOT_FOUND: 'Vehículo no encontrado',
    ALREADY_HAS_DEVICE: 'Este vehículo ya tiene un dispositivo asignado',
  },

  DEVICES: {
    CREATE_SUCCESS: 'Dispositivo registrado correctamente',
    LIST_SUCCESS: 'Dispositivos obtenidos correctamente',
    APPROVE_SUCCESS: 'Dispositivo aprobado correctamente',
    REJECT_SUCCESS: 'Dispositivo rechazado correctamente',

    NOT_FOUND: 'Dispositivo no encontrado',
    NOT_APPROVED: 'El dispositivo aún no está aprobado',
    ALREADY_ASSIGNED: 'El dispositivo ya está asignado a un vehículo',
    INVALID_STATUS: 'El estado del dispositivo no es válido para esta operación',
  },

  COMMON: {
    FORBIDDEN: 'No tienes permisos para realizar esta acción',
    VALIDATION_ERROR: 'Hay errores de validación en los datos enviados',
    INTERNAL_ERROR: 'Ocurrió un error interno en el servidor',
  },
};
