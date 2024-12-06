import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/bateau_3.png";
import userdc from "../assets/images/user_dc.png";
import { forgottenPassword, login, register } from "./Api";
import "../assets/css/Connexion.css";
import { useNotification } from "./NotificationProvider";
import useAuth from "./useAuth";

const Connexion = () => {
  const [username, setLoginUsername] = useState("");
  const [password, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/jouer");
      notifySuccess("Connexion réussie ! Bienvenue.");
      //setLoginError('');
    } catch (error) {
      notifyError("Erreur de connexion.");
      //setLoginError('Erreur de connexion. Veuillez vérifier vos identifiants.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(registerUsername, registerEmail, registerPassword);
      navigate("/jouer");
      notifySuccess("Welcome!");
      //setRegisterError('');
    } catch (error) {
      notifyError("Erreur d'inscription. Veuillez vérifier vos informations.");
      //setRegisterError('');
    }
  };

  const handleFocus = (e) => {
    e.target.placeholder = "";
  };

  const handleBlur = (e, placeholderText) => {
    if (e.target.value === "") {
      e.target.placeholder = placeholderText;
    }
  };

  const auth = useAuth();
  // Fonction pour ouvrir et fermer le pop-up
  const handleForgotPasswordClick = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleClosePopup = () => {
    setShowForgotPasswordPopup(false);
  };

  const handleForgottenEmail = async () => {
    try {
      await forgottenPassword(email);
      notifySuccess("Vérifier votre boite mail.");
    } catch (error) {
      notifyError("Un probleme est survenue lors de l'envoie de l'email.");
    }
  };

  return (
    <div className="fond-secondaire-connexion">
      <header>
        <nav>
          <img src={logo} alt="Logo" className="logo" />
          <Link to="/">Accueil</Link>
          <Link to="/tutoriel">Tutoriel</Link>
          <Link to="/jouer">Jouer</Link>
          {!auth && (
            <Link to="/connexion" style={{ color: "#F9943B" }}>
              Connexion
            </Link>
          )}
          <img src={userdc} alt="Userdc" className="user-dc" />
        </nav>
      </header>

      <main>
        <div className="container-connexion">
          <div className="left-side-connexion">
            <div>
              <input
                type="text"
                className="input-connexion"
                placeholder="Votre pseudo"
                onFocus={handleFocus}
                value={username}
                onBlur={(e) => handleBlur(e, "Votre pseudo")}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                className="input-connexion"
                placeholder="Votre mot de passe"
                onFocus={handleFocus}
                value={password}
                onChange={(e) => setLoginPassword(e.target.value)}
                onBlur={(e) => handleBlur(e, "Votre mot de passe")}
              />
            </div>
            <div>
              <button className="btn-co-ins-connexion" onClick={handleLogin}>
                Connexion
              </button>
            </div>
            {loginError && (
              <div
                style={{ color: "red", fontSize: "25px", marginTop: "10px" }}
              >
                {loginError}
              </div>
            )}
            <div>
              <Link
                onClick={handleForgotPasswordClick}
                className="forgot-password-connexion"
              >
                Mot de passe oublié?
              </Link>
            </div>
          </div>

          <div className="right-side-connexion">
            <div>
              <input
                type="text"
                className="input-connexion"
                placeholder="Votre pseudo"
                onFocus={handleFocus}
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                onBlur={(e) => handleBlur(e, "Votre pseudo")}
              />
            </div>
            <div>
              <input
                type="email"
                className="input-connexion"
                placeholder="Votre email"
                onFocus={handleFocus}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                onBlur={(e) => handleBlur(e, "Votre email")}
              />
            </div>
            <div>
              <input
                type="password"
                className="input-connexion"
                placeholder="Votre mot de passe"
                onFocus={handleFocus}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                onBlur={(e) => handleBlur(e, "Votre mot de passe")}
              />
            </div>
            <div>
              <button className="btn-co-ins-connexion" onClick={handleRegister}>
                S'inscrire
              </button>
            </div>
            {registerError && (
              <div
                style={{ color: "red", fontSize: "25px", marginTop: "10px" }}
              >
                {registerError}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Pop-up pour réinitialisation du mot de passe */}
      {showForgotPasswordPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Réinitialisation du mot de passe</h2>
            <p>
              Entrez votre adresse e-mail pour recevoir un lien de
              réinitialisation :
            </p>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="input-mail"
              />
            </div>
            <button
              className="btn-co-ins-connexion"
              onClick={handleForgottenEmail}
            >
              Envoyer
            </button>
            <button className="btn-close-popup" onClick={handleClosePopup}>
              Fermer
            </button>
          </div>
        </div>
      )}
      <footer>
        <p>&copy; 2024 Mon Application - Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default Connexion;
