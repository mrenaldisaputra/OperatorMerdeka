// Audio elements
const audioElements = {
    background: document.getElementById('backgroundAudio'),
    correct: document.getElementById('correctAudio'),
    wrong: document.getElementById('wrongAudio')
};

// Volume sliders
const volumeSliders = {
    background: document.getElementById('bgVolume'),
    correct: document.getElementById('correctVolume'),
    wrong: document.getElementById('wrongVolume')
};

// Background music source and select
const bgSource = document.getElementById('bgSource');
const bgMusicSelect = document.getElementById('bgMusicSelect');
const bgMusicName = document.getElementById('bgMusicName');

// Status elements
const statusElement = document.getElementById('currentStatus');
const currentlyPlayingElement = document.getElementById('currentlyPlaying');

// Progress bars
const progressBars = {
    background: document.getElementById('bgProgress')
};

// Time elements
const timeElements = {
    background: {
        current: document.getElementById('bgCurrentTime'),
        duration: document.getElementById('bgDuration'),
        remaining: document.getElementById('bgTimeRemaining')
    }
};

// State tracking
let currentlyPlaying = [];
let playingStates = {
    background: false
};

// Initialize volume controls
function initializeVolume() {
    Object.keys(volumeSliders).forEach(key => {
        const slider = volumeSliders[key];
        const audio = audioElements[key];
        // Set initial volume
        audio.volume = slider.value / 100;
        // Add event listener for volume changes
        slider.addEventListener('input', (e) => {
            audio.volume = e.target.value / 100;
        });
    });
}

// Change background music source
function changeBackgroundMusic() {
    const selected = bgMusicSelect.value;
    bgSource.src = `audio/${selected}`;
    audioElements.background.load();
    bgMusicName.textContent = selected;
    stopAudio('background');
}

// Update status display
function updateStatus(status, playing = null) {
    statusElement.textContent = status;
    if (playing !== null) {
        currentlyPlayingElement.textContent = playing;
    }
}

// Format time to MM:SS
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update time display and progress
function updateProgress(type) {
    const audio = audioElements[type];
    const progress = progressBars[type];
    const timeEl = timeElements[type];
    
    if (!audio || !progress || !timeEl) return;
    
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = progressPercent + '%';
        
        // Update time displays
        timeEl.current.textContent = formatTime(audio.currentTime);
        timeEl.duration.textContent = formatTime(audio.duration);
        timeEl.remaining.textContent = '-' + formatTime(audio.duration - audio.currentTime);
    }
}

// Seek audio to specific position
function seekAudio(event, type) {
    const audio = audioElements[type];
    const progressBar = event.currentTarget;
    
    if (!audio || !audio.duration) return;
    
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progressBarWidth = rect.width;
    const seekPercent = clickX / progressBarWidth;
    const seekTime = seekPercent * audio.duration;
    
    audio.currentTime = seekTime;
    updateProgress(type);
}

// Play audio function
function playAudio(type) {
    try {
        const audio = audioElements[type];
        
        if (!audio) {
            console.error(`Audio element for ${type} not found`);
            return;
        }

        // Reset audio to beginning if not background music
        if (type !== 'background') {
            audio.currentTime = 0;
        }
        
        // Play the audio
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Audio started successfully
                if (type === 'background') {
                    playingStates[type] = true;
                    updateStatus('Playing', 'Background Music');
                } else {
                    const soundName = type === 'correct' ? 'SFX Benar' : 'SFX Salah';
                    updateStatus('Playing SFX', soundName);
                }
                
                // Add to currently playing list
                if (!currentlyPlaying.includes(type)) {
                    currentlyPlaying.push(type);
                }
                
                // Add visual feedback
                addButtonFeedback(type, 'play');
                
            }).catch(error => {
                console.error('Error playing audio:', error);
                updateStatus('Error', 'Failed to play audio');
            });
        }
        
    } catch (error) {
        console.error('Error in playAudio:', error);
        updateStatus('Error', 'Failed to play audio');
    }
}

// Pause audio function (mainly for background music)
function pauseAudio(type) {
    try {
        const audio = audioElements[type];
        
        if (!audio) {
            console.error(`Audio element for ${type} not found`);
            return;
        }

        audio.pause();
        
        if (type === 'background') {
            playingStates[type] = false;
            updateStatus('Paused', 'Background Music');
        }
        
        // Add visual feedback
        addButtonFeedback(type, 'pause');
        
    } catch (error) {
        console.error('Error in pauseAudio:', error);
    }
}

// Stop audio function
function stopAudio(type) {
    try {
        const audio = audioElements[type];
        
        if (!audio) {
            console.error(`Audio element for ${type} not found`);
            return;
        }

        audio.pause();
        audio.currentTime = 0;
        
        if (type === 'background') {
            playingStates[type] = false;
            if (progressBars[type]) {
                progressBars[type].style.width = '0%';
            }
            // Reset time displays
            if (timeElements[type]) {
                timeElements[type].current.textContent = '0:00';
                timeElements[type].remaining.textContent = '-0:00';
            }
        }
        
        // Remove from currently playing list
        const index = currentlyPlaying.indexOf(type);
        if (index > -1) {
            currentlyPlaying.splice(index, 1);
        }
        
        // Update status
        if (currentlyPlaying.length === 0) {
            updateStatus('Ready', 'None');
        } else {
            updateStatus('Playing', getCurrentlyPlayingText());
        }
        
        // Add visual feedback
        addButtonFeedback(type, 'stop');
        
    } catch (error) {
        console.error('Error in stopAudio:', error);
    }
}

