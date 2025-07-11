import React, { useEffect, useState, useRef } from 'react';

const ViabilidadeModal = ({ onClose }: { onClose: () => void }) => {
  const [cep, setCep] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'no' | 'invalid' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setCep('');
    setStatus('idle');
    setMessage('');
    onClose();
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
    setCep(v);
  };

  const checkCEP = async () => {
    const cepRaw = cep.replace(/\D/g, '');
    if (cepRaw.length !== 8) {
      setStatus('invalid');
      setMessage('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    try {
      setStatus('loading');
      const credRes = await fetch('https://api.chip7.cc/get-credentials');
      const { app, token } = await credRes.json();

      const body = new URLSearchParams({ app, token, cep: cepRaw });

      const res = await fetch('https://chip7.sgp.tsmx.com.br/api/ura/viabilidade/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });

      const data = await res.json();

      if (data.viabilidade === true) {
        setStatus('ok');
        setMessage('Seu endereço possui cobertura. Para continuar, clique em Continuar.');
      } else {
        setStatus('no');
        setMessage('Infelizmente, não temos cobertura para este CEP.');
      }
    } catch {
      setStatus('error');
      setMessage('Erro de conexão. Tente novamente mais tarde.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} ref={modalRef}>
        <button style={styles.close} onClick={close}>×</button>
        <h2 style={styles.title}>
          {status === 'ok' && 'Viabilidade Confirmada'}
          {status === 'no' && 'Sem Viabilidade'}
          {status === 'invalid' && 'CEP Inválido'}
          {status === 'error' && 'Erro de Conexão'}
          {status === 'idle' && 'Informe seu CEP'}
        </h2>
        <div style={styles.underline}></div>

        {status === 'idle' || status === 'loading' ? (
          <>
            <input
              style={styles.input}
              value={cep}
              onChange={handleChange}
              placeholder="00000-000"
              inputMode="numeric"
              maxLength={9}
            />
            <button style={styles.btnPrimary} onClick={checkCEP}>
              {status === 'loading' ? 'Verificando...' : 'Verificar Viabilidade'}
            </button>
          </>
        ) : (
          <>
            <p style={styles.message}>{message}</p>
            <div style={styles.buttonGroup}>
              <button style={styles.btnSecondary} onClick={close}>Sair</button>
              {(status === 'ok' || status === 'no' || status === 'error') && (
                <button
                  style={styles.btnPrimary}
                  onClick={() => {
                    if (status === 'ok') {
                      window.location.href = 'https://cadastro.chip7.cc';
                    } else {
                      window.open('https://wa.me/555340012277', '_blank');
                    }
                  }}
                >
                  Continuar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    paddingTop: '80px',
    zIndex: 10000
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    width: '90%', maxWidth: '480px',
    boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
    position: 'relative',
    animation: 'fadeIn 0.3s ease-out'
  },
  title: {
    fontSize: 22, fontWeight: 600, color: '#333', textAlign: 'center', marginBottom: 8
  },
  underline: {
    width: '90%', height: 3, background: '#fbcc0a', margin: '0 auto 1.5rem', borderRadius: 2
  },
  input: {
    width: '100%', padding: 14, fontSize: 16,
    border: '1px solid #ddd', borderRadius: 8, marginBottom: '2rem',
    boxSizing: 'border-box'
  },
  btnPrimary: {
    width: '100%', backgroundColor: '#fbcc0a', color: '#1d1d1b',
    fontWeight: 600, padding: '1rem', borderRadius: 6, fontSize: '1.15rem',
    border: 'none', cursor: 'pointer'
  },
  btnSecondary: {
    width: '100%', backgroundColor: '#eee', color: '#1d1d1b',
    fontWeight: 600, padding: '1rem', borderRadius: 6, fontSize: '1.15rem',
    border: 'none', cursor: 'pointer'
  },
  message: {
    fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 1.5, marginBottom: '2rem'
  },
  buttonGroup: {
    display: 'flex', justifyContent: 'space-between', gap: 10
  },
  close: {
    position: 'absolute', top: 12, right: 16, fontSize: 26,
    background: 'none', border: 'none', cursor: 'pointer', color: '#555'
  }
};

export default ViabilidadeModal;
