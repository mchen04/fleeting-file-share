# Temporary File Sharing Application

A secure and user-friendly web application for temporary file sharing with automatic expiration and download limits.

## Features

- **Secure File Upload**: Upload files up to 150MB
- **Customizable Expiration**: Set file availability duration (30 minutes to 72 hours)
- **Download Limits**: Control the number of times a file can be downloaded (1 to unlimited)
- **Automatic Cleanup**: Files are automatically removed after expiration or reaching download limits
- **Shareable Links**: Generate unique links for easy file sharing
 
## Usage

1. **Upload a File**:
   - Drag and drop a file or click to select
   - Maximum file size: 150MB

2. **Configure Sharing Settings**:
   - Set expiration time (30 minutes to 72 hours)
   - Set download limit (1 to unlimited downloads)

3. **Share the Link**:
   - Copy the generated link
   - Share with intended recipients

4. **Download**:
   - Recipients can download the file using the shared link
   - Link expires after the set time or download limit

## Technical Details

Built with:
- React + TypeScript
- Tailwind CSS for styling
- Supabase for backend storage and file management
- Shadcn UI components
- React Query for data management

## Security Features

- Automatic file deletion after expiration
- Download limit enforcement
- Secure file storage
- No user registration required

## File Expiration

Files automatically become inaccessible when:
- The specified time period expires (30 minutes to 72 hours)
- The download limit is reached
- The file is marked as deleted

## Development

To run this project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase environment variables
4. Run the development server: `npm run dev`

## Environment Variables

Required Supabase environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
