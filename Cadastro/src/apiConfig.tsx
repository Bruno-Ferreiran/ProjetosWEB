import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Endpoint para obter as credenciais (app e token) do backend
const BACKEND_CREDENTIALS_URL = "https://api.chip7.cc/get-credentials";

// Endpoints para pré-cadastro
const ENDPOINT_PF = "https://chip7.sgp.tsmx.com.br/api/precadastro/F";
const ENDPOINT_PJ = "https://chip7.sgp.tsmx.com.br/api/precadastro/J";

// Função para obter credenciais do backend (dinamicamente)
const getCredentials = async () => {
  try {
    const response = await axios.get(BACKEND_CREDENTIALS_URL);
    // O endpoint deve retornar um objeto { app: string, token: string }
    return response.data;
  } catch (error) {
    console.error("Erro ao obter credenciais:", error);
    // Removemos o toast.error daqui para evitar duplicidade
    throw new Error("Erro ao obter credenciais");
  }
};

// Função auxiliar para criar dados URL-encoded a partir do objeto 'dados' e das credenciais obtidas
const createUrlEncodedData = (
  dados: Record<string, any>,
  credentials: { app: string; token: string }
): string => {
  const params = new URLSearchParams();
  // Adiciona as credenciais obtidas dinamicamente
  params.append("app", credentials.app);
  params.append("token", credentials.token);
  // Adiciona todas as outras propriedades do objeto 'dados'
  Object.keys(dados).forEach((key) => {
    if (dados[key] !== undefined && dados[key] !== null) {
      params.append(key, String(dados[key]));
    }
  });
  return params.toString();
};

// Função para enviar cadastro de Pessoa Física
export const enviarCadastroPf = async (dados: Record<string, any>): Promise<any> => {
  try {
    // Obtém as credenciais dinamicamente
    const credentials = await getCredentials();
    // Cria o payload URL-encoded (form data)
    const payload = createUrlEncodedData(dados, credentials);
    const response = await axios.post(ENDPOINT_PF, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    });
    toast.success("Cadastro de Pessoa Física enviado com sucesso!");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao enviar cadastro PF:", error);
    toast.error("Erro ao enviar cadastro de Pessoa Física. Verifique os dados e tente novamente.");
    throw new Error("Erro ao enviar cadastro PF");
  }
};

// Função para enviar cadastro de Pessoa Jurídica
export const enviarCadastroPj = async (dados: Record<string, any>): Promise<any> => {
  try {
    const credentials = await getCredentials();
    const payload = createUrlEncodedData(dados, credentials);
    const response = await axios.post(ENDPOINT_PJ, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      maxBodyLength: Infinity,
    });
    toast.success("Cadastro de Pessoa Jurídica enviado com sucesso!");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao enviar cadastro PJ:", error);
    toast.error("Erro ao enviar cadastro de Pessoa Jurídica. Verifique os dados e tente novamente.");
    throw new Error("Erro ao enviar cadastro PJ");
  }
};
