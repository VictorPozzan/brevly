import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CopySimpleIcon, TrashIcon, CheckIcon, LinkIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { api } from '../lib/api'

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL ?? 'http://localhost:5173'

export function LinksList() {
  const queryClient = useQueryClient()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  const { data: links, isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: api.links.list,
  })

  const deleteMutation = useMutation({
    mutationFn: api.links.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['links'] }),
  })

  function copyLink(link: { id: string; shortCode: string }) {
    const url = `${FRONTEND_URL}/${link.shortCode}`
    navigator.clipboard.writeText(url)
    setCopiedId(link.id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.info('Link copiado com sucesso', {
      description: `O link ${link.shortCode} foi copiado para a área de transferência.`,
    })
  }

  async function handleExport() {
    setExportLoading(true)
    try {
      const { url } = await api.links.export()
      window.open(url, '_blank')
    } catch (err) {
      alert('Falha ao gerar o CSV. Tente novamente.')
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* barra de progresso no topo */}
      <div className="relative h-1 bg-transparent rounded-t-lg overflow-hidden">
        {isLoading && (
          <div className="absolute h-full w-1/3 bg-blue-base animate-progress-slide" />
        )}
      </div>

      {/* header com botão de exportar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-600">Meus links</h2>
        <button
          onClick={handleExport}
          disabled={exportLoading || !links?.length}
          className="flex items-center gap-1.5 h-8 px-2 bg-gray-200 rounded text-xs font-semibold text-gray-500 cursor-pointer hover:border hover:border-blue-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadSimpleIcon size={14} />
          {exportLoading ? 'Gerando...' : 'Baixar CSV'}
        </button>
      </div>

      {/* loading */}
      {isLoading && (
        <div className="py-16 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-base border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Carregando links...</p>
        </div>
      )}

      {/* empty state */}
      {!isLoading && links?.length === 0 && (
        <div className="p-12 flex flex-col items-center gap-3 text-center">
          <LinkIcon size={32} className="text-gray-400" />
          <p className="text-sm text-gray-500 uppercase">ainda não existem links cadastrados</p>
        </div>
      )}

      {/* lista de links */}
      {!isLoading && links && links.length > 0 && (
        <ul className="max-h-[600px] overflow-y-auto">
          {links.map((link, index) => (
            <li key={link.id}>
              {index > 0 && <div className="border-t border-gray-200 mx-6" />}
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <a
                    href={`${FRONTEND_URL}/${link.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-blue-base truncate hover:underline block"
                  >
                    brev.ly/{link.shortCode}
                  </a>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {link.originalUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap mr-1">
                    {link.accessCount} {link.accessCount === 1 ? 'acesso' : 'acessos'}
                  </span>

                  <button
                    onClick={() => copyLink(link)}
                    title="Copiar link"
                    className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded cursor-pointer hover:border hover:border-blue-base transition-colors"
                  >
                    {copiedId === link.id ? (
                      <CheckIcon size={16} className="text-blue-base" />
                    ) : (
                      <CopySimpleIcon size={16} className="text-gray-500" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Você realmente quer apagar o link brev.ly/${link.shortCode}?`)) {
                        deleteMutation.mutate(link.shortCode)
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    title="Excluir link"
                    className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded cursor-pointer hover:border hover:border-danger transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
