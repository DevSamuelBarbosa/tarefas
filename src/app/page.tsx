'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function Home() {
	const router = useRouter()

	useEffect(() => {
		const token = localStorage.getItem('token')

		if (token) {
			router.replace('/painel')
		} else {
			router.replace('/usuario/login')
		}
	}, [router])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
			<Loader2 className="animate-spin mb-4" size={40} />
			<p className="text-xl font-medium">Aguarde</p>
		</div>
	)
}
