//@ts-ignore
import React from 'react'

// ✅ Import das imagens
import imgVision from '../assets/cards/vision.png'
import imgFixo from '../assets/cards/telefone-ip-horizontal.png'
import imgVps from '../assets/cards/vps-horizontal.png'
import imgApp from '../assets/cards/app-horizontal.png'

export default function CardProdutos() {
  const cards = [
    {
      img: imgVision,
      alt: 'Chip7 Vision',
      text: 'Monitore suas câmeras com IA integrada e alertas em tempo real.',
      href: '/vision',
    },
    {
      img: imgFixo,
      alt: 'Telefone Fixo',
      text: 'Solução VoIP estável e de alta qualidade para sua empresa.',
      href: '/fixo',
    },
    {
      img: imgVps,
      alt: 'Servidores VPS',
      text: 'Servidores privados com desempenho dedicado e suporte 24/7.',
      href: '/servidores',
    },
    {
      img: imgApp,
      alt: 'Aplicativo Chip7',
      text: 'Gerencie sua conta e faturas direto no smartphone.',
      href: '/app',
    },
  ]

  return (
    <>
      <style>
        {`
          #product-cards {
            padding: 3rem 1rem;
            background-color: #1d1d1b;
            font-family: 'Roboto', sans-serif;
          }

          #product-cards .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 8rem;
            max-width: 1400px;
            margin: 0 auto;
          }

          @media (max-width: 600px) {
            #product-cards .cards-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.2rem;
            }
          }

          #product-cards .card {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            border: 2px solid #fbcc0a;
            border-radius: 1rem;
            overflow: hidden;
            background-color: #2a2a2a;
            transition: transform 0.2s, box-shadow 0.2s;
            height: 100%;
            min-height: 340px;
          }

          @media (max-width: 600px) {
            #product-cards .card {
              min-height: 300px;
              height: 100%;
            }
          }

          #product-cards .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          }

          #product-cards .card img {
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 9;
            object-fit: cover;
            display: block;
          }

          #product-cards .card-content {
            padding: 1rem;
            background-color: #3a3a3a;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
          }

          #product-cards .card-content p {
            color: #ccc;
            font-size: 0.95rem;
            line-height: 1.4;
            text-align: center;
            margin: 0 0 1rem 0;
            flex-grow: 1;
          }

          #product-cards .card-btn {
            background-color: #fbcc0a;
            color: #1d1d1b;
            border: none;
            border-radius: 30px;
            padding: 0.6rem 1.2rem;
            font-weight: bold;
            font-size: 0.95rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            align-self: center;
          }

          #product-cards .card-btn:hover {
            background-color: #e0b209;
          }
        `}
      </style>

      <section id="product-cards">
        <div className="cards-grid">
          {cards.map((card, i) => (
            <div className="card" key={i}>
              <img src={card.img} alt={card.alt} />
              <div className="card-content">
                <p>{card.text}</p>
                <button className="card-btn" onClick={() => window.location.href = card.href}>
                  Saiba Mais
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
