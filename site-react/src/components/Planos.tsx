import { useState } from 'react';

export default function Planos() {
  const [ativo, setAtivo] = useState<number | null>(null);

  const planos = [
    {
      tipo: 'essencial',
      logo: '/assets/planos/essencial-logo.png',
      velocidade: '400Mb',
      preco: 'R$ 70/mês',
      descricao: 'Perfeito para quem busca economia com qualidade.',
      detalhes: [
        '400Mb de upload e download reais',
        'Wi-Fi Mesh incluso',
        'Ativação rápida',
        'Suporte técnico incluso',
      ],
      imgFooter: '/assets/planos/img-essencial.jpg',
    },
    {
      tipo: 'super',
      logo: '/assets/planos/super-logo.png',
      velocidade: '700Mb',
      preco: 'R$ 100/mês',
      descricao: 'Ideal para famílias que estudam, trabalham e se divertem.',
      detalhes: [
        '700Mb de velocidade simétrica',
        'Wi-Fi de alto desempenho',
        'Instalação gratuita',
        'Monitoramento online',
      ],
      imgFooter: '/assets/planos/img-super.jpg',
    },
    {
      tipo: 'ultra',
      logo: '/assets/planos/ultra-logo.png',
      velocidade: '1Gb',
      preco: 'R$ 150/mês',
      descricao: 'A melhor conexão para gamers, streamers e empresas exigentes.',
      detalhes: [
        '1Gb full-duplex',
        'Equipamentos topo de linha',
        'Suporte prioritário',
        'Garantia de performance',
      ],
      imgFooter: '/assets/planos/img-ultra.jpg',
    },
  ];

  return (
    <>
      <style>{`
        #planos-container {
          background-color: #1d1d1b;
          border: 2px solid #fbcc0a;
          margin: 2rem auto;
          max-width: 95vw;
          border-radius: 16px;
          padding: 2rem 1rem 1rem;
          font-family: 'Roboto', sans-serif;
        }

        .planos-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .planos-header h2 {
          color: #fbcc0a;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .planos-header p {
          color: #ccc;
          font-size: 1rem;
        }

        .planos-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          justify-content: center;
          padding-bottom: 2rem;
        }

        .plano-card {
          flex: 1 1 280px;
          max-width: 350px;
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          scroll-snap-align: center;
          transition: box-shadow 0.2s ease;
          border: 3px solid transparent;
        }

        .plano-card.essencial { border-color: #999; }
        .plano-card.super { border-color: #fbcc0a; }
        .plano-card.ultra { border-color: #000; }

        .plano-card:hover {
          box-shadow: 0 14px 30px rgba(0,0,0,0.3);
        }

        .plano-top {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          flex-direction: column;
          text-align: center;
        }

        .plano-top img {
          max-height: 300px;
          margin-bottom: 0.8rem;
        }

        .plano-velocidade {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1d1d1b;
          margin-bottom: 0.25rem;
        }

        .plano-preco {
          font-size: 1.1rem;
          font-weight: 500;
          color: #444444;
          margin-bottom: 1rem;
        }

        .plano-desc {
          padding: 0 1.5rem;
          font-size: 0.95rem;
          color: #555555;
          text-align: center;
          margin-bottom: 1rem;
          min-height: 60px;
        }

        .plano-expandir {
          border: none;
          background: none;
          font-size: 1.5rem;
          color: #fbcc0a;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .plano-expandir:hover {
          transform: scale(1.2);
        }

        .plano-detalhes {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.4s ease;
          padding: 0 1.5rem;
        }

        .plano-detalhes.open {
          max-height: 500px;
          padding: 1rem 1.5rem 2rem;
        }

        .plano-detalhes ul {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.95rem;
          color: #333;
        }

        .plano-detalhes li {
          padding: 0.4rem 0;
          border-bottom: 1px solid #eee;
        }

        .plano-img-footer {
          width: 100%;
          aspect-ratio: 3/1;
          object-fit: cover;
          display: block;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .planos-grid {
            flex-wrap: wrap;
            justify-content: center;
          }

          .plano-card {
            flex: 1 1 90%;
            max-width: 500px;
          }
        }
      `}</style>

      <section id="planos-container">
        <div className="planos-header">
          <h2>Nossos Planos</h2>
          <p>Escolha a velocidade ideal para sua casa ou empresa</p>
        </div>

        <div className="planos-grid">
          {planos.map((plano, index) => (
            <div key={index} className={`plano-card ${plano.tipo}`}>
              <div className="plano-top">
                <img src={plano.logo} alt={`Plano ${plano.tipo}`} />
                <div className="plano-velocidade">{plano.velocidade}</div>
                <div className="plano-preco">{plano.preco}</div>
              </div>
              <p className="plano-desc">{plano.descricao}</p>
              <button
                className="plano-expandir"
                onClick={() => setAtivo(ativo === index ? null : index)}
              >
                {ativo === index ? '▲' : '▼'}
              </button>
              <div className={`plano-detalhes ${ativo === index ? 'open' : ''}`}>
                <ul>
                  {plano.detalhes.map((det, i) => (
                    <li key={i}>{det}</li>
                  ))}
                </ul>
              </div>
              <img className="plano-img-footer" src={plano.imgFooter} alt={`Imagem ${plano.tipo}`} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
