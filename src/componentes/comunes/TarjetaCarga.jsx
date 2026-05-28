// src/componentes/comunes/TarjetaCarga.jsx
//
// Tarjeta skeleton (esqueleto) de carga.
//
// Aparece mientras la API responde al GET inicial.
// Simula la forma de TarjetaReserva para evitar saltos visuales
// cuando el contenido real aparece (layout shift).
//
// Los skeletons mejoran la UX porque:
//   - El usuario sabe que hay contenido cargando
//   - Se perciben más rápidos que un spinner genérico
//   - Mantienen el espacio de la grilla estable

import React from 'react'

function TarjetaCarga() {
  return (
    // Misma estructura visual que TarjetaReserva
    <div className="bg-pergamino border border-lino rounded-2xl p-4 space-y-3">

      {/* Fila superior: avatar + nombre */}
      <div className="flex items-center gap-3">
        {/* Placeholder del avatar circular */}
        <div className="esqueleto w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          {/* Placeholder del nombre */}
          <div className="esqueleto h-4 w-3/4" />
          {/* Placeholder del ID */}
          <div className="esqueleto h-3 w-1/3" />
        </div>
        {/* Placeholder del badge de estado */}
        <div className="esqueleto h-6 w-20 rounded-full" />
      </div>

      {/* Separador */}
      <div className="border-t border-lino" />

      {/* Placeholders de los detalles */}
      <div className="space-y-2">
        <div className="esqueleto h-3 w-full" />
        <div className="esqueleto h-3 w-2/3" />
        <div className="esqueleto h-3 w-1/2" />
      </div>

      {/* Placeholder de los chips */}
      <div className="flex gap-2">
        <div className="esqueleto h-5 w-16 rounded-full" />
        <div className="esqueleto h-5 w-20 rounded-full" />
      </div>

      {/* Placeholder de los botones de acción */}
      <div className="flex gap-2 pt-1 border-t border-lino">
        <div className="esqueleto h-8 flex-1 rounded-full" />
        <div className="esqueleto h-8 flex-1 rounded-full" />
        <div className="esqueleto h-8 w-16 rounded-full" />
      </div>
    </div>
  )
}

export default TarjetaCarga