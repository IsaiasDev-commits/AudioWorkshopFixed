import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { EQParameters } from '../types/audio';

interface EqualizerPanelProps {
  visible: boolean;
  onEQChange: (eqParams: EQParameters) => void;
  onClose: () => void;
  initialParams?: EQParameters;
}

export const EqualizerPanel: React.FC<EqualizerPanelProps> = ({
  visible,
  onEQChange,
  onClose,
  initialParams = { lowGain: 0, midGain: 0, highGain: 0 }
}) => {
  const [eqParams, setEqParams] = useState<EQParameters>(initialParams);

  const updateGain = (band: keyof EQParameters, value: number) => {
    const newParams = {
      ...eqParams,
      [band]: Math.max(-12, Math.min(12, value))
    };
    setEqParams(newParams);
    onEQChange(newParams);
  };

  const BandControl: React.FC<{ label: string; band: keyof EQParameters; value: number }> = ({
    label,
    band,
    value
  }) => (
    <View style={styles.bandContainer}>
      <Text style={styles.bandLabel}>{label}</Text>
      <View style={styles.sliderContainer}>
        <TouchableOpacity 
          style={styles.sliderButton}
          onPress={() => updateGain(band, value - 1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{value}dB</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.sliderButton}
          onPress={() => updateGain(band, value + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
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
          <Text style={styles.title}>🎛️ Equalizador</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
        
        <BandControl label="Bajos" band="lowGain" value={eqParams.lowGain} />
        <BandControl label="Medios" band="midGain" value={eqParams.midGain} />
        <BandControl label="Agudos" band="highGain" value={eqParams.highGain} />
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => {
              const resetParams = { lowGain: 0, midGain: 0, highGain: 0 };
              setEqParams(resetParams);
              onEQChange(resetParams);
            }}
          >
            <Text style={styles.resetText}>🔄 Reiniciar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={onClose}
          >
            <Text style={styles.applyText}>✅ Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#666',
    borderRadius: 8
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold'
  },
  bandContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10
  },
  bandLabel: {
    color: 'white',
    fontSize: 18,
    width: 80,
    fontWeight: '600'
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  sliderButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    minWidth: 45,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  valueDisplay: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center'
  },
  valueText: {
    color: '#00ff88',
    fontWeight: 'bold',
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 10
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});