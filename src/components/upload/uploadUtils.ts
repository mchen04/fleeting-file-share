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
    formData.append('expiryTime', expiryTime.replace(/[^0-9]/g, '')); // Convert "24h" to "24"
    formData.append('downloadLimit', downloadLimit);

    // Call the upload function
    const response = await fetch(`${supabase.supabaseUrl}/functions/v1/upload-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabase.supabaseKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload file');
    }

    const { fileId } = await response.json();
    
    // Set progress to 100% and complete
    setUploadProgress(100);
    setIsUploading(false);
    setUploadComplete(true);

    // Generate shareable link
    const currentDomain = window.location.origin;
    setShareableLink(`${currentDomain}/download/${fileId}`);
  } catch (error) {
    console.error('Upload error:', error);
    setIsUploading(false);
    throw error;
  }
};