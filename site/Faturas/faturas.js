// -------------------------------------------------------------
// Faturas/faturas.js
// -------------------------------------------------------------
// Responsável apenas por:
//   1) Máscara de CPF/CNPJ no input
//   2) Buscar contratos (getContratos) ao clicar em “Entrar”
//   3) Se >1 contrato → exibir cards de seleção de contrato
//   4) Se 1 contrato  → chamar abrirTelaFaturas(cpf, contratoId)
//   5) abrirTelaFaturas → injeta faturas.html em #faturas-component
// -------------------------------------------------------------

import { getContratos } from './api.js';

////////////////////////////////////////////////////////////////////////////////
// 1) SELETORES DE LOGIN / CONTRATOS (existem diretamente em index.html)
////////////////////////////////////////////////////////////////////////////////
const cpfInput         = document.getElementById('cpf-input');
const btnSubmit        = document.getElementById('btn-submit');
const loadingText      = document.getElementById('loading');
const errorMsgText     = document.getElementById('error-msg');
const loginScreen      = document.getElementById('login-screen');
const faturasComponent = document.getElementById('faturas-component');

////////////////////////////////////////////////////////////////////////////////
// 2) MÁSCARA CPF / CNPJ
////////////////////////////////////////////////////////////////////////////////
cpfInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, ''); // só dígitos

  if (v.length <= 11) {
    // Formata como CPF: XXX.XXX.XXX-XX
    v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  } else {
    // Formata como CNPJ: XX.XXX.XXX/XXXX-XX
    v = v.slice(0, 14);
    v = v.replace(/(\d{2})(\d)/, '$1.$2');
    v = v.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
    v = v.replace(
      /(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/,
      '$1.$2.$3/$4-$5'
    );
  }

  e.target.value = v;
});

////////////////////////////////////////////////////////////////////////////////
// 3) FUNÇÕES AUXILIARES DE UI (loading e erro)
////////////////////////////////////////////////////////////////////////////////
function setLoading(isLoading) {
  if (isLoading) {
    loadingText.style.display = 'block';
    btnSubmit.disabled        = true;
  } else {
    loadingText.style.display = 'none';
    btnSubmit.disabled        = false;
  }
}

function showError(message) {
  errorMsgText.textContent   = message;
  errorMsgText.style.display = 'block';
}

function validaCpfCnpj(value) {
  const apenasDigitos = value.replace(/\D/g, '');
  return apenasDigitos.length === 11 || apenasDigitos.length === 14;
}

