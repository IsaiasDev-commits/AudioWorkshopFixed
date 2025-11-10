import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { AudioEffect } from '../types/audio';

interface AdvancedEffectsPanelProps {
  visible: boolean;
  onEffectApply: (effect: AudioEffect) => void;
  onClose: () => void;
}

export const AdvancedEffectsPanel: React.FC<AdvancedEffectsPanelProps> = ({
  visible,
  onEffectApply,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'reverb' | 'delay' | 'compressor'>('reverb');

  // REVERB: Parámetros con valores realistas
  const [reverbParams, setReverbParams] = useState({
    decay: 2.0,
    wetLevel: 0.3,
    dryLevel: 0.7,
    preDelay: 20
  });

  // DELAY: Parámetros básicos de eco
  const [delayParams, setDelayParams] = useState({
    delayTime: 400,
    feedback: 0.5,
    wetLevel: 0.3,
    cutoff: 5000
  });

  // COMPRESOR: Control dinámico del rango
  const [compressorParams, setCompressorParams] = useState({
    threshold: -20,
    ratio: 4.0,
    attack: 3,
    release: 250,
    gain: 2
  });

  // 
  const defaultEQParams = {
    lowGain: 0,
    midGain: 0,
    highGain: 0
  };

  // Función que evita error TS2322
  const handleApplyEffect = () => {
    let effect: AudioEffect;

    switch (activeTab) {
      case 'reverb':
        effect = {
          id: `reverb_${Date.now()}`,
          type: 'reverb',
          parameters: reverbParams
        };
        break;

      case 'delay':
        effect = {
          id: `delay_${Date.now()}`,
          type: 'delay',
          parameters: delayParams
        };
        break;

      case 'compressor':
        effect = {
          id: `compressor_${Date.now()}`,
          type: 'compressor',
          parameters: compressorParams
        };
        break;

      default:
        // ✅ EQ por defecto en caso de tab desconocido
        effect = {
          id: `equalizer_${Date.now()}`,
          type: 'equalizer',
          parameters: defaultEQParams
        };
    }

    onEffectApply(effect);
    onClose();
  };

  // Formateo profesional de valores
  const formatValue = (value: number, unit: string): string => {
    switch (unit) {
      case 's':
        return `${value.toFixed(1)}s`;
      case 'ms':
        return `${value}ms`;
      case 'dB':
        return `${value}dB`;
      case ':1':
        return `${value.toFixed(1)}:1`;
      case 'Hz':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}kHz` : `${value}Hz`;
      case '%':
        return `${Math.round(value * 100)}%`;
      default:
        return value.toFixed(1);
    }
  };

  // Componente de control deslizante
  const ParamSlider: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    onChange: (value: number) => void;
  }> = ({ label, value, min, max, step, unit, onChange }) => (
    <View style={styles.paramRow}>
      <Text style={styles.paramLabel}>{label}</Text>
      <View style={styles.paramControls}>
        <TouchableOpacity
          style={styles.paramButton}
          onPress={() => onChange(Math.max(min, Number((value - step).toFixed(2))))}
        >
          <Text style={styles.paramButtonText}>−</Text>
        </TouchableOpacity>

        <View style={styles.paramValue}>
          <Text style={styles.paramValueText}>{formatValue(value, unit)}</Text>
        </View>

        <TouchableOpacity
          style={styles.paramButton}
          onPress={() => onChange(Math.min(max, Number((value + step).toFixed(2))))}
        >
          <Text style={styles.paramButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎛️ EFECTOS AVANZADOS</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reverb' && styles.activeTab]}
            onPress={() => setActiveTab('reverb')}
          >
            <Text style={[styles.tabText, activeTab === 'reverb' && styles.activeTabText]}>
              🏛️ Reverb
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'delay' && styles.activeTab]}
            onPress={() => setActiveTab('delay')}
          >
            <Text style={[styles.tabText, activeTab === 'delay' && styles.activeTabText]}>
              ⏰ Delay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'compressor' && styles.activeTab]}
            onPress={() => setActiveTab('compressor')}
          >
            <Text style={[styles.tabText, activeTab === 'compressor' && styles.activeTabText]}>
              📊 Compressor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido dinámico */}
        <ScrollView style={styles.content}>
          {activeTab === 'reverb' && (
            <View style={styles.effectPanel}>
              <Text style={styles.effectDescription}>Simula espacios acústicos naturales</Text>
              <ParamSlider
                label="Decay Time"
                value={reverbParams.decay}
                min={0.1}
                max={10.0}
                step={0.1}
                unit="s"
                onChange={(value) => setReverbParams((prev) => ({ ...prev, decay: value }))}
              />
              <ParamSlider
                label="Wet Mix"
                value={reverbParams.wetLevel}
                min={0}
                max={1.0}
                step={0.05}
                unit="%"
                onChange={(value) => setReverbParams((prev) => ({ ...prev, wetLevel: value }))}
              />
              <ParamSlider
                label="Dry Mix"
                value={reverbParams.dryLevel}
                min={0}
                max={1.0}
                step={0.05}
                unit="%"
                onChange={(value) => setReverbParams((prev) => ({ ...prev, dryLevel: value }))}
              />
              <ParamSlider
                label="Pre Delay"
                value={reverbParams.preDelay}
                min={0}
                max={100}
                step={1}
                unit="ms"
                onChange={(value) => setReverbParams((prev) => ({ ...prev, preDelay: value }))}
              />
            </View>
          )}

          {activeTab === 'delay' && (
            <View style={styles.effectPanel}>
              <Text style={styles.effectDescription}>Crea ecos y patrones rítmicos</Text>
              <ParamSlider
                label="Delay Time"
                value={delayParams.delayTime}
                min={0}
                max={2000}
                step={10}
                unit="ms"
                onChange={(value) => setDelayParams((prev) => ({ ...prev, delayTime: value }))}
              />
              <ParamSlider
                label="Feedback"
                value={delayParams.feedback}
                min={0}
                max={0.9}
                step={0.05}
                unit="%"
                onChange={(value) => setDelayParams((prev) => ({ ...prev, feedback: value }))}
              />
              <ParamSlider
                label="Wet Mix"
                value={delayParams.wetLevel}
                min={0}
                max={1.0}
                step={0.05}
                unit="%"
                onChange={(value) => setDelayParams((prev) => ({ ...prev, wetLevel: value }))}
              />
              <ParamSlider
                label="Cutoff"
                value={delayParams.cutoff}
                min={100}
                max={20000}
                step={100}
                unit="Hz"
                onChange={(value) => setDelayParams((prev) => ({ ...prev, cutoff: value }))}
              />
            </View>
          )}

          {activeTab === 'compressor' && (
            <View style={styles.effectPanel}>
              <Text style={styles.effectDescription}>Controla el rango dinámico del audio</Text>
              <ParamSlider
                label="Threshold"
                value={compressorParams.threshold}
                min={-60}
                max={0}
                step={1}
                unit="dB"
                onChange={(value) => setCompressorParams((prev) => ({ ...prev, threshold: value }))}
              />
              <ParamSlider
                label="Ratio"
                value={compressorParams.ratio}
                min={1.0}
                max={20.0}
                step={0.1}
                unit=":1"
                onChange={(value) => setCompressorParams((prev) => ({ ...prev, ratio: value }))}
              />
              <ParamSlider
                label="Attack"
                value={compressorParams.attack}
                min={1}
                max={100}
                step={1}
                unit="ms"
                onChange={(value) => setCompressorParams((prev) => ({ ...prev, attack: value }))}
              />
              <ParamSlider
                label="Release"
                value={compressorParams.release}
                min={10}
                max={1000}
                step={10}
                unit="ms"
                onChange={(value) => setCompressorParams((prev) => ({ ...prev, release: value }))}
              />
              <ParamSlider
                label="Makeup Gain"
                value={compressorParams.gain}
                min={0}
                max={20}
                step={1}
                unit="dB"
                onChange={(value) => setCompressorParams((prev) => ({ ...prev, gain: value }))}
              />
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyEffect}>
            <Text style={styles.applyButtonText}>🎵 Aplicar Efecto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 🎨 Estilos visuales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 6,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88',
  },
  tabText: {
    color: '#888',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#00ff88',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  effectPanel: {
    gap: 20,
  },
  effectDescription: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  paramRow: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
  },
  paramLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  paramControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paramButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  paramButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paramValue: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  paramValueText: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButton: {
    flex: 2,
    padding: 15,
    backgroundColor: '#00cc66',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
