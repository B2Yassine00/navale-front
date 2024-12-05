import React from 'react';
import { Link } from 'react-router-dom';
import vs from '../images/1vs1.png'; // Import de l'image pour le mode 1VS1
import logo from '../images/bateau_3.png'; // Import du logo
import settings_icon from '../images/settings_icon.png'; // Import de l'icône utilisateur
import user_co from '../images/user_co.png'; // Import de l'icône utilisateur
import './Jouer_1v1.css';
import useAuth from './useAuth';

const Jouer_1v1 = () => {
  const auth = useAuth();
  return (
    <div className="fond-jouer-1v1" >
    <header>
      <nav>
        <img src={logo} alt="Logo" className="logo" />
        <Link to="/">Accueil</Link>
        <Link to="/tutoriel">Tutoriel</Link>
        <Link to="/jouer" style={{color: '#F9943B'}}>Jouer</Link>
        {!auth ? (
            <Link to="/connexion">Connexion</Link>
          ) : (
            <>
              <Link to="/connexion/profile">
                <img src={user_co} alt="User Profile" className="user-co" />
              </Link>
              <Link to="/connexion/setting">
                <img src={settings_icon} alt="Settings Icon" className="settings-icon" />
              </Link>
            </>
          )}
      </nav>
    </header>
      <main>
        <div className="container-jouer-1v1">
        <div className="game-mode-jouer-1v1">
            <img src={vs} alt="1VS1 Mode" className="game-image-jouer-1v1" />
            <p className="game-link-jouer-1v1">1VS1</p>
        </div>
          <div className="text-zone-jouer-1v1">
                <p><span className="bullet-jouer-1v1"></span> Choisir la taille du plateau : Petit, moyen, grand.</p>
                <p> <span className="bullet-jouer-1v1"></span> Choisir le style des navires.</p>
                <p> <span  className="bullet-jouer-1v1"></span> Placer les navires.</p>
                <Link to="/jouer/jeu" > <button className="start-button-jouer-1v1">Commencer la partie</button></Link>
          </div>
        </div>
            
      </main>
      <footer>
            <p>&copy; 2024 Mon Application - Tous droits réservés</p>
        </footer>
    </div>
  );
}

export default Jouer_1v1;