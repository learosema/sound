
export function noteToFrequency(note) {
  return 440 * Math.pow(2, (noteToMIDI(note) - 69) / 12);
}

export function noteToMIDI(note) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = parseInt(note.slice(-1));
  const noteName = note.slice(0, -1);
  return (octave + 1) * 12 + noteNames.indexOf(noteName);
}

const OscGainNode = (AC, type = 'sine'|'square'|'triangle') => {
  const node = {
    osc: AC.createOscillator(),
    gain: AC.createGain(),
  }
  node.osc.type=type;
  
  node.osc.start();
  return node;
}


export class FrequencyModulation {

  constructor(audioContext, modulationFrequency = 12, modulationDepth = 4) {
    this.audioContext = audioContext;
    this.modulationDepth = modulationDepth;
    this.modulationFrequency = modulationFrequency;
    this.carrier = OscGainNode(this.audioContext, 'square');
    this.modulator = OscGainNode(this.audioContext, 'square');

    this.modulator.osc.connect(this.modulator.gain);
    this.modulator.gain.connect(this.carrier.osc.frequency);
    
    this.carrier.osc.connect(this.carrier.gain);
    this.carrier.gain.connect(audioContext.destination);
  }

  play(note1, startTime, endTime) {
    const frequency = noteToFrequency(note1);
    this.carrier.osc.frequency.setValueAtTime(frequency, startTime);
    this.modulator.osc.frequency.setValueAtTime(this.modulationFrequency, startTime);
    this.modulator.gain.gain.setValueAtTime(frequency / this.modulationDepth, startTime);
    this.carrier.gain.gain.setValueAtTime(1, startTime);
    this.carrier.gain.gain.linearRampToValueAtTime(0, endTime);
  }
}
