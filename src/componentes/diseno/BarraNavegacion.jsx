// src/componentes/diseno/BarraNavegacion.jsx
//
// Barra de navegación superior con estética mediterránea.
//
// Responsabilidades:
//   - Mostrar logo y nombre del restaurante
//   - Mostrar nombre del anfitrión activo y su turno
//   - Botón de cerrar sesión con confirmación SweetAlert2
//
// No recibe props: obtiene el usuario directamente del contexto.

import React from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAutenticacion } from '../../contexto/ContextoAutenticacion'
import { obtenerIniciales } from '../../utilidades/ayudantes'

// Estilos de badge por turno
const ESTILOS_TURNO = {
  'Mañana': 'bg-amber-100 text-amber-800 border border-amber-200',
  'Tarde':  'bg-orange-100 text-orange-800 border border-orange-200',
  'Noche':  'bg-slate-700 text-slate-100 border border-slate-600',
}

function BarraNavegacion() {
  const { usuario, cerrarSesion } = useAutenticacion()
  const navegar = useNavigate()

  // Cerrar sesión con confirmación SweetAlert2
  const manejarCierreSesion = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: `El turno de ${usuario?.nombre} quedará registrado.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D4813A',
      cancelButtonColor: '#8B7355',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        cerrarSesion()
        navegar('/acceso')
      }
    })
  }

  return (
    // Navbar con azul marino mediterráneo y acento terracota
    <header className="sticky top-0 z-40 bg-marino shadow-lg border-b-4 border-terracota">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* ─── Logo ─── */}
        <div className="flex items-center gap-3">
          {/* Círculo con ancla — identidad mediterránea */}
          <div className="w-9 h-9 bg-terracota rounded-full flex items-center
                          justify-center text-white font-display text-lg font-semibold">
            ⚓
          </div>
          <div>
            <span className="font-display text-white text-lg font-semibold leading-none block">
              Bella Notte
            </span>
            <span className="text-cielo text-xs tracking-widest uppercase leading-none">
              Table-Track
            </span>
          </div>
        </div>

        {/* ─── Info del anfitrión + botón salir ─── */}
        {usuario && (
          <div className="flex items-center gap-3">

            {/* Info del usuario — oculta en pantallas muy pequeñas */}
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-white text-sm font-semibold leading-none">
                  {usuario.nombre}
                </p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                                 ${ESTILOS_TURNO[usuario.turno] || 'bg-gray-100 text-gray-700'}`}>
                  Turno {usuario.turno}
                </span>
              </div>
              {/* Avatar con iniciales */}
              <div className="w-8 h-8 bg-terracota rounded-full flex items-center
                              justify-center text-white text-xs font-bold border-2 border-white/20">
                {obtenerIniciales(usuario.nombre)}
              </div>
            </div>

            {/* Botón cerrar sesión */}
            <button
              onClick={manejarCierreSesion}
              className="flex items-center gap-1.5 text-cielo hover:text-white
                         text-sm border border-cielo/30 hover:border-white/50
                         px-3 py-1.5 rounded-full transition-all duration-150"
              aria-label="Cerrar sesión"
            >
              {/* Ícono de salida SVG */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default BarraNavegacion
