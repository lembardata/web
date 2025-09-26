import { useCallback, useState } from "react";

interface DropzoneOptions {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
}

interface DropzoneState {
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
}

export function useDropzone(options: DropzoneOptions) {
  const { onDrop, accept, multiple = false, maxSize } = options;

  const [state, setState] = useState<DropzoneState>({
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false,
  });

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      if (accept) {
        const acceptedTypes = Object.keys(accept);
        const acceptedExtensions = Object.values(accept).flat();

        const isTypeAccepted = acceptedTypes.some((type) =>
          file.type.includes(type.split("/")[1]),
        );
        const isExtensionAccepted = acceptedExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext.toLowerCase()),
        );

        if (!isTypeAccepted && !isExtensionAccepted) {
          return false;
        }
      }

      // Check file size
      if (maxSize && file.size > maxSize) {
        return false;
      }

      return true;
    },
    [accept, maxSize],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setState((prev) => ({ ...prev, isDragActive: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set to false if we're leaving the dropzone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setState((prev) => ({
        ...prev,
        isDragActive: false,
        isDragAccept: false,
        isDragReject: false,
      }));
    }
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      const hasValidFiles = files.some(validateFile);

      setState((prev) => ({
        ...prev,
        isDragActive: true,
        isDragAccept: hasValidFiles,
        isDragReject: !hasValidFiles && files.length > 0,
      }));
    },
    [validateFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setState({
        isDragActive: false,
        isDragAccept: false,
        isDragReject: false,
      });

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(validateFile);

      if (validFiles.length > 0) {
        const filesToProcess = multiple ? validFiles : [validFiles[0]];
        onDrop(filesToProcess);
      }
    },
    [onDrop, multiple, validateFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter(validateFile);

      if (validFiles.length > 0) {
        const filesToProcess = multiple ? validFiles : [validFiles[0]];
        onDrop(filesToProcess);
      }

      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [onDrop, multiple, validateFile],
  );

  const getRootProps = useCallback(
    () => ({
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    }),
    [handleDragEnter, handleDragLeave, handleDragOver, handleDrop],
  );

  const getInputProps = useCallback(
    () => ({
      type: "file" as const,
      multiple,
      accept: accept ? Object.keys(accept).join(",") : undefined,
      onChange: handleInputChange,
      style: { display: "none" },
    }),
    [multiple, accept, handleInputChange],
  );

  return {
    ...state,
    getRootProps,
    getInputProps,
  };
}
