'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/utils/api'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Play, Pause, CheckCircle, Trash2, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Link from 'next/link'
import { formatarData, formatarTempo, statusEstilizacao, textoStatus } from '@/utils/utils'
import DialogConfirmarExclusaoTarefa from '@/components/DialogConfirmarExclusaoTarefa'

export default function TarefaDetalhe() {
	const { id } = useParams()
	const router = useRouter()
	const [tarefa, setTarefa] = useState<any>(null)
	const [carregando, setCarregando] = useState(true)
	const [dialogAberto, setDialogAberto] = useState(false)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (!token) {
			router.push('/usuario/login')
			return
		}

		api.get(`/tarefas/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => setTarefa(res.data))
			.catch(() => toast.error('Erro ao carregar tarefa'))
			.finally(() => setCarregando(false))
	}, [id, router])

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

			toast.success(`Tarefa ${acaoStr} com sucesso`)
			setTarefa((prev: any) => {
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
					// Se iniciar, atualize iniciada_em
					...(acao === 'iniciar' ? { iniciada_em: new Date().toISOString() } : {}),
					// Se pausar ou concluir, zere iniciada_em
					...(acao !== 'iniciar' ? { iniciada_em: null } : {}),
				}
			})

		} catch (err) {
			let mensagemErro = 'Erro ao atualizar status da tarefa'
			if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
				mensagemErro = (err as any).response.data.error
			}
			toast.error(mensagemErro)
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
		} catch(err) {
			let mensagemErro = 'Erro ao remover tarefa'
			if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
				mensagemErro = (err as any).response.data.error
			}
			toast.error(mensagemErro)
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
			<Header />
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
			<div className="max-w-6xl mx-auto mt-10 flex flex-col gap-4">
				<Link href="/painel" className="w-fit flex items-center gap-2 font-semibold text-white text-sm px-2 py-1 rounded bg-orange-500 hover:bg-orange-600 cursor-pointer transition duration-200">
					<ArrowLeft size={14} /> Voltar
				</Link>

				<div className="flex flex-col gap-4 bg-slate-800 rounded-xl p-6 shadow-md">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold text-slate-100">{tarefa.titulo}</h1>
						<span className={`text-base font-semibold px-2 py-1 rounded ${statusEstilizacao(tarefa.status)}`}>
							{textoStatus(tarefa.status)}
						</span>
					</div>
					<p className="text-base text-slate-300">{tarefa.descricao}</p>

					<div className="flex flex-col sm:flex-row gap-6 border-t border-slate-700 pt-4 mt-4">
						<p className="text-sm font-normal text-slate-300">Tempo total: <span className="text-white text-sm font-semibold">{formatarTempo(tarefa.tempo_total)}</span></p>
						<p className="text-sm font-normal text-slate-300">Criada em: <span className="text-white text-sm font-semibold">{formatarData(tarefa.criada_em)}</span></p>
						<p className="text-sm font-normal text-slate-300">Atualizada em: <span className="text-white text-sm font-semibold">{formatarData(tarefa.atualizada_em)}</span></p>
						{tarefa.status == 'concluída' && (
							<p className="text-sm font-normal text-slate-300">Concluída em: <span className="text-white text-sm font-semibold">{formatarData(tarefa.finalizada_em)}</span></p>
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
							<CheckCircle size={18} />
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
