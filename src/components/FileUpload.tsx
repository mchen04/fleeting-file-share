import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, Copy, Link } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

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
      simulateUpload(selectedFile);
    }
  }, [maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          setShareableLink(`https://share.temp/${Math.random().toString(36).substring(7)}`);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    setShareableLink('');
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expires after</label>
                  <Select
                    value={expiryTime}
                    onValueChange={setExpiryTime}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiry time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="48h">48 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Download limit</label>
                  <Select
                    value={downloadLimit}
                    onValueChange={setDownloadLimit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select download limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 download</SelectItem>
                      <SelectItem value="5">5 downloads</SelectItem>
                      <SelectItem value="10">10 downloads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => simulateUpload(file)}
              >
                Generate Shareable Link
              </Button>
            </div>
          )}

          {uploadComplete && shareableLink && (
            <div className="space-y-4 slide-up">
              <div className="flex items-center space-x-2 p-3 bg-secondary rounded-lg">
                <Link className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm flex-1 truncate">{shareableLink}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <p>Expires in: {expiryTime}</p>
                <p>Downloads remaining: {downloadLimit}</p>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={resetUpload}
                >
                  Upload Another File
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default FileUpload;