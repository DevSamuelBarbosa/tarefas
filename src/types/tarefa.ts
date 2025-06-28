export interface Tarefa {
    id: number;
    titulo: string;
    descricao?: string;
    status: string;
    criada_em: string;
    atualizada_em: string;
    finalizada_em?: string;
    iniciada_em?: string;
    tempo_total: number;
}
