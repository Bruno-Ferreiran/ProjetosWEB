// viabilidade.js
export function showViabilidadeModal() {
  const container = document.getElementById('viabilidade-modal-root');
  if (!container) return;

  // Remover estilos anteriores, se existirem
  const prevStyle = document.getElementById('viab-style');
  if (prevStyle) prevStyle.remove();

  // CSS embutido no JS
  const style = document.createElement('style');
  style.id = 'viab-style';
  style.textContent = `
    .viab-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 80px;
      z-index: 10000;
    }
    .viab-modal {
      background: #ffffff;
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 480px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);
      position: relative;
      animation: viabFadeIn 0.3s ease-out;
    }
    .viab-title {
      font-size: 22px;
      font-weight: 600;
      color: #333333;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .viab-underline {
      width: 90%;
      height: 3px;
      background: #fbcc0a;
      margin: 0 auto 1.5rem auto;
      border-radius: 2px;
    }
    .viab-input {
      width: 100%;
      padding: 14px;
      font-size: 16px;
      border: 1px solid #dddddd;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-sizing: border-box;
      transition: border-color 0.2s ease;
    }
    .viab-input:focus {
      outline: none;
      border-color: #fbcc0a;
      box-shadow: 0 0 8px rgba(251, 204, 10, 0.3);
    }
    /* Botão primário (Verificar Viabilidade e Continuar) */
    .viab-btn-primary {
  width: 100%;
  background-color: #fbcc0a;
  color: #1d1d1b;
  font-weight: 600;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1.15rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  transition: background-color 0.2s ease, transform 0.1s ease;
  border: none;
  cursor: pointer;
  text-align: center;
  display: inline-block;
}
.viab-btn-primary:hover {
  background-color: #e0b209;
  transform: translateY(-1px);
}
.viab-btn-primary:active {
  transform: translateY(1px);
}

    .viab-btn-primary:hover {
      background-color: #e0b209;
      transform: translateY(-1px);
    }
    .viab-btn-primary:active {
      transform: translateY(1px);
    }
    /* Botão secundário (Sair) */
    /* Botão “Sair” no mesmo estilo do botão “Entrar”, porém sempre cinza */
.viab-btn-secondary {
  width: 100%;
  background-color: #eeeeee;         /* Cinza claro fixo */
  color: #1d1d1b;                    /* Texto preto */
  font-weight: 600;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1.15rem;
  border: none;
  cursor: pointer;
  text-align: center;
  display: inline-block;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.1s ease;
}

/* Hover: cinza um pouco mais escuro */
.viab-btn-secondary:hover {
  background-color: #d5d5d5;
  transform: translateY(-1px);
}

/* Active: animação de clique para baixo */
.viab-btn-secondary:active {
  transform: translateY(1px);
}

/* Layout horizontal para dois botões */
.viab-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  width: 100%;
  gap: 10px;
}

/* Ambos ocupam metade da largura */
.viab-buttons .viab-btn-primary,
.viab-buttons .viab-btn-secondary {
  flex: 1;
  margin: 0;
  width: auto;
}


    .viab-btn-secondary:hover {
      background-color: #cccccc;
      transform: translateY(-1px);
    }
    .viab-btn-secondary:active {
      transform: translateY(1px);
    }
    .viab-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5rem;
      width: 100%;
      gap: 10px;
    }
    /* Dentro de .viab-buttons, cada botão ocupa a mesma largura */
    .viab-buttons .viab-btn-primary,
    .viab-buttons .viab-btn-secondary {
      flex: 1;
      margin: 0;
      text-align: center;
    }
    .viab-close {
      position: absolute;
      top: 12px;
      right: 16px;
      font-size: 26px;
      background: none;
      border: none;
      cursor: pointer;
      color: #555555;
      transition: color 0.2s ease, transform 0.1s ease;
    }
    .viab-close:hover {
      color: #555555;
      transform: scale(1.1);
    }
    .viab-close:active {
      transform: scale(0.95);
    }
    .viab-message {
      font-size: 16px;
      color: #555555;
      text-align: center;
      line-height: 1.5;
      margin-bottom: 2rem;
    }
    @keyframes viabFadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  // HTML inicial do modal
  container.innerHTML = `
    <div class="viab-overlay" id="viab-overlay">
      <div class="viab-modal" id="viab-modal">
        <button class="viab-close" id="viab-close">&times;</button>
        <h2 class="viab-title">Informe seu CEP</h2>
        <div class="viab-underline"></div>
        <input
          type="text"
          class="viab-input"
          id="viab-cep"
          placeholder="00000-000"
          inputmode="numeric"
          maxlength="9"
        />
        <button class="viab-btn-primary" id="viab-btn-check">Verificar Viabilidade</button>
      </div>
    </div>
  `;

  const fecharTudo = () => {
    container.innerHTML = '';
  };

  // Fechar ao clicar no “X” ou fora do modal
  document.getElementById('viab-close').addEventListener('click', fecharTudo);
  document.getElementById('viab-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'viab-overlay') fecharTudo();
  });

  // Formatação do CEP enquanto digita
  const cepInput = document.getElementById('viab-cep');
  cepInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
    e.target.value = v;
  });

  // Clique no botão "Verificar Viabilidade"
  document.getElementById('viab-btn-check').addEventListener('click', async () => {
    const cepRaw = cepInput.value.replace(/\D/g, '');
    if (cepRaw.length !== 8) {
      // Substituir conteúdo por erro de CEP
      const modal = document.getElementById('viab-modal');
      modal.innerHTML = `
        <button class="viab-close" id="viab-close-err">&times;</button>
        <h2 class="viab-title">CEP Inválido</h2>
        <div class="viab-underline"></div>
        <p class="viab-message">Por favor, digite um CEP válido com 8 dígitos.</p>
        <div class="viab-buttons">
          <button class="viab-btn-secondary" id="viab-btn-exit-err">Sair</button>
        </div>
      `;
      document.getElementById('viab-close-err').addEventListener('click', fecharTudo);
      document.getElementById('viab-btn-exit-err').addEventListener('click', fecharTudo);
      return;
    }

    try {
      // Obter credenciais
      const credRes = await fetch('https://api.chip7.cc/get-credentials');
      const credData = await credRes.json();
      const { app, token } = credData;

      // Montar formData
      const formData = new URLSearchParams();
      formData.append('app', app);
      formData.append('token', token);
      formData.append('cep', cepRaw);

      // Requisição de viabilidade
      const res = await fetch('https://chip7.sgp.tsmx.com.br/api/ura/viabilidade/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      const data = await res.json();
      const modal = document.getElementById('viab-modal');
      const overlay = document.getElementById('viab-overlay');

      if (data.viabilidade === true) {
        // Conteúdo para endereço disponível
        modal.innerHTML = `
          <button class="viab-close" id="viab-close-ok">&times;</button>
          <h2 class="viab-title">Viabilidade Confirmada</h2>
          <div class="viab-underline"></div>
          <p class="viab-message">
            Seu endereço possui cobertura.<br>
            Para continuar, clique em Continuar.
          </p>
          <div class="viab-buttons">
            <button class="viab-btn-secondary" id="viab-btn-exit-ok">Sair</button>
            <button class="viab-btn-primary" id="viab-btn-continue-ok">Continuar</button>
          </div>
        `;
        document.getElementById('viab-close-ok').addEventListener('click', fecharTudo);
        document.getElementById('viab-btn-exit-ok').addEventListener('click', fecharTudo);
        document.getElementById('viab-btn-continue-ok').addEventListener('click', () => {
          window.location.href = 'https://cadastro.chip7.cc';
        });
      } else {
        // Conteúdo para sem viabilidade
        modal.innerHTML = `
          <button class="viab-close" id="viab-close-no">&times;</button>
          <h2 class="viab-title">Sem Viabilidade</h2>
          <div class="viab-underline"></div>
          <p class="viab-message">
            Infelizmente, não temos cobertura para este CEP.<br>
            Para mais informações, fale conosco.
          </p>
          <div class="viab-buttons">
            <button class="viab-btn-secondary" id="viab-btn-exit-no">Sair</button>
            <button class="viab-btn-primary" id="viab-btn-continue-no">Continuar</button>
          </div>
        `;
        document.getElementById('viab-close-no').addEventListener('click', fecharTudo);
        document.getElementById('viab-btn-exit-no').addEventListener('click', fecharTudo);
        document.getElementById('viab-btn-continue-no').addEventListener('click', () => {
          window.open('https://wa.me/555340012277', '_blank');
        });
      }

      // Permitir fechar clicando fora do modal atualizado
      overlay.addEventListener('click', (e) => {
        if (e.target.id === 'viab-overlay') fecharTudo();
      });
    } catch (err) {
      // Conteúdo para erro de requisição
      const modal = document.getElementById('viab-modal');
      const overlay = document.getElementById('viab-overlay');
      modal.innerHTML = `
        <button class="viab-close" id="viab-close-errnet">&times;</button>
        <h2 class="viab-title">Erro de Conexão</h2>
        <div class="viab-underline"></div>
        <p class="viab-message">
          Ocorreu um problema ao verificar.<br>
          Tente novamente mais tarde ou fale conosco.
        </p>
        <div class="viab-buttons">
          <button class="viab-btn-secondary" id="viab-btn-exit-errnet">Sair</button>
          <button class="viab-btn-primary" id="viab-btn-continue-errnet">Continuar</button>
        </div>
      `;
      document.getElementById('viab-close-errnet').addEventListener('click', fecharTudo);
      document.getElementById('viab-btn-exit-errnet').addEventListener('click', fecharTudo);
      document.getElementById('viab-btn-continue-errnet').addEventListener('click', () => {
        window.open('https://wa.me/555340012277', '_blank');
      });
      overlay.addEventListener('click', (e) => {
        if (e.target.id === 'viab-overlay') fecharTudo();
      });
      console.error(err);
    }
  });
}
