// src/componentes/reservas/FiltroPorEstado.jsx
//
// Barra de filtros por estado de reserva.
//
// Filtra la lista en el cliente (sin peticiones adicionales a la API).
// Muestra contadores por cada estado para dar contexto visual al anfitrión.
//
// Props:
//   - filtroActivo: estado actualmente filtrado ('Todos', 'En Espera', etc.)
//   - alCambiarFiltro: función que actualiza el filtro en PaginaPanel
//   - conteos: objeto { Todos: N, 'En Espera': N, Confirmada: N, Finalizada: N }

import React from 'react'

// Definición de los botones de filtro con sus estilos mediterráneos
const FILTROS = [
  {
    valor:    'Todos',
    etiqueta: 'Todos',
    // Activo: azul marino | Inactivo: neutro con hover marino
    activo:   'bg-marino text-white border-marino',
    inactivo: 'bg-pergamino text-siena border-lino hover:border-marino hover:text-marino',
  },
  {
    valor:    'En Espera',
    etiqueta: 'En espera',
    activo:   'bg-amber-500 text-white border-amber-500',
    inactivo: 'bg-pergamino text-siena border-lino hover:border-amber-400 hover:text-amber-700',
  },
  {
    valor:    'Confirmada',
    etiqueta: 'Confirmadas',
    activo:   'bg-olivo text-white border-olivo',
    inactivo: 'bg-pergamino text-siena border-lino hover:border-olivo hover:text-olivo',
  },
  {
    valor:    'Finalizada',
    etiqueta: 'Finalizadas',
    activo:   'bg-siena text-white border-siena',
    inactivo: 'bg-pergamino text-siena border-lino hover:border-siena hover:text-profundo',
  },
]

function FiltroPorEstado({ filtroActivo, alCambiarFiltro, conteos }) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filtrar reservas por estado"
    >
      {FILTROS.map(({ valor, etiqueta, activo, inactivo }) => {
        const estaActivo = filtroActivo === valor
        const cantidad   = conteos?.[valor] ?? 0

        return (
          <button
            key={valor}
            onClick={() => alCambiarFiltro(valor)}
            className={`
              flex items-center gap-2 px-4 py-1.5 rounded-full
              text-sm font-semibold border transition-all duration-150
              ${estaActivo ? activo : inactivo}
            `}
            aria-pressed={estaActivo}
          >
            {etiqueta}
            {/* Contador de reservas por estado */}
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full font-bold
              ${estaActivo ? 'bg-white/25' : 'bg-lino text-siena'}
            `}>
              {cantidad}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default FiltroPorEstado