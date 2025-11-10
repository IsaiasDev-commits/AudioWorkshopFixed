import { useState, useEffect, useCallback } from 'react';
import { AudioProject, AudioTrack } from '../types/audio';
import { Platform, Alert } from 'react-native';

export const useProjectManager = () => {
  const [currentProject, setCurrentProject] = useState<AudioProject | null>(null);
  const [projects, setProjects] = useState<AudioProject[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar proyectos al iniciar
  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        // CORREGIDO: Tipo explícito para savedProjects
        const savedProjects: AudioProject[] = []; // Vacío por ahora
        setProjects(savedProjects);
        
        // Crear proyecto inicial si no hay proyectos
        if (savedProjects.length === 0) {
          createProject('Mi Primer Proyecto');
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadFromStorage();
  }, []);

  const createProject = useCallback((name: string, tracks: AudioTrack[] = []) => {
    const newProject: AudioProject = {
      id: `project_${Date.now()}`,
      name,
      createdAt: new Date(),
      lastSaved: new Date(),
      tracks,
      bpm: 120,
      userId: 'user_1',
      settings: {
        masterVolume: 1.0,
        metronome: false,
        autoSave: true,
        performanceMode: false
      }
    };

    setCurrentProject(newProject);
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, []);

  const saveProject = async (project: AudioProject) => {
    try {
      setIsSaving(true);
      const projectToSave: AudioProject = {
        ...project,
        lastSaved: new Date()
      };

      setCurrentProject(projectToSave);
      
      // Actualizar en la lista de proyectos
      setProjects(prev => {
        const filtered = prev.filter(p => p.id !== project.id);
        return [projectToSave, ...filtered];
      });

      console.log('Project saved:', project.name);
      
      // Simular guardado exitoso
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error saving project:', error);
      Alert.alert('Error', 'No se pudo guardar el proyecto');
    } finally {
      setIsSaving(false);
    }
  };

  const loadProject = async (projectId: string): Promise<AudioProject | null> => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setCurrentProject(project);
        return project;
      } else {
        Alert.alert('Error', 'Proyecto no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error loading project:', error);
      Alert.alert('Error', 'No se pudo cargar el proyecto');
      return null;
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      
      Alert.alert('Éxito', 'Proyecto eliminado');
    } catch (error) {
      console.error('Error deleting project:', error);
      Alert.alert('Error', 'No se pudo eliminar el proyecto');
    }
  };

  const exportProject = async (project: AudioProject): Promise<string | null> => {
    try {
      const exportData = {
        ...project,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        platform: Platform.OS
      };

      // Simular exportación
      const exportJson = JSON.stringify(exportData, null, 2);
      
      Alert.alert(
        '✅ Proyecto Listo para Exportar', 
        `"${project.name}"\n\nContenido preparado para descarga.`
      );
      
      // En una app real, aquí iría la lógica de FileSystem
      console.log('Project ready for export:', exportJson);
      
      return exportJson;
    } catch (error) {
      console.error('Error exporting project:', error);
      Alert.alert('Error', 'No se pudo exportar el proyecto');
      return null;
    }
  };

  const updateProjectSettings = (settings: Partial<AudioProject['settings']>): void => {
    if (currentProject) {
      const updatedProject: AudioProject = {
        ...currentProject,
        settings: { ...currentProject.settings, ...settings }
      };
      setCurrentProject(updatedProject);
      saveProject(updatedProject);
    }
  };

  const loadProjects = async (): Promise<void> => {
    // Simular recarga de proyectos
    console.log('Projects reloaded');
  };

  return {
    currentProject,
    projects,
    isSaving,
    createProject,
    saveProject,
    loadProject,
    deleteProject,
    exportProject,
    updateProjectSettings,
    loadProjects
  };
};