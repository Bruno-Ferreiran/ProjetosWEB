// Faturas/script.js
// -------------------------------------------------------------
// Responsável por:
//   1) Pegar CPF/CONTRATO global (window.SELECTED_CPF / window.SELECTED_CONTRACT)
//   2) Chamar getTitulos(cpf, contrato) → lista de faturas
//   3) Chamar a API de clientes para obter nome e contratos com endereço
//   4) Agrupar faturas por mês/ano e gerar dinamicamente vários “month cards”
//   5) Ao clicar num “month card”, atualizar o container de faturas daquele mês
//   6) Mostrar apenas UMA fatura por vez, e — se paga — somente mensagem “Fatura paga”
//   7) Tornar botões de copiar mais profissionais (alterar texto e cor ao clicar)
// -------------------------------------------------------------

import { getCredentials } from './api.js'; // Para autenticação
import { getTitulos } from './api.js';

const API_CLIENTES_URL = 'https://chip7.sgp.tsmx.com.br/api/ura/clientes/';

async function getCliente(cpfcnpj) {
  const { app, token } = await getCredentials();
  const payload = new URLSearchParams();
  payload.append('app', app);
  payload.append('token', token);
  payload.append('cpfcnpj', cpfcnpj);

  const resp = await fetch(API_CLIENTES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: payload
  });
  if (!resp.ok) {
    throw new Error('Erro ao buscar dados do cliente.');
  }
  const data = await resp.json();
  if (!data.clientes || !Array.isArray(data.clientes) || data.clientes.length === 0) {
    throw new Error('Formato de resposta de cliente inesperado.');
  }
  return data.clientes[0];
}

