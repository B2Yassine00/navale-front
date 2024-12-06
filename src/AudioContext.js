import React, { createContext, useState, useRef, useEffect } from 'react';
import audioFile1 from './audio/audio.m4a';
import audioFile2 from './audio/audio3.mp3';
import audioFile3 from './audio/hakim.mpga';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef1 = useRef(new Audio(audioFile1));
  const audioRef2 = useRef(new Audio(audioFile2));
  const audioRef3 = useRef(new Audio(audioFile3));
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudio, setActiveAudio] = useState('audio1');
  const [volume, setVolume] = useState(50);
  const [userPaused, setUserPaused] = useState(true);

  useEffect(() => {
    audioRef1.current.loop = true;
    audioRef2.current.loop = true;
    audioRef3.current.loop = true;
    audioRef1.current.volume = volume / 100;
    audioRef2.current.volume = volume / 100;
    audioRef3.current.volume = volume / 100;
  }, [volume]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef1.current.pause();
      audioRef2.current.pause();
      audioRef3.current.pause();
      setUserPaused(true);
    } else {
      if (activeAudio === 'audio1') {
        audioRef1.current.play();
      } else if (activeAudio === 'audio2') {
        audioRef2.current.play();
      } else if (activeAudio === 'audio3') {
        audioRef3.current.play();
      }
      setUserPaused(false);
    }
    setIsPlaying(!isPlaying);
  };

  const switchAudio = (audioName) => {
    audioRef1.current.pause();
    audioRef2.current.pause();
    audioRef3.current.pause();
    audioRef1.current.currentTime = 0;
    audioRef2.current.currentTime = 0;
    audioRef3.current.currentTime = 0;

    setActiveAudio(audioName);
    if (isPlaying && !userPaused) {
      if (audioName === 'audio1') {
        audioRef1.current.play();
      } else if (audioName === 'audio2') {
        audioRef2.current.play();
      } else if (audioName === 'audio3') {
        audioRef3.current.play();
      }
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayPause, switchAudio, activeAudio, volume, setVolume, userPaused }}>
      {children}
    </AudioContext.Provider>
  );
};
