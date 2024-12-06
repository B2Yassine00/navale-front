import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AudioContext } from "../components/AudioContext"; // Import du contexte audio global
import customBoat from "../assets/images/bateau_1.png";
import classicBoat from "../assets/images/bateau_2.png";
import {
  default as logo,
  default as pirateBoat,
} from "../assets/images/bateau_3.png";
import settingsicon from "../assets/images/settings_icon.png";
import userco from "../assets/images/user_co.png";
import "../assets/css/Setting.css";
import useAuth from "./useAuth";

const Setting = () => {
  const [boatDesign, setBoatDesign] = useState("classic");
  const [difficulty, setDifficulty] = useState("medium");
  const [flag, setFlag] = useState(null);
  const auth = useAuth();
  // Accès aux valeurs du contexte audio
  const {
    isPlaying,
    togglePlayPause,
    switchAudio,
    activeAudio,
    volume,
    setVolume,
  } = useContext(AudioContext);

  const handleFlagUpload = (e) => {
    setFlag(URL.createObjectURL(e.target.files[0]));
  };

  const handleValidation = () => {
    const flagMessage = flag
      ? "Drapeau personnalisé ajouté"
      : "Pas de drapeau personnalisé";
    console.log(`Design du bateau: ${boatDesign}`);
    console.log(`Difficulté: ${difficulty}`);
    console.log(flagMessage);
    console.log(`Musique de fond: ${activeAudio}`);
    console.log(`Volume: ${volume}%`);
  };

  const handleMusicChange = (e) => {
    switchAudio(e.target.value);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
  };

  return (
    <div className="page-setting">
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
            <img src={userco} alt="user-co" className="user-co" />
          </Link>
          <Link to="/connexion/setting">
            <img
              src={settingsicon}
              alt="Settingscon"
              className="settings-icon"
            />
          </Link>
        </nav>
      </header>
      <main>
        <div className="content-setting-single-section">
          <section className="setting-section">
            <div className="select-container">
              <h3>Choix du design du bateau</h3>
              <div className="boat-selection">
                <img
                  src={classicBoat}
                  alt="Bateau Classique"
                  className={`boat-image ${
                    boatDesign === "classic" ? "selected" : ""
                  }`}
                  onClick={() => setBoatDesign("classic")}
                />
                <img
                  src={pirateBoat}
                  alt="Bateau Pirate"
                  className={`boat-image ${
                    boatDesign === "pirate" ? "selected" : ""
                  }`}
                  onClick={() => setBoatDesign("pirate")}
                />
                <img
                  src={customBoat}
                  alt="Bateau Personnalisé"
                  className={`boat-image-3 ${
                    boatDesign === "custom" ? "selected" : ""
                  }`}
                  onClick={() => setBoatDesign("custom")}
                />
              </div>
            </div>

            <div className="select-container">
              <h3>Choix de la difficulté</h3>

              <select
                className="input-setting-choice"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>

            <div className="input-container">
              <h3>Personnaliser le drapeau</h3>
              <input type="file" onChange={handleFlagUpload} />
              {flag && (
                <img
                  src={flag}
                  alt="Drapeau personnalisé"
                  className="flag-preview"
                />
              )}
            </div>

            <div className="select-container">
              <h3>Musique de fond</h3>

              <select
                className="input-setting-choice"
                value={activeAudio}
                onChange={handleMusicChange}
              >
                <option value="audio1">Pirates des Caraïbes</option>
                <option value="audio2">One Piece</option>
                <option value="audio3">Abdelhakim</option>
              </select>
              {/* Bouton de lecture/pause uniquement dans la page des paramètres */}
            </div>

            <div className="input-container">
              <h3>Volume</h3>

              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
              />

              <button className="btn-audio-control" onClick={togglePlayPause}>
                {isPlaying ? "ON" : "OFF"}
              </button>
            </div>
            <button className="btn-setting" onClick={handleValidation}>
              Valider les choix
            </button>
          </section>
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Mon Application - Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default Setting;
