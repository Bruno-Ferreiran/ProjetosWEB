
import React, { useEffect, useState, useRef } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiCopy,
  FiFileText
} from 'react-icons/fi';
import { getCredentials, getTitulos } from './faturasApi';

interface Fatura {
  valor: number | string;
  dataVencimento: string;
  status: string;
  linhaDigitavel?: string;
  codigoPix?: string;
  link?: string;
}

interface Cliente {
  nome: string;
  contratos: Array<{
    id: number;
    endereco: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      uf: string;
    };
  }>;
}

interface Props {
  cpfCnpj: string;
  contratoId: number;
}

const MES_NOMES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

export default function FaturasLista({ cpfCnpj, contratoId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [grupos, setGrupos] = useState<Record<string, Fatura[]>>({});
  const [mesesData, setMesesData] = useState<
    Array<{ chave: string; nomeMes: string; ano: string; statusNum: number }>
  >([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedLinha, setCopiedLinha] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const monthsNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  // centraliza mês ativo
  useEffect(() => {
    if (!loading && monthsNavRef.current) {
      const active = monthsNavRef.current.querySelector('.month-tab.active');
      active?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [loading, selectedIdx]);

  async function fetchAll() {
    try {
      const { app, token } = await getCredentials();
      const cliente = await fetchCliente(cpfCnpj, app, token);
      setClienteNome(cliente.nome);
      const ct = cliente.contratos.find(c => c.id === contratoId);
      if (ct) {
        const e = ct.endereco;
        setEndereco(
          `${e.logradouro}, ${e.numero}${e.complemento ? ' ‒ ' + e.complemento : ''} ‒ ${e.bairro}, ${e.cidade}/${e.uf}`
        );
      }
      const titulos = await getTitulos(cpfCnpj, contratoId);
      if (!titulos.length) {
        setError('Nenhuma fatura encontrada para este contrato.');
        return;
      }
      const gruposMap: Record<string, Fatura[]> = {};
      titulos.forEach(f => {
        if (!f.dataVencimento) return;
        const dt = new Date(f.dataVencimento);
        const chave = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
        gruposMap[chave] = gruposMap[chave] || [];
        gruposMap[chave].push(f);
      });
      const chaves = Object.keys(gruposMap).sort();
      const md = chaves.map(chave => {
        const [ano, mesStr] = chave.split('-');
        const mesNum = parseInt(mesStr, 10);
        return {
          chave,
          nomeMes: MES_NOMES[mesNum - 1],
          ano,
          statusNum: classifyMonth(gruposMap[chave])
        };
      });
      setGrupos(gruposMap);
      setMesesData(md);
      const hojeKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      const idx = md.findIndex(m => m.chave === hojeKey);
      setSelectedIdx(idx >= 0 ? idx : md.length - 1);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar faturas.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCliente(cpf: string, app: string, token: string): Promise<Cliente> {
    const res = await fetch('https://chip7.sgp.tsmx.com.br/api/ura/clientes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ app, token, cpfcnpj: cpf }).toString()
    });
    if (!res.ok) throw new Error('Erro ao buscar cliente');
    const json = await res.json();
    return json.clientes[0];
  }

  function classifyFatura(f: Fatura): number {
    const hoje = new Date();
    if (f.status.toLowerCase() === 'pago') return 2;
    if (f.dataVencimento && new Date(f.dataVencimento) < hoje) return 0;
    return 1;
  }

  function classifyMonth(fats: Fatura[]): number {
    let atrasado = false;
    let todosPagos = true;
    fats.forEach(f => {
      const c = classifyFatura(f);
      if (c === 0) atrasado = true;
      if (c !== 2) todosPagos = false;
    });
    if (atrasado) return 0;
    if (todosPagos) return 2;
    return 1;
  }

  function prevMonth() {
    monthsNavRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  }
  function nextMonth() {
    monthsNavRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }

  function copyLinha(linha?: string) {
    if (!linha) return;
    navigator.clipboard.writeText(linha).then(() => {
      setCopiedLinha(true);
      setTimeout(() => setCopiedLinha(false), 2000);
    });
  }
  function copyPix(pix?: string) {
    if (!pix) return;
    navigator.clipboard.writeText(pix).then(() => {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    });
  }

  if (loading) return <p className="info-text">Carregando faturas…</p>;
  if (error) return <p className="error-text">{error}</p>;

  const current = mesesData[selectedIdx];
  const fats = grupos[current.chave] || [];
  const f = fats[0];
  const cat = f ? classifyFatura(f) : null;

  let dia = '';
  let mesExt = '';
  if (f && f.dataVencimento) {
    const d = new Date(f.dataVencimento);
    dia = String(d.getDate()).padStart(2, '0');
    mesExt = MES_NOMES[d.getMonth()];
  }

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

body {
  margin: 0;
  padding: 0;
  background: #1d1d1b;
  font-family: 'Roboto', sans-serif;
  color: #fff;
}

.container {
  width: 90%;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 64px;
  box-sizing: border-box;
}

#client-info {
  padding: 1rem 0;
  color: #fff;
}
.client-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.client-address {
  font-size: 1rem;
  color: #bbb;
}

.carousel-wrapper {
  position: relative;
  padding-top: 0.5rem;
}
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: 0.2s;
}
.carousel-arrow:hover {
  background: rgba(0,0,0,0.7);
}
.carousel-arrow svg {
  width: 20px;
  height: 20px;
  fill: #fbcc0a;
}
.carousel-arrow.left { left: 10px; }
.carousel-arrow.right { right: 10px; }

@media (max-width: 767px) {
  .carousel-arrow { display: none; }
  #months-nav { margin: 0; }
}

/* --- ajustado: removido margin lateral para alinhar com o container --- */
#months-nav {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-behavior: smooth;
  margin: 0;            /* antes: margin: 0 50px; */
  -ms-overflow-style: none;
  scrollbar-width: none;
}
#months-nav::-webkit-scrollbar { display: none; }

.month-tab {
  flex: 0 0 auto;
  width: 160px;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 0.6rem 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: 0.2s;
}
.month-tab:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.month-tab.active {
  border-color: #fbcc0a;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}

.month-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1b;
  white-space: nowrap;
  margin-bottom: 0.3rem;
}
.month-div {
  width: 95%;
  height: 1px;
  background: #fbcc0a;
  opacity: 0.6;
  margin-bottom: 0.3rem;
  transition: opacity 0.2s;
}
.month-tab.active .month-div {
  opacity: 1;
}

.month-status {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
}
.month-status .icon svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}
.month-status .status-text {
  font-weight: 700;       /* negrito */
}

/* cores das abas */
.month-status.status-pago {
  color: #2e7d32;          /* verde */
}
.month-status.status-aberto {
  color: #fbcc0a;          /* amarelo */
}
.month-status.status-atrasado {
  color: #FF0000;          /* vermelho */
}

#faturas-screen {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  padding: 2rem 1.5rem 1rem;
  color: #1d1d1b;
  margin: 2rem auto;      /* centraliza horizontalmente */
  max-width: 900px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* ajustado para que o card encoste corretamente */
}

#faturas-screen h2 {
  font-size: 1.8rem;
  
  text-align: center;
  width: 100%;
  margin: 0 0 0.5rem;
  color: #1d1d1b;
}

