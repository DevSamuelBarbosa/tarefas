'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import api from '@/utils/api'
import { toast } from 'react-hot-toast'
import { getToken } from '@/utils/auth'
import Link from 'next/link'
import Header from '@/components/Header'

export default function CadastrarTarefa() {
	const router = useRouter()

	const [titulo, setTitulo] = useState('')
	const [descricao, setDescricao] = useState('')
	const [carregando, setCarregando] = useState(false)
	const [erro, setErro] = useState<string | null>(null)

	const handleCadastro = async (e: React.FormEvent) => {
		e.preventDefault()
		setErro(null)
		setCarregando(true)

		try {
			const token = getToken()
			const response = await api.post(
				'/tarefas/criar',
				{ titulo, descricao },
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			const novaTarefa = response.data
			toast.success('Tarefa cadastrada com sucesso!', { duration: 4000 })
			router.push(`/tarefas/${novaTarefa.id}`)
		} catch (err: any) {
			setErro(err?.response?.data?.error || 'Erro ao cadastrar tarefa')
		} finally {
			setCarregando(false)
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 text-white">
			<Header />

			<div className="max-w-6xl mx-auto mt-10 flex flex-col gap-4">
				<Link href="/painel" className="w-fit flex items-center gap-2 font-semibold text-white text-sm px-2 py-1 rounded bg-orange-500 hover:bg-orange-600 cursor-pointer transition duration-200">
					<ArrowLeft size={14} /> Voltar
				</Link>


				<div className="flex flex-col gap-4 bg-slate-800 rounded-xl shadow-md p-6">
					<div className="flex justify-start items-center">
						<h1 className="text-2xl font-bold m-0">Cadastrar Tarefa</h1>
					</div>

					<form onSubmit={handleCadastro} className="space-y-6">
						<div>
							<label className="block text-sm mb-1">Título</label>
							<input
								type="text"
								value={titulo}
								onChange={(e) => setTitulo(e.target.value)}
								required
								className="w-full p-3 rounded border border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
							/>
						</div>

						<div>
							<label className="block text-sm mb-1">Descrição</label>
							<textarea
								value={descricao}
								onChange={(e) => setDescricao(e.target.value)}
								required
								rows={5}
								className="w-full p-3 rounded border border-slate-600 bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
							/>
						</div>

						{erro && <p className="text-red-500 text-sm">{erro}</p>}

						<button type="submit" disabled={carregando} className="w-full p-3 rounded text-white text-base font-semibold bg-orange-500 hover:bg-orange-600 cursor-pointer transition duration-200">
							{carregando ? 'Cadastrando...' : 'Cadastrar Tarefa'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