// Stop all audio
function stopAllAudio() {
    try {
        Object.keys(audioElements).forEach(type => {
            const audio = audioElements[type];
            audio.pause();
            audio.currentTime = 0;
        });
        
        // Reset all states
        playingStates.background = false;
        currentlyPlaying = [];
        
        // Reset progress bars and time displays
        Object.keys(progressBars).forEach(type => {
            if (progressBars[type]) {
                progressBars[type].style.width = '0%';
            }
            if (timeElements[type]) {
                timeElements[type].current.textContent = '0:00';
                timeElements[type].remaining.textContent = '-0:00';
            }
        });
        
        updateStatus('Ready', 'None');
        
        // Add visual feedback to stop all button
        const stopAllBtn = document.querySelector('.stop-all');
        stopAllBtn.classList.add('active');
        setTimeout(() => {
            stopAllBtn.classList.remove('active');
        }, 200);
        
    } catch (error) {
        console.error('Error in stopAllAudio:', error);
    }
}

// Get currently playing text
function getCurrentlyPlayingText() {
    const playingNames = currentlyPlaying.map(type => {
        switch(type) {
            case 'background': return 'Background Music';
            case 'correct': return 'SFX Benar';
            case 'wrong': return 'SFX Salah';
            default: return type;
        }
    });
    return playingNames.join(', ');
}

// Add visual feedback to buttons
function addButtonFeedback(type, action) {
    const buttons = document.querySelectorAll(`button[onclick*="${type}"]`);
    buttons.forEach(button => {
        if (button.textContent.toLowerCase().includes(action) || 
            (action === 'play' && button.classList.contains('quick-btn'))) {
            button.classList.add('active');
            setTimeout(() => {
                button.classList.remove('active');
            }, 300);
        }
    });
}

// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Prevent shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT') return;
    
    switch(event.key.toLowerCase()) {
        case '1':
            playAudio('background');
            break;
        case '2':
            pauseAudio('background');
            break;
        case '3':
            stopAudio('background');
            break;
        case 'q':
            playAudio('correct');
            break;
        case 'w':
            playAudio('wrong');
            break;
        case 's':
            stopAllAudio();
            break;
        case ' ':
            event.preventDefault();
            if (playingStates.background) {
                pauseAudio('background');
            } else {
                playAudio('background');
            }
            break;
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeVolume();
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Add progress update for music tracks
    audioElements.background.addEventListener('timeupdate', () => updateProgress('background'));
    
    // Handle music end events
    audioElements.background.addEventListener('ended', function() {
        playingStates.background = false;
        const index = currentlyPlaying.indexOf('background');
        if (index > -1) {
            currentlyPlaying.splice(index, 1);
        }
        if (currentlyPlaying.length === 0) {
            updateStatus('Ready', 'None');
        } else {
            updateStatus('Playing', getCurrentlyPlayingText());
        }
    });
    
    // Handle SFX end events
    audioElements.correct.addEventListener('ended', function() {
        const index = currentlyPlaying.indexOf('correct');
        if (index > -1) {
            currentlyPlaying.splice(index, 1);
        }
        if (currentlyPlaying.length === 0) {
            updateStatus('Ready', 'None');
        } else {
            updateStatus('Playing', getCurrentlyPlayingText());
        }
    });
    audioElements.wrong.addEventListener('ended', function() {
        const index = currentlyPlaying.indexOf('wrong');
        if (index > -1) {
            currentlyPlaying.splice(index, 1);
        }
        if (currentlyPlaying.length === 0) {
            updateStatus('Ready', 'None');
        } else {
            updateStatus('Playing', getCurrentlyPlayingText());
        }
    });
    
    // Handle metadata loaded for time display initialization
    Object.keys(timeElements).forEach(type => {
        const audio = audioElements[type];
        audio.addEventListener('loadedmetadata', () => {
            if (timeElements[type]) {
                timeElements[type].duration.textContent = formatTime(audio.duration);
                timeElements[type].remaining.textContent = '-' + formatTime(audio.duration);
            }
        });
    });
    
    // Background music select event
    if (bgMusicSelect) {
        bgMusicSelect.addEventListener('change', changeBackgroundMusic);
    }
    // Initialize status
    updateStatus('Ready', 'None');
    console.log('Audio Operator Control initialized successfully!');
    console.log('Keyboard shortcuts:');
    console.log('1 - Play Background Music');
    console.log('2 - Pause Background Music');
    console.log('3 - Stop Background Music');
    console.log('Q - Play SFX Benar');
    console.log('W - Play SFX Salah');
    console.log('S - Stop All Audio');
    console.log('Space - Toggle Background Music');
});

// Error handling for audio loading
Object.keys(audioElements).forEach(type => {
    const audio = audioElements[type];
    
    audio.addEventListener('error', function(e) {
        console.error(`Error loading ${type} audio:`, e);
        updateStatus('Error', `Failed to load ${type} audio`);
    });
    
    audio.addEventListener('loadstart', function() {
        console.log(`Loading ${type} audio...`);
    });
    
    audio.addEventListener('canplay', function() {
        console.log(`${type} audio ready to play`);
    });
});
