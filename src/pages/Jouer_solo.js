  import React from 'react';
  import { Link, Navigate } from 'react-router-dom';
  import logo from '../images/bateau_3.png'; // Import du logo
  import settings_icon from '../images/settings_icon.png'; // Import de l'icône utilisateur
  import solo from '../images/solo.png'; // Import de l'image pour le mode 1VS1
  import user_co from '../images/user_co.png'; // Import de l'icône utilisateur
  import { startGameFunction } from './Api';
  import './Jouer_solo.css';
  import useAuth from './useAuth'; // Import the custom hook



  const Jouer_solo = () => {
    const auth = useAuth();

    const handleStartGame = async () => {
      try {
        const data = {
          playerId : localStorage.getItem("userId"),
          difficulty : "easy",
          mode : "bot"
        }
      const response = await startGameFunction(data);
      const {idGame,ships} = response.data;
      playerShips = ships;
      localStorage.setItem("gameId",idGame);
      console.log({
        ships
      });
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <div className="fond-jouer-solo" >
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
          <div className="container-jouer-solo">
          <div className="game-mode-jouer-solo">
              <img src={solo} alt="1VS1 Mode" className="game-image-jouer-solo" />
              <p className="game-link-jouer-solo">SOLO</p>
          </div>
            <div className="text-zone-jouer-solo">
                  <p><span className="bullet-jouer-solo"></span> Choisir la taille du plateau : Petit, moyen, grand.</p>
                  <p> <span className="bullet-jouer-solo"></span> Choisir le style des navires.</p>
                  <p> <span  className="bullet-jouer-solo"></span> Placer les navires.</p>
                  <Link to="/jouer/jeu" > <button onClick={handleStartGame} className="start-button-jouer-solo">Commencer la partie</button></Link>
            </div>
          </div>
              
        </main>
        <footer>
              <p>&copy; 2024 Mon Application - Tous droits réservés</p>
          </footer>
      </div>
    );
  }

  export let playerShips;
  export default Jouer_solo;