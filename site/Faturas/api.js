// -------------------------------------------------------------
// Faturas/api.js
// -------------------------------------------------------------
// Aqui ficam apenas as 3 funções de API (getCredentials, getContratos, getTitulos).
// Cada função lança um Error em caso de falha (status ≠ 2xx ou formato inesperado).
// -------------------------------------------------------------

const API_CREDENTIALS_URL = 'https://api.chip7.cc/get-credentials';
const API_CLIENTES_URL    = 'https://chip7.sgp.tsmx.com.br/api/ura/clientes/';
const API_TITULOS_URL     = 'https://chip7.sgp.tsmx.com.br/api/ura/titulos/';

export async function getCredentials() {
  const resp = await fetch(API_CREDENTIALS_URL);
  if (!resp.ok) {
    throw new Error('Não foi possível obter credenciais. Tente novamente mais tarde.');
  }
  const data = await resp.json();
  if (!data.app || !data.token) {
    throw new Error('Resposta de credenciais inválida.');
  }
  return { app: data.app, token: data.token };
}

export async function getContratos(cpfcnpj) {
  const { app, token } = await getCredentials();
  const payload = new URLSearchParams();
  payload.append('app', app);
  payload.append('token', token);
  payload.append('cpfcnpj', cpfcnpj);

  const resp = await fetch(API_CLIENTES_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body:    payload
  });

  if (!resp.ok) {
    throw new Error('Erro ao buscar contratos para este CPF/CNPJ.');
  }

  const data = await resp.json();
  // A API retorna { clientes: [ { contratos: [ { id: …, endereco: { … } }, … ] }, … ] }
  // Precisamos extrair “clientes[0].contratos”
  if (!data.clientes || !Array.isArray(data.clientes) || data.clientes.length === 0) {
    throw new Error('Formato de resposta de contratos inesperado.');
  }
  const primeiroCliente = data.clientes[0];
  if (!primeiroCliente.contratos || !Array.isArray(primeiroCliente.contratos)) {
    throw new Error('Formato de resposta de contratos inesperado.');
  }
  return primeiroCliente.contratos;
}

export async function getTitulos(cpfcnpj, contratoId) {
  const { app, token } = await getCredentials();
  const payload = new URLSearchParams();
  payload.append('app', app);
  payload.append('token', token);
  payload.append('cpfcnpj', cpfcnpj);
  payload.append('contrato', contratoId);

  const resp = await fetch(API_TITULOS_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body:    payload
  });

  if (!resp.ok) {
    throw new Error('Erro ao buscar faturas para este contrato.');
  }

  const data = await resp.json();
  if (!data.titulos || !Array.isArray(data.titulos)) {
    throw new Error('Formato de resposta de faturas inesperado.');
  }
  return data.titulos;
}
