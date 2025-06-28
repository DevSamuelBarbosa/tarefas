'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/api'
import { useRouter } from 'next/navigation'
import { Filter, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Header from '@/components/Header'
import Link from 'next/link'
import { formatarData, formatarTempo, statusEstilizacao, textoStatus } from '@/utils/utils'
import DialogFiltrosTarefas from '@/components/DialogFiltrosTarefas'
import { Tarefa } from '@/types/tarefa'


export default function Painel() {
	const router = useRouter()
	const [tarefas, setTarefas] = useState<Tarefa[]>([])
	const [carregando, setCarregando] = useState(true)
    const [filtrosListagemTarefas, setFiltrosListagemTarefas] = useState(false)
    const [statusFiltro, setStatusFiltro] = useState('')
    const [criadaEmFiltro, setCriadaEmFiltro] = useState('')
    const [finalizadaEmFiltro, setFinalizadaEmFiltro] = useState('')


	const carregarTarefas = async () => {
		try {
			const response = await api.get('/tarefas')
			setTarefas(response.data)
		} catch (error) {
			toast.error('Não foi possível carregar as tarefas. Error: ' + (error as Error).message)
		} finally {
			setCarregando(false)
		}
	}

    const aplicarFiltros = async () => {
        try {
            const params: Record<string, unknown> = {}
            if (statusFiltro) params.status = statusFiltro
            if (criadaEmFiltro) params.criadaEm = criadaEmFiltro
            if (finalizadaEmFiltro) params.finalizadaEm = finalizadaEmFiltro

            const response = await api.get('/tarefas', { params })
            setTarefas(response.data)
            setFiltrosListagemTarefas(false)
        } catch (error) {
            toast.error('Erro ao aplicar filtros. Error: ' + (error as Error).message)
        }
    }


	useEffect(() => {
		carregarTarefas()
	}, [])

	return (
		<>
			<Header titulo='Painel'/>
            <DialogFiltrosTarefas
                aberto={filtrosListagemTarefas}
                status={statusFiltro}
                criadaEm={criadaEmFiltro}
                finalizadaEm={finalizadaEmFiltro}
                onChangeStatus={setStatusFiltro}
                onChangeCriadaEm={setCriadaEmFiltro}
                onChangeFinalizadaEm={setFinalizadaEmFiltro}
                onFechar={() => setFiltrosListagemTarefas(false)}
                onFiltrar={aplicarFiltros}
            />

			<div className="min-h-screen bg-slate-900 p-6 text-white">
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold">Minhas tarefas</h1>
                        <div className='flex flex-row justify-end gap-4 items-stretch'>
                            <button onClick={() => setFiltrosListagemTarefas(true)} className="bg-slate-700 text-white p-1 rounded cursor-pointer hover:bg-slate-600 transition" aria-label="Abrir filtros">
                                <Filter size={24} />
                            </button>
                            <button onClick={() => router.push('/tarefas/cadastrar')}
                                className="flex items-center gap-2 font-semibold text-white text-sm px-2 py-1 rounded bg-orange-500 hover:bg-orange-600 cursor-pointer transition duration-200">
                                <Plus size={14} />
                                Nova tarefa
                            </button>
                        </div>
					</div>

					{carregando ? (
						<p>Carregando tarefas...</p>
					) : tarefas.length === 0 ? (
						<p>Você ainda não tem tarefas.</p>
					) : (
						<ul className="flex flex-col gap-4">
							{tarefas.map((tarefa) => (
								<li key={tarefa.id}>
                                    <Link href={`/tarefas/${tarefa.id}`} className="flex flex-col bg-slate-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                                        <div className="flex flex-col justify-between items-start gap-2">
                                            <div className='flex flex-row justify-between items-start w-full'>
                                                <h2 className="text-base lg:text-lg text-slate-100 font-semibold">{tarefa.titulo}</h2>
                                                <span className={`text-sm font-semibold whitespace-nowrap px-2 py-1 rounded ${statusEstilizacao(tarefa.status)}`}>
                                                    {textoStatus(tarefa.status)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-300 mt-1">
                                                    {tarefa.descricao && tarefa.descricao.length > 150
                                                        ? `${tarefa.descricao.substring(0, 150)}...`
                                                        : tarefa.descricao || 'Sem descrição'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-start gap-6 mt-4 border-t border-slate-700">
                                            <p className="text-xs text-slate-300 mt-2">Criada em: <span className="text-white text-xs font-semibold">{formatarData(tarefa.criada_em)}</span></p>
                                            <p className="text-xs text-slate-300 mt-2">Tempo total: <span className="text-white text-xs font-semibold">{formatarTempo(tarefa.tempo_total)}</span></p>
                                        </div>
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
