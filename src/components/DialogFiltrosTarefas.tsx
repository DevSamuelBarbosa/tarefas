import { X } from 'lucide-react'
import React from 'react'

interface DialogFiltrosTarefasProps {
	aberto: boolean
	status: string
	criadaEm: string
	finalizadaEm: string
	onChangeStatus: (valor: string) => void
	onChangeCriadaEm: (valor: string) => void
	onChangeFinalizadaEm: (valor: string) => void
	onFechar: () => void
	onFiltrar: () => void
}

export default function DialogFiltrosTarefas({
	aberto,
	status,
	criadaEm,
	finalizadaEm,
	onChangeStatus,
	onChangeCriadaEm,
	onChangeFinalizadaEm,
	onFechar,
	onFiltrar
}: DialogFiltrosTarefasProps) {
	if (!aberto) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 ">
			<div className="bg-slate-800 text-white rounded-lg p-6 max-w-sm w-full shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-bold">Filtrar Tarefas</h2>
					<button onClick={onFechar} className="text-white hover:text-red-400 text-xl font-bold cursor-pointer transition duration-200"><X/></button>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm mb-1">Status</label>
						<select
							value={status}
							onChange={(e) => onChangeStatus(e.target.value)}
							className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white cursor-pointer"
						>
							<option value="">Todos</option>
							<option value="criada">Aberta</option>
							<option value="iniciada">Iniciada</option>
							<option value="pausada">Pausada</option>
							<option value="concluída">Concluída</option>
						</select>
					</div>

					<div>
						<label className="block text-sm mb-1">Criada em</label>
						<input
							type="date"
							value={criadaEm}
							onChange={(e) => onChangeCriadaEm(e.target.value)}
							className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white cursor-pointer"
						/>
					</div>

					<div>
						<label className="block text-sm mb-1">Finalizada em</label>
						<input
							type="date"
							value={finalizadaEm}
							onChange={(e) => onChangeFinalizadaEm(e.target.value)}
							className="w-full p-2 rounded bg-slate-700 border border-slate-600 text-white cursor-pointer"
						/>
					</div>
				</div>

				<div className="flex gap-4 justify-end mt-6">
					<button onClick={() => {
							onChangeStatus('')
							onChangeCriadaEm('')
							onChangeFinalizadaEm('')
						}}
						className="border border-slate-600 bg-transparent hover:bg-slate-600 px-4 py-2 rounded text-sm font-semibold text-white cursor-pointer transition duration-200"
					>
						Limpar
					</button>
					<button onClick={onFiltrar} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-semibold text-white cursor-pointer transition duration-200">
						Filtrar
					</button>
				</div>
			</div>
		</div>
	)
}
