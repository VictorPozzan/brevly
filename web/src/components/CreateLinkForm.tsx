import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { WarningIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { api } from '../lib/api'

const schema = z.object({
  originalUrl: z.url('Informe uma URL válida (ex: https://google.com)'),
  shortCode: z
    .string()
    .min(3, 'Mínimo de 3 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Use apenas letras, números, - ou _'),
})

type FormData = z.infer<typeof schema>

export function CreateLinkForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const [originalUrl, shortCode] = watch(['originalUrl', 'shortCode'])
  const isEmpty = !originalUrl || !shortCode

  const [focusedField, setFocusedField] = useState<string | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: api.links.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      reset()
    },
    onError: (err) => {
      toast.error('Erro no cadastro', { description: err.message })
    },
  })

  const onSubmit = (data: FormData) => mutate(data)

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm min-h-[340px]">
      <h2 className="text-lg font-bold text-gray-600 mb-6">Novo link</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Link original */}
        <div className="flex flex-col gap-1">
          <label className={`text-xs uppercase tracking-wide transition-colors ${focusedField === 'originalUrl' ? 'font-bold text-blue-base' : 'font-semibold text-gray-500'}`}>
            Link original
          </label>
          <input
            {...register('originalUrl')}
            type="text"
            placeholder="https://www.exemplo.com.br"
            onFocus={() => setFocusedField('originalUrl')}
            onBlur={() => setFocusedField(null)}
            className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 ${
              errors.originalUrl
                ? 'border-danger focus:border-danger'
                : 'border-gray-300 focus:border-blue-base'
            }`}
          />
          {errors.originalUrl && (
            <span className="flex items-center gap-1 text-xs text-danger">
              <WarningIcon size={12} weight="fill" />
              {errors.originalUrl.message}
            </span>
          )}
        </div>

        {/* Link encurtado */}
        <div className="flex flex-col gap-1">
          <label className={`text-xs uppercase tracking-wide transition-colors ${focusedField === 'shortCode' ? 'font-bold text-blue-base' : 'font-semibold text-gray-500'}`}>
            Link encurtado
          </label>
          <div
            className={`flex items-center border rounded-lg px-3 py-2.5 gap-0.5 bg-white transition-colors focus-within:border-blue-base ${
              errors.shortCode ? 'border-danger focus-within:border-danger' : 'border-gray-300'
            }`}
          >
            <span className="text-sm text-gray-400 shrink-0">brev.ly/</span>
            <input
              {...register('shortCode')}
              type="text"
              placeholder="meu-link"
              onFocus={() => setFocusedField('shortCode')}
              onBlur={() => setFocusedField(null)}
              className="flex-1 text-sm outline-none bg-white placeholder:text-gray-400"
            />
          </div>
          {errors.shortCode && (
            <span className="flex items-center gap-1 text-xs text-danger">
              <WarningIcon size={12} weight="fill" />
              {errors.shortCode.message}
            </span>
          )}
        </div>


        <button
          type="submit"
          disabled={isPending || isEmpty}
          className="mt-2 w-full h-12 bg-blue-base text-white rounded-lg px-5 gap-3 text-sm font-semibold cursor-pointer hover:bg-blue-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'Salvando...' : 'Salvar link'}
        </button>
      </form>
    </div>
  )
}
