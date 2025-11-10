import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AudioTrack } from '../types/audio';

interface AudioMixerProps {
  tracks: AudioTrack[];
  onTrackVolumeChange: (trackId: string, volume: number) => void;
  onToggleMute: (trackId: string) => void;
  onApplyEffect: (trackId: string, effect: any) => void;
  onRemoveTrack: (trackId: string) => void;
  onAdvancedEffects: (trackId: string) => void; // ← NUEVA PROP CORREGIDA
}

export const AudioMixer: React.FC<AudioMixerProps> = ({
  tracks,
  onTrackVolumeChange,
  onToggleMute,
  onApplyEffect,
  onRemoveTrack,
  onAdvancedEffects
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎚️ Mezclador de Pistas</Text>
      
      <ScrollView style={styles.tracksContainer}>
        {tracks.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            onVolumeChange={(volume) => onTrackVolumeChange(track.id, volume)}
            onToggleMute={() => onToggleMute(track.id)}
            onApplyEffect={(effect) => onApplyEffect(track.id, effect)}
            onRemove={() => onRemoveTrack(track.id)}
            onAdvancedEffects={() => onAdvancedEffects(track.id)} // ← NUEVA PROP
          />
        ))}
      </ScrollView>

      {tracks.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay pistas de audio</Text>
          <Text style={styles.emptySubtext}>Añade archivos de audio para comenzar a mezclar</Text>
        </View>
      )}
    </View>
  );
};

const TrackRow: React.FC<{
  track: AudioTrack;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onApplyEffect: (effect: any) => void;
  onRemove: () => void;
  onAdvancedEffects: () => void; // ← NUEVA PROP
}> = ({ track, onVolumeChange, onToggleMute, onApplyEffect, onRemove, onAdvancedEffects }) => {
  return (
    <View style={[styles.trackRow, track.isMuted && styles.mutedTrack]}>
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>
          {track.name}
        </Text>
        <Text style={styles.trackDetails}>
          Vol: {(track.volume * 100).toFixed(0)}% • 
          Effects: {track.effects.length}
          {track.isMuted && ' • MUTE'}
        </Text>
      </View>

      <View style={styles.trackControls}>
        {/* Botón Mute */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.muteButton, track.isMuted && styles.activeMute]}
          onPress={onToggleMute}
        >
          <Text style={styles.controlText}>M</Text>
        </TouchableOpacity>

        {/* Controles de Volumen */}
        <View style={styles.volumeControls}>
          <TouchableOpacity 
            style={styles.volumeButton}
            onPress={() => onVolumeChange(Math.max(0, track.volume - 0.1))}
          >
            <Text style={styles.controlText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.volumeText}>{(track.volume * 100).toFixed(0)}%</Text>
          
          <TouchableOpacity 
            style={styles.volumeButton}
            onPress={() => onVolumeChange(Math.min(1, track.volume + 0.1))}
          >
            <Text style={styles.controlText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Botón EQ Básico */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.eqButton]}
          onPress={() => onApplyEffect({
            type: 'equalizer',
            parameters: { lowGain: 0, midGain: 0, highGain: 0 }
          })}
        >
          <Text style={styles.controlText}>EQ</Text>
        </TouchableOpacity>

        {/* Botón Efectos Avanzados - NUEVO */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.advancedButton]}
          onPress={onAdvancedEffects}
        >
          <Text style={styles.controlText}>🎛️</Text>
        </TouchableOpacity>

        {/* Botón Eliminar */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.removeButton]}
          onPress={onRemove}
        >
          <Text style={styles.controlText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 20,
    textAlign: 'center'
  },
  tracksContainer: {
    flex: 1
  },
  trackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88'
  },
  mutedTrack: {
    opacity: 0.6,
    borderLeftColor: '#666'
  },
  trackInfo: {
    flex: 1,
    marginRight: 12
  },
  trackName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  trackDetails: {
    color: '#888',
    fontSize: 12
  },
  trackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  controlButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  muteButton: {
    backgroundColor: '#444'
  },
  activeMute: {
    backgroundColor: '#ff4444'
  },
  eqButton: {
    backgroundColor: '#0088ff'
  },
  advancedButton: {
    backgroundColor: '#8a2be2' // Purple
  },
  removeButton: {
    backgroundColor: '#ff4444'
  },
  controlText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#333',
    padding: 6,
    borderRadius: 6
  },
  volumeButton: {
    padding: 4,
    backgroundColor: '#555',
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center'
  },
  volumeText: {
    color: 'white',
    fontSize: 10,
    minWidth: 30,
    textAlign: 'center'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center'
  }
});