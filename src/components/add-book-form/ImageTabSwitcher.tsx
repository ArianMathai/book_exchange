import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, X } from 'lucide-react';
import GoogleBooksCover from './GoogleBooksCover';
import ManualImageUpload from './ManualImageUpload';

interface ImageTabSwitcherProps {
    activeTab: 'google' | 'manual';
    onTabChange: (value: 'google' | 'manual') => void;

    imageSource: 'google_books' | 'manual' | null;
    isSearchingImage: boolean;
    googleBooksImage: string | null;
    uploadedS3Key: string | null;

    onClearImage: () => void;
    onRefreshGoogleImage: () => void;

    onUploadStart: () => void;
    onUploadSuccess: (key: string) => void;
    onUploadError: (error: string) => void;
    imageError?: string;

    canRefresh: boolean;
}

const ImageTabSwitcher: React.FC<ImageTabSwitcherProps> = ({
                                                               activeTab,
                                                               onTabChange,
                                                               imageSource,
                                                               isSearchingImage,
                                                               googleBooksImage,
                                                               uploadedS3Key,
                                                               onClearImage,
                                                               onRefreshGoogleImage,
                                                               onUploadStart,
                                                               onUploadSuccess,
                                                               onUploadError,
                                                               imageError,
                                                               canRefresh,
                                                           }) => {
    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Camera className="w-4 h-4 mr-1.5 text-slate-500" />
                    Book Cover
                    <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                </label>

                {(imageSource || isSearchingImage) && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClearImage}
                        className="h-8 px-2 text-slate-500"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={(val) => onTabChange(val as 'google' | 'manual')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="google" className="flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        Find Cover
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center">
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="google">
                    <GoogleBooksCover
                        image={googleBooksImage}
                        isSearching={isSearchingImage}
                        onRefresh={onRefreshGoogleImage}
                        canRefresh={canRefresh}
                    />
                </TabsContent>

                <TabsContent value="manual">
                    <ManualImageUpload
                        uploadedKey={uploadedS3Key}
                        onClear={onClearImage}
                        onUploadStart={onUploadStart}
                        onUploadSuccess={onUploadSuccess}
                        onUploadError={onUploadError}
                        error={imageError}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ImageTabSwitcher;
