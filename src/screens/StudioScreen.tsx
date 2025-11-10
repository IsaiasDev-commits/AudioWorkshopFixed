import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Modal 
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AudioMixer } from '../components/AudioMixer';
import { EqualizerPanel } from '../components/EqualizerPanel';
import { AdvancedEffectsPanel } from '../components/AdvancedEffectsPanel';
import { WaveformAnalyzer } from '../components/WaveformAnalyzer';
import { AudioAnalytics } from '../components/AudioAnalytics';
import { PerformanceMonitor } from '../components/PerformanceMonitor';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { useAudioAnalytics } from '../hooks/useAudioAnalytics';
import { useProjectManager } from '../hooks/useProjectManager';
import { usePerformanceMode } from '../hooks/usePerformanceMode';
import { AudioEffect, EQParameters } from '../types/audio';

export const StudioScreen: React.FC = () => {
  // Hooks principales
  const {
    mixerState,
    loadTrack,
    playAll,
    pauseAll,
    setTrackVolume,
    toggleMuteTrack,
    applyEffectToTrack,
    removeTrack
  } = useAudioEngine();

  const analytics = useAudioAnalytics(mixerState.tracks);
  const {
    currentProject,
    projects,
    isSaving,
    createProject,
    saveProject,
    exportProject
  } = useProjectManager();
  
  const {
    performanceMode,
    metrics,
    recommendations,
    togglePerformanceMode
  } = usePerformanceMode(mixerState.tracks, mixerState.isPlaying);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [showEQ, setShowEQ] = useState(false);
  const [showAdvancedEffects, setShowAdvancedEffects] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  // Crear proyecto automáticamente al iniciar
  useEffect(() => {
    if (!currentProject && mixerState.tracks.length === 0) {
      createProject('Nuevo Proyecto');
    }
  }, []);

  // Auto-guardar cuando cambian las pistas
  useEffect(() => {
    if (currentProject && mixerState.tracks.length > 0) {
      const updatedProject = {
        ...currentProject,
        tracks: mixerState.tracks,
        lastSaved: new Date()
      };
      saveProject(updatedProject);
    }
  }, [mixerState.tracks]);

  const handleAddTrack = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: true
      });

      if (result.assets) {
        let loadedCount = 0;
        for (const asset of result.assets) {
          try {
            await loadTrack(asset.uri, asset.name);
            loadedCount++;
          } catch (error) {
            console.error(`Error loading ${asset.name}:`, error);
          }
        }
        
        if (loadedCount > 0) {
          Alert.alert('Éxito', `${loadedCount} pista${loadedCount !== 1 ? 's' : ''} añadida${loadedCount !== 1 ? 's' : ''}`);
        } else {
          Alert.alert('Error', 'No se pudo cargar ningún archivo');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar los archivos de audio');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (mixerState.isPlaying) {
      pauseAll();
    } else {
      playAll();
    }
  };

  const handleApplyEffect = (trackId: string, effect: any) => {
    if (effect.type === 'equalizer') {
      setSelectedTrack(trackId);
      setShowEQ(true);
    } else {
      applyEffectToTrack(trackId, effect);
    }
  };

  const handleAdvancedEffect = (effect: AudioEffect) => {
    if (selectedTrack) {
      applyEffectToTrack(selectedTrack, effect);
      Alert.alert('Éxito', `Efecto ${effect.type} aplicado`);
    }
  };

  const handleEQChange = (eqParams: EQParameters) => {
    if (selectedTrack) {
      const effect: AudioEffect = {
        id: `eq_${Date.now()}`,
        type: 'equalizer',
        parameters: eqParams
      };
      applyEffectToTrack(selectedTrack, effect);
    }
  };

  const handleCloseEQ = () => {
    setShowEQ(false);
    setSelectedTrack(null);
  };

  const handleExportProject = async () => {
    if (currentProject) {
      await exportProject(currentProject);
    } else {
      Alert.alert('Info', 'No hay proyecto activo para exportar');
    }
  };

  const handleNewProject = () => {
    createProject(`Proyecto ${projects.length + 1}`);
    Alert.alert('Nuevo Proyecto', 'Proyecto creado exitosamente');
  };

  const openAdvancedEffects = (trackId: string) => {
    setSelectedTrack(trackId);
    setShowAdvancedEffects(true);
  };

  return (
    <View style={styles.container}>
      {/* Header Profesional */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>🎚️ STUDIO PRO</Text>
          {currentProject && (
            <Text style={styles.projectName}>
              {currentProject.name} {isSaving && '💾'}
            </Text>
          )}
        </View>
        
        <View style={styles.headerControls}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowPerformance(!showPerformance)}
          >
            <Text style={styles.headerButtonText}>⚡</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowAnalytics(!showAnalytics)}
          >
            <Text style={styles.headerButtonText}>📊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleExportProject}>
            <Text style={styles.headerButtonText}>📤</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleNewProject}>
            <Text style={styles.headerButtonText}>🆕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Performance Monitor */}
        {showPerformance && (
          <PerformanceMonitor
            metrics={metrics}
            performanceMode={performanceMode}
            recommendations={recommendations}
            onTogglePerformance={togglePerformanceMode}
          />
        )}

        {/* Analytics */}
        {showAnalytics && <AudioAnalytics analytics={analytics} />}

        {/* Waveform Analyzer */}
        <WaveformAnalyzer 
          isPlaying={mixerState.isPlaying} 
          tracks={mixerState.tracks} 
        />

        {/* Audio Mixer */}
        <AudioMixer
          tracks={mixerState.tracks}
          onTrackVolumeChange={setTrackVolume}
          onToggleMute={toggleMuteTrack}
          onApplyEffect={handleApplyEffect}
          onRemoveTrack={removeTrack}
          onAdvancedEffects={openAdvancedEffects}
        />

        {/* Estado vacío */}
        {mixerState.tracks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>🚀 Bienvenido a Audio Workshop Pro</Text>
            <Text style={styles.emptyText}>
              Características profesionales:{'\n'}
              • Mezclador multipista avanzado{'\n'}
              • Efectos en tiempo real (EQ, Reverb, Delay){'\n'}
              • Sistema de proyectos con auto-guardado{'\n'}
              • Monitor de performance y analytics{'\n'}
              • Exportación de proyectos
            </Text>
            <TouchableOpacity style={styles.getStartedButton} onPress={handleAddTrack}>
              <Text style={styles.getStartedText}>🎵 Comenzar a Mezclar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats rápidas */}
        {mixerState.tracks.length > 0 && (
          <View style={styles.quickStats}>
            <Text style={styles.quickStatsText}>
              🎵 {mixerState.tracks.length} pistas • 
              ⚡ {metrics.activeTracks} activas • 
              🎛️ {analytics.effectsApplied} efectos
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Controls Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerButton, styles.effectsButton]}
          onPress={() => {
            if (mixerState.tracks.length > 0) {
              setSelectedTrack(mixerState.tracks[0].id);
              setShowAdvancedEffects(true);
            } else {
              Alert.alert('Info', 'Añade pistas primero para usar efectos');
            }
          }}
          disabled={mixerState.tracks.length === 0}
        >
          <Text style={styles.footerButtonText}>🎛️ Efectos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerButton, styles.addButton]}
          onPress={handleAddTrack}
          disabled={isLoading}
        >
          <Text style={styles.footerButtonText}>
            {isLoading ? '📥 Cargando...' : '🎵 Añadir Pistas'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.footerButton, styles.playButton, 
                 mixerState.isPlaying && styles.pauseButton]}
          onPress={handlePlayPause}
          disabled={mixerState.tracks.length === 0}
        >
          <Text style={styles.footerButtonText}>
            {mixerState.isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <EqualizerPanel
        visible={showEQ}
        onEQChange={handleEQChange}
        onClose={handleCloseEQ}
      />

      <AdvancedEffectsPanel
        visible={showAdvancedEffects}
        onEffectApply={handleAdvancedEffect}
        onClose={() => setShowAdvancedEffects(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a'
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  projectName: {
    color: '#888',
    fontSize: 12,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8
  },
  headerButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    margin: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 12
  },
  emptyTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#00cc66',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  getStartedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quickStats: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickStatsText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#2a2a2a'
  },
  footerButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  effectsButton: {
    backgroundColor: '#8a2be2', // Purple
    flex: 0.8,
  },
  addButton: {
    backgroundColor: '#00cc66'
  },
  playButton: {
    backgroundColor: '#0066cc'
  },
  pauseButton: {
    backgroundColor: '#cc3300'
  },
  footerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  }
});