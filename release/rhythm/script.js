let player;
let isPlaying = false;
const ambientSounds = {
  rain: new Audio('sounds/rain.mp3'),
  thunder: new Audio('sounds/thunder.mp3'),
  wind: new Audio('sounds/wind.mp3'),
  train: new Audio('sounds/train.mp3'),
  bird: new Audio('sounds/bird.mp3'),
  seawaves: new Audio('sounds/seawaves.mp3'),
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


// Play/Pause button logic goes here ... brrrrrrrrrrrrrrrrr.......
document.getElementById('playPause').addEventListener('click', () => {

  const icon = document.getElementById('playPauseIcon');
  if (!player || !icon) return;

  if (isPlaying) {
    // Pause everything
    player.pauseVideo();
    for (const key in ambientSounds) {
      ambientSounds[key].pause();
    }
    icon.textContent = 'play_arrow';
    isPlaying = false;
  } else {
    // Play everything
    player.playVideo();
    for (const key in ambientSounds) {
      ambientSounds[key].play();
    }
    icon.textContent = 'pause';
    isPlaying = true;
  }
});

// Clock update logic
function updateClock() {
  const clock = document.getElementById('clock-time');
  if (!clock) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  clock.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();




// background video logic
const bgVideos = [
  './bg/1.webm',
  './bg/2.webm',
  './bg/3.webm',
  './bg/4.webm'
];

// Preload and cache background videos
bgVideos.forEach(src => {
  const vid = document.createElement('video');
  vid.src = src;
  vid.preload = 'auto';
  vid.muted = true;
  vid.style.display = 'none';
  document.body.appendChild(vid);
});

let currentBgIndex = 0;

const bgVideo = document.getElementById('bgVideo');
const prevBgBtn = document.getElementById('prevBg');
const nextBgBtn = document.getElementById('nextBg');

function setBgVideo(index, direction = 'right') {
  const outClass = direction === 'left' ? 'slide-out-right' : 'slide-out-left';
  bgVideo.classList.remove('slide-in');
  bgVideo.classList.add(outClass);

  setTimeout(() => {
    currentBgIndex = (index + bgVideos.length) % bgVideos.length;
    bgVideo.src = bgVideos[currentBgIndex];
    bgVideo.load();
    bgVideo.play();

    bgVideo.classList.remove(outClass);
    bgVideo.classList.add('slide-in');
  }, 500); // Match transition duration
}

prevBgBtn.addEventListener('click', () => {
  setBgVideo(currentBgIndex - 1, 'left');
});

nextBgBtn.addEventListener('click', () => {
  setBgVideo(currentBgIndex + 1, 'right');
});

// Optional: Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') setBgVideo(currentBgIndex - 1, 'left');
  if (e.key === 'ArrowRight') setBgVideo(currentBgIndex + 1, 'right');
});


const channels = [
  { name: "Lofi Girl", id: "jfKfPfyJRdk" },
  { name: "Chillhop", id: "FcpsfK4IUMs" },
  { name: "Synthwave", id: "4xDzrJKXOOY" },
  { name: "Ambient Renders", id: "7NOSDKb0HlU" }
];

// Populate dropdown
const channelDropdownMenu = document.getElementById('channelDropdownMenu');
channels.forEach(channel => {
  const li = document.createElement('li');
  li.textContent = channel.name;
  li.style.padding = '10px 18px';
  li.style.cursor = 'pointer';
  li.style.fontFamily = 'Quicksand, sans-serif';
  li.style.fontSize = '1.1rem';
  li.style.color = '#fff';
  li.addEventListener('click', () => {
    if (player && typeof player.loadVideoById === 'function') {
      player.loadVideoById(channel.id);
      isPlaying = true;
      document.getElementById('playPauseIcon').textContent = 'pause';
    }
    channelDropdownMenu.style.display = 'none';
  });
  li.addEventListener('mouseenter', () => li.style.background = '#6e5e8a');
  li.addEventListener('mouseleave', () => li.style.background = 'none');
  channelDropdownMenu.appendChild(li);
});

// Dropdown toggle
const channelDropdownBtn = document.getElementById('channelDropdownBtn');
channelDropdownBtn.addEventListener('click', () => {
  channelDropdownMenu.style.display = channelDropdownMenu.style.display === 'none' ? 'block' : 'none';
});

// Hide dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!channelDropdownBtn.contains(e.target) && !channelDropdownMenu.contains(e.target)) {
    channelDropdownMenu.style.display = 'none';
  }
});
