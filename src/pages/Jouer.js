import React from "react";
import { Link } from "react-router-dom";
import vs from "../assets/images/1vs1.png"; // Import de l'image pour le mode 1VS1
import logo from "../assets/images/bateau_3.png"; // Import du logo
import settings_icon from "../assets/images/settings_icon.png";
import solo from "../assets/images/solo.png"; // Import de l'image pour le mode Solo
import user_co from "../assets/images/user_co.png"; // Import de l'icône utilisateur
import "../assets/css/Jouer.css"; // Un fichier CSS spécifique pour cette page
import useAuth from "./useAuth";

const Jouer = () => {
  const auth = useAuth();
  return (
    <div className="fond-jouer">
      <header>
        <nav>
          <img src={logo} alt="Logo" className="logo" />
          <Link to="/">Accueil</Link>
          <Link to="/tutoriel">Tutoriel</Link>
          <Link to="/jouer" style={{ color: "#F9943B" }}>
            Jouer
          </Link>
          {!auth && <Link to="/connexion">Connexion</Link>}
          <Link to="/connexion/profile">
            <img src={user_co} alt="user_co" className="user-co" />
          </Link>
          <Link to="/connexion/setting">
            <img
              src={settings_icon}
              alt="Settings Icon"
              className="settings-icon"
            />
          </Link>
        </nav>
      </header>

      <main>
        <div className="container-jouer">
          <div className="game-mode-jouer">
            <img src={vs} alt="1VS1 Mode" className="game-image-jouer" />
            <Link to="/jouer/jouer_1v1" className="game-link-jouer">
              1 VS 1
            </Link>
          </div>

          <div className="game-mode-jouer">
            <img src={solo} alt="Solo Mode" className="game-image-jouer" />
            <Link to="/jouer/jouer_solo" className="game-link-jouer">
              SOLO
            </Link>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Mon Application - Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default Jouer;
