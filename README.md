# Audio Operator Control - Event Games

Aplikasi web untuk operator games/event yang memudahkan kontrol audio selama acara berlangsung.

## Fitur

### 🎵 Kontrol Audio Lengkap
- **Background Music**: Dropdown dengan pilihan lengkap:
  - BacksoundGames1 & BacksoundGames2 
  - AuraFramingSong
  - LaguBetawi1, LaguBetawi2, LaguBetawi3, LaguBetawi4
- **SFX Benar**: Sound effect untuk jawaban benar
- **SFX Salah**: Sound effect untuk jawaban salah
- **Volume Control**: Slider volume individual untuk setiap audio
- **Time Display**: Current time, duration, dan time remaining
- **Seek Function**: Klik progress bar untuk jump ke posisi tertentu
- **Quick Controls**: Button cepat untuk akses mudah

### ⌨️ Keyboard Shortcuts
- `1` - Play Background Music
- `2` - Pause Background Music  
- `3` - Stop Background Music
- `Q` - Play SFX Benar
- `W` - Play SFX Salah
- `S` - Stop All Audio
- `Space` - Toggle Background Music (Play/Pause)

### 📱 Design Modern & Responsive
- Interface yang clean dan modern
- Responsive design untuk berbagai ukuran layar
- Visual feedback pada setiap interaksi
- Status panel untuk monitoring audio yang sedang berjalan
- Gradient background yang eye-catching

## File Structure

```
OperatorMerdeka/
├── index.html          # Main HTML file
├── style.css           # Styling dan design
├── script.js           # JavaScript functionality
├── README.md           # Documentation
└── audio/
    ├── BacksoundGames1.mp3   # Background music games
    ├── BacksoundGames2.mp3   # Background music games
    ├── AuraFramingSong.mp3   # Aura framing music
    ├── LaguBetawi1.mp3       # Lagu betawi 1
    ├── LaguBetawi2.mp3       # Lagu betawi 2
    ├── LaguBetawi3.mp3       # Lagu betawi 3
    ├── LaguBetawi4.mp3       # Lagu betawi 4
    ├── SFX_BENAR.mp3         # Sound effect benar
    └── SFX_SALAH.mp3         # Sound effect salah
```

## Cara Penggunaan

1. Buka file `index.html` di web browser
2. Gunakan button pada interface atau keyboard shortcuts
3. Atur volume sesuai kebutuhan menggunakan slider
4. Monitor status audio pada panel status

## Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge

## Tips untuk Operator

- Gunakan keyboard shortcuts untuk akses yang lebih cepat
- Background music akan loop otomatis
- SFX akan berhenti otomatis setelah selesai
- Gunakan "Stop All" untuk menghentikan semua audio sekaligus
- Volume dapat diatur real-time tanpa mengganggu playback

## Technical Features

- HTML5 Audio API
- Responsive CSS Grid Layout
- Modern JavaScript ES6+
- Cross-browser compatibility
- Touch-friendly interface
- Visual feedback animations
