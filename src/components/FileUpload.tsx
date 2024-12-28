import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { Card } from './ui/card';
import UploadSettings from './upload/UploadSettings';
import UploadResult from './upload/UploadResult';
import { uploadFile } from './upload/uploadUtils';

interface FileUploadProps {
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ maxSize = 10 * 1024 * 1024 }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [expiryTime, setExpiryTime] = useState('24h');
  const [downloadLimit, setDownloadLimit] = useState('5');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > maxSize) {
        toast.error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        return;
      }
      setFile(selectedFile);
    }
  }, [maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    setShareableLink('');
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadFile(
        file,
        expiryTime,
        downloadLimit,
        setUploadProgress,
        setIsUploading,
        setUploadComplete,
        setShareableLink
      );
    } catch (error) {
      toast.error('Failed to upload file. Please try again.');
      resetUpload();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 glass-card slide-up">
      {!file && (
        <div
          {...getRootProps()}
          className={`upload-zone ${isDragActive ? 'dragging' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-sm text-gray-500">
              or click to select a file (max {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        </div>
      )}

      {file && (
        <div className="space-y-6 fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetUpload}
              className="hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-center text-gray-500">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {!isUploading && !uploadComplete && (
            <div className="space-y-4">
              <UploadSettings
                expiryTime={expiryTime}
                setExpiryTime={setExpiryTime}
                downloadLimit={downloadLimit}
                setDownloadLimit={setDownloadLimit}
              />
              <Button
                className="w-full"
                onClick={handleUpload}
              >
                Generate Shareable Link
              </Button>
            </div>
          )}

          {uploadComplete && shareableLink && (
            <UploadResult
              shareableLink={shareableLink}
              expiryTime={expiryTime}
              downloadLimit={downloadLimit}
              onReset={resetUpload}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default FileUpload;