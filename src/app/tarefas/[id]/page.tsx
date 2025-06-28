'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/utils/api'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Play, Pause, Trash2, Loader2, CheckCircleIcon, SaveIcon } from 'lucide-react'
import Header from '@/components/Header'
import Link from 'next/link'
import { formatarData, formatarTempo, statusEstilizacao, textoStatus } from '@/utils/utils'
import DialogConfirmarExclusaoTarefa from '@/components/DialogConfirmarExclusaoTarefa'
import { Tarefa } from '@/types/tarefa'
import { AxiosError } from 'axios';

export default function TarefaDetalhe() {

	const { id } = useParams()
	const router = useRouter()
	const [tarefa, setTarefa] = useState<Tarefa | null>(null)
	const [carregando, setCarregando] = useState(true)
	const [dialogAberto, setDialogAberto] = useState(false)
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
	const [editado, setEditado] = useState(false)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (!token) {
			router.push('/usuario/login')
			return
		}

		api.get(`/tarefas/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				setTarefa(res.data)
				setTitulo(res.data.titulo)
				setDescricao(res.data.descricao)
			})
			.catch(() => toast.error('Erro ao carregar tarefa'))
			.finally(() => setCarregando(false))
	}, [id, router])

	useEffect(() => {
		if (!tarefa) return

		if (titulo !== tarefa.titulo || descricao !== tarefa.descricao) {
			setEditado(true)
		} else {
			setEditado(false)
		}
	}, [titulo, descricao, tarefa])

	const atualizarStatus = async (acao: 'iniciar' | 'pausar' | 'concluir') => {
		try {
			const token = localStorage.getItem('token')
			await api.put(`/tarefas/${id}/${acao}`, {}, {
				headers: { Authorization: `Bearer ${token}` },
			})

			let acaoStr = ''
			switch (acao) {
				case 'iniciar':
					acaoStr = 'iniciada'
					break
				case 'pausar':
					acaoStr = 'pausada'
					break
				case 'concluir':
					acaoStr = 'concluída'
					break
			}

			toast.success(`Tarefa ${acaoStr} com sucesso!`)

			setTarefa((prev: Tarefa | null) => {
				if (!prev) return prev

				let novoTempoTotal = prev.tempo_total

				// Supondo que prev.iniciada_em armazene o último momento em que a tarefa foi iniciada
				if ((acao === 'pausar' || acao === 'concluir') && prev.iniciada_em) {
					const agora = Date.now()
					const inicio = new Date(prev.iniciada_em).getTime()
					novoTempoTotal += Math.floor((agora - inicio) / 1000) // soma segundos
				}

				return {
					...prev,
					status: acaoStr,
					tempo_total: novoTempoTotal,
					atualizada_em: new Date().toISOString(),
					iniciada_em: acao === 'iniciar' ? new Date().toISOString() : undefined,
				}
			})

		} catch (err: unknown) {
			let mensagemErro = 'Erro ao atualizar status da tarefa'
           
            if (err instanceof AxiosError && err.response?.data?.error) {
                mensagemErro = err.response.data.error;
            }

            toast.error(mensagemErro);
		}
	}

	const removerTarefa = async () => {
		try {
			const token = localStorage.getItem('token')
			await api.delete(`/tarefas/${id}/remover`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			toast.success('Tarefa removida com sucesso!')
			router.push('/painel')
		} catch(err: unknown) {
			let mensagemErro = 'Erro ao remover tarefa'
            if (err instanceof AxiosError && err.response?.data?.error) {
                mensagemErro = err.response.data.error;
            }
			toast.error(mensagemErro)
		}
	}

	const salvarEdicao = async () => {
		try {
			await api.put(`/tarefas/editar/${id}`, {
				titulo,
				descricao
			}, {
				headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
			})
			setEditado(false)

			toast.success('Alterações salvas com sucesso!')
			setTarefa((prev: Tarefa | null) => {
				if (!prev) return prev
				return {
					...prev,
					titulo,
					descricao,
					atualizada_em: new Date().toISOString()
				}
			})

		} catch (error) {
			console.error('Erro ao salvar alterações:', error)
		}
	}

	if (carregando) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
				<Loader2 className="animate-spin mb-4" size={40} />
				<p className="text-xl font-medium">Aguarde</p>
			</div>
		)
	}

	if (!tarefa) return null

	return (
		<div className="min-h-screen bg-slate-900 text-white">
			<Header titulo='Tarefa' />
			<DialogConfirmarExclusaoTarefa
				aberto={dialogAberto}
				titulo="Remover tarefa"
				mensagem="Tem certeza que deseja remover essa tarefa?"
				onConfirmar={() => {
					setDialogAberto(false)
					removerTarefa()
				}}
				onCancelar={() => setDialogAberto(false)}
			/>
			<div className="max-w-6xl p-6 mx-auto flex flex-col gap-4">
                <div className='flex items-center justify-between gap-2'>
                    <Link href="/painel" className="w-fit flex items-center gap-2 font-semibold text-white text-sm px-2 py-1 rounded bg-orange-500 hover:bg-orange-600 cursor-pointer transition duration-200">
                        <ArrowLeft size={14} /> Voltar
                    </Link>
                    
                    <span className={`text-base font-semibold px-2 py-1 rounded ${statusEstilizacao(tarefa.status)}`}>
                        {textoStatus(tarefa.status)}
                    </span>
                </div>

				<div className="flex flex-col gap-4 bg-slate-800 rounded-xl p-4 lg:p-6 shadow-md">
					<div className="flex justify-between items-start gap-4">
						<div className="flex-1">
                            <label className="block text-sm mb-1">Título</label>
							<input
								value={titulo}
								onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Título da tarefa"
                                maxLength={256}
								className="bg-slate-700 text-white text-sm lg:text-base p-2 rounded w-full outline-none"
							/>
						</div>
                    </div>

                    <div className='w-full'>
                        <label className="block text-sm mb-1">Descrição</label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descrição da tarefa"
                            maxLength={2000}
                            className="w-full bg-slate-700 text-white text-xs lg:text-sm p-2 leading-6 lg:leading-5 rounded resize-none min-h-[50vh] lg:min-h-[30vh] outline-none"
                        />
                    </div>

					{editado && (
						<div className="flex justify-end">
							<button onClick={salvarEdicao} className="bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded flex items-center gap-2 text-white font-semibold text-sm transition cursor-pointer">
								<SaveIcon size={16} /> Salvar alterações
							</button>
						</div>
					)}


					<div className="flex flex-col sm:flex-row gap-4 lg:gap-6 border-t border-slate-700 pt-4 mt-4 text-xs lg:text-sm text-slate-300">
						<p>Tempo total: <span className="text-white text-xs lg:text-sm font-semibold">{formatarTempo(tarefa.tempo_total)}</span></p>
						<p>Criada em: <span className="text-white text-xs lg:text-sm font-semibold">{formatarData(tarefa.criada_em)}</span></p>
						<p>Atualizada em: <span className="text-white text-xs lg:text-sm font-semibold">{formatarData(tarefa.atualizada_em)}</span></p>
						{tarefa.status === 'concluída' && tarefa.finalizada_em && (
							<p>Concluída em: <span className="text-white text-xs lg:text-sm font-semibold">{formatarData(tarefa.finalizada_em)}</span></p>
						)}
					</div>

					<div className="flex flex-row gap-4 mt-6 justify-end">
						<button onClick={() => atualizarStatus('iniciar')} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition duration-300">
							<Play size={18} />
						</button>
						<button onClick={() => atualizarStatus('pausar')} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition duration-300">
							<Pause size={18} />
						</button>
						<button onClick={() => atualizarStatus('concluir')} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition duration-300">
							<CheckCircleIcon size={18} />
						</button>
						<button onClick={() => setDialogAberto(true)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2 cursor-pointer transition duration-300">
							<Trash2 size={18} />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
