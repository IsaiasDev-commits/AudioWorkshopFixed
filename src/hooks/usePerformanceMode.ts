import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

interface PerformanceMetrics {
  memoryUsage: number;
  frameRate: number;
  activeTracks: number;
  effectsCount: number;
  isOptimal: boolean;
}

export const usePerformanceMode = (tracks: any[], isPlaying: boolean) => {
  const [performanceMode, setPerformanceMode] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    frameRate: 60,
    activeTracks: 0,
    effectsCount: 0,
    isOptimal: true
  });

  // Monitorear métricas de performance
  useEffect(() => {
    const activeTracks = tracks.filter(track => !track.isMuted).length;
    const effectsCount = tracks.reduce((sum, track) => sum + track.effects.length, 0);
    
    // Simular métricas (en app real usarías APIs específicas)
    const newMetrics: PerformanceMetrics = {
      memoryUsage: Math.min(100, (tracks.length * 5) + (effectsCount * 2)),
      frameRate: performanceMode ? 60 : Math.max(30, 60 - (effectsCount * 2)),
      activeTracks,
      effectsCount,
      isOptimal: activeTracks <= 8 && effectsCount <= 10
    };

    setMetrics(newMetrics);

    // Alertar si el performance es pobre
    if (!newMetrics.isOptimal && !performanceMode) {
      if (activeTracks > 8) {
        Alert.alert(
          'Alerta de Performance',
          `Tienes ${activeTracks} pistas activas. Considera activar el modo performance.`,
          [{ text: 'Activar Modo Performance', onPress: () => setPerformanceMode(true) }]
        );
      }
    }
  }, [tracks, performanceMode]);

  const getPerformanceRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    
    if (metrics.activeTracks > 6) {
      recommendations.push('🔇 Mutea pistas no esenciales');
    }
    
    if (metrics.effectsCount > 8) {
      recommendations.push('🎛️ Reduce efectos en pistas menos importantes');
    }
    
    if (metrics.memoryUsage > 70) {
      recommendations.push('💾 Cierra proyectos no utilizados');
    }
    
    if (!performanceMode && !metrics.isOptimal) {
      recommendations.push('⚡ Activa el modo performance');
    }

    return recommendations.length > 0 ? recommendations : ['✅ Performance óptimo'];
  }, [metrics, performanceMode]);

  const togglePerformanceMode = useCallback(() => {
    const newMode = !performanceMode;
    setPerformanceMode(newMode);
    
    if (newMode) {
      Alert.alert(
        'Modo Performance Activado',
        'Se han aplicado optimizaciones para mejor rendimiento.'
      );
    }
  }, [performanceMode]);

  return {
    performanceMode,
    metrics,
    recommendations: getPerformanceRecommendations(),
    togglePerformanceMode,
    shouldLimitRendering: performanceMode && !isPlaying
  };
};