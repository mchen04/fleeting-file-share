export const simulateUpload = (
  file: File,
  setUploadProgress: (progress: number) => void,
  setIsUploading: (isUploading: boolean) => void,
  setUploadComplete: (isComplete: boolean) => void,
  setShareableLink: (link: string) => void
) => {
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