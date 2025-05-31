import React from 'react'

interface DialogConfirmarProps {
    aberto: boolean
    titulo?: string
    mensagem: string
    onConfirmar: () => void
    onCancelar: () => void
}

export default function DialogConfirmarExclusaoTarefa({ aberto, titulo, mensagem, onConfirmar, onCancelar }: DialogConfirmarProps) {
    if (!aberto) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                {titulo && <h2 className="text-lg font-bold mb-2 text-slate-900">{titulo}</h2>}
                <p className="mb-6 text-slate-700">{mensagem}</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onCancelar} className="px-4 py-2 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer transition duration-300">Cancelar</button>
                    <button onClick={onConfirmar} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer transition duration-300">Remover</button>
                </div>
            </div>
        </div>
    )
}