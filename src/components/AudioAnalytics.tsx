import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AudioAnalyticsProps {
  analytics: {
    totalDuration: number;
    fileSizes: number;
    averageBitrate: number;
    effectsApplied: number;
    peakVolume: number;
    loudness: number;
  };
}

export const AudioAnalytics: React.FC<AudioAnalyticsProps> = ({ analytics }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (mb: number) => {
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Analytics del Proyecto</Text>
      
      <View style={styles.grid}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{formatTime(analytics.totalDuration)}</Text>
          <Text style={styles.metricLabel}>Duración Total</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{formatFileSize(analytics.fileSizes)}</Text>
          <Text style={styles.metricLabel}>Tamaño Total</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{analytics.averageBitrate}kbps</Text>
          <Text style={styles.metricLabel}>Bitrate Promedio</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{analytics.effectsApplied}</Text>
          <Text style={styles.metricLabel}>Efectos Aplicados</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{(analytics.peakVolume * 100).toFixed(0)}%</Text>
          <Text style={styles.metricLabel}>Volumen Pico</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{(analytics.loudness * 100).toFixed(0)}%</Text>
          <Text style={styles.metricLabel}>Loudness Promedio</Text>
        </View>
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
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metric: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  metricValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});