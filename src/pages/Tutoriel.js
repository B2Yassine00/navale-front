import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/bateau_3.png'; // Importation de l'image
import userdc from '../images/user_dc.png';
import './Tutoriel.css';
import useAuth from './useAuth';
const Tutoriel = () => {
  const auth = useAuth();
  return (
    <div className='fond-jouer-tutoriel'>
      <header>
        <nav>
          <img src={logo} alt="Logo" className="logo" />  {/* Utilisation de l'image importée */}
          <Link to="/" >Accueil</Link>
          <Link to="/tutoriel" style={{color: '#F9943B'}}>Tutoriel</Link>
          <Link to="/jouer">Jouer</Link>
          {!auth && <Link to="/connexion">Connexion</Link>}
          <img src={userdc} alt="Userdc" className="user-dc" />
        </nav>
      </header>

      <main>
      <div className="container-tutoriel">
          <div className="text-zone-tutoriel">
          <h2 style={{ color: '#F9943B' }}>Mode Solo</h2>

            
              <p>Glissez-déposez le bateau de combat.</p>
              <p>Cliquez sur le bateau pour le pivoter.</p>
              <p>Répétez pour configurer toute la flotte.</p>
              <p>Appuyez sur COMMENCER LA PARTIE pour commencer la bataille.</p>
              <p>Tirez en devinant les cases ennemies.</p>
              <p>Continuez à tirer si vous touchez une cible.</p>
            
            <p>Le joueur joue à tour de rôle.</p>
          </div>

          <div className="text-zone-tutoriel">
            <h2 style={{ color: '#F9943B' }}>Mode Deux Joueurs</h2>
            
              <p>Glissez-déposez chaque bateau sur votre grille.</p>
              <p>Cliquez sur un bateau pour le pivoter.</p>
              <p>Répétez ces étapes pour configurer toute la flotte.</p>
              <p>Les joueurs appuient sur COMMENCER LA PARTIE pour commencer.</p>
              <p>Tirez en devinant les cases ennemies.</p>
              <p>Continuez à tirer tant que vous touchez une cible.</p>
            
            <p>Les joueurs jouent à tour de rôle.</p>
          </div>
        </div>
      </main>
      <footer>
            <p>&copy; 2024 Mon Application - Tous droits réservés</p>
        </footer>
    </div>
  );
};

export default Tutoriel;
