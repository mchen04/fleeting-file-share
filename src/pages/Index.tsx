import FileUpload from '@/components/FileUpload';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content with side ads */}
      <div className="flex-1 flex">
        {/* Left ad space */}
        <div className="hidden lg:block w-64 p-4 bg-gray-100 border-r">
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Ad Space Left</p>
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
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

        {/* Right ad space */}
        <div className="hidden lg:block w-64 p-4 bg-gray-100 border-l">
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Ad Space Right</p>
          </div>
        </div>
      </div>

      {/* Bottom ad space */}
      <div className="w-full p-4 bg-gray-100 border-t">
        <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Ad Space Bottom</p>
        </div>
      </div>
    </div>
  );
};

export default Index;