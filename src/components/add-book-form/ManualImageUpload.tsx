import React from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Camera, CheckCircle, Upload } from 'lucide-react';

interface ManualImageUploadProps {
    uploadedKey: string | null;
    onClear: () => void;
    onUploadStart: () => void;
    onUploadSuccess: (key: string) => void;
    onUploadError: (error: string) => void;
    error?: string;
}

const ManualImageUpload: React.FC<ManualImageUploadProps> = ({
                                                                 uploadedKey,
                                                                 onClear,
                                                                 onUploadStart,
                                                                 onUploadSuccess,
                                                                 onUploadError,
                                                                 error,
                                                             }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Upload a photo of your book cover</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 min-h-[200px]">
                {uploadedKey ? (
                    <div className="relative flex flex-col items-center">
                        <div className="mb-2 text-green-600 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-1" />
                            <span>Upload complete!</span>
                        </div>
                        <Badge className="mb-4 bg-purple-100 text-purple-800">
                            <Camera className="w-3 h-3 mr-1" />
                            Your Photo
                        </Badge>
                        <Button type="button" variant="outline" size="sm" onClick={onClear}>
                            Upload Different Image
                        </Button>
                    </div>
                ) : (
                    <FileUploader
                        acceptedFileTypes={['image/*']}
                        maxFileSize={5000000}
                        maxFileCount={1}
                        path={({ identityId }) => `bookImages/${identityId}/`}
                        isResumable={true}
                        onUploadStart={onUploadStart}
                        onUploadSuccess={(data) => {
                            if (data.key) {
                                onUploadSuccess(data.key);
                            } else {
                                onUploadError('No file key returned from upload.');
                            }
                        }}
                        onUploadError={(error) => {
                            onUploadError(String(error));
                        }}
                        components={{
                            Container: ({ children }) => (
                                <div className="w-full flex flex-col items-center">{children}</div>
                            ),
                            DropZone: ({ children }) => (
                                <div className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-red-300 transition-colors">
                                    {children}
                                </div>
                            ),
                            FilePicker: ({ children, ...props }) => (
                                <div className="flex flex-col items-center">
                                    <div className="mb-4 p-3 bg-slate-100 rounded-full">
                                        <Camera className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4 text-center">
                                        Drag and drop a photo here, or click to select
                                    </p>
                                    <Button type="button" variant="outline" onClick={props.onClick}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Select Photo
                                    </Button>
                                    {children}
                                </div>
                            ),
                        }}
                    />
                )}
            </div>

            {error && (
                <div className="flex items-center text-sm text-red-600 mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                </div>
            )}

            <p className="text-xs text-slate-500">
                Accepted formats: JPEG, PNG, WebP, GIF. Max size: 5MB.
            </p>
        </div>
    );
};

export default ManualImageUpload;
