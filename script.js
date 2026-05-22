/* ==========================================================================
   STATE MANAGEMENT & AUDIO CONTEXT SETUP
   ========================================================================== */

let activeSoundsCount = 0;

// Elements
const body = document.body;
const equalizer = document.getElementById('equalizer');
const statusDisplay = document.getElementById('status-display');

const volumeControl = document.getElementById('volume-control');
const volumeVal = document.getElementById('volume-val');

const soundPads = document.querySelectorAll('.sound-pad');

// Map sound pad data-sound to local audio file paths
const soundFiles = {
  'vineboom': 'Vine boom sound effect.mp3',
  'laugh': 'Frog Laughing - Sound Effect.mp3'
};

/* ==========================================================================
   SLIDER EVENT LISTENERS
   ========================================================================== */

volumeControl.addEventListener('input', (e) => {
  const val = Math.round(e.target.value * 100);
  volumeVal.textContent = `${val}%`;
});

/* ==========================================================================
   EVENT HANDLERS & THEME STATE ENGINE
   ========================================================================== */

function handlePadClick(soundName, padElement) {
  const currentVolume = parseFloat(volumeControl.value);
  const audioFile = soundFiles[soundName];

  // Increase active sound count & trigger layout animations
  activeSoundsCount++;
  equalizer.classList.add('playing');
  padElement.classList.add('active-pad');
  
  // Set active theme class and header tag
  body.className = `theme-${soundName}`;
  statusDisplay.textContent = `PLAYING: ${soundName.toUpperCase()}`;

  // Helper to handle cleanup of state
  const cleanUpState = () => {
    activeSoundsCount--;
    padElement.classList.remove('active-pad');
    
    // Only revert theme to default if no other overlapping sounds are playing
    if (activeSoundsCount === 0) {
      body.className = 'theme-default';
      equalizer.classList.remove('playing');
      statusDisplay.textContent = 'SYSTEM: IDLE';
    }
  };

  if (audioFile) {
    // Play local audio file
    const audio = new Audio(audioFile);
    audio.volume = currentVolume;
    
    audio.addEventListener('ended', cleanUpState);
    
    audio.play().catch(err => {
      console.warn("Audio playback failed (usually requires initial user click):", err);
      cleanUpState();
    });
  } else {
    // For pads with no sound file, just flash the visual theme for 0.8 seconds
    statusDisplay.textContent = `ACTIVE: ${soundName.toUpperCase()} (MUTE)`;
    setTimeout(cleanUpState, 800);
  }
}

// Bind Pads
soundPads.forEach(pad => {
  const soundName = pad.getAttribute('data-sound');
  pad.addEventListener('click', () => {
    handlePadClick(soundName, pad);
  });
});
