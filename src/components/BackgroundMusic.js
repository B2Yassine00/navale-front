// import React, { useEffect, useRef } from 'react';
// import au from '../audio/audio.m4a';
// import au3 from '../audio/audio3.mp3';

// const BackgroundMusic = ({ selectedTrack, isMusicActive }) => {
//   const piratesAudioRef = useRef(new Audio(au));
//   const onePieceAudioRef = useRef(new Audio(au3));

//   useEffect(() => {
//     const currentAudio =
//       selectedTrack === 'pirates' ? piratesAudioRef.current : onePieceAudioRef.current;

//     // Stop both audios and reset them
//     piratesAudioRef.current.pause();
//     piratesAudioRef.current.currentTime = 0;
//     onePieceAudioRef.current.pause();
//     onePieceAudioRef.current.currentTime = 0;

//     if (isMusicActive) {
//       currentAudio
//         .play()
//         .then(() => {
//           currentAudio.loop = true; // Loop the music
//         })
//         .catch((err) => {
//           console.error('Error playing the audio file:', err);
//         });
//     }

//     return () => {
//       currentAudio.pause();
//     };
//   }, [selectedTrack, isMusicActive]);

//   return null;
// };

// export default BackgroundMusic;
