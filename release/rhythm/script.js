let player;
let isPlaying = false; // Global state to track play/pause
const ambientSounds = {
  rain: new Audio('sounds/rain.mp3'),
  thunder: new Audio('sounds/thunder.mp3'),
  wind: new Audio('sounds/wind.mp3'),
  train: new Audio('sounds/train.mp3'),
  water: new Audio('sounds/water.mp3'),
};

// Setup ambient audio
for (const key in ambientSounds) {
  const audio = ambientSounds[key];
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = parseFloat(document.querySelector(`#${key} input`).value);
  audio.load();
  document.querySelector(`#${key} input`).addEventListener('input', e => {
    audio.volume = parseFloat(e.target.value);
  });
}

// YouTube IFrame API callback
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    height: '0',
    width: '0',
    videoId: 'jfKfPfyJRdk',
    playerVars: {
      autoplay: 0,
      controls: 0,
      mute: 0,
    }
  });
}

// Play/Pause button logic
document.getElementById('playPause').addEventListener('click', () => {
  if (!player) return;

  if (isPlaying) {
    // Pause everything
    player.pauseVideo();
    for (const key in ambientSounds) {
      ambientSounds[key].pause();
    }
    document.getElementById('playPause').textContent = '▶️';
    isPlaying = false;
  } else {
    // Play everything
    player.playVideo();
    for (const key in ambientSounds) {
      ambientSounds[key].play();
    }
    document.getElementById('playPause').textContent = '⏸️';
    isPlaying = true;
  }
});

// Volume control for lofi YouTube audio
document.getElementById('lofiVolume').addEventListener('input', (e) => {
  const volume = parseFloat(e.target.value) * 100;
  if (player) player.setVolume(volume);
});


// Splash screen logic
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('splash').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
    }, 600);
  }, 2000);
});


