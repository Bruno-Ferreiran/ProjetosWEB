// src/faturas/Login.tsx
import React, { useState } from 'react'
import { FiMapPin, FiFileText } from 'react-icons/fi'
import { getContratos } from './faturasApi'
import FaturasLista from './FaturasLista'  // <— novo import

export default function Login() {
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [contratos, setContratos] = useState<any[] | null>(null)
  const [cpfLimpo, setCpfLimpo] = useState<string>('')          // guarda o CPF/CNPJ sem máscara
  const [contratoSelecionado, setContratoSelecionado] = useState<number | null>(null)

  const aplicarMascara = (valor: string) => {
    let v = valor.replace(/\D/g, '')
    if (v.length <= 11) {
      v = v
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    } else {
      v = v
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
        .replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
    }
    return v
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpfCnpj(aplicarMascara(e.target.value))
  }

  const handleSubmit = async () => {
    setErro('')
    const raw = cpfCnpj.replace(/\D/g, '')
    if (![11, 14].includes(raw.length)) {
      setErro('Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.')
      return
    }

    setCpfLimpo(raw)
    setLoading(true)
    try {
      const resp = await getContratos(raw)
      if (!resp.length) {
        setErro('Nenhum contrato encontrado para este CPF/CNPJ.')
      } else if (resp.length === 1) {
        // pula seleção e já abre a lista de faturas
        setContratoSelecionado(resp[0].id)
      } else {
        setContratos(resp)
      }
    } catch (e: any) {
      setErro(e.message || 'Erro ao buscar contratos.')
    } finally {
      setLoading(false)
    }
  }

  // se contrato já foi escolhido, renderiza o componente de faturas
  if (contratoSelecionado !== null) {
  return (
      <>
        <style>{`
          .lista-wrapper {
            width: 100%;
            box-sizing: border-box;
          }
        `}</style>
        <div className="lista-wrapper">
          <FaturasLista
            cpfCnpj={cpfLimpo}
            contratoId={contratoSelecionado}
          />
        </div>
      </>
    )
  }


  return (
    <>
      <style>{`
        .faturas-main {
          padding: 2rem;
          max-width: 480px;
          margin: 0 auto;
          font-family: 'Roboto', sans-serif;
        }
        .faturas-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          padding: 2rem;
          color: #1d1d1b;
          margin-top: 2rem;
        }
        .faturas-card h2 {
          font-size: 1.5rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .faturas-underline {
          width: 60px;
          height: 4px;
          background: #fbcc0a;
          margin: 0 auto 1.5rem;
          border-radius: 2px;
        }
        .faturas-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 1.25rem;
          outline: none;
          transition: border-color .2s;
        }
        .faturas-input:focus {
          border-color: #fbcc0a;
          box-shadow: 0 0 6px rgba(251,204,10,0.3);
        }
        .faturas-btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          background: #fbcc0a;
          color: #1d1d1b;
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: background .2s, transform .1s;
        }
        .faturas-btn:hover {
          background: #e0b209;
        }
        .faturas-btn:active {
          transform: translateY(1px);
        }
        .faturas-error {
          color: #d32f2f;
          text-align: center;
          margin-top: 1rem;
        }
        .contrato-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .contrato-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: background .2s, box-shadow .2s;
          background: #f9f9f9;
        }
        .contrato-card:hover {
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .contrato-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .contrato-endereco {
          font-size: 0.95rem;
          color: #333;
        }
        .contrato-id {
          font-size: 0.85rem;
          color: #555;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        @media (max-width: 480px) {
          .faturas-main { padding: 1rem; }
          .faturas-card { padding: 1.5rem; }
          .faturas-card h2 { font-size: 1.3rem; }
          .faturas-input, .faturas-btn { font-size: 0.95rem; }
        }
      `}</style>

      <main className="faturas-main">
        {!contratos && (
          <section className="faturas-card">
            <h2>Informe seu CPF ou CNPJ</h2>
            <div className="faturas-underline" />
            <input
              className="faturas-input"
              type="text"
              value={cpfCnpj}
              onChange={handleChange}
              placeholder="000.000.000-00"
              inputMode="numeric"
              disabled={loading}
            />
            <button
              className="faturas-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Carregando…' : 'Entrar'}
            </button>
            {erro && <p className="faturas-error">{erro}</p>}
          </section>
        )}

        {contratos && (
          <section className="faturas-card">
            <h2>Selecione o contrato</h2>
            <div className="faturas-underline" />
            <div className="contrato-list">
              {contratos.map(ct => {
                const e = ct.endereco || {}
                const endereco = 
                  `${e.logradouro || ''}, ${e.numero || ''}${e.complemento ? ' ‒ ' + e.complemento : ''} ‒ ${e.bairro || ''}, ${e.cidade || ''}/${e.uf || ''}`
                return (
                  <div
                    key={ct.id}
                    className="contrato-card"
                    onClick={() => setContratoSelecionado(ct.id)}
                  >
                    <FiMapPin size={24} color="#fbcc0a" />
                    <div className="contrato-info">
                      <span className="contrato-endereco">{endereco}</span>
                      <span className="contrato-id">
                        <FiFileText size={16} /> Contrato #{ct.id}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
