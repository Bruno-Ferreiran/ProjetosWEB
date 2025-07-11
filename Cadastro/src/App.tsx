import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="home-page-container">
      <div className="home-outer-container">
        {/* Cabeçalho com logo e título */}
        <header className="home-header-container">
          <img src="/logo1.png" alt="Logo" className="home-logo" />
          <div className="home-divider"></div>
          <h1 className="home-title">Ficha de Cadastro</h1>
        </header>

        {/* Conteúdo central */}
        <div className="home-content-container">
          <h2 className="home-subtitle">
            Escolha a opção desejada para iniciar seu cadastro:
          </h2>
          <div className="home-button-container">
            <Link to="/pf" className="home-button">
              Pessoa Física
            </Link>
            <Link to="/pj" className="home-button">
              Pessoa Jurídica
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
