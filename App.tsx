import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StudioScreen } from './src/screens/StudioScreen';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <StudioScreen />
    </>
  );
}