////////////////////////////////////////////////////////////////////////////////
// 4) CLIQUE EM “Entrar”: buscar contratos
////////////////////////////////////////////////////////////////////////////////
btnSubmit.addEventListener('click', async () => {
  errorMsgText.style.display = 'none';

  const rawValue = cpfInput.value.trim();
  const cpfcnpj  = rawValue.replace(/\D/g, '');

  if (!validaCpfCnpj(cpfcnpj)) {
    showError('Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
    return;
  }

  try {
    setLoading(true);
    const contratos = await getContratos(cpfcnpj);

    if (!Array.isArray(contratos) || contratos.length === 0) {
      showError('Nenhum contrato encontrado para este CPF/CNPJ.');
      return;
    }

    if (contratos.length > 1) {
      exibirSelecaoContrato(contratos, cpfcnpj);
    } else {
      abrirTelaFaturas(cpfcnpj, contratos[0].id);
    }
  } catch (err) {
    console.error('Erro no processo de autenticação:', err);
    showError(err.message || 'Ocorreu um erro. Tente novamente.');
  } finally {
    setLoading(false);
  }
});

////////////////////////////////////////////////////////////////////////////////
// 5) SELEÇÃO DE CONTRATO (>1): renderiza um card para cada contrato
////////////////////////////////////////////////////////////////////////////////
function exibirSelecaoContrato(contratos, cpfcnpj) {
  // Limpa a área de login (substitui por título + cards)
  loginScreen.innerHTML = '';

  // Novo título “Selecione o contrato”
  const titulo = document.createElement('h2');
  titulo.textContent = 'Selecione o contrato';
  loginScreen.appendChild(titulo);

  const underline = document.createElement('div');
  underline.classList.add('contract-underline');
  loginScreen.appendChild(underline);

  // Container de cards de contrato
  const cardsContainer = document.createElement('div');
  cardsContainer.style.display       = 'flex';
  cardsContainer.style.flexDirection = 'column';
  cardsContainer.style.gap           = '1rem';
  cardsContainer.style.marginTop     = '1.5rem';
  loginScreen.appendChild(cardsContainer);

  contratos.forEach(ct => {
    // Extrai o endereço do contrato (vem em ct.endereco)
    const e = ct.endereco || {};
    const enderecoCompleto = `
      ${e.logradouro || ''}, ${e.numero || ''}${
      e.complemento ? ' ‒ ' + e.complemento : ''
    } ‒ ${e.bairro || ''}, ${e.cidade || ''}/${e.uf || ''}
    `.trim();

    const card = document.createElement('div');
    card.classList.add('contrato-card');

    // Inline SVG de “localização”
    const svgEndereco = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 
                 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 
                 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 
                 12 6.5 14.5 7.62 14.5 9 13.38 11.5 
                 12 11.5z"/>
      </svg>`.trim();

    // Inline SVG de “contrato”
    const svgContrato = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 2H8c-1.1 0-2 .9-2 2v4H5c-1.1 
                 0-2 .9-2 2v10c0 1.1.9 2 2 2h11c1.1 
                 0 2-.9 2-2v-1h2c1.1 0 2-.9 
                 2-2V4c0-1.1-.9-2-2-2zm0 
                 14h-2v-2h2v2zm0-4h-2V6h2v6zM8 
                 4h11v4H8V4zm0 6h7v2H8v-2zm0 
                 4h7v2H8v-2z"/>
      </svg>`.trim();

    card.innerHTML = `
      <div class="icon-wrapper">${svgEndereco}</div>
      <div class="contrato-info">
        <span class="endereco-text">${enderecoCompleto}</span>
        <span class="contrato-id">
          ${svgContrato} Contrato #${ct.id}
        </span>
      </div>
    `;

    card.addEventListener('click', () => {
      abrirTelaFaturas(cpfcnpj, ct.id);
    });

    cardsContainer.appendChild(card);
  });
}

////////////////////////////////////////////////////////////////////////////////
// 6) abrirTelaFaturas: injeta faturas.html e REEXECUTA o script.js
////////////////////////////////////////////////////////////////////////////////
async function abrirTelaFaturas(cpfcnpj, contratoId) {
  // Armazena globalmente para o componente faturas.html usar
  window.SELECTED_CPF      = cpfcnpj;
  window.SELECTED_CONTRACT = contratoId;

  try {
    // 1) Puxa o faturas.html
    const res = await fetch('./faturas.html');
    if (!res.ok) throw new Error('Não foi possível carregar o componente de faturas.');
    const html = await res.text();

    // 2) Injeta o HTML dentro de #faturas-component
    faturasComponent.innerHTML = html;
    faturasComponent.style.display = 'block';

    // 3) Esconde a tela de login completamente
    loginScreen.style.display = 'none';

    // 4) Reexecuta todos os <script> que vieram embutidos em faturas.html
    const scripts = faturasComponent.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      // copia o atributo type (por ex. type="module") se existir
      if (oldScript.type) newScript.type = oldScript.type;

      // se for um script externo, copia o src
      if (oldScript.src) {
        // NOTA: o “src” será carregado relativamente a esta pasta de Faturas/
        // Ex: script.js → garante fetch de Faturas/script.js
        newScript.src = oldScript.src;
      }

      // se fosse um <script> inline (sem src), copia o conteúdo
      else {
        newScript.textContent = oldScript.textContent;
      }

      // Anexa ao final de faturasComponent (ou document.body)
      faturasComponent.appendChild(newScript);
    });

    // Pronto: agora o script.js embutido em faturas.html será executado e chamará
    // a função fetchAndRenderFaturas(window.SELECTED_CPF, window.SELECTED_CONTRACT).
  }
  catch (err) {
    console.error('Erro ao abrir tela de faturas:', err);
    alert('Não foi possível carregar a página de faturas. Tente novamente.');
  }
}

////////////////////////////////////////////////////////////////////////////////
// FIM DE faturas.js
////////////////////////////////////////////////////////////////////////////////
