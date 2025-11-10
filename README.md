 AudioWorkshopFixed
 AudioWorkshopFixed es un estudio de mezcla digital desarrollado con React Native + Expo, diseñado para ofrecer una experiencia de producción musical completa desde dispositivos móviles o de escritorio.  
Permite crear, editar y mezclar proyectos de audio con múltiples pistas, aplicar efectos en tiempo real y exportar tus sesiones con facilidad.
Características Principales

Mezclador Multipista
- Agrega, elimina o silencia pistas de audio.
- Control de volumen y paneo individual.
- Soporte para múltiples formatos de audio.
- Interfaz responsiva y optimizada.

 Efectos Avanzados
- Ecualizador paramétrico (EQ).
- Reverb, Delay y Compresor configurables.
- Panel de efectos avanzado con vista interactiva.
- Aplicación inmediata de efectos sobre la pista seleccionada.

Sistema de Proyectos
- Crea nuevos proyectos con un solo clic.
- Guardado automático cuando se modifican las pistas.
- Carga, exportación y eliminación de proyectos.
- Modal de administración 📁 para gestionar fácilmente tus sesiones.

Monitor de Rendimiento
- Mide uso de memoria, cantidad de efectos y pistas activas.
- Alertas automáticas si el rendimiento baja.
- Recomendaciones inteligentes para optimizar.

Análisis de Audio
- Estadísticas automáticas: duración total, tamaño, picos de volumen, efectos aplicados.
- Visualizador de forma de onda (Waveform Analyzer) y monitor dinámico.
  Arquitectura del Proyecto

| Archivo | Descripción |
|----------|--------------|
| `App.tsx` | Punto de entrada principal. |
| `StudioScreen.tsx` | Pantalla principal de mezcla y paneles. |
| `useAudioEngine.ts` | Hook principal para manejar el motor de audio y las pistas. |
| `useAudioAnalytics.ts` | Hook para obtener métricas y estadísticas de las pistas. |
| `usePerformanceMode.ts` | Hook para optimizar el rendimiento del sistema. |
| `useProjectManager.ts` | Hook para crear, guardar, exportar y eliminar proyectos. |
| `audio.ts` | Tipos y modelos de datos (pistas, efectos, proyectos). |
| `components/` | Contiene los paneles visuales: mezclador, efectos, análisis, rendimiento, etc. |

Tecnologías Utilizadas

- React Native (Expo SDK)
- TypeScript
- Expo Document Picker
- Expo AV(para audio)
- React Hooks personalizados
- React Native Modal y ScrollView
- Alert API

  Instalación y Ejecución
  Clona el repositorio
  Instala las dependencias
  npm install

  Inicia el proyecto
  npm start
  Lo podrias abrir tanto como en web oh en Expo con el qr
  <img width="525" height="384" alt="image" src="https://github.com/user-attachments/assets/74564d00-b09a-4858-ad45-79262c674c73" />
  <img width="1365" height="601" alt="image" src="https://github.com/user-attachments/assets/462e9c5a-c107-4675-92ab-d76ea483ac29" />
  <img width="1365" height="535" alt="image" src="https://github.com/user-attachments/assets/3cacd9af-9780-42c2-ba39-e75c425a81e8" />
  <img width="1364" height="498" alt="image" src="https://github.com/user-attachments/assets/54343663-60bb-410a-b41f-de8322613353" />



