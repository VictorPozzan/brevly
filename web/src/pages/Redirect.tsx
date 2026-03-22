import { useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import brevlyIcon from '../assets/brev.ly-icon.svg'

export function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>()
  const navigate = useNavigate()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!shortCode) {
      navigate('/not-found', { replace: true })
      return
    }

    if (hasRedirected.current) return
    hasRedirected.current = true

    async function redirect() {
      try {
        const link = await api.links.getByShortCode(shortCode!)

        api.links.incrementAccess(shortCode!).catch(() => {})

        window.location.replace(link.originalUrl)
      } catch {
        navigate('/not-found', { replace: true })
      }
    }

    redirect()
  }, [shortCode, navigate])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 shadow-sm flex flex-col items-center gap-4 max-w-sm w-full text-center">
        <img src={brevlyIcon} alt="brev.ly" width={48} height={48} />
        <h1 className="text-lg font-bold text-gray-600">Redirecionando...</h1>
        <p className="text-sm text-gray-500">
          O link será aberto automaticamente em alguns instantes.
        </p>
        <p className="text-sm text-gray-500">
          Não foi redirecionado?{' '}
          <Link to="/" className="text-blue-base font-semibold hover:underline">
            Acesse aqui
          </Link>
        </p>
      </div>
    </div>
  )
}
