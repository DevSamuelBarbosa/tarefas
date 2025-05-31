export function formatarData(dataStr: string) {
    const data = new Date(dataStr)
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()
    let horas = data.getHours()
    const minutos = String(data.getMinutes()).padStart(2, '0')
    const ampm = horas >= 12 ? 'PM' : 'AM'
    horas = horas % 12
    horas = horas ? horas : 12 // 0 => 12
    return `${dia}/${mes}/${ano} ${horas}:${minutos} ${ampm}`
}

export function formatarTempo(segundos: number) {
    const h = Math.floor(segundos / 3600)
    const m = Math.floor((segundos % 3600) / 60)
    const s = Math.floor(segundos % 60)
    return [h, m, s]
        .map((v) => String(v).padStart(2, '0'))
        .join(':')
}

export function textoStatus(textoStatus: string) {
    switch (textoStatus) {
        case 'criada':
            return 'Aberta'
        case 'iniciada':
            return 'Em andamento'
        case 'pausada':
            return 'Pausada'
        case 'concluída':
            return 'Concluída'
        default:
            return ''
    }
}

export function statusEstilizacao(status: string) {
    switch (status) {
        case 'criada':
            return 'bg-slate-200 text-slate-900'
        case 'iniciada':
            return 'bg-blue-600 text-white'
        case 'pausada':
            return 'bg-yellow-500 text-white'
        case 'concluída':
            return 'bg-green-600 text-white'
        default:
            return ''
    }
}