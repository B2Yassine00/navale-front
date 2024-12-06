import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AudioContext } from "./AudioContext";

const Layout = ({ children }) => {
  const { isPlaying, togglePlayPause, userPaused } = useContext(AudioContext);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/jouer/jeu" && isPlaying) {
      togglePlayPause();
    } else if (
      location.pathname !== "/connexion/setting" &&
      !userPaused &&
      !isPlaying
    ) {
      togglePlayPause();
    }
  }, [location, isPlaying, togglePlayPause, userPaused]);

  return <div>{children}</div>;
};

export default Layout;
