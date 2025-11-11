import logoDog from '../assets/dog-hand.webp'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const Confirm = () => {
  const { token } = useParams()
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`
        const respuesta = await fetch(url)
        const data = await respuesta.json()

        if (!respuesta.ok) {
          setError(true)
          setMensaje(data.msg || 'Error al confirmar cuenta')
          toast.error(data.msg || 'Token inválido o expirado')
        } else {
          setMensaje(data.msg)
          toast.success(data.msg)
        }
      } catch (error) {
        console.error('Error en confirmación:', error)
        setError(true)
        setMensaje('Error del servidor')
        toast.error('Error del servidor')
      } finally {
        setCargando(false)
      }
    }

    confirmarCuenta()
  }, [token])

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p className="text-2xl">Verificando tu cuenta...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer />

      <img
        className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
        src={logoDog}
        alt="Confirmación"
      />

      <div className="flex flex-col items-center justify-center">
        <p
          className={`text-3xl md:text-4xl lg:text-5xl mt-12 ${
            error ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {mensaje}
        </p>

        {!error && (
          <>
            <p className="md:text-lg lg:text-xl text-gray-600 mt-8">
              Ya puedes iniciar sesión
            </p>
            <Link
              to="/login"
              className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white"
            >
              Ir al Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
