export const simulateUpload = (
  file: File,
  setUploadProgress: (progress: number) => void,
  setIsUploading: (isUploading: boolean) => void,
  setUploadComplete: (isComplete: boolean) => void,
  setShareableLink: (link: string) => void
) => {
  setIsUploading(true);
  setUploadProgress(0);
  let progress = 0;

  const interval = setInterval(() => {
    progress += 10;
    
    if (progress >= 100) {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      setUploadComplete(true);
      // Generate a link using the current domain
      const fileId = Math.random().toString(36).substring(7);
      const currentDomain = window.location.origin;
      setShareableLink(`${currentDomain}/download/${fileId}`);
    } else {
      setUploadProgress(progress);
    }
  }, 500);
};