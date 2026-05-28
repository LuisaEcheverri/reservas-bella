// src/componentes/reservas/FormularioReserva.jsx
//
// Modal de formulario para crear y editar reservas.
// Maneja DOS modos:
//   1. Creación (reservaInicial = null): campos vacíos → POST
//   2. Edición (reservaInicial = objeto): campos pre-llenados → PUT
//
// Secciones:
//   - Datos básicos: nombre, fecha, personas, estado
//   - Zona del restaurante: tarjetas de selección única
//   - Ocasión especial: tarjetas de selección única
//   - Preferencias alimentarias: tarjetas de selección múltiple
//   - Platos de interés: tarjetas de selección múltiple

import React, { useState, useEffect } from 'react'
import { validarFormulario } from '../../utilidades/ayudantes'

// ─── Opciones del formulario ───────────────────────────────────────────────
const ESTADOS = ['En Espera', 'Confirmada', 'Finalizada']

const ZONAS = [
  { valor: 'Interior',  icono: '🪑', etiqueta: 'Interior'  },
  { valor: 'Terraza',   icono: '🌿', etiqueta: 'Terraza'   },
  { valor: 'Barra',     icono: '🍸', etiqueta: 'Barra'     },
  { valor: 'VIP',       icono: '⭐', etiqueta: 'VIP'       },
]

const OCASIONES = [
  { valor: 'Ninguna',     icono: '🍽️', etiqueta: 'Sin ocasión'   },
  { valor: 'Cumpleaños',  icono: '🎂', etiqueta: 'Cumpleaños'    },
  { valor: 'Aniversario', icono: '💍', etiqueta: 'Aniversario'   },
  { valor: 'Negocios',    icono: '💼', etiqueta: 'Negocios'      },
  { valor: 'Graduación',  icono: '🎓', etiqueta: 'Graduación'    },
  { valor: 'Romántica',   icono: '🌹', etiqueta: 'Cena romántica'},
]

const PREFERENCIAS = [
  { valor: 'Vegano',       etiqueta: 'Vegano'       },
  { valor: 'Vegetariano',  etiqueta: 'Vegetariano'  },
  { valor: 'Sin gluten',   etiqueta: 'Sin gluten'   },
  { valor: 'Sin lactosa',  etiqueta: 'Sin lactosa'  },
  { valor: 'Kosher',       etiqueta: 'Kosher'       },
  { valor: 'Halal',        etiqueta: 'Halal'        },
  { valor: 'Sin mariscos', etiqueta: 'Sin mariscos' },
  { valor: 'Sin nueces',   etiqueta: 'Sin nueces'   },
]

const PLATOS = [
  { valor: 'Tabla de quesos', etiqueta: 'Tabla de quesos' },
  { valor: 'Bruschetta',      etiqueta: 'Bruschetta'      },
  { valor: 'Carpaccio',       etiqueta: 'Carpaccio'       },
  { valor: 'Sopa del día',    etiqueta: 'Sopa del día'    },
  { valor: 'Ensalada César',  etiqueta: 'Ensalada César'  },
  { valor: 'Pasta al pesto',  etiqueta: 'Pasta al pesto'  },
  { valor: 'Risotto funghi',  etiqueta: 'Risotto funghi'  },
  { valor: 'Tiramisú',        etiqueta: 'Tiramisú'        },
]

// Valores vacíos del formulario
const FORMULARIO_VACIO = {
  nombreCliente:    '',
  fechaHora:        '',
  cantidadPersonas: '',
  estado:           'En Espera',
  zona:             '',
  ocasion:          'Ninguna',
  preferencias:     [],
  platos:           [],
}

function FormularioReserva({ reservaInicial, alGuardar, alCerrar, guardando }) {

  const [form, setForm]       = useState(FORMULARIO_VACIO)
  const [errores, setErrores] = useState({})

  // Pre-llenar el formulario cuando se edita una reserva existente
  useEffect(() => {
    if (reservaInicial) {
      const fechaFormato = reservaInicial.fechaHora
        ? reservaInicial.fechaHora.slice(0, 16)
        : ''
      setForm({
        nombreCliente:    reservaInicial.nombreCliente    || '',
        fechaHora:        fechaFormato,
        cantidadPersonas: reservaInicial.cantidadPersonas || '',
        estado:           reservaInicial.estado           || 'En Espera',
        zona:             reservaInicial.zona             || '',
        ocasion:          reservaInicial.ocasion          || 'Ninguna',
        preferencias:     reservaInicial.preferencias     || [],
        platos:           reservaInicial.platos           || [],
      })
    } else {
      setForm(FORMULARIO_VACIO)
    }
    setErrores({})
  }, [reservaInicial])

  // Manejador para inputs de texto y select
  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }))
  }

  // Selección única (zona, ocasion): deselecciona si se vuelve a tocar
  const seleccionarUnico = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: prev[campo] === valor ? '' : valor
    }))
  }

  // Selección múltiple (preferencias, platos): toggle
  const seleccionarMultiple = (campo, valor) => {
    setForm((prev) => {
      const actual = prev[campo] || []
      const yaEsta = actual.includes(valor)
      return {
        ...prev,
        [campo]: yaEsta
          ? actual.filter((v) => v !== valor)
          : [...actual, valor]
      }
    })
  }

  // Envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault()

    const erroresValidacion = validarFormulario(form)
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    await alGuardar({
      ...form,
      cantidadPersonas: Number(form.cantidadPersonas),
    })
  }

  const titulo = reservaInicial ? 'Editar Reserva' : 'Nueva Reserva'

  // Tarjeta visual reutilizable para las opciones de menú
  const TarjetaOpcion = ({ icono, etiqueta, seleccionada, alHacerClic }) => (
    <button
      type="button"
      onClick={alHacerClic}
      className={`
        flex flex-col items-center gap-1 p-2.5 rounded-xl border-2
        text-xs font-semibold transition-all duration-150
        ${seleccionada
          ? 'border-marino bg-marino text-white scale-95 shadow-sm'
          : 'border-lino bg-pergamino text-siena hover:border-terracota hover:text-profundo'
        }
      `}
    >
      {icono && <span className="text-lg leading-none">{icono}</span>}
      <span className="text-center leading-tight">{etiqueta}</span>
    </button>
  )

  return (
    // Overlay oscuro
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(27, 75, 107, 0.6)' }}
      onClick={alCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal"
    >
      {/* Contenedor del modal con scroll interno */}
      <div
        className="bg-arena rounded-2xl shadow-2xl w-full max-w-lg
                   flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado fijo — azul marino mediterráneo */}
        <div className="bg-marino px-6 py-4 flex items-center justify-between
                        rounded-t-2xl flex-shrink-0 border-b-4 border-terracota">
          <h2 id="titulo-modal" className="font-display text-white text-xl font-semibold">
            {titulo}
          </h2>
          <button
            onClick={alCerrar}
            className="text-cielo hover:text-white transition-colors text-lg"
            aria-label="Cerrar formulario"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo con scroll */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={manejarEnvio} noValidate className="p-6 space-y-6">

            {/* SECCIÓN 1 — Datos básicos */}
            <div className="space-y-4">
              <h3 className="etiqueta border-b border-lino pb-2">
                Datos de la reserva
              </h3>

              <div>
                <label htmlFor="nombreCliente" className="etiqueta">
                  Nombre del cliente *
                </label>
                <input
                  id="nombreCliente"
                  name="nombreCliente"
                  type="text"
                  value={form.nombreCliente}
                  onChange={manejarCambio}
                  placeholder="Ej: María García"
                  className={`campo-input ${errores.nombreCliente ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  autoFocus
                  autoComplete="off"
                />
                {errores.nombreCliente && (
                  <p className="text-red-600 text-xs mt-1" role="alert">
                    {errores.nombreCliente}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="fechaHora" className="etiqueta">
                  Fecha y hora *
                </label>
                <input
                  id="fechaHora"
                  name="fechaHora"
                  type="datetime-local"
                  value={form.fechaHora}
                  onChange={manejarCambio}
                  className={`campo-input ${errores.fechaHora ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                />
                {errores.fechaHora && (
                  <p className="text-red-600 text-xs mt-1" role="alert">
                    {errores.fechaHora}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cantidadPersonas" className="etiqueta">
                    Personas *
                  </label>
                  <input
                    id="cantidadPersonas"
                    name="cantidadPersonas"
                    type="number"
                    min="1"
                    max="50"
                    value={form.cantidadPersonas}
                    onChange={manejarCambio}
                    placeholder="2"
                    className={`campo-input ${errores.cantidadPersonas ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  />
                  {errores.cantidadPersonas && (
                    <p className="text-red-600 text-xs mt-1" role="alert">
                      {errores.cantidadPersonas}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="estado" className="etiqueta">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={form.estado}
                    onChange={manejarCambio}
                    className="campo-input"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2 — Zona del restaurante */}
            <div className="space-y-3">
              <h3 className="etiqueta border-b border-lino pb-2">
                Zona preferida
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {ZONAS.map(({ valor, icono, etiqueta }) => (
                  <TarjetaOpcion
                    key={valor}
                    icono={icono}
                    etiqueta={etiqueta}
                    seleccionada={form.zona === valor}
                    alHacerClic={() => seleccionarUnico('zona', valor)}
                  />
                ))}
              </div>
            </div>

            {/* SECCIÓN 3 — Ocasión especial */}
            <div className="space-y-3">
              <h3 className="etiqueta border-b border-lino pb-2">
                Ocasión especial
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {OCASIONES.map(({ valor, icono, etiqueta }) => (
                  <TarjetaOpcion
                    key={valor}
                    icono={icono}
                    etiqueta={etiqueta}
                    seleccionada={form.ocasion === valor}
                    alHacerClic={() => seleccionarUnico('ocasion', valor)}
                  />
                ))}
              </div>
            </div>

            {/* SECCIÓN 4 — Preferencias alimentarias */}
            <div className="space-y-3">
              <h3 className="etiqueta border-b border-lino pb-2">
                Preferencias alimentarias
                {form.preferencias.length > 0 && (
                  <span className="ml-2 bg-terracota text-white text-xs
                                   px-2 py-0.5 rounded-full normal-case">
                    {form.preferencias.length} seleccionada{form.preferencias.length > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {PREFERENCIAS.map(({ valor, etiqueta }) => (
                  <TarjetaOpcion
                    key={valor}
                    etiqueta={etiqueta}
                    seleccionada={form.preferencias.includes(valor)}
                    alHacerClic={() => seleccionarMultiple('preferencias', valor)}
                  />
                ))}
              </div>
            </div>

            {/* SECCIÓN 5 — Platos de interés */}
            <div className="space-y-3">
              <h3 className="etiqueta border-b border-lino pb-2">
                Platos de interés
                {form.platos.length > 0 && (
                  <span className="ml-2 bg-terracota text-white text-xs
                                   px-2 py-0.5 rounded-full normal-case">
                    {form.platos.length} seleccionado{form.platos.length > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {PLATOS.map(({ valor, etiqueta }) => (
                  <TarjetaOpcion
                    key={valor}
                    etiqueta={etiqueta}
                    seleccionada={form.platos.includes(valor)}
                    alHacerClic={() => seleccionarMultiple('platos', valor)}
                  />
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-2 border-t border-lino">
              <button
                type="button"
                onClick={alCerrar}
                className="boton-secundario flex-1"
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="boton-primario flex-1 justify-center"
                disabled={guardando}
              >
                {guardando ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                     rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  reservaInicial ? 'Actualizar' : 'Crear Reserva'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormularioReserva