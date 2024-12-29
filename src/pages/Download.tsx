import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const DownloadPage = () => {
  const { fileId } = useParams();

  const { data: fileInfo, isLoading, error } = useQuery({
    queryKey: ['file', fileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async () => {
    if (!fileInfo) return;

    try {
      // First update the download count
      const { error: updateError } = await supabase
        .from('files')
        .update({ downloads: (fileInfo.downloads || 0) + 1 })
        .eq('id', fileId);

      if (updateError) {
        console.error('Failed to update download count:', updateError);
        toast.error('Failed to process download. Please try again.');
        return;
      }

      // Then attempt to download the file
      const { data, error: downloadError } = await supabase.storage
        .from('files')
        .download(fileInfo.file_path);

      if (downloadError) {
        console.error('Download error:', downloadError);
        toast.error('Failed to download file. Please try again.');
        return;
      }

      // Create and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInfo.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !fileInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg space-y-4">
          <h1 className="text-2xl font-bold text-center text-red-600">File Not Found</h1>
          <p className="text-center text-gray-600">
            This file may have expired or reached its download limit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Download File</h1>
        <div className="space-y-2">
          <p className="text-center text-gray-600 font-medium">{fileInfo.filename}</p>
          <p className="text-center text-sm text-gray-500">
            Size: {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          {fileInfo.max_downloads !== -1 && (
            <p className="text-center text-sm text-gray-500">
              Downloads remaining: {fileInfo.max_downloads - (fileInfo.downloads || 0)}
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <Button onClick={handleDownload} className="space-x-2">
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;