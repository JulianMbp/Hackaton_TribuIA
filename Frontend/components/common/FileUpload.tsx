'use client';

// ============================================
// FILE UPLOAD COMPONENT - DRAG & DROP
// ============================================

import React, { useRef } from 'react';
import { useFileUpload } from '@/lib/hooks/useFileUpload';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  acceptedTypes?: string[];
  maxSize?: number;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  acceptedTypes,
  maxSize,
  label = 'Subir archivo',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useFileUpload({
    acceptedTypes,
    maxSize,
    onUpload,
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-neutral-900 bg-neutral-50'
            : 'border-neutral-200 bg-white hover:border-neutral-800'
          }
          ${error ? 'border-red-500' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes?.join(',')}
          onChange={handleFileInput}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <>
              <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4" />
              <p className="text-neutral-800 font-medium">Subiendo archivo...</p>
              <div className="w-full max-w-xs mt-4 bg-neutral-100 rounded-full h-2">
                <div
                  className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-neutral-800 mt-2">{progress}%</p>
            </>
          ) : file ? (
            <>
              <svg
                className="w-12 h-12 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-neutral-900 font-medium">{file.name}</p>
              <p className="text-sm text-neutral-800 mt-1">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                className="mt-4 text-sm text-neutral-800 hover:text-neutral-900 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
              >
                Cambiar archivo
              </button>
            </>
          ) : (
            <>
              <svg
                className="w-12 h-12 text-neutral-200 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-neutral-900 font-medium mb-2">{label}</p>
              <p className="text-sm text-neutral-800">
                Arrastra y suelta tu archivo aquí, o haz clic para seleccionar
              </p>
              {acceptedTypes && (
                <p className="text-xs text-neutral-800 mt-2">
                  Formatos: PDF, JPG, PNG, TXT
                </p>
              )}
              {maxSize && (
                <p className="text-xs text-neutral-800">
                  Tamaño máximo: {maxSize}MB
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
