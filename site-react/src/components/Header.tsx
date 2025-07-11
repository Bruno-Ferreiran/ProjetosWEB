//@ts-ignore
import React, { useEffect } from 'react'
import logo from '../assets/logo.png'

export default function Header() {
  useEffect(() => {
    const toggleMobileMenu = () => {
      const menu = document.getElementById('chip7-mobile-menu')
      if (menu) {
        const isOpen = menu.style.display === 'flex'
        menu.style.display = isOpen ? 'none' : 'flex'
        if (!isOpen) menu.style.flexDirection = 'column'
      }
    }

    const closeBtn = document.querySelector('.chip7-close-menu')
    const toggleBtn = document.querySelector('.chip7-mobile-toggle')
    const viabBtns = document.querySelectorAll('.open-viabilidade')

    if (toggleBtn) toggleBtn.addEventListener('click', toggleMobileMenu)
    if (closeBtn) closeBtn.addEventListener('click', toggleMobileMenu)

    viabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const menu = document.getElementById('chip7-mobile-menu')
        if (menu) menu.style.display = 'none'
        // @ts-ignore
        if (window.showViabilidadeModal) window.showViabilidadeModal()
      })
    })
  }, [])

  return (
    <>
      {/* Estilo embutido */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          .chip7-header {
            background-color: #1d1d1b;
            color: white;
            font-family: 'Roboto', sans-serif;
            border-bottom: 2px solid #fbcc0a;
            position: relative;
            z-index: 1000;
          }
          .chip7-header-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.8rem 0;
            max-width: 100%;
          }
          .chip7-left-area {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding-left: 2rem;
          }
          .chip7-right-area {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding-right: 2rem;
          }
          .chip7-logo {
            height: 45px;
          }
          .chip7-divider {
            width: 2px;
            height: 40px;
            background-color: #fbcc0a;
          }
          .chip7-nav {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }
          .chip7-nav a {
            text-decoration: none;
            color: white;
            font-size: 15px;
            transition: color 0.3s;
          }
          .chip7-nav a:hover {
            color: #fbcc0a;
          }
          .chip7-dropdown {
            position: relative;
          }
          .chip7-dropdown-toggle {
            background: none;
            border: none;
            color: white;
            font-weight: 500;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .chip7-dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: #333;
            border-radius: 4px;
            padding: 0.5rem 0;
            min-width: 160px;
            z-index: 100;
          }
          .chip7-dropdown:hover .chip7-dropdown-menu {
            display: block;
          }
          .chip7-dropdown-menu a {
            display: block;
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            font-size: 14px;
          }
          .chip7-dropdown-menu a:hover {
            background-color: #444;
          }
          .chip7-btn-fatura,
          .chip7-btn-fatura-mobile {
            background-color: #eeeeee;
            color: #333333;
            font-weight: 600;
            border: none;
            border-radius: 30px;
            padding: 10px 20px;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .chip7-btn-fatura:hover,
          .chip7-btn-fatura-mobile:hover {
            background-color: #cccccc;
          }
          .chip7-btn-verificar,
          .chip7-btn-verificar-mobile {
            background-color: #fbcc0a;
            color: #1d1d1b;
            font-weight: bold;
            border: 1px solid #fbcc0a;
            border-radius: 30px;
            padding: 10px 20px;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          .chip7-btn-verificar:hover,
          .chip7-btn-verificar-mobile:hover {
            background-color: #e0b209;
            color: #000;
          }
          .chip7-mobile-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: white;
            cursor: pointer;
          }
          .chip7-mobile-menu {
            display: none;
            position: fixed;
            top: 0;
            right: 0;
            background: #1d1d1b;
            color: white;
            width: 80%;
            height: 100%;
            padding: 0;
            box-shadow: -2px 0 8px rgba(0, 0, 0, 0.6);
            flex-direction: column;
            z-index: 9999;
            overflow-y: auto;
          }
          .chip7-mobile-menu-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0;
          }
          .chip7-mobile-nav {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
            padding: 0 1.5rem;
          }
          .chip7-mobile-nav-link {
            padding: 10px 12px;
            border: 1px solid #ffffff;
            border-radius: 6px;
            text-decoration: none;
            color: white;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.3s, color 0.3s;
            text-align: center;
          }
          .chip7-mobile-nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          .chip7-close-menu {
            background: none;
            border: none;
            font-size: 28px;
            color: white;
            cursor: pointer;
            margin-right: 1rem;
          }
          @media (max-width: 900px) {
            .chip7-divider,
            .chip7-btn-verificar,
            .chip7-btn-fatura,
            .chip7-nav {
              display: none;
            }
            .chip7-mobile-toggle {
              display: block;
            }
            .chip7-mobile-divider {
              display: block;
              width: 100%;
              height: 2px;
              background-color: #fbcc0a;
              margin: 1rem 0 0.5rem 0;
            }
          }
        `}
      </style>

      <header className="chip7-header">
        <div className="chip7-header-container">
          <div className="chip7-left-area">
            <a href="/" className="chip7-logo-link">
              <img src={logo} alt="Logo Chip7" className="chip7-logo" />
            </a>
            <div className="chip7-divider" />
            <nav className="chip7-nav">
              <div className="chip7-dropdown">
                <button className="chip7-dropdown-toggle">
                  Produtos
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10l5 5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="chip7-dropdown-menu">
                  <a href="/vision">Chip7 Vision</a>
                  <a href="/servidores">Servidores VPS</a>
                  <a href="/app">App Chip7</a>
                  <a href="/fixo">Telefone Fixo</a>
                </div>
              </div>
              <a href="/empresarial">Planos Empresariais</a>
              <a href="/privacidade">Política de Privacidade</a>
            </nav>
          </div>
          <div className="chip7-right-area">
            <button className="chip7-btn-fatura" onClick={() => (window.location.href = '/faturas')}>
              Fatura fácil
            </button>
            <button className="chip7-btn-verificar open-viabilidade">Verificar Viabilidade</button>
            <button className="chip7-mobile-toggle">⋮</button>
          </div>
        </div>

        <div id="chip7-mobile-menu" className="chip7-mobile-menu">
          <div className="chip7-mobile-menu-header-column">
            <div className="chip7-mobile-menu-header">
              <a href="/" className="chip7-mobile-logo-link">
                <img src={logo} alt="Logo Chip7" className="chip7-mobile-logo" />
              </a>
              <button className="chip7-close-menu">✕</button>
            </div>
            <div className="chip7-mobile-divider" />
          </div>

          <nav className="chip7-mobile-nav">
            <a href="/vision" className="chip7-mobile-nav-link">Chip7 Vision</a>
            <a href="/servidores" className="chip7-mobile-nav-link">Servidores VPS</a>
            <a href="/app" className="chip7-mobile-nav-link">App Chip7</a>
            <a href="/fixo" className="chip7-mobile-nav-link">Telefone Fixo</a>
            <a href="/empresarial" className="chip7-mobile-nav-link">Planos Empresariais</a>
            <a href="/privacidade" className="chip7-mobile-nav-link">Política de Privacidade</a>
          </nav>

          <button className="chip7-btn-fatura-mobile" onClick={() => (window.location.href = '/faturas')}>
            Fatura fácil
          </button>
          <button className="chip7-btn-verificar-mobile full open-viabilidade">Verificar Viabilidade</button>
        </div>
      </header>
    </>
  )
}
