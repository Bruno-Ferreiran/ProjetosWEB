import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { enviarCadastroPj } from "../apiConfig";
import { toast } from "react-toastify";
import axios from "axios";
import "../style.css";

// Função para formatar CPF ou CNPJ (aplicada no campo cpfcnpj)
function formatCpfCnpj(value: string): string {
  if (!value) return "";
  if (value.length <= 11) {
    const part1 = value.substring(0, 3);
    const part2 = value.substring(3, 6);
    const part3 = value.substring(6, 9);
    const part4 = value.substring(9, 11);
    let formatted = part1;
    if (part2) formatted += "." + part2;
    if (part3) formatted += "." + part3;
    if (part4) formatted += "-" + part4;
    return formatted;
  } else {
    const part1 = value.substring(0, 2);
    const part2 = value.substring(2, 5);
    const part3 = value.substring(5, 8);
    const part4 = value.substring(8, 12);
    const part5 = value.substring(12, 14);
    let formatted = part1;
    if (part2) formatted += "." + part2;
    if (part3) formatted += "." + part3;
    if (part4) formatted += "/" + part4;
    if (part5) formatted += "-" + part5;
    return formatted;
  }
}

// Função para formatar o WhatsApp: (99) 99999-9999
function formatCelular(value: string): string {
  if (!value) return "";
  const part1 = value.substring(0, 2);
  const part2 = value.substring(2, 7);
  const part3 = value.substring(7, 11);
  let formatted = "";
  if (part1) formatted = "(" + part1 + ")";
  if (part2) formatted += " " + part2;
  if (part3) formatted += "-" + part3;
  return formatted;
}

// Função para formatar o CEP: 99999-999
function formatCep(value: string): string {
  if (!value) return "";
  const part1 = value.substring(0, 5);
  const part2 = value.substring(5, 8);
  let formatted = part1;
  if (part2) formatted += "-" + part2;
  return formatted;
}

// Mapas para os selects (texto a ser enviado)
const instalacaoMapping: Record<string, string> = {
  "1": "R$0,00 - Fidelidade 12 Meses",
  "2": "R$299,00 - Sem Fidelidade",
};

const pontoAdicionalMapping: Record<string, string> = {
  "1": "Roteador extra - R$30,00",
  "2": "Roteador AX3000 Premium - R$50,00",
};

const adicionaisMapping: Record<string, string> = {
  "1": "Telefone ilimitado - R$50,00",
  "2": "IP fixo - R$50,00",
  "3": "Telefone ilimitado e IP fixo - R$100,00",
  "0": "Nenhum adicional",
};

