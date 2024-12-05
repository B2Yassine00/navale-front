import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/bateau_3.png'; // Import du logo
import settings_icon from '../images/settings_icon.png';
import user_co from '../images/user_co.png';
import { changeEmail, changePassword, changeUsername } from './Api'; // Import des fonctions API
import { useNotification } from './NotificationProvider';
import './Profile.css'; // Fichier CSS spécifique pour cette page
import useAuth from './useAuth';


const Profile = () => {
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const token = localStorage.getItem('token');
  const auth = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();


  const handleChangeEmail = async (e) => {
    e.preventDefault();
    try {
      await changeEmail(newEmail, token);
      notifySuccess("Email changé avec succès.");
    } catch (error) {
      notifyError("Un problème est survenu.")
    }
  };

  const handleLogout = async (e) => {
    try{
      await localStorage.removeItem("token");
      await localStorage.removeItem("userId");
      await localStorage.removeItem("gameId");
      navigate('/');
      notifySuccess("Vous etes déconnecter avec succès.");
    }catch (error){
      notifyError("Probleme lors de la deconnexion.");
    }
  }

  const handleChangeUsername = async () => {
    try {
      await changeUsername(newUsername);
      notifySuccess("Username a été changé.")
    } catch (error) {
      notifyError("Un problème est survenu.")
    }
  }

  const handleChangePassword = async () => {
    try{
      await changePassword(currentPassword,newPassword);
      notifySuccess("Username a été changé.")
    }catch(error){
      notifyError("Un problème est survenu.");
    }
  }

  return (
    <div className="page-profile">
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
        <div className="content-profile">
  
  <div className="section-left-profile">
    {/* Changer le mot de passe */}
    <div className="change-password-section-profile">
    <div><h2>Changer le mot de passe</h2></div>
    <div> <input type="password" className="input-profile" placeholder="Ancien mot de passe" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
    <div> <input type="password" className="input-profile" placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
    <div> <button className="btn-profile" onClick={handleChangePassword}>Mettre à jour le mot de passe</button></div>
    </div>
  </div>

  <div className="section-middle-profile">
    {/* Changer l'email */}
    <div className="change-email-section-profile">
    <div> <h2>Changer l'email</h2></div>
    <div>  <input type="email" className="input-profile" placeholder="Nouvel email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /></div>
    <div>  <button className="btn-profile" onClick={handleChangeEmail} >Mettre à jour l'email</button></div>  
    </div>
  </div>

  <div className="section-right-profile">
    {/* Changer le nom d'utilisateur */}
    <div className="change-username-section-profile">
    <div> <h2>Changer le nom d'utilisateur</h2></div>
    <div>  <input type="text" className="input-profile" placeholder="Nouveau nom d'utilisateur" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} /></div>
    <div>  <button className="btn-profile" onClick={handleChangeUsername} >Mettre à jour le nom d'utilisateur</button></div>
    </div>
    <div> <button className="btn-large-profile" onClick={ e => handleLogout(e)} >Déconnexion</button></div>
  </div>
</div>

</main>
<footer>
      <p>&copy; 2024 Mon Application - Tous droits réservés</p>
</footer>
</div>
  );
};

export default Profile;