(async () => {
  const cpf = window.SELECTED_CPF;
  const contrato = window.SELECTED_CONTRACT;

  const clientInfoEl = document.getElementById('client-info');
  const monthsNav = document.getElementById('months-nav');
  const faturaMesAnoEl = document.getElementById('fatura-mes-ano');
  const loadingEl = document.getElementById('faturas-loading');
  const errorEl = document.getElementById('faturas-error');
  const resultEl = document.getElementById('result-container');

  const arrowLeft = document.querySelector('.carousel-arrow.left');
  const arrowRight = document.querySelector('.carousel-arrow.right');

  // 1) Validação inicial de dados
  if (!cpf || !contrato) {
    errorEl.textContent = 'Dados do cliente não encontrados. Tente novamente.';
    errorEl.style.display = 'block';
    return;
  }

  // Exibe “Carregando…” até a resposta das APIs
  loadingEl.style.display = 'block';
  errorEl.style.display = 'none';

  try {
    // 2) Buscar dados do cliente para exibir nome e endereço do contrato selecionado
    const cliente = await getCliente(cpf);
    const nomeCliente = cliente.nome || '';
    // Encontrar o contrato ativo pelo ID para pegar o endereço
    const contratoAtual = (cliente.contratos || []).find(ct => ct.id === contrato);
    let enderecoContrato = '';
    if (contratoAtual && contratoAtual.endereco) {
      const e = contratoAtual.endereco;
      enderecoContrato = `${e.logradouro}, ${e.numero}${
        e.complemento ? ' ‒ ' + e.complemento : ''
      } ‒ ${e.bairro}, ${e.cidade}/${e.uf}`;
    }

    // Renderizar saudação do cliente e endereço
    clientInfoEl.innerHTML = `
      <div class="client-name">Olá, ${nomeCliente}</div>
      <div class="client-address">${enderecoContrato}</div>
    `;

    // 3) Chamar a API de faturas após exibir cliente
    const titulos = await getTitulos(cpf, contrato);

    // Se não vier lista ou vier vazia, exibe mensagem e finaliza
    if (!Array.isArray(titulos) || titulos.length === 0) {
      loadingEl.style.display = 'none';
      resultEl.innerHTML = '';
      const vazio = document.createElement('p');
      vazio.textContent = 'Nenhuma fatura encontrada para este contrato.';
      vazio.classList.add('no-invoices');
      resultEl.appendChild(vazio);
      return;
    }

    // 4) Função para classificar uma fatura isoladamente:
    //    0 → atrasado, 1 → em aberto, 2 → pago
    function classificaFatura(f) {
      const hoje = new Date();
      if ((f.status || '').toLowerCase() === 'pago') return 2;
      if (f.dataVencimento) {
        const vencto = new Date(f.dataVencimento);
        if (vencto < hoje) return 0; // atrasado
      }
      return 1; // em aberto
    }

    // 5) Agrupar faturas por mês/ano (chave = “YYYY-MM”)
    const grupos = {};
    titulos.forEach(f => {
      if (!f.dataVencimento) return;
      const dt = new Date(f.dataVencimento);
      const ano = dt.getFullYear();
      const mesNum = dt.getMonth() + 1; // 1 a 12
      const chave = `${ano}-${String(mesNum).padStart(2, '0')}`; // ex: “2025-06”
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(f);
    });

    // 6) Função para obter status agregado de um mês inteiro:
    //    0 → se HÁ pelo menos uma fatura atrasada
    //    2 → se TODAS as faturas estão pagas
    //    1 → senão (alguma em aberto, mas nenhuma atrasada)
    function classificaMes(arrayFaturas) {
      let temAtrasado = false;
      let todosPagos = true;

      arrayFaturas.forEach(f => {
        const cat = classificaFatura(f);
        if (cat === 0) temAtrasado = true;
        if (cat !== 2) todosPagos = false;
      });
      if (temAtrasado) return 0;
      if (todosPagos) return 2;
      return 1;
    }

    // 7) Ordenar as chaves (meses) do mais antigo para o mais recente
    const chavesOrdenadas = Object.keys(grupos).sort();

    // 8) Preparar um array “mesInfo” com dados para cada mês
    const mesesData = chavesOrdenadas.map(chave => {
      const [ano, mesStr] = chave.split('-');
      const mesNum = parseInt(mesStr, 10);
      const faturasDoMes = grupos[chave];
      const statusAgrupadoNum = classificaMes(faturasDoMes);

      let iconeSVG, textoStatus, statusClass;
      if (statusAgrupadoNum === 2) {
        // Ícone “✓” verde
        iconeSVG = `
          <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
            <circle cx="12" cy="12" r="10" fill="#2e7d32" />
            <path fill="#ffffff" d="M9.5 13.5l-2.5-2.5 1.414-1.414L9.5 10.672l5.586-5.586L16.5 6.5l-7 7z"/>
          </svg>
        `.trim();
        textoStatus = 'Pago';
        statusClass = 'status-pago';
      } else if (statusAgrupadoNum === 0) {
        // Ícone “!” vermelho
        iconeSVG = `
          <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
            <circle cx="12" cy="12" r="10" fill="#FF0000" />
            <path fill="#ffffff" d="M11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/>
          </svg>
        `.trim();
        textoStatus = 'Atrasado';
        statusClass = 'status-atrasado';
      } else {
        // Ícone “⌚” amarelo
        iconeSVG = `
          <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
            <circle cx="12" cy="12" r="10" fill="#fbcc0a" />
            <path fill="#1d1d1b" d="M12 6V12.5L15.5 14.75l.75-1.23-3-1.64V6z"/>
          </svg>
        `.trim();
        textoStatus = 'Em Aberto';
        statusClass = 'status-aberto';
      }

      // Converter mês numérico em nome por extenso (pt-br):
      const mesesExtenso = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      const nomeMes = mesesExtenso[mesNum - 1];

      return {
        chave,
        ano,
        mesNum,
        nomeMes,
        iconeSVG,
        textoStatus,
        statusClass
      };
    });

    // 9) Gerar “month cards” dinamicamente em #months-nav
    mesesData.forEach((mesInfo, index) => {
      const btn = document.createElement('button');
      btn.classList.add('month-tab');
      btn.dataset.chave = mesInfo.chave;
      btn.dataset.index = index; // armazenar índice

      btn.innerHTML = `
        <div class="month-title">${mesInfo.nomeMes} ${mesInfo.ano}</div>
        <div class="month-div"></div>
        <div class="month-status ${mesInfo.statusClass}">
          <span class="icon">${mesInfo.iconeSVG}</span>
          <span class="status-text">${mesInfo.textoStatus}</span>
        </div>
      `;
      monthsNav.appendChild(btn);
    });

    // 10) Determinar índice do “mês atual”; se não houver fatura nesse mês, pegar o último
    const hoje = new Date();
    const chaveNow = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    let selectedIdx = mesesData.findIndex(m => m.chave === chaveNow);
    if (selectedIdx === -1) {
      selectedIdx = mesesData.length - 1; // último mês disponível
    }

    // 11) Função para marcar apenas um month card como ativo
    function marcaMesAtivo(idx) {
      document.querySelectorAll('.month-tab').forEach(el => {
        el.classList.remove('active');
      });
      const selecionado = document.querySelector(`.month-tab[data-index="${idx}"]`);
      if (selecionado) {
        selecionado.classList.add('active');
        selecionado.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }

    // 12) Função que renderiza APENAS A PRIMEIRA fatura do mês
    function renderizaCartoesDoMes(chaveSelecionada) {
      resultEl.innerHTML = '';
      const mesInfoAtual = mesesData[selectedIdx];
      faturaMesAnoEl.textContent = `${mesInfoAtual.nomeMes} ${mesInfoAtual.ano}`;

      const faturasDoMes = grupos[chaveSelecionada] || [];
      if (faturasDoMes.length === 0) {
        const semFaturas = document.createElement('p');
        semFaturas.classList.add('no-invoices');
        semFaturas.textContent = 'Nenhuma fatura para este mês.';
        resultEl.appendChild(semFaturas);
        return;
      }

      // Mostrar apenas a PRIMEIRA fatura do array (índice zero):
      const f = faturasDoMes[0];
      const cat = classificaFatura(f);

      // Se a fatura já foi paga, exibir apenas uma mensagem "Fatura paga"
      if (cat === 2) {
        const cardPago = document.createElement('div');
        cardPago.classList.add('fatura-card');
        cardPago.innerHTML = `
          <div class="fatura-info">
            <span class="fatura-pago-text">Fatura paga</span>
          </div>
        `;
        resultEl.appendChild(cardPago);
        return;
      }

      // Caso contrário (em aberto ou atrasado), montar o card normal:
      let textoStatus = '';
      let corClasse = '';
      let iconeSVG = '';
      let valorColor = '';

      if (cat === 0) {
        textoStatus = 'Atrasado';
        corClasse = 'status-atrasado';
        iconeSVG = `
          <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
            <circle cx="12" cy="12" r="10" fill="#FF0000" />
            <path fill="#ffffff" d="M11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/>
          </svg>
        `.trim();
        valorColor = '#FF0000';
      } else {
        textoStatus = 'Em Aberto';
        corClasse = 'status-aberto';
        iconeSVG = `
          <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
            <circle cx="12" cy="12" r="10" fill="#fbcc0a" />
            <path fill="#1d1d1b" d="M12 6V12.5L15.5 14.75l.75-1.23-3-1.64V6z"/>
          </svg>
        `.trim();
        valorColor = '#fbcc0a';
      }

      // Formatação “Vence dia XX de Mês”
      let diaVenc = '';
      let mesExtenso = '';
      if (f.dataVencimento) {
        const dt = new Date(f.dataVencimento);
        const dia = String(dt.getDate()).padStart(2, '0');
        const idxMes = dt.getMonth(); // 0 a 11
        const mesesExtenso = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        mesExtenso = mesesExtenso[idxMes];
        diaVenc = dia;
      }

      // Criar o elemento card
      const card = document.createElement('div');
      card.classList.add('fatura-card');

      card.innerHTML = `
        <div class="fatura-info">
          <div class="fatura-label">Valor</div>
          <span class="fatura-valor" style="color: ${valorColor}">R$ ${Number(f.valor).toFixed(2).replace('.', ',')}</span>
          <div class="fatura-vencimento">Vence dia <strong>${diaVenc}</strong> de ${mesExtenso}</div>
          <div class="fatura-status ${corClasse}">
            <span class="icon">${iconeSVG}</span>
            <span class="status-text">${textoStatus}</span>
          </div>
        </div>
        <div class="acoes-fatura">
          <div class="button-row">
            <button class="btn-copiar-linha"><i class="fa-solid fa-copy"></i>Copiar Código do Boleto</button>
            <button class="btn-copiar-pix"><i class="fa-solid fa-qrcode"></i>Copiar Código Pix</button>
          </div>
          <a href="${f.link || '#'}" target="_blank" class="btn-baixar"><i class="fa-solid fa-receipt"></i>Baixar 2ª Via</a>
        </div>
      `;

      // Seleciona botões para eventos
      const btnLinha = card.querySelector('.btn-copiar-linha');
      const btnPix = card.querySelector('.btn-copiar-pix');

      // Lógica de copiar Linha Digitável → altera texto e cor do botão
      btnLinha.addEventListener('click', () => {
        if (f.linhaDigitavel) {
          navigator.clipboard
            .writeText(f.linhaDigitavel)
            .then(() => {
              btnLinha.textContent = 'Copiado';
              btnLinha.style.backgroundColor = '#2e7d32'; // verde
              btnLinha.style.color = '#ffffff';
              setTimeout(() => {
                btnLinha.innerHTML = '<i class="fa-solid fa-copy"></i>Copiar Linha Digitável';
                btnLinha.style.backgroundColor = '#fbcc0a'; // amarelo original
                btnLinha.style.color = '#1d1d1b';
              }, 2000);
            })
            .catch(() => {
              // Se falhar, mantém o texto original
            });
        }
      });

      // Lógica de copiar Código Pix → altera texto e cor do botão
      btnPix.addEventListener('click', () => {
        if (f.codigoPix) {
          navigator.clipboard
            .writeText(f.codigoPix)
            .then(() => {
              btnPix.textContent = 'Copiado';
              btnPix.style.backgroundColor = '#2e7d32'; // verde
              btnPix.style.color = '#ffffff';
              setTimeout(() => {
                btnPix.innerHTML = '<i class="fa-solid fa-qrcode"></i>Copiar Código Pix';
                btnPix.style.backgroundColor = '#fbcc0a'; // amarelo original
                btnPix.style.color = '#1d1d1b';
              }, 2000);
            })
            .catch(() => {
              // Se falhar, mantém o texto original
            });
        }
      });

      // Ao adicionar ao container, os estilos definidos no CSS permanecem válidos
      resultEl.appendChild(card);
    }

    // 13) Adicionar listeners de clique em cada month card
    document.querySelectorAll('.month-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = Number(tab.dataset.index);
        if (!isNaN(idx)) {
          selectedIdx = idx;
          marcaMesAtivo(selectedIdx);
          renderizaCartoesDoMes(mesesData[selectedIdx].chave);
        }
      });
    });

    // 14) Inicialmente: marca mês ativo, renderiza faturas e centraliza carousel
    marcaMesAtivo(selectedIdx);
    renderizaCartoesDoMes(mesesData[selectedIdx].chave);

    // 15) Navegação com setas em desktop
    arrowLeft.addEventListener('click', () => {
      monthsNav.scrollBy({ left: -200, behavior: 'smooth' });
    });
    arrowRight.addEventListener('click', () => {
      monthsNav.scrollBy({ left: 200, behavior: 'smooth' });
    });

  } catch (err) {
    console.error('Erro ao buscar dados ou faturas:', err);
    loadingEl.style.display = 'none';
    errorEl.textContent = err.message || 'Erro ao carregar os dados.';
    errorEl.style.display = 'block';
  } finally {
    loadingEl.style.display = 'none';
  }
})();
