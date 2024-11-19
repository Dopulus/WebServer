let audioPlayer;
let playPauseButton;
let volumeControl;
let toggleThemeButton;
let toggleNavButton;
let startPartyButton;
let sidebar;
let isAudioStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    // Crea l'iframe per l'audio se non esiste già
    if (!document.getElementById('audioIframe')) {
        const iframe = document.createElement('iframe');
        iframe.id = 'audioIframe';
        iframe.src = '../audio.html';
        iframe.style.display = 'none';
        iframe.setAttribute('aria-hidden', 'true');
        document.getElementById('audioContainer').appendChild(iframe);
    }

    const iframe = document.getElementById('audioIframe');
    if (iframe) {
        iframe.addEventListener('load', () => {
            audioPlayer = iframe.contentWindow.document.getElementById('audioPlayer');
            playPauseButton = document.getElementById('playPauseButton');
            volumeControl = document.getElementById('volumeControl');
            toggleThemeButton = document.getElementById('toggleTheme');
            toggleNavButton = document.getElementById('toggleNav');
            startPartyButton = document.getElementById('startPartyButton');
            sidebar = document.querySelector('.sidebar');

            // Imposta volume iniziale
            if (audioPlayer) {
                audioPlayer.volume = 0.1; // Volume iniziale basso
                volumeControl.value = 0.1; // Aggiorna il controllo del volume
                console.log('Volume iniziale impostato a:', audioPlayer.volume); // Log per verifica
            }

            // Mantieni lo stato della riproduzione dell'audio tra le pagine
            const isAudioPlaying = localStorage.getItem('isAudioPlaying');
            const audioCurrentTime = localStorage.getItem('audioCurrentTime');
            if (isAudioPlaying === 'true' && audioPlayer) {
                if (audioCurrentTime) {
                    audioPlayer.currentTime = parseFloat(audioCurrentTime);
                }
                playAudio();
                isAudioStarted = true;
            }

            // Gestisci il pulsante Play/Pause
            if (playPauseButton) {
                playPauseButton.addEventListener('click', () => {
                    if (!isAudioStarted) {
                        playAudio();
                        isAudioStarted = true;
                    } else if (audioPlayer.paused) {
                        playAudio();
                    } else {
                        pauseAudio();
                    }
                });
            }

            // Cambia volume in tempo reale
            if (volumeControl) {
                volumeControl.addEventListener('input', () => {
                    audioPlayer.volume = volumeControl.value;
                    console.log('Volume cambiato a:', audioPlayer.volume); // Log per verifica
                    volumeControl.style.transition = 'width 0.2s ease';
                });
            }

            // Salva il tempo corrente dell'audio in localStorage
            audioPlayer.addEventListener('timeupdate', () => {
                localStorage.setItem('audioCurrentTime', audioPlayer.currentTime);
            });

            // Funzionalità di cambio tema
            if (toggleThemeButton) {
                toggleThemeButton.addEventListener('click', () => {
                    document.body.classList.toggle('light-theme');
                    document.body.classList.add('theme-transition');
                    setTimeout(() => {
                        document.body.classList.remove('theme-transition');
                    }, 500);
                });
            }

            // Funzionalità di mostra/nascondi menu
            if (toggleNavButton) {
                toggleNavButton.addEventListener('click', () => {
                    sidebar.classList.toggle('open');
                    sidebar.classList.toggle('closed');
                });
            }

            // Funzione per avviare la festa
            if (startPartyButton) {
                startPartyButton.addEventListener('click', () => {
                    document.body.classList.toggle('party-mode');
                    startPartyButton.innerText = document.body.classList.contains('party-mode') ? '🎉 Festa Iniziata!' : '🎉 Inizio Festa';
                    if (document.body.classList.contains('party-mode')) {
                        startDiscoLights();
                    } else {
                        stopDiscoLights();
                    }
                });
            }
        });
    }
});

function playAudio() {
    audioPlayer.play().catch(error => {
        console.error('Autoplay blocked:', error);
    });
    playPauseButton.classList.add('playing');
    playPauseButton.innerText = '⏸️';
    playPauseButton.classList.add('rotate');
    localStorage.setItem('isAudioPlaying', 'true');
}

function pauseAudio() {
    audioPlayer.pause();
    playPauseButton.classList.remove('playing', 'rotate');
    playPauseButton.innerText = '▶️';
    localStorage.setItem('isAudioPlaying', 'false');
}

let discoInterval;

function startDiscoLights() {
    discoInterval = setInterval(() => {
        document.body.style.backgroundColor = getRandomColor();
    }, 500);
}

function stopDiscoLights() {
    clearInterval(discoInterval);
    document.body.style.backgroundColor = '';
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
