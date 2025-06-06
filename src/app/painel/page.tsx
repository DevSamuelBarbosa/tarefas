'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/api'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from '@/components/Header'
import Link from 'next/link'
import { formatarData, statusEstilizacao, textoStatus } from '@/utils/utils'


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
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold">Minhas tarefas</h1>
						<button onClick={() => router.push('/tarefas/cadastrar')}
							className="flex items-center gap-2 font-semibold text-white text-sm px-2 py-1 rounded bg-orange-500 hover:bg-orange-600 cursor-pointer transition duration-200">
							<Plus size={14} />
							Nova tarefa
						</button>
					</div>

					{carregando ? (
						<p>Carregando tarefas...</p>
					) : tarefas.length === 0 ? (
						<p>Você ainda não tem tarefas.</p>
					) : (
						<ul className="flex flex-col gap-4">
							{tarefas.map((tarefa) => (
								<li key={tarefa.id}>
                                    <Link href={`/tarefas/${tarefa.id}`} className="flex flex-col bg-slate-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-lg text-slate-900 font-semibold">{tarefa.titulo}</h2>
                                                {tarefa.descricao && <p className="text-sm text-slate-600 mt-1">{tarefa.descricao}</p>}
                                            </div>
                                            <span className={`text-sm px-2 py-1 rounded ${statusEstilizacao(tarefa.status)}`}>
                                                {textoStatus(tarefa.status)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Criada em: {formatarData(tarefa.criada_em)}
                                        </p>
                                    </Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</>
	)
}
