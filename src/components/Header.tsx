'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'

export default function Header() {
	const [nome, setNome] = useState('')
	const router = useRouter()

	useEffect(() => {
		const fetchUsuario = async () => {
			try {
				const response = await api.get('/auth/usuariologado')
				setNome(response.data.nome)
			} catch (err) {
				router.push('/usuario/login')
			}
		}

		fetchUsuario()
	}, [])

	const sair = () => {
		localStorage.removeItem('token')
		router.push('/usuario/login')
	}

	return (
		<header className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
			<h1 className="text-lg font-bold">Painel</h1>
			<div className="flex items-center gap-4">
				<span className="text-base font-bold">{nome}</span>
				<button onClick={sair} className="bg-slate-300 hover:bg-slate-400 px-3 py-1 rounded text-sm text-slate-800 cursor-pointer transition duration-200">
					Sair
				</button>
			</div>
		</header>
	)
}
