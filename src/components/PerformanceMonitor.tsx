import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PerformanceMonitorProps {
  metrics: {
    memoryUsage: number;
    frameRate: number;
    activeTracks: number;
    effectsCount: number;
    isOptimal: boolean;
  };
  performanceMode: boolean;
  recommendations: string[];
  onTogglePerformance: () => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  metrics,
  performanceMode,
  recommendations,
  onTogglePerformance
}) => {
  const getStatusColor = () => {
    if (metrics.isOptimal) return '#00cc66';
    if (metrics.memoryUsage > 80) return '#ff4444';
    return '#ffaa00';
  };

  const getStatusText = () => {
    if (metrics.isOptimal) return 'ÓPTIMO';
    if (metrics.memoryUsage > 80) return 'CRÍTICO';
    return 'ALERTA';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 MONITOR DE PERFORMANCE</Text>
        <TouchableOpacity 
          style={[
            styles.performanceButton,
            performanceMode && styles.performanceButtonActive
          ]}
          onPress={onTogglePerformance}
        >
          <Text style={styles.performanceButtonText}>
            {performanceMode ? '⚡ ACTIVO' : '⚙️ NORMAL'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{metrics.memoryUsage}%</Text>
          <Text style={styles.metricLabel}>MEMORIA</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{metrics.frameRate}FPS</Text>
          <Text style={styles.metricLabel}>FRAMERATE</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{metrics.activeTracks}</Text>
          <Text style={styles.metricLabel}>PISTAS ACTIVAS</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{metrics.effectsCount}</Text>
          <Text style={styles.metricLabel}>EFECTOS</Text>
        </View>
      </View>

      <View style={styles.status}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>ESTADO: {getStatusText()}</Text>
      </View>

      <View style={styles.recommendations}>
        <Text style={styles.recommendationsTitle}>💡 Recomendaciones:</Text>
        {recommendations.map((rec, index) => (
          <Text key={index} style={styles.recommendation}>
            • {rec}
          </Text>
        ))}
      </View>

      {performanceMode && (
        <View style={styles.performanceNotice}>
          <Text style={styles.performanceNoticeText}>
            ⚡ Modo Performance: Optimizaciones activadas para mejor rendimiento
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    margin: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0066ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  performanceButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  performanceButtonActive: {
    backgroundColor: '#00cc66',
  },
  performanceButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendations: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 6,
  },
  recommendationsTitle: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  recommendation: {
    color: '#888',
    fontSize: 11,
    lineHeight: 16,
  },
  performanceNotice: {
    backgroundColor: '#004400',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  performanceNoticeText: {
    color: '#00ff88',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
});