// src/componentes/reservas/TarjetaReserva.jsx
//
// Tarjeta individual de una reserva con estética mediterránea.
//
// Responsabilidades:
//   - Mostrar datos: nombre, fecha, personas, zona, ocasión,
//     preferencias alimentarias, platos de interés
//   - Botón rápido "Finalizar" (cambia estado vía PUT)
//   - Botón "Editar" (abre el modal de edición)
//   - Botón "Eliminar" (confirma con SweetAlert2 y ejecuta DELETE)
//
// Props:
//   - reserva: objeto con los datos de la reserva
//   - alEditar: función que abre el modal pasando la reserva
//   - alEliminar: función que ejecuta el DELETE
//   - alCambiarEstado: función que ejecuta el PUT de estado

import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { formatearFecha, obtenerConfigEstado, obtenerIniciales } from '../../utilidades/ayudantes'

function TarjetaReserva({ reserva, alEditar, alEliminar, alCambiarEstado }) {
  // Evita doble clic en acciones asíncronas
  const [procesando, setProcesando] = useState(false)

  // Configuración visual del estado actual
  const configEstado = obtenerConfigEstado(reserva.estado)

  // ─── Eliminar con confirmación ─────────────────────────────────────────
  const manejarEliminar = async () => {
    const resultado = await Swal.fire({
      title: '¿Cancelar esta reserva?',
      html: `<p style="color:#8B7355">Se eliminará la reserva de <strong>${reserva.nombreCliente}</strong>.<br/>Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#8B7355',
    })

    if (resultado.isConfirmed) {
      setProcesando(true)
      try {
        await alEliminar(reserva.id)
        Swal.fire({
          title: '¡Reserva cancelada!',
          text: 'La reserva fue eliminada correctamente.',
          icon: 'success',
          confirmButtonColor: '#D4813A',
          timer: 2500,
          timerProgressBar: true,
        })
      } catch (err) {
        Swal.fire({
          title: 'Error al eliminar',
          text: err.message,
          icon: 'error',
          confirmButtonColor: '#D4813A',
        })
      } finally {
        setProcesando(false)
      }
    }
  }

  // ─── Finalizar mesa ────────────────────────────────────────────────────
  const manejarFinalizar = async () => {
    if (reserva.estado === 'Finalizada') return
    setProcesando(true)
    try {
      await alCambiarEstado(reserva.id, 'Finalizada')
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Mesa finalizada',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      })
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        confirmButtonColor: '#D4813A',
      })
    } finally {
      setProcesando(false)
    }
  }

  return (
    <article className="bg-pergamino border border-lino rounded-2xl p-4
                        hover:border-terracota hover:shadow-md
                        transition-all duration-200 flex flex-col gap-3">

      {/* ─── Encabezado: avatar + nombre + estado ─── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Avatar con iniciales — azul marino mediterráneo */}
          <div className="w-10 h-10 rounded-full bg-marino flex items-center
                          justify-content-center text-white text-sm font-bold
                          flex-shrink-0 flex items-center justify-center">
            {obtenerIniciales(reserva.nombreCliente)}
          </div>
          <div>
            <h3 className="font-display font-semibold text-profundo text-base leading-tight">
              {reserva.nombreCliente}
            </h3>
            <p className="text-siena text-xs mt-0.5">
              Reserva #{reserva.id}
            </p>
          </div>
        </div>

        {/* Badge de estado */}
        <span className={`insignia-estado ${configEstado.color} flex-shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${configEstado.punto}`} />
          {configEstado.etiqueta}
        </span>
      </div>

      {/* ─── Detalles de la reserva ─── */}
      <div className="space-y-1.5 text-sm">

        {/* Fecha y hora */}
        <div className="flex items-center gap-2 text-profundo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2"
               className="text-terracota flex-shrink-0" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{formatearFecha(reserva.fechaHora)}</span>
        </div>

        {/* Cantidad de personas */}
        <div className="flex items-center gap-2 text-profundo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2"
               className="text-terracota flex-shrink-0" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>
            {reserva.cantidadPersonas}{' '}
            {reserva.cantidadPersonas === 1 ? 'persona' : 'personas'}
          </span>
        </div>

        {/* Zona del restaurante */}
        {reserva.zona && (
          <div className="flex items-center gap-2 text-profundo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2"
                 className="text-terracota flex-shrink-0" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Zona: <strong>{reserva.zona}</strong></span>
          </div>
        )}

        {/* Ocasión especial */}
        {reserva.ocasion && reserva.ocasion !== 'Ninguna' && (
          <div className="flex items-center gap-2 text-profundo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2"
                 className="text-terracota flex-shrink-0" aria-hidden="true">
              <path d="M20 12V22H4V12"/>
              <path d="M22 7H2v5h20V7z"/>
              <path d="M12 22V7"/>
              <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
            </svg>
            <span>{reserva.ocasion}</span>
          </div>
        )}

        {/* Preferencias alimentarias — chips */}
        {reserva.preferencias?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {reserva.preferencias.map((p) => (
              <span key={p}
                className="text-xs bg-green-50 text-green-800 border border-green-200
                           px-2 py-0.5 rounded-full font-medium">
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Platos seleccionados — chips */}
        {reserva.platos?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {reserva.platos.map((p) => (
              <span key={p}
                className="text-xs bg-amber-50 text-amber-800 border border-amber-200
                           px-2 py-0.5 rounded-full font-medium">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Botones de acción ─── */}
      <div className="flex gap-2 pt-2 border-t border-lino">

        {/* Finalizar — solo si no está finalizada */}
        {reserva.estado !== 'Finalizada' && (
          <button
            onClick={manejarFinalizar}
            disabled={procesando}
            className="flex-1 text-xs py-2 px-3 rounded-full border border-olivo
                       text-olivo hover:bg-olivo hover:text-white
                       transition-all duration-150 disabled:opacity-50 font-semibold"
          >
            Finalizar
          </button>
        )}

        {/* Editar */}
        <button
          onClick={() => alEditar(reserva)}
          disabled={procesando}
          className="flex-1 text-xs py-2 px-3 rounded-full border border-marino
                     text-marino hover:bg-marino hover:text-white
                     transition-all duration-150 disabled:opacity-50 font-semibold"
        >
          Editar
        </button>

        {/* Eliminar */}
        <button
          onClick={manejarEliminar}
          disabled={procesando}
          className="text-xs py-2 px-3 rounded-full border border-red-300
                     text-red-600 hover:bg-red-600 hover:text-white
                     transition-all duration-150 disabled:opacity-50 font-semibold"
        >
          Eliminar
        </button>
      </div>
    </article>
  )
}

export default TarjetaReserva