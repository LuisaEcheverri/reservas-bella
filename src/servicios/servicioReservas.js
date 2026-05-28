// src/servicios/servicioReservas.js
//
// Capa de servicios: centraliza TODAS las llamadas a la API de reservas.
//
// ¿Por qué separar los servicios?
//   Si el día de mañana cambias la URL base o el cliente HTTP,
//   solo modificas ESTE archivo. Los componentes no saben de
//   dónde vienen los datos.
//
// Usamos axios porque:
//   - Maneja automáticamente JSON
//   - Interceptores centralizados de errores
//   - Más legible que fetch para múltiples métodos HTTP

import axios from 'axios'

// ─── URL base de la API ────────────────────────────────────────────────────
// Reemplaza con tu URL real de MockAPI
const URL_BASE = 'https://TU_ID.mockapi.io/api/v1'

// ─── Instancia pre-configurada de axios ───────────────────────────────────
const clienteApi = axios.create({
  baseURL: URL_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Interceptor de errores ────────────────────────────────────────────────
// Se ejecuta para TODA respuesta. Si hay error, lo formatea uniformemente.
clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const mensaje =
      error.response?.data?.message ||
      error.message ||
      'Error desconocido'
    return Promise.reject(new Error(mensaje))
  }
)

// ─── Funciones CRUD ────────────────────────────────────────────────────────

/**
 * GET /reservas — Obtiene todas las reservas
 */
export const obtenerReservas = () =>
  clienteApi.get('/reservas').then((res) => res.data)

/**
 * POST /reservas — Crea una nueva reserva
 */
export const crearReserva = (datos) =>
  clienteApi.post('/reservas', datos).then((res) => res.data)

/**
 * PUT /reservas/:id — Actualiza todos los campos de una reserva
 */
export const actualizarReserva = (id, datos) =>
  clienteApi.put(`/reservas/${id}`, datos).then((res) => res.data)

/**
 * PUT /reservas/:id — Cambia solo el estado de una reserva
 * MockAPI gratuito no soporta PATCH, usamos PUT
 */
export const cambiarEstadoReserva = (id, estado) =>
  clienteApi.put(`/reservas/${id}`, { estado }).then((res) => res.data)

/**
 * DELETE /reservas/:id — Elimina una reserva
 */
export const eliminarReserva = (id) =>
  clienteApi.delete(`/reservas/${id}`).then((res) => res.data)