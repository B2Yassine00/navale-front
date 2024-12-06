import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AudioProvider } from './AudioContext';
import Connexion from './pages/Connexion';
import Jouer from './pages/Jouer';
import Tutoriel from './pages/Tutoriel';
import Accueil from './pages/Accueil';
import Jouer_solo from './pages/Jouer_solo';
import Jouer_1v1 from './pages/Jouer_1v1';
import Jeu from './pages/Jeu';
import Profile from './pages/Profile';
import Setting from './pages/Setting';
import Layout from './components/Layout';
import { NotificationProvider } from './pages/NotificationProvider'
import ProtectedRoutes from './ProctectedRoutes';

function App() {
  return (
    <NotificationProvider>
      <AudioProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/tutoriel" element={<Tutoriel />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/jouer" element={<Jouer />} />
                <Route path="/jouer/jouer_solo" element={<Jouer_solo />} />
                <Route path="/jouer/Jouer_1v1" element={<Jouer_1v1 />} />
                <Route path="/jouer/jeu" element={<Jeu />} />
                <Route path="/connexion/profile" element={<Profile />} />
                <Route path="/connexion/setting" element={<Setting />} />
              </Route>

            </Routes>
          </Layout>
        </Router>
      </AudioProvider>
    </NotificationProvider>
  );
}

export default App;
