'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut, User } from 'lucide-react'

export default function Header({ titulo }: { titulo: string }) {
	const [nome, setNome] = useState('')
	const router = useRouter()

	useEffect(() => {
		const fetchUsuario = async () => {
			try {
				const response = await api.get('/auth/usuariologado')
				setNome(response.data.nome)
			} catch (err) {
                console.error('Erro ao buscar usuário:', err)
				router.push('/usuario/login')
			}
		}

		fetchUsuario()
	}, [router])

	const sair = () => {
		localStorage.removeItem('token')
		router.push('/usuario/login')
	}

	return (
		<header className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
			<h1 className="text-lg font-bold">{titulo}</h1>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<button className="flex items-center gap-2 cursor-pointer hover:bg-slate-700 px-3 py-2 rounded transition">
						<User size={18} className='text-orange-400' />
						<span className="text-base font-semibold">{nome}</span>
					</button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content className="bg-slate-800 text-slate-100 rounded-md shadow-lg p-2 w-40 border border-slate-500" sideOffset={8}>
					<DropdownMenu.Item onClick={sair} className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-slate-700 rounded cursor-pointer">
						<LogOut size={16} className='text-orange-400'/>
						Sair
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>
	)
}
