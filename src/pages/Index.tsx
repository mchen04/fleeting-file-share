import FileUpload from '@/components/FileUpload';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center mb-12 space-y-4 slide-down">
        <h1 className="text-4xl font-bold tracking-tight">
          Temporary File Sharing
        </h1>
        <p className="text-lg text-gray-600">
          Share files securely with time-based or download-based expiration
        </p>
      </div>
      <FileUpload />
      <p className="mt-8 text-sm text-gray-500 text-center max-w-md fade-in">
        Files are automatically deleted after expiration. Maximum file size is 10MB.
      </p>
    </div>
  );
};

export default Index;