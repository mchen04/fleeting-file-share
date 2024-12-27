import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const DownloadPage = () => {
  const { fileId } = useParams();

  const handleDownload = () => {
    // In a real implementation, this would fetch and download the actual file
    toast.success('Download started!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Download File</h1>
        <p className="text-center text-gray-600">File ID: {fileId}</p>
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