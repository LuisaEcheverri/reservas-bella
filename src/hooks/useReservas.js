// src/hooks/useReservas.js
//
// Hook personalizado: encapsula toda la lógica de estado de las reservas.
//
// ¿Por qué un hook personalizado?
//   El componente PaginaPanel solo se preocupa de "cómo se ve".
//   Este hook maneja el "qué datos hay y cómo cambiarlos".
//
// Retorna:
//   - reservas: array de todas las reservas
//   - cargando: booleano de carga inicial
//   - error: mensaje de error si falla la API
//   - cargarReservas: función para recargar manualmente
//   - agregarReserva, editarReserva, cambiarEstado, quitarReserva

import { useState, useEffect, useCallback } from 'react'
import {
  obtenerReservas,
  crearReserva,
  actualizarReserva,
  cambiarEstadoReserva,
  eliminarReserva,
} from '../servicios/servicioReservas'

export function useReservas() {
  // Lista de reservas del sistema
  const [reservas, setReservas] = useState([])

  // true mientras esperamos la respuesta inicial de la API
  const [cargando, setCargando] = useState(true)

  // Mensaje de error o null si no hay error
  const [error, setError] = useState(null)

  // ─── Cargar reservas ─────────────────────────────────────────────────────
  // useCallback memoriza la función para evitar re-renders innecesarios
  const cargarReservas = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const datos = await obtenerReservas()
      setReservas(datos)
    } catch (err) {
      setError(err.message)
    } finally {
      // finally garantiza que cargando se desactive aunque haya error
      setCargando(false)
    }
  }, [])

  // Carga inicial al montar el hook
  useEffect(() => {
    cargarReservas()
  }, [cargarReservas])

  // ─── Agregar reserva ──────────────────────────────────────────────────────
  const agregarReserva = async (datosFormulario) => {
    const nuevaReserva = await crearReserva(datosFormulario)
    // Agregamos al inicio para que aparezca primero en la lista
    setReservas((prev) => [nuevaReserva, ...prev])
    return nuevaReserva
  }

  // ─── Editar reserva ───────────────────────────────────────────────────────
  const editarReserva = async (id, datosFormulario) => {
    const actualizada = await actualizarReserva(id, datosFormulario)
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? actualizada : r))
    )
    return actualizada
  }

  // ─── Cambiar estado ───────────────────────────────────────────────────────
  // Acción rápida para el botón "Finalizar"
  const cambiarEstado = async (id, estado) => {
    const actualizada = await cambiarEstadoReserva(id, estado)
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? actualizada : r))
    )
    return actualizada
  }

  // ─── Quitar reserva ───────────────────────────────────────────────────────
  const quitarReserva = async (id) => {
    await eliminarReserva(id)
    setReservas((prev) => prev.filter((r) => r.id !== id))
  }

  return {
    reservas,
    cargando,
    error,
    cargarReservas,
    agregarReserva,
    editarReserva,
    cambiarEstado,
    quitarReserva,
  }
}