import { supabase } from "@/integrations/supabase/client";

export const uploadFile = async (
  file: File,
  expiryTime: string,
  downloadLimit: string,
  setUploadProgress: (progress: number) => void,
  setIsUploading: (isUploading: boolean) => void,
  setUploadComplete: (isComplete: boolean) => void,
  setShareableLink: (link: string) => void
) => {
  try {
    setIsUploading(true);
    setUploadProgress(0);

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Convert time string to hours (handle "0.5h" correctly)
    const hours = expiryTime.endsWith('h') 
      ? parseFloat(expiryTime.replace('h', ''))
      : parseFloat(expiryTime);
    
    formData.append('expiryTime', hours.toString());
    formData.append('downloadLimit', downloadLimit);

    // Call the upload function
    const { data, error } = await supabase.functions.invoke('upload-file', {
      body: formData,
    });

    if (error) {
      throw error;
    }

    // Set progress to 100% and complete
    setUploadProgress(100);
    setIsUploading(false);
    setUploadComplete(true);

    // Generate shareable link
    const currentDomain = window.location.origin;
    setShareableLink(`${currentDomain}/download/${data.fileId}`);
  } catch (error) {
    console.error('Upload error:', error);
    setIsUploading(false);
    throw error;
  }
};