const PJ = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomefantasia: "",
    cpfcnpj: "",
    nome: "",
    email: "",
    celular: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    plano_id: "",
    vencimento_id: "",
    vendedor_id: "",
    instalacao: "",
    ponto_adicional: "",
    quantidade_ponto: "1",
    adicionais: "",
    observacao: "",
  });

  // Função para buscar o endereço pelo CEP
  const buscarCEP = async (cep: string) => {
    if (cep.replace(/\D/g, "").length !== 8) {
      toast.error("CEP inválido. Deve conter exatamente 8 dígitos.");
      return;
    }
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`
      );
      if (response.data.erro) {
        throw new Error("CEP não encontrado.");
      }
      setFormData((prevData) => ({
        ...prevData,
        logradouro: response.data.logradouro || prevData.logradouro,
        bairro: response.data.bairro || prevData.bairro,
        cidade: response.data.localidade || prevData.cidade,
        uf: response.data.uf || prevData.uf,
      }));
    } catch (error: any) {
      toast.error("Erro ao buscar o CEP: " + error.message);
      setFormData((prevData) => ({
        ...prevData,
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
      }));
    }
  };

  // Atualiza os campos do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;
    // Remove caracteres não numéricos para campos específicos
    if (["cpfcnpj", "celular", "cep", "numero", "quantidade_ponto"].includes(name)) {
      updatedValue = value.replace(/\D/g, "");
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
    if (name === "cep" && updatedValue.length === 8) {
      buscarCEP(updatedValue);
    }
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const camposObrigatorios = [
      "nomefantasia",
      "cpfcnpj",
      "nome",
      "email",
      "celular",
      "cep",
      "logradouro",
      "numero",
      "bairro",
      "cidade",
      "uf",
      "plano_id",
      "vencimento_id",
      "vendedor_id",
      "instalacao",
    ];
    if (camposObrigatorios.some((campo) => formData[campo as keyof typeof formData] === "")) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    // Converte os valores dos selects para os textos correspondentes e constrói a observação
    let observacao = formData.observacao || "";
    if (formData.ponto_adicional && formData.ponto_adicional !== "") {
      const pontoAdicionalText = pontoAdicionalMapping[formData.ponto_adicional] || "";
      observacao += ` | Ponto Adicional: ${pontoAdicionalText} - Quantidade: ${formData.quantidade_ponto}`;
    }
    if (formData.adicionais && formData.adicionais !== "") {
      const adicionaisText = adicionaisMapping[formData.adicionais] || "";
      observacao += ` | Adicionais: ${adicionaisText}`;
    }
    if (formData.instalacao && formData.instalacao !== "") {
      const instalacaoText = instalacaoMapping[formData.instalacao] || "";
      observacao += ` | Instalação: ${instalacaoText}`;
    }

    const dadosParaEnvio = {
      ...formData,
      // Substitui os valores dos selects pelos textos
      instalacao: formData.instalacao ? instalacaoMapping[formData.instalacao] : "",
      adicionais: formData.adicionais ? adicionaisMapping[formData.adicionais] : "",
      ponto_adicional: formData.ponto_adicional ? pontoAdicionalMapping[formData.ponto_adicional] : "",
      observacao,
      pais: "BR",
    };

    try {
      setIsLoading(true);
      await enviarCadastroPj(dadosParaEnvio);
      toast.success("Pré-cadastro realizado com sucesso!");
      setTimeout(() => navigate("/sucesso"), 2000);
    } catch (error) {
      console.error("Erro ao enviar o formulário PJ:", error);
      // Removemos o toast.error aqui para evitar duplicidade, pois a API já exibe o toast de erro.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="outer-container">
        <header className="header-container">
          <img src="/logo1.png" alt="Logo" className="logo" />
          <div className="divider"></div>
          <h1 className="title">Pré-Cadastro de Pessoa Jurídica</h1>
        </header>
        <div className="content-container">
          <form onSubmit={handleSubmit}>
            <div className="pj-form-grid">
              {/* Nome Fantasia */}
              <div className="form-group">
                <label>Nome Fantasia:</label>
                <input
                  type="text"
                  name="nomefantasia"
                  value={formData.nomefantasia}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu nome fantasia"
                />
              </div>

              {/* CPF/CNPJ com formatação */}
              <div className="form-group">
                <label>CNPJ:</label>
                <input
                  type="text"
                  name="cpfcnpj"
                  value={formatCpfCnpj(formData.cpfcnpj)}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu CNPJ"
                  inputMode="numeric"
                />
              </div>

              {/* Razão Social */}
              <div className="form-group">
                <label>Razão Social:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Digite a razão social"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Digite o email"
                />
              </div>

              {/* WhatsApp com formatação */}
              <div className="form-group">
                <label>WhatsApp:</label>
                <input
                  type="text"
                  name="celular"
                  value={formatCelular(formData.celular)}
                  onChange={handleChange}
                  required
                  placeholder="Digite o WhatsApp"
                  inputMode="numeric"
                />
              </div>

              {/* CEP com formatação */}
              <div className="form-group">
                <label>CEP:</label>
                <input
                  type="text"
                  name="cep"
                  value={formatCep(formData.cep)}
                  onChange={handleChange}
                  required
                  placeholder="Digite o CEP"
                  inputMode="numeric"
                />
              </div>

              {/* Rua */}
              <div className="form-group">
                <label>Rua:</label>
                <input
                  type="text"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                  required
                  placeholder="Digite a rua"
                />
              </div>

              {/* Bairro */}
              <div className="form-group">
                <label>Bairro:</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                  placeholder="Digite o bairro"
                />
              </div>

              {/* Cidade */}
              <div className="form-group">
                <label>Cidade:</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  placeholder="Digite a cidade"
                />
              </div>

              {/* UF */}
              <div className="form-group">
                <label>UF:</label>
                <select name="uf" value={formData.uf} onChange={handleChange} required>
                  <option value="" disabled>
                    Selecione o estado
                  </option>
                  {[
                    "AC",
                    "AL",
                    "AP",
                    "AM",
                    "BA",
                    "CE",
                    "DF",
                    "ES",
                    "GO",
                    "MA",
                    "MT",
                    "MS",
                    "MG",
                    "PA",
                    "PB",
                    "PR",
                    "PE",
                    "PI",
                    "RJ",
                    "RN",
                    "RS",
                    "RO",
                    "RR",
                    "SC",
                    "SP",
                    "SE",
                    "TO",
                  ].map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Número */}
              <div className="form-group">
                <label>Número:</label>
                <input
                  type="tel"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                  placeholder="Digite o número"
                  inputMode="numeric"
                />
              </div>

              {/* Complemento */}
              <div className="form-group">
                <label>Complemento:</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Digite o complemento"
                />
              </div>

              {/* Plano de Internet */}
              <div className="form-group">
                <label>Plano de Internet:</label>
                <select name="plano_id" value={formData.plano_id} onChange={handleChange} required>
                  <option value="" disabled>
                    Selecione o plano
                  </option>
                  <option value="59">100MB - R$89,00</option>
                  <option value="35">200MB - R$99,00</option>
                  <option value="71">400MB - R$119,00</option>
                  <option value="81">
                    700MB -  R$ 149,00 c/ desconto por R$ 129,00 para pagamento até data de vencimento
                  </option>
                  <option value="82">
                    1GB - R$ 199,00 c/ desconto por R$ 169,00 para pagamento até data de vencimento
                  </option>
                  <option value="85">2GB - R$299,00</option>
                </select>
              </div>

              {/* Vencimento */}
              <div className="form-group">
                <label>Vencimento:</label>
                <select name="vencimento_id" value={formData.vencimento_id} onChange={handleChange} required>
                  <option value="" disabled>
                    Selecione o vencimento
                  </option>
                  <option value="3">Dia 5</option>
                  <option value="1">Dia 10</option>
                  <option value="2">Dia 15</option>
                </select>
              </div>
              
              
              <div className="form-group">
                <label>Vendedor:</label>
                <select name="vendedor_id" value={formData.vendedor_id} onChange={handleChange} required>
                  <option value="" disabled>
                    Selecione o vendedor
                  </option>
                  <option value="1">Renan Quevedo Peres</option>
                  <option value="3">Marcio Berndt Afonso</option>
                  <option value="4">Casarão Imóveis</option>
                </select>
              </div>
              
              {/* Instalação */}
              <div className="form-group">
                <label>Instalação:</label>
                <select name="instalacao" value={formData.instalacao} onChange={handleChange} required>
                  <option value="" disabled>
                    Selecione a instalação
                  </option>
                  <option value="1">R$0,00 - Fidelidade 12 Meses</option>
                  <option value="2">R$299,00 - Sem Fidelidade</option>
                </select>
              </div>

              {/* Ponto Adicional */}
              <div className="form-group">
                <label>Ponto Adicional:</label>
                <select name="ponto_adicional" value={formData.ponto_adicional} onChange={handleChange}>
                  <option value="">Sem ponto adicional</option>
                  <option value="1">Roteador extra - R$30,00</option>
                  <option value="2">Roteador AX3000 Premium - R$50,00</option>
                </select>
              </div>
              {formData.ponto_adicional && formData.ponto_adicional !== "" && (
                <div className="form-group">
                  <label>Quantidade:</label>
                  <input
                    type="number"
                    name="quantidade_ponto"
                    value={formData.quantidade_ponto}
                    onChange={handleChange}
                    min="1"
                    placeholder="Quantidade de Pontos"
                  />
                </div>
              )}

              {/* Adicionais */}
              <div className="form-group">
                <label>Adicionais:</label>
                <select name="adicionais" value={formData.adicionais} onChange={handleChange}>
                  <option value="" disabled>
                    Selecione um adicional
                  </option>
                  <option value="1">Telefone ilimitado - R$50,00</option>
                  <option value="2">IP fixo - R$50,00</option>
                  <option value="3">Telefone ilimitado e IP fixo - R$100,00</option>
                  <option value="0">Nenhum adicional</option>
                </select>
              </div>

              {/* Observação */}
              <div className="form-group full-width">
                <label>Observação:</label>
                <textarea
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleChange}
                  className="full-width"
                  placeholder="Digite a observação"
                ></textarea>
              </div>
            </div>
            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Pré-Cadastro"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PJ;
