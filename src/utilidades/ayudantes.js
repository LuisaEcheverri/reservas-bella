// src/utilidades/ayudantes.js
//
// Funciones puras reutilizables en toda la app.
// Al ser funciones puras (sin efectos secundarios), son fáciles
// de testear y reutilizar en cualquier componente.

/**
 * formatearFecha
 * Convierte un string ISO al formato legible en español colombiano.
 * Ejemplo: "2024-07-15T20:30:00" → "lun, 15 jul 2024 · 08:30 PM"
 */
export const formatearFecha = (fechaString) => {
  if (!fechaString) return '—'
  try {
    const fecha = new Date(fechaString)
    return new Intl.DateTimeFormat('es-CO', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(fecha)
  } catch {
    return fechaString
  }
}

/**
 * obtenerConfigEstado
 * Retorna la configuración visual de un estado de reserva.
 * Centralizar esto evita repetir colores en múltiples componentes.
 */
export const obtenerConfigEstado = (estado) => {
  const configuraciones = {
    'En Espera': {
      etiqueta: 'En Espera',
      // Clases Tailwind con paleta mediterránea
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      punto: 'bg-amber-500',
    },
    'Confirmada': {
      etiqueta: 'Confirmada',
      color: 'bg-green-100 text-green-800 border-green-300',
      punto: 'bg-olivo',
    },
    'Finalizada': {
      etiqueta: 'Finalizada',
      color: 'bg-stone-100 text-stone-600 border-stone-300',
      punto: 'bg-siena',
    },
  }
  return configuraciones[estado] || {
    etiqueta: estado,
    color: 'bg-gray-100 text-gray-600 border-gray-300',
    punto: 'bg-gray-400',
  }
}

/**
 * validarFormulario
 * Valida los datos del formulario antes de enviarlos a la API.
 * Retorna un objeto de errores (vacío si todo está bien).
 */
export const validarFormulario = (datos) => {
  const errores = {}

  if (!datos.nombreCliente?.trim()) {
    errores.nombreCliente = 'El nombre del cliente es requerido'
  }

  if (!datos.fechaHora) {
    errores.fechaHora = 'La fecha y hora son requeridas'
  }

  const personas = Number(datos.cantidadPersonas)
  if (!datos.cantidadPersonas) {
    errores.cantidadPersonas = 'La cantidad de personas es requerida'
  } else if (personas <= 0) {
    errores.cantidadPersonas = 'Debe ser al menos 1 persona'
  } else if (personas > 50) {
    errores.cantidadPersonas = 'Máximo 50 personas por reserva'
  }

  return errores
}

/**
 * obtenerIniciales
 * Genera las iniciales de un nombre completo para avatares.
 * Ejemplo: "María García" → "MG"
 */
export const obtenerIniciales = (nombre) => {
  if (!nombre) return '?'
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase())
    .join('')
}
