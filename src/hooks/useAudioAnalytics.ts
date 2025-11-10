import { useState, useEffect } from 'react';
import { AudioTrack } from '../types/audio';

interface AudioAnalytics {
  totalDuration: number;
  fileSizes: number;
  averageBitrate: number;
  effectsApplied: number;
  peakVolume: number;
  loudness: number;
}

export const useAudioAnalytics = (tracks: AudioTrack[]) => {
  const [analytics, setAnalytics] = useState<AudioAnalytics>({
    totalDuration: 0,
    fileSizes: 0,
    averageBitrate: 0,
    effectsApplied: 0,
    peakVolume: 0,
    loudness: 0,
  });

  useEffect(() => {
    const totalEffects = tracks.reduce((sum, track) => sum + track.effects.length, 0);
    const peakVolume = Math.max(...tracks.map(track => track.volume));
    const averageVolume = tracks.reduce((sum, track) => sum + track.volume, 0) / tracks.length || 0;

    setAnalytics({
      totalDuration: tracks.length * 180, // Simulado 3min por track
      fileSizes: tracks.length * 5, // Simulado 5MB por track
      averageBitrate: 320,
      effectsApplied: totalEffects,
      peakVolume,
      loudness: averageVolume,
    });
  }, [tracks]);

  return analytics;
};