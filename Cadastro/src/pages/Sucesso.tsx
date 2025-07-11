import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Usa o mesmo CSS da tela inicial

const Sucesso: React.FC = () => {
  return (
    <div className="home-page-container">
      <div className="home-outer-container">
        {/* Cabeçalho: você pode manter a logo e o título */}
        <header className="home-header-container">
          <img src="/logo1.png" alt="Logo" className="home-logo" />
          <div className="home-divider"></div>
          <h1 className="home-title">Cadastro Enviado</h1>
        </header>
        {/* Container de Conteúdo */}
        <div className="home-content-container">
          <h2 className="home-subtitle">Seu cadastro foi realizado com sucesso!</h2>
          {/* Ícone de verificação */}
          <div className="success-icon" style={{ margin: "20px 0" }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="100" 
              height="100" 
              fill="#f8cb0e" 
              viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.93 10.588l4.796-4.797-1.414-1.414L6.93 7.76 5.707 6.537 4.293 7.95l2.636 2.637z"/>
            </svg>
          </div>
          {/* Botão para voltar para a página inicial */}
          <Link to="/" className="home-button">Voltar para Início</Link>
        </div>
      </div>
    </div>
  );
};

export default Sucesso;
