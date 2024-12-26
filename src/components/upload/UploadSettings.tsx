import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UploadSettingsProps {
  expiryTime: string;
  setExpiryTime: (value: string) => void;
  downloadLimit: string;
  setDownloadLimit: (value: string) => void;
}

const UploadSettings: React.FC<UploadSettingsProps> = ({
  expiryTime,
  setExpiryTime,
  downloadLimit,
  setDownloadLimit,
}) => {
  return (
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
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="6h">6 hours</SelectItem>
              <SelectItem value="12h">12 hours</SelectItem>
              <SelectItem value="24h">24 hours</SelectItem>
              <SelectItem value="48h">48 hours</SelectItem>
              <SelectItem value="72h">72 hours</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="14d">14 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
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
              <SelectItem value="2">2 downloads</SelectItem>
              <SelectItem value="3">3 downloads</SelectItem>
              <SelectItem value="5">5 downloads</SelectItem>
              <SelectItem value="10">10 downloads</SelectItem>
              <SelectItem value="25">25 downloads</SelectItem>
              <SelectItem value="50">50 downloads</SelectItem>
              <SelectItem value="100">100 downloads</SelectItem>
              <SelectItem value="unlimited">Unlimited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UploadSettings;