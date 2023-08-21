import { FrequencyModulation } from './FrequencyModulation.js';

class WebAudioTracker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
          <style>
            button {
              margin: 10px;
            }
          </style>
          <button id="startButton">Start Arpeggio</button>
          <button id="stopButton">Stop Arpeggio</button>
        `;

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.isPlaying = false;

    this.shadowRoot.getElementById('startButton').addEventListener('click', this.startArpeggio.bind(this));
    this.shadowRoot.getElementById('stopButton').addEventListener('click', this.stopArpeggio.bind(this));
  }

  startArpeggio() {
    if (!this.isPlaying) {
      this.isPlaying = true;

      const melody1 = ['C4', 'E4', 'G4', 'C5', 'E4', 'A4', 'D5', 'G5'];
      const melody2 = ['E5', 'G5', 'B5', 'E6', 'G5', 'C6', 'F6', 'A6'];
      const rhythm = [0.5, 0.25, 0.25, 0.5]; // in seconds

      const fmChiptune = new FrequencyModulation(this.audioContext, 150); // Chiptune-style modulation
      // const fmSine = new FrequencyModulation(this.audioContext, 180); // Sine wave modulation

      let startTime = this.audioContext.currentTime;
      let currentIndex = 0;
      const playLoop = () => {
        const endTime = startTime + rhythm[currentIndex % 4];
        fmChiptune.play(melody1[currentIndex], startTime, endTime);
        
        this.playDrums(startTime, currentIndex % 2 === 0);
        startTime = endTime;

        currentIndex = (currentIndex + 1) % melody1.length;
        if (this.isPlaying) {
          requestAnimationFrame(playLoop);
        }
      };

      playLoop();
    }
  }

  playDrums(startTime, isKick) {
    if (!this.isPlaying) return;

    const bufferSize = this.audioContext.sampleRate * 0.02; // 20ms buffer size
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (isKick && i < bufferSize / 2) {
        // Simulate a kick drum sound
        output[i] = Math.random() * 2 - 1;
      } else {
        // Generate regular white noise
        output[i] = Math.random() * 2 - 1;
      }
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(startTime);
  }

  stopArpeggio() {
    this.isPlaying = false;
  }
}

customElements.define('webaudio-tracker', WebAudioTracker);