// Get elements
const audioPlayer = document.getElementById("audioPlayer");
const trackName = document.getElementById('footer-track-name');
const artistName = document.getElementById('footer-artist-name');
const albumArt = document.getElementById('footer-album-art');
const songItems = document.querySelectorAll('.song-item');
const volumeControl = document.getElementById('volume');
const volumeButton = document.getElementById('control-button');

// Get the progress bar and time display elements
const progressBar = document.getElementById("progress");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");

// Song data (title, artist, album cover, MP3 path)
const songs = [
    {
        title: "Real",
        artist: "NF",
        albumArt: "pics/NFtherapysession.jpg",
        audioFile: "music/NFreal.mp3",
        youtubeVideo: "https://www.youtube.com/embed/MDWSqeBodEg"  // Example YouTube video link
    },
    {
        title: "Breathe",
        artist: "NF",
        albumArt: "pics/NFtherapysession.jpg",
        audioFile: "music/NFbreathe.mp3",
        youtubeVideo: "https://youtu.be/CXA-b9Goous"                                                                                                      // Replace with actual video ID
    },
    {
        title: "How Could You Leave Us",
        artist: "NF",
        albumArt: "pics/NFtherapysession.jpg",
        audioFile: "music/NFhowcouldyouleaveus.mp3",
        youtubeVideo: "https://youtu.be/wOzQMCyPc8o"  // Replace with actual video ID
    }
    // Add more songs here with YouTube video links
];

// Get the YouTube iframe element
const youtubeIframe = document.getElementById("youtube-video");

// Get the play, next, and previous buttons
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const playPauseButton = document.getElementById("play-pause-btn");

// Function to update the footer with current song details and iframe youtube video
function updateFooter(song) {
    trackName.textContent = song.title;
    artistName.textContent = song.artist;
    albumArt.src = song.albumArt;

    // Update the YouTube iframe source with the corresponding video URL
    youtubeIframe.src = song.youtubeVideo;
}

// Track the current song index
let currentSongIndex = 0;

// Event listener for "next" button
nextButton.addEventListener('click', function() {
    // Move to the next song, loop to the first song if at the end
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
    highlightSong(songItems[currentSongIndex]); // Highlight the new song
});

// Event listener for "previous" button
prevButton.addEventListener('click', function() {
    // Move to the previous song, loop to the last song if at the beginning
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
    highlightSong(songItems[currentSongIndex]); // Highlight the new song
});

// Initialize the player by playing the first song in the list
playSong(currentSongIndex);

// Function to play the current song
function playSong(index) {
    const song = songs[index];
    audioPlayer.src = song.audioFile;
    // Ensure the audio source is loaded before playing
    audioPlayer.load(); // Force load the new audio file
    audioPlayer.play(); // Then play the audio
    playPauseButton.innerHTML = "❚❚"; // Change to pause icon
    updateFooter(song);
}

// Keep track of the currently playing song
let currentSong = null;

// Add event listeners to song items
songItems.forEach((songItem, index) => {
    songItem.addEventListener('click', function () {
        // Get song details
        const song = songs[index];

        // Update footer with song details
        trackName.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.src = song.albumArt;

        // Set the audio player source and start playing
        audioPlayer.src = song.audioFile;
        audioPlayer.play();

        // Change the play/pause button to "pause"
        playPauseButton.innerHTML = "❚❚"; // Pause icon

        // Highlight the selected song
        highlightSong(songItem);

        // Update the current song index
        currentSongIndex = index;
    });
});

// Function to highlight the currently playing song and remove highlight from the previous one
function highlightSong(selectedSong) {
    // Remove highlight from previous song
    songItems.forEach(item => item.classList.remove('active-song'));

    // Add highlight to the selected song
    selectedSong.classList.add('active-song');
}

// Play/Pause button functionality
playPauseButton.addEventListener("click", function() {
    if (audioPlayer.paused || audioPlayer.ended) {
        audioPlayer.play();
        playPauseButton.innerHTML = "❚❚"; // Change to pause icon
    } else {
        audioPlayer.pause();
        playPauseButton.innerHTML = "⏯️"; // Change to play icon
    }
});

// Update progress bar and time as the song plays
audioPlayer.addEventListener('timeupdate', function () {
    // Get the current time and total duration
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    // Calculate the progress as a percentage
    const progress = (currentTime / duration) * 100;
    progressBar.value = progress;

    // Update the current time and total time display
    currentTimeDisplay.innerText = formatTime(currentTime);
    totalTimeDisplay.innerText = formatTime(duration);
});

// Sync the audio playback with the progress bar when the user manually changes the progress
progressBar.addEventListener('input', function () {
    const value = progressBar.value;
    const duration = audioPlayer.duration;

    // Calculate the new current time based on the progress bar value
    const newCurrentTime = (value / 100) * duration;
    audioPlayer.currentTime = newCurrentTime;
});

// Function to format time (minutes:seconds) without decimals
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60); // Remove decimals from seconds
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

// Set the initial volume based on the range input's value (max is 100, so scale it down to 1)
audioPlayer.volume = volumeControl.value / 100;

// When the volume control changes, update the audio player's volume
volumeControl.addEventListener('input', function() {
    audioPlayer.volume = volumeControl.value / 100;
    updateVolumeIcon();  // Optionally, update the volume icon based on the volume level
});

// Update volume icon
function updateVolumeIcon() {
    if (audioPlayer.volume === 0) {
        volumeButton.innerHTML = '🔇'; // Mute icon
    } else if (audioPlayer.volume > 0 && audioPlayer.volume <= 0.5) {
        volumeButton.innerHTML = '🔉'; // Low volume icon
    } else {
        volumeButton.innerHTML = '🔊'; // High volume icon
    }
}

// Mute functionality for the volume button
volumeButton.addEventListener('click', function () {
    if (audioPlayer.volume > 0) {
        audioPlayer.volume = 0; // Mute the audio
        volumeControl.value = 0; // Set volume slider to 0
    } else {
        audioPlayer.volume = 0.8; // Unmute the audio
        volumeControl.value = 80; // Set volume slider to 80
    }
    updateVolumeIcon();  // Update the volume icon
});