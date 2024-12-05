import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/bateau_3.png';  // Import du logo
import userdc from '../images/user_dc.png';
import './Accueil.css'
import useAuth from './useAuth'; // Import the custom hook

const Accueil = () => {
  const auth = useAuth();
  return (
    <div className='fond-accueil'>
      <header>
        <nav>
          <img src={logo} alt="Logo" className="logo" />
          <Link to="/" style={{color: '#F9943B'}}>Accueil</Link>
          <Link to="/tutoriel">Tutoriel</Link>
          <Link to="/jouer">Jouer</Link>
          {!auth && <Link to="/connexion">Connexion</Link>}
          <img src={userdc} alt="Userdc" className="user-dc" /> 
        </nav>
      </header>
       
      <main>  
        <div><p className='title-bataille-accueil'>BATAILLE</p></div>
        <div><p className='title-navale-accueil'>Navale</p></div>
        
        <div className="container-accueil">
          <div className="text-zone-accueil">
            <h3>Règles du jeu :</h3>
            <p>Place tes navires de manière stratégique sur une grille.</p>
            <p>Devine où se trouvent les navires ennemis en tirant sur les cases de la grille adverse.</p>
          </div>
          <div className="star-button-accueil">
             <Link to="/jouer" className="star-text-accueil">JOUER</Link>
          </div> 
          <div className="text-zone-accueil">
            <h3>Objectif du jeu :</h3>
            <p>Coule tous les navires de ton adversaire avant qu'il ne coule les tiens.</p>
          </div>
        </div>
      </main>
      <footer>
            <p>&copy; 2024 Mon Application - Tous droits réservés</p>
        </footer>
    </div>
  );
};

export default Accueil;