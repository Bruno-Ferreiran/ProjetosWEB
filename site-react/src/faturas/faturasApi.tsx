// src/faturas/faturasApi.ts
const API_CREDENTIALS_URL = 'https://api.chip7.cc/get-credentials'
const API_CLIENTES_URL = 'https://chip7.sgp.tsmx.com.br/api/ura/clientes/'
const API_TITULOS_URL = 'https://chip7.sgp.tsmx.com.br/api/ura/titulos/'

// Tipagens simples
interface Credentials {
  app: string
  token: string
}

interface Contrato {
  id: string
  endereco?: {
    [key: string]: any
  }
  [key: string]: any
}

interface Cliente {
  contratos: Contrato[]
}

interface Titulo {
  id: string
  valor: number
  vencimento: string
  status: string
  [key: string]: any
}

// ✅ Função para buscar app + token
export async function getCredentials(): Promise<Credentials> {
  const resp = await fetch(API_CREDENTIALS_URL)
  if (!resp.ok) {
    throw new Error('Não foi possível obter credenciais. Tente novamente mais tarde.')
  }
  const data = await resp.json()
  if (!data.app || !data.token) {
    throw new Error('Resposta de credenciais inválida.')
  }
  return { app: data.app, token: data.token }
}

// ✅ Função para buscar contratos com base no CPF/CNPJ
export async function getContratos(cpfcnpj: string): Promise<Contrato[]> {
  const { app, token } = await getCredentials()
  const payload = new URLSearchParams()
  payload.append('app', app)
  payload.append('token', token)
  payload.append('cpfcnpj', cpfcnpj)

  const resp = await fetch(API_CLIENTES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: payload
  })

  if (!resp.ok) {
    throw new Error('Erro ao buscar contratos para este CPF/CNPJ.')
  }

  const data = await resp.json()

  if (!Array.isArray(data.clientes) || data.clientes.length === 0) {
    throw new Error('Formato de resposta de contratos inesperado.')
  }

  const primeiroCliente: Cliente = data.clientes[0]

  if (!Array.isArray(primeiroCliente.contratos)) {
    throw new Error('Formato de resposta de contratos inesperado.')
  }

  return primeiroCliente.contratos
}

// ✅ Função para buscar os títulos (faturas) de um contrato
export async function getTitulos(cpfcnpj: string, contratoId: string): Promise<Titulo[]> {
  const { app, token } = await getCredentials()
  const payload = new URLSearchParams()
  payload.append('app', app)
  payload.append('token', token)
  payload.append('cpfcnpj', cpfcnpj)
  payload.append('contrato', contratoId)

  const resp = await fetch(API_TITULOS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: payload
  })

  if (!resp.ok) {
    throw new Error('Erro ao buscar faturas para este contrato.')
  }

  const data = await resp.json()
  if (!Array.isArray(data.titulos)) {
    throw new Error('Formato de resposta de faturas inesperado.')
  }

  return data.titulos
}
