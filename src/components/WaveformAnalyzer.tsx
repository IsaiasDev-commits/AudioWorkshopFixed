import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WaveformAnalyzerProps {
  isPlaying: boolean;
  tracks: any[];
}

export const WaveformAnalyzer: React.FC<WaveformAnalyzerProps> = ({ 
  isPlaying, 
  tracks 
}) => {
  const activeTracks = tracks.filter(track => !track.isMuted);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎚️ Monitor de Audio</Text>
      <View style={styles.meterContainer}>
        <View style={[styles.meter, { width: `${(activeTracks.length / Math.max(tracks.length, 1)) * 100}%` }]} />
      </View>
      <View style={styles.info}>
        <Text style={styles.infoText}>
          Pistas activas: {activeTracks.length}/{tracks.length}
        </Text>
        <Text style={styles.infoText}>
          Estado: {isPlaying ? '🔴 EN VIVO' : '⏸️ PAUSA'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    margin: 10,
  },
  title: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meterContainer: {
    height: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
  },
  meter: {
    height: '100%',
    backgroundColor: '#00ff88',
    borderRadius: 10,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  infoText: {
    color: '#888',
    fontSize: 12,
  },
});