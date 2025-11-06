import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

interface SuccessMessageProps {
    title: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ title }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-green-100 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Book Added Successfully!</h3>
                            <p className="text-slate-600 text-sm">
                                "{title}" has been added to your library.
                            </p>
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Redirecting to library...
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuccessMessage;
