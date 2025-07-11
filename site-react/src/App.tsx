//@ts-ignore
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Banner from './components/Banner'
import Planos from './components/Planos'
import Links from './components/Links'
import CardProdutos from './components/CardProdutos'
import ViabilidadeModal from './components/ViabilidadeModal'

// Importando a nova tela de login de faturas
import LoginFaturas from './faturas/Login'

export default function App() {
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.open-viabilidade')) {
        setModalAberto(true)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const styles = {
    app: {
      backgroundColor: '#1d1d1b',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      overflowX: 'hidden' as const,
      margin: 0,
      padding: 0,
    },
  }

  return (
    <div style={styles.app}>
      <Router>
        <Header />

        <Routes>
          {/* Página principal */}
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Planos />
                <Links />
                <CardProdutos />
              </>
            }
          />

          {/* Tela de Faturas */}
          <Route path="/faturas" element={<LoginFaturas />} />
        </Routes>

        {/* Modal de viabilidade */}
        {modalAberto && <ViabilidadeModal onClose={() => setModalAberto(false)} />}
      </Router>
    </div>
  )
}
