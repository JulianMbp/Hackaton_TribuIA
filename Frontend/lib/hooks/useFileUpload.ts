'use client';

// ============================================
// HOOK: useFileUpload - FILE UPLOAD WITH DRAG & DROP
// ============================================

import { useState, useCallback } from 'react';

interface UseFileUploadOptions {
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onUpload?: (file: File) => Promise<void>;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxSize = 10,
    acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'],
    onUpload,
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        return `Tipo de archivo no permitido. Acepta: ${acceptedTypes.join(', ')}`;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        return `El archivo es demasiado grande. Máximo: ${maxSize}MB`;
      }

      return null;
    },
    [acceptedTypes, maxSize]
  );

  const handleFile = useCallback(
    async (selectedFile: File) => {
      setError(null);
      const validationError = validateFile(selectedFile);

      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(selectedFile);

      if (onUpload) {
        setIsUploading(true);
        setProgress(0);

        try {
          // Simulate progress for better UX
          const progressInterval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 100);

          await onUpload(selectedFile);

          clearInterval(progressInterval);
          setProgress(100);
        } catch (error: any) {
          setError(error.message || 'Error al subir el archivo');
        } finally {
          setIsUploading(false);
        }
      }
    },
    [validateFile, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile]
  );

  const reset = useCallback(() => {
    setFile(null);
    setError(null);
    setProgress(0);
    setIsUploading(false);
  }, []);

  return {
    file,
    isDragging,
    isUploading,
    error,
    progress,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    reset,
  };
};
