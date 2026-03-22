import { Link } from 'react-router-dom'
import errorSvg from '../assets/404-error.svg'

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 shadow-sm max-w-sm w-full flex flex-col items-center gap-4 text-center">
        <img src={errorSvg} alt="404" className="w-32" />
        <h1 className="text-lg font-bold text-gray-600">Link não encontrado</h1>
        <p className="text-sm text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.{' '}
          Saiba mais em{' '}
          <Link to="/" className="text-blue-base font-semibold hover:underline">
            brev.ly
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
