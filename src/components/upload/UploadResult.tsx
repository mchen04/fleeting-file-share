import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface UploadResultProps {
  shareableLink: string;
  expiryTime: string;
  downloadLimit: string;
  onReset: () => void;
}

const UploadResult: React.FC<UploadResultProps> = ({
  shareableLink,
  expiryTime,
  downloadLimit,
  onReset,
}) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const formatExpiryTime = (time: string) => {
    if (time.endsWith('d')) return `${time.slice(0, -1)} days`;
    return `${time.slice(0, -1)} hours`;
  };

  return (
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
        <p>Expires in: {formatExpiryTime(expiryTime)}</p>
        <p>Downloads remaining: {downloadLimit === 'unlimited' ? 'Unlimited' : downloadLimit}</p>
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={onReset}
        >
          Upload Another File
        </Button>
      </div>
    </div>
  );
};

export default UploadResult;