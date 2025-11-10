import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { AudioTrack, MixerState, AudioProject, AudioEffect } from '../types/audio';

export const useAudioEngine = () => {
  const [mixerState, setMixerState] = useState<MixerState>({
    tracks: [],
    bpm: 120,
    currentTime: 0,
    isPlaying: false,
    masterVolume: 1.0
  });

  const soundRefs = useRef<{ [key: string]: Audio.Sound }>({});

  const loadTrack = useCallback(async (fileUri: string, name: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: false }
      );

      const track: AudioTrack = {
        id: `track_${Date.now()}`,
        name,
        filePath: fileUri,
        volume: 1.0,
        pan: 0,
        duration: 0,
        isMuted: false,
        isSolo: false,
        effects: []
      };

      soundRefs.current[track.id] = sound;
      
      setMixerState(prev => ({
        ...prev,
        tracks: [...prev.tracks, track]
      }));

      return track;
    } catch (error) {
      console.error('Error loading track:', error);
      throw error;
    }
  }, []);

  const playAll = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true
      });

      for (const track of mixerState.tracks) {
        if (!track.isMuted && soundRefs.current[track.id]) {
          await soundRefs.current[track.id].playAsync();
        }
      }

      setMixerState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error('Error playing tracks:', error);
    }
  }, [mixerState.tracks]);

  const pauseAll = useCallback(async () => {
    try {
      for (const sound of Object.values(soundRefs.current)) {
        await sound.pauseAsync();
      }
      setMixerState(prev => ({ ...prev, isPlaying: false }));
    } catch (error) {
      console.error('Error pausing tracks:', error);
    }
  }, []);

  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    setMixerState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track =>
        track.id === trackId ? { ...track, volume } : track
      )
    }));

    if (soundRefs.current[trackId]) {
      soundRefs.current[trackId].setVolumeAsync(volume);
    }
  }, []);

  const toggleMuteTrack = useCallback((trackId: string) => {
    setMixerState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track =>
        track.id === trackId ? { ...track, isMuted: !track.isMuted } : track
      )
    }));
  }, []);

  const applyEffectToTrack = useCallback((trackId: string, effect: AudioEffect) => {
    setMixerState(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => {
        if (track.id === trackId) {
          const existingEffectIndex = track.effects.findIndex(e => e.type === effect.type);
          let newEffects = [...track.effects];
          
          if (existingEffectIndex >= 0) {
            newEffects[existingEffectIndex] = effect;
          } else {
            newEffects.push(effect);
          }

          return {
            ...track,
            effects: newEffects
          };
        }
        return track;
      })
    }));

    console.log('Applied effect to track:', trackId, effect);
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    if (soundRefs.current[trackId]) {
      soundRefs.current[trackId].unloadAsync();
      delete soundRefs.current[trackId];
    }

    setMixerState(prev => ({
      ...prev,
      tracks: prev.tracks.filter(track => track.id !== trackId)
    }));
  }, []);

  return {
    mixerState,
    loadTrack,
    playAll,
    pauseAll,
    setTrackVolume,
    toggleMuteTrack,
    applyEffectToTrack,
    removeTrack
  };
};