'use client'

import { useState, useEffect } from 'react'
import api from '@/utils/api'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'


export default function CadastroUsuario() {
	const router = useRouter()

	const [nome, setNome] = useState('')
	const [email, setEmail] = useState('')
	const [senha, setSenha] = useState('')
	const [mostrarSenha, setMostrarSenha] = useState(false)
	const [erro, setErro] = useState<string | null>(null)
	const [emailErro, setEmailErro] = useState('')
	const [carregando, setCarregando] = useState(false)
  	const [verificandoAuth, setVerificandoAuth] = useState(true)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			router.replace('/painel') // redireciona se já estiver logado
		} else {
			setVerificandoAuth(false) // libera a tela se não estiver logado
		}
	}, [router])

	if (verificandoAuth) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-slate-900">
				<p className="text-white font-bold">Aguarde...</p>
			</div>
		)
	}


	const handleCadastro = async (e: React.FormEvent) => {
		e.preventDefault()
		setErro(null)
		setCarregando(true)

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setEmailErro('Email inválido')
			setCarregando(false)
			return
		} else {
			setEmailErro('')
		}

		try {
			await api.post('/auth/registro', { nome, email, senha })
			toast.success(`Usuário ${nome} foi cadastrado com sucesso!`, { duration: 5000 })
			router.push('/usuario/login')
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'response' in err) {
				const axiosError = err as { response?: { data?: { error?: string } } };
				setErro(axiosError.response?.data?.error || 'Erro ao cadastrar usuário');
			} else {
				setErro('Erro ao cadastrar usuário');
			}
		} finally {
			setCarregando(false)
		}
	}


	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
			<h1 className="text-2xl font-bold mb-4">Criar uma conta</h1>
			<form onSubmit={handleCadastro} noValidate className="w-full md:w-3/5 lg:w-5/12 xl:w-4/12 2xl:w-1/4 flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
				<div>
					<label className="block text-sm text-slate-700 font-medium">Nome</label>
					<input
						type="text"
						value={nome}
						onChange={(e) => setNome(e.target.value)}
						required
						className="w-full p-2 border rounded text-slate-800 border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
					/>
				</div>

				<div>
					<label className="block text-sm text-slate-700 font-medium">E-mail</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className={`w-full p-2 border rounded text-slate-800 border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 ${emailErro ? 'border-red-500' : ''}`}
					/>
					{emailErro && <p className="text-red-500 text-sm">{emailErro}</p>}
				</div>

				<div>
					<label className="block text-sm text-slate-700 font-medium">Senha</label>
					<div className="relative">
						<input
							type={mostrarSenha ? 'text' : 'password'}
							value={senha}
							onChange={(e) => setSenha(e.target.value)}
							required
							className="w-full p-2 border rounded text-slate-800 border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 pr-10"
						/>
						<button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="bg-slate-200 rounded-full p-1 absolute right-1.5 top-1.5 text-sm text-slate-800 cursor-pointer">
							{mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
				</div>

				{erro && <p className="text-red-500 text-sm">{erro}</p>}

				<button type="submit" disabled={carregando} className="disabled:opacity-50 w-full font-semibold text-white p-2 rounded bg-orange-500 hover:bg-orange-600 cursor-pointer transition duration-200">
					{carregando ? 'Aguarde...' : 'Cadastrar'}
				</button>

				<div className='flex flex-col items-center'>
					<p className="text-sm text-slate-600">
						Já possui uma conta?{' '}
						<a href="/usuario/login" className="text-orange-500 font-bold hover:underline">
							Clique aqui para entrar
						</a>
					</p>
				</div>
			</form>
		</div>
	)
}
