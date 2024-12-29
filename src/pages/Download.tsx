import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const DownloadPage = () => {
  const { fileId } = useParams();

  const { data: fileInfo, isLoading, error, refetch } = useQuery({
    queryKey: ['file', fileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('deleted', false)
        .single();

      if (error) throw error;
      
      // Check if file has expired or reached download limit
      if (data) {
        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        
        if (now > expiresAt) {
          throw new Error('This file has expired');
        }
        
        if (data.max_downloads !== -1 && data.downloads >= data.max_downloads) {
          throw new Error('Download limit reached');
        }
      }
      
      return data;
    },
  });

  const handleDownload = async () => {
    if (!fileInfo) return;

    try {
      // First increment the download count
      const { error: updateError } = await supabase
        .from('files')
        .update({ 
          downloads: (fileInfo.downloads || 0) + 1 
        })
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

      // Refetch the file info to get updated download count
      await refetch();

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
          <h1 className="text-2xl font-bold text-center text-red-600">File Not Available</h1>
          <p className="text-center text-gray-600">
            {error?.message || 'This file may have expired or reached its download limit.'}
          </p>
        </div>
      </div>
    );
  }

  const downloadsRemaining = fileInfo.max_downloads === -1 
    ? 'Unlimited' 
    : Math.max(0, fileInfo.max_downloads - (fileInfo.downloads || 0));

  const expiresAt = new Date(fileInfo.expires_at);
  const now = new Date();
  const minutesRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60)));
  
  // Format the time remaining in a human-readable way
  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Download File</h1>
        <div className="space-y-2">
          <p className="text-center text-gray-600 font-medium">{fileInfo.filename}</p>
          <p className="text-center text-sm text-gray-500">
            Size: {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-center text-sm text-gray-500">
            Downloads remaining: {downloadsRemaining}
          </p>
          <p className="text-center text-sm text-gray-500">
            Expires in: {formatTimeRemaining(minutesRemaining)}
          </p>
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