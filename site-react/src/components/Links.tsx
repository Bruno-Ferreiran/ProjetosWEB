//@ts-ignore
import React from 'react'
import textoLinks from '../assets/textos/links.png' // ajuste o caminho se necessário

export default function Links() {
  return (
    <>
      <style>
        {`
          #app-links-container {
            width: 100%;
            background-color: #333333;
            padding: 0.1rem 0;
            min-height: 50px;
            height: 200px;
            overflow: hidden;
            position: relative;
          }

          .manual-stripes {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 55vw;
            display: flex;
            justify-content: flex-end;
            gap: 100px;
            z-index: 0;
            pointer-events: none;
          }

          .ripa {
            width: 100px;
            background-color: #1d1d1b;
            transform: skewX(-30deg);
            height: 100%;
          }

          .app-links-content {
            max-width: 1200px;
            margin: 0 auto;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 1;
            padding: 0 1rem;
            gap: 1rem;
          }

          .text-side {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            padding: 0.4rem;
          }

          .text-image {
            width: 360px;
            height: auto;
            margin-left: -20px;
            max-width: 100%;
          }

          .button-side {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0.4rem;
          }

          .links-button {
            background-color: #333333;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 900;
            font-size: 2rem;
            padding: 1.4rem 3.6rem;
            border: 10px solid white;
            border-radius: 999px;
            text-decoration: none;
            transition: all 0.3s ease;
            z-index: 1;
            position: relative;
            margin-right: -20px;
            white-space: nowrap;
          }

          .links-button:hover {
            transform: scale(1.06);
            box-shadow: 0 0 14px rgba(255, 255, 255, 0.25);
          }

          @media (max-width: 1024px) {
            .text-image {
              width: 300px;
            }

            .links-button {
              font-size: 1.6rem;
              padding: 1.2rem 3rem;
              border-width: 8px;
            }

            .manual-stripes {
              width: 60vw;
              gap: 80px;
            }

            .ripa {
              width: 80px;
            }
          }

          @media (max-width: 768px) {
            #app-links-container {
              height: 180px;
            }

            .app-links-content {
              flex-wrap: nowrap;
              flex-direction: row;
              justify-content: space-between;
              gap: 0.5rem;
            }

            .text-side {
              justify-content: center;
              flex: 0 0 50%;
            }

            .button-side {
              justify-content: center;
              flex: 0 0 50%;
            }

            .text-image {
              width: 200px;
              margin-left: 0;
            }

            .links-button {
              font-size: 1.1rem;
              padding: 1rem 1rem;
              border-width: 5px;
              margin-right: 0;
            }

            .manual-stripes {
              width: 200px;
              gap: 40px;
              overflow: visible;
            }

            .manual-stripes .ripa:nth-child(n+4) {
              display: none;
            }

            .manual-stripes .ripa {
              width: 60px;
            }
          }
        `}
      </style>

      <div id="app-links-container">
        {/* ░░░ RIPAS À DIREITA ░░░ */}
        <div className="manual-stripes">
          <div className="ripa" />
          <div className="ripa" />
          <div className="ripa" />
          <div className="ripa" />
          <div className="ripa" />
        </div>

        {/* ░░░ IMAGEM + BOTÃO ░░░ */}
        <div className="app-links-content">
          <div className="text-side">
            <img src={textoLinks} alt="Baixe nossos aplicativos" className="text-image" />
          </div>
          <div className="button-side">
            <a href="https://apps.chip7.cc" className="links-button">NOSSOS LINKS</a>
          </div>
        </div>
      </div>
    </>
  )
}
