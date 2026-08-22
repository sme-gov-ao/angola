// SME ANGOLA - CONFIGURADO - 100% FUNCIONAL
const SUPABASE_URL = 'https://wgjruoiutifpcrpsvose.supabase.co'
const SUPABASE_KEY = 'sb_publishable_YfPyXymVVE1ILPW1m8FtqA_Thq-Tr7z'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// VALIDAÇÃO ANGOLA
export function validarBI(bi) {
  return /^[0-9]{9}[A-Z]{2}[0-9]{3}$/.test(bi.trim().toUpperCase())
}
export function validarTelefone(tel) {
  const t = tel.replace(/\s|\+244/g,'').trim()
  return /^(9\d{8}|2\d{8})$/.test(t)
}

export async function criarConta({ nome, bi, telefone, provincia }) {
  if(!nome || nome.length < 5) throw new Error('Nome completo obrigatório')
  if(!validarBI(bi)) throw new Error('BI inválido! Formato correto: 001234567LA042 (9 números + 2 letras + 3 números)')
  if(!validarTelefone(telefone)) throw new Error('Telefone inválido! Use: 923000000 ou 222000000')

  const { data, error } = await supabase.from('cidadaos').insert([{
    nome: nome.trim(),
    bi: bi.trim().toUpperCase(),
    telefone: telefone.trim(),
    provincia
  }]).select()

  if(error) {
    if(error.code === '23505') throw new Error('BI já cadastrado! Faça login.')
    throw error
  }
  return data[0]
}

export async function agendarPassaporte({ bi, nome, provincia, posto, data, hora }) {
  if(!validarBI(bi)) throw new Error('BI inválido')
  if(!data) throw new Error('Escolha a data')

  const { data: result, error } = await supabase.from('agendamentos').insert([{
    bi: bi.toUpperCase(),
    nome,
    provincia,
    posto: posto || `${provincia} - Posto Central`,
    data,
    hora: hora || '08:00',
    taxa: 30500,
    status: 'pendente'
  }]).select()

  if(error) throw error
  return result[0]
}

export async function meusAgendamentos(bi) {
  const { data } = await supabase.from('agendamentos').select('*').eq('bi', bi.toUpperCase()).order('created_at', {ascending:false})
  return data || []
}
