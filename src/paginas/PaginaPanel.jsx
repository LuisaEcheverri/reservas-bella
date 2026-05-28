// src/paginas/PaginaPanel.jsx
//
// Panel principal de gestión de reservas — ruta protegida: /panel
//
// Este componente es el "orquestador" — conecta todas las piezas:
//   - useReservas (hook)         → datos y acciones CRUD
//   - BarraNavegacion            → cabecera con sesión
//   - FiltroPorEstado            → filtrar por estado
//   - TarjetaReserva             → cada tarjeta de reserva
//   - FormularioReserva          → modal crear/editar
//   - TarjetaCarga               → skeletons de carga
//
// Estado local:
//   - filtroActivo: estado por el que se filtra la lista
//   - modalAbierto: si el formulario modal está visible
//   - reservaEditando: reserva en edición (null = crear nueva)
//   - guardando: si hay un POST/PUT en curso

import React, { useState, useMemo } from 'react'
import Swal from 'sweetalert2'
import BarraNavegacion from '../componentes/diseno/BarraNavegacion'
import TarjetaReserva from '../componentes/reservas/TarjetaReserva'
import FormularioReserva from '../componentes/reservas/FormularioReserva'
import FiltroPorEstado from '../componentes/reservas/FiltroPorEstado'
import TarjetaCarga from '../componentes/comunes/TarjetaCarga'
import { useReservas } from '../hooks/useReservas'

function PaginaPanel() {

  // ─── Datos y acciones del hook ──────────────────────────────────────────
  const {
    reservas,
    cargando,
    error,
    cargarReservas,
    agregarReserva,
    editarReserva,
    cambiarEstado,
    quitarReserva,
  } = useReservas()

  // ─── Estado local del panel ─────────────────────────────────────────────
  const [filtroActivo,    setFiltroActivo]    = useState('Todos')
  const [modalAbierto,    setModalAbierto]    = useState(false)
  const [reservaEditando, setReservaEditando] = useState(null)
  const [guardando,       setGuardando]       = useState(false)

  // ─── Conteos por estado para los badges de los filtros ──────────────────
  // useMemo evita recalcular en cada render si reservas no cambió
  const conteos = useMemo(() => ({
    'Todos':      reservas.length,
    'En Espera':  reservas.filter((r) => r.estado === 'En Espera').length,
    'Confirmada': reservas.filter((r) => r.estado === 'Confirmada').length,
    'Finalizada': reservas.filter((r) => r.estado === 'Finalizada').length,
  }), [reservas])

  // ─── Filtrado en el cliente (sin petición a la API) ──────────────────────
  const reservasFiltradas = useMemo(() => {
    if (filtroActivo === 'Todos') return reservas
    return reservas.filter((r) => r.estado === filtroActivo)
  }, [reservas, filtroActivo])

  // ─── Abrir modal para crear ──────────────────────────────────────────────
  const abrirCrear = () => {
    setReservaEditando(null)
    setModalAbierto(true)
  }

  // ─── Abrir modal para editar ─────────────────────────────────────────────
  const abrirEditar = (reserva) => {
    setReservaEditando(reserva)
    setModalAbierto(true)
  }

  // ─── Cerrar modal ────────────────────────────────────────────────────────
  const cerrarModal = () => {
    setModalAbierto(false)
    setReservaEditando(null)
  }

  // ─── Guardar (crear o editar según reservaEditando) ──────────────────────
  const manejarGuardar = async (datosFormulario) => {
    setGuardando(true)
    try {
      if (reservaEditando) {
        await editarReserva(reservaEditando.id, datosFormulario)
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'Reserva actualizada',
          showConfirmButton: false, timer: 2000, timerProgressBar: true,
        })
      } else {
        await agregarReserva(datosFormulario)
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'Reserva creada exitosamente',
          showConfirmButton: false, timer: 2000, timerProgressBar: true,
        })
      }
      cerrarModal()
    } catch (err) {
      Swal.fire({
        title: 'Error al guardar',
        text: err.message,
        icon: 'error',
        confirmButtonColor: '#D4813A',
      })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="min-h-screen bg-arena">

      {/* Barra de navegación superior */}
      <BarraNavegacion />

      {/* ─── Contenido principal ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Encabezado del panel */}
        <div className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-4 mb-8">
          <div>
            {/* Ornamento mediterráneo */}
            <p className="text-terracota text-sm tracking-widest mb-1">— · —</p>
            <h1 className="font-display text-profundo text-4xl font-semibold">
              Reservas
            </h1>
            <p className="text-siena text-sm mt-1">
              Gestión de mesas · Bella Notte
            </p>
          </div>

          {/* Botón nueva reserva */}
          <button
            onClick={abrirCrear}
            className="boton-primario self-start sm:self-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nueva Reserva
          </button>
        </div>

        {/* Barra de filtros */}
        <div className="mb-6">
          <FiltroPorEstado
            filtroActivo={filtroActivo}
            alCambiarFiltro={setFiltroActivo}
            conteos={conteos}
          />
        </div>

        {/* ─── Estado de carga: 6 skeletons ─── */}
        {cargando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <TarjetaCarga key={i} />
            ))}
          </div>
        )}

        {/* ─── Estado de error ─── */}
        {!cargando && error && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">⚠️</p>
            <h3 className="font-display text-profundo text-2xl font-semibold mb-2">
              Error al cargar reservas
            </h3>
            <p className="text-siena text-sm mb-6">{error}</p>
            <button onClick={cargarReservas} className="boton-primario mx-auto">
              Reintentar
            </button>
          </div>
        )}

        {/* ─── Estado vacío ─── */}
        {!cargando && !error && reservasFiltradas.length === 0 && (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">⚓</p>
            <h3 className="font-display text-profundo text-2xl font-semibold mb-2">
              {filtroActivo === 'Todos'
                ? 'No hay reservas registradas'
                : `No hay reservas "${filtroActivo}"`}
            </h3>
            <p className="text-siena text-sm mb-6">
              {filtroActivo === 'Todos'
                ? 'Crea la primera reserva del turno.'
                : 'Prueba cambiando el filtro.'}
            </p>
            {filtroActivo === 'Todos' && (
              <button onClick={abrirCrear} className="boton-primario mx-auto">
                Crear primera reserva
              </button>
            )}
          </div>
        )}

        {/* ─── Grilla de tarjetas ─── */}
        {!cargando && !error && reservasFiltradas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservasFiltradas.map((reserva) => (
              <TarjetaReserva
                key={reserva.id}
                reserva={reserva}
                alEditar={abrirEditar}
                alEliminar={quitarReserva}
                alCambiarEstado={cambiarEstado}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de formulario — se monta solo cuando está abierto */}
      {modalAbierto && (
        <FormularioReserva
          reservaInicial={reservaEditando}
          alGuardar={manejarGuardar}
          alCerrar={cerrarModal}
          guardando={guardando}
        />
      )}
    </div>
  )
}

export default PaginaPanel