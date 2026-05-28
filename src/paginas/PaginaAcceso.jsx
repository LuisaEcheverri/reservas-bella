// src/paginas/PaginaAcceso.jsx
//
// Página pública de ingreso — ruta: /acceso
//
// Responsabilidades:
//   - Mostrar el formulario de nombre y selección de turno
//   - Validar que el nombre no esté vacío
//   - Guardar la sesión via iniciarSesion() del contexto
//   - Redirigir al /panel tras el ingreso exitoso
//   - Si ya hay sesión activa, redirigir directamente al panel

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAutenticacion } from '../contexto/ContextoAutenticacion'

// Turnos disponibles con sus íconos
const TURNOS = [
  { valor: 'Mañana', icono: '🌅' },
  { valor: 'Tarde',  icono: '☀️' },
  { valor: 'Noche',  icono: '🌙' },
]

function PaginaAcceso() {
  const { usuario, iniciarSesion } = useAutenticacion()
  const navegar = useNavigate()

  const [form, setForm]       = useState({ nombre: '', turno: 'Mañana' })
  const [errores, setErrores] = useState({})

  // Si ya hay sesión activa, ir directo al panel
  useEffect(() => {
    if (usuario) {
      navegar('/panel', { replace: true })
    }
  }, [usuario, navegar])

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }))
  }

  const manejarEnvio = (e) => {
    e.preventDefault()

    if (!form.nombre.trim()) {
      setErrores({ nombre: 'Ingresa tu nombre completo' })
      return
    }

    iniciarSesion({
      nombre: form.nombre.trim(),
      turno:  form.turno,
    })
    navegar('/panel')
  }

  return (
    // Fondo azul marino oscuro con gradiente sutil
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: 'linear-gradient(135deg, #163D58 0%, #1B4B6B 50%, #1A3A52 100%)',
      }}
    >
      <div className="w-full max-w-sm">

        {/* ─── Logo y bienvenida ─── */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-terracota rounded-full flex items-center
                          justify-center mx-auto mb-4 shadow-lg text-4xl
                          border-4 border-white/10">
            ⚓
          </div>
          <h1 className="font-display text-white text-4xl font-semibold">
            Bella Notte
          </h1>
          <p className="text-cielo text-xs tracking-widest uppercase mt-2">
            Table-Track · Reservas
          </p>
          <p className="text-white/40 text-sm mt-3 font-display italic">
            "Ogni tavola, una storia."
          </p>
        </div>

        {/* ─── Tarjeta de formulario ─── */}
        <div className="bg-pergamino rounded-2xl p-7 shadow-2xl
                        border-t-4 border-terracota">
          <h2 className="font-display text-profundo text-2xl font-semibold mb-1">
            Iniciar turno
          </h2>
          <p className="text-siena text-sm mb-6">
            Registra tus datos para gestionar las reservas.
          </p>

          <form onSubmit={manejarEnvio} noValidate className="space-y-5">

            {/* Nombre completo */}
            <div>
              <label htmlFor="nombre" className="etiqueta">
                Tu nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={manejarCambio}
                placeholder="Ej: Carlos Herrera"
                className={`campo-input ${errores.nombre ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                autoFocus
                autoComplete="name"
              />
              {errores.nombre && (
                <p className="text-red-600 text-xs mt-1" role="alert">
                  {errores.nombre}
                </p>
              )}
            </div>

            {/* Selector de turno con tarjetas visuales */}
            <div>
              <span className="etiqueta block mb-2">Turno de trabajo</span>
              <div className="grid grid-cols-3 gap-2">
                {TURNOS.map(({ valor, icono }) => {
                  const activo = form.turno === valor
                  return (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, turno: valor }))}
                      className={`
                        flex flex-col items-center gap-1.5 py-3 rounded-xl
                        border-2 text-sm font-semibold transition-all duration-150
                        ${activo
                          ? 'border-marino bg-marino text-white shadow-sm'
                          : 'border-lino bg-white text-siena hover:border-terracota'
                        }
                      `}
                      aria-pressed={activo}
                    >
                      <span className="text-xl">{icono}</span>
                      {valor}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Botón de ingreso */}
            <button
              type="submit"
              className="boton-primario w-full justify-center text-base py-3 mt-2"
            >
              Comenzar turno
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Bella Notte · Sistema de Reservas v1.0
        </p>
      </div>
    </main>
  )
}

export default PaginaAcceso