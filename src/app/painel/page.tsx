'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/api'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from '@/components/Header'


interface Tarefa {
	id: string
	titulo: string
	descricao?: string
	status: string
	criada_em: string
}

export default function Painel() {
	const router = useRouter()
	const [tarefas, setTarefas] = useState<Tarefa[]>([])
	const [carregando, setCarregando] = useState(true)

	const carregarTarefas = async () => {
		try {
			const response = await api.get('/tarefas')
			setTarefas(response.data)
		} catch (error) {
			toast.error('Erro ao carregar tarefas')
		} finally {
			setCarregando(false)
		}
	}

	useEffect(() => {
		carregarTarefas()
	}, [])

	return (
		<>
			<Header />
			<div className="min-h-screen bg-slate-900 p-6 text-white">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold">Suas Tarefas</h1>
						<button onClick={() => router.push('/painel/nova')}
							className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition">
							<PlusCircle size={20} />
							Nova Tarefa
						</button>
					</div>

					{carregando ? (
						<p>Carregando tarefas...</p>
					) : tarefas.length === 0 ? (
						<p>Você ainda não tem tarefas.</p>
					) : (
						<ul className="space-y-4">
							{tarefas.map((tarefa) => (
								<li key={tarefa.id} className="bg-white text-slate-800 p-4 rounded-lg shadow-md">
									<div className="flex justify-between items-start">
										<div>
											<h2 className="text-lg font-semibold">{tarefa.titulo}</h2>
											{tarefa.descricao && <p className="text-sm text-slate-600 mt-1">{tarefa.descricao}</p>}
										</div>
										<span className="text-sm px-2 py-1 rounded bg-slate-200 text-slate-700">
											{tarefa.status}
										</span>
									</div>
									<p className="text-xs text-slate-500 mt-2">
										Criada em: {new Date(tarefa.criada_em).toLocaleString()}
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</>
	)
}
