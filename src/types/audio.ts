// 🎵 Tipos base de pistas y efectos
export interface AudioTrack {
  id: string;
  name: string;
  filePath: string;
  volume: number;
  pan: number;
  duration: number;
  isMuted: boolean;
  isSolo: boolean;
  effects: AudioEffect[];
}

// 🎚️ Tipos de efectos de audio
export interface AudioEffect {
  id: string;
  type: 'equalizer' | 'reverb' | 'delay' | 'compressor';
  parameters: EQParameters | ReverbParameters | DelayParameters | CompressorParameters;
}

// 🔊 Parámetros individuales por efecto
export interface EQParameters {
  lowGain: number;
  midGain: number;
  highGain: number;
}

export interface ReverbParameters {
  decay: number;      // 0.1 - 10s
  wetLevel: number;   // 0 - 1
  dryLevel: number;   // 0 - 1
  preDelay: number;   // 0 - 100ms
}

export interface DelayParameters {
  delayTime: number;  // 0 - 2000ms
  feedback: number;   // 0 - 0.9
  wetLevel: number;   // 0 - 1
  cutoff: number;     // 100 - 20000Hz
}

export interface CompressorParameters {
  threshold: number;  // -60 - 0 dB
  ratio: number;      // 1 - 20
  attack: number;     // 1 - 100ms
  release: number;    // 10 - 1000ms
  gain: number;       // 0 - 20 dB
}

// 🎚️ Estado general del mezclador
export interface MixerState {
  tracks: AudioTrack[];
  bpm: number;
  currentTime: number;
  isPlaying: boolean;
  masterVolume: number;
}

// 🎵 Configuración y proyecto
export interface AudioProject {
  id: string;
  name: string;
  createdAt: Date;
  lastSaved: Date;
  tracks: AudioTrack[];
  bpm: number;
  userId: string;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  masterVolume: number;
  metronome: boolean;
  autoSave: boolean;
  performanceMode: boolean;
}