.contract-underline {
  width: 80%;
  height: 2px;
  background: #fbcc0a;
  margin: 0 0 1.5rem 0;
}

#result-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.fatura-card {
  background: #fff;
  color: #1d1d1b;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem;
  flex-wrap: wrap; 
  box-sizing: border-box;
  gap: 1rem;
  width: 100%;
  margin: 0;             /* remove qualquer deslocamento */
}

@media (max-width: 767px) {
  .fatura-card {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    width: 100%;
    margin: 0;
  }
}

.fatura-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.fatura-valor {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}
.fatura-vencimento {
  font-size: 1rem;
  color: #555;
}
.fatura-vencimento strong {
  color: #1d1d1b;
  margin-left: 0.25rem;
}

.fatura-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}
.fatura-status.status-pago {
  color: #2e7d32;
}
.fatura-status.status-aberto {
  color: #fbcc0a;
}
.fatura-status.status-atrasado {
  color: #FF0000;
}
.fatura-status .icon svg {
  fill: currentColor;
}

.fatura-pago-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
  text-align: center;
  padding: 1.5rem 0;
}

.acoes-fatura {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-left: 0rem;
    flex: 1;      
}
.acoes-fatura .button-row {
  display: flex;
  gap: 0.75rem;
}
.acoes-fatura button {
  background: #fbcc0a;
  color: #1d1d1b;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: 0.2s;
  flex: 1;
  justify-content: center;
  
}
.acoes-fatura button:hover {
  background: #e0b209;
}
.acoes-fatura button.copied {
  background: #2e7d32;
  color: #fff;
}
.acoes-fatura a.btn-baixar {
  background: #e0e0e0;
  color: #1d1d1b;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  transition: 0.2s;
  
}
.acoes-fatura a.btn-baixar:hover {
  background: #c8c8c8;
}
`}</style>


      <div className="container">
        <div id="client-info">
          <div className="client-name">Olá, {clienteNome}</div>
          <div className="client-address">{endereco}</div>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={prevMonth}>
            <FiChevronLeft />
          </button>
          <div id="months-nav" ref={monthsNavRef}>
            {mesesData.map((m, i) => (
              <button
                key={m.chave}
                className={`month-tab ${i === selectedIdx ? 'active' : ''}`}
                onClick={() => setSelectedIdx(i)}
              >
                <div className="month-title">{m.nomeMes} {m.ano}</div>
                <div className="month-div"></div>
                <div className={`month-status status-${m.statusNum === 2 ? 'pago' : m.statusNum === 0 ? 'atrasado' : 'aberto'}`}>
                  {m.statusNum === 2 ? <FiCheck/> : m.statusNum === 0 ? <FiAlertCircle/> : <FiClock/>}
                  <span className="status-text">
                    {m.statusNum === 2 ? 'Pago' : m.statusNum === 0 ? 'Atrasado' : 'Em Aberto'}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button className="carousel-arrow right" onClick={nextMonth}>
            <FiChevronRight />
          </button>
        </div>

        <div id="faturas-screen">
          <h2>
            Fatura – <span id="fatura-mes-ano">{mesesData[selectedIdx]?.nomeMes} {mesesData[selectedIdx]?.ano}</span>
          </h2>
          <div className="contract-underline"></div>

          <div id="result-container">
            {!f ? (
              <p className="no-invoices">Nenhuma fatura para este mês.</p>
            ) : cat === 2 ? (
              <div className="fatura-card">
                <span className="fatura-pago-text">Fatura paga</span>
              </div>
            ) : (
              <div className="fatura-card">
                <div className="fatura-info">
                  <div className="fatura-label">Valor</div>
                  <span
                    className="fatura-valor"
                    style={{ color: cat === 0 ? '#FF0000' : '#fbcc0a' }}
                  >
                    R$ {Number(f.valor).toFixed(2).replace('.', ',')}
                  </span>
                  <div className="fatura-vencimento">
                    Vence dia <strong>{dia}</strong> de {mesExt}
                  </div>
                  <div className={`fatura-status status-${cat === 0 ? 'atrasado' : 'aberto'}`}>
                    {cat === 0 ? <FiAlertCircle/> : <FiClock/>}
                    <span className="status-text">
                      {cat === 0 ? 'Atrasado' : 'Em Aberto'}
                    </span>
                  </div>
                </div>
                <div className="acoes-fatura">
                  <div className="button-row">
                    <button
                      className={`btn-copiar-linha ${copiedLinha ? 'copied' : ''}`}
                      onClick={() => copyLinha(f.linhaDigitavel)}
                    >
                      <FiCopy /> {copiedLinha ? 'Copiado' : 'Copiar Código do Boleto'}
                    </button>
                    <button
                      className={`btn-copiar-pix ${copiedPix ? 'copied' : ''}`}
                      onClick={() => copyPix(f.codigoPix)}
                    >
                      <FiCopy /> {copiedPix ? 'Copiado' : 'Copiar Código Pix'}
                    </button>
                  </div>
                  <a
                    href={f.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-baixar"
                  >
                    <FiFileText /> Baixar 2ª Via
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
