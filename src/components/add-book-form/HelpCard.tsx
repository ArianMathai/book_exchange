import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const HelpCard: React.FC = () => {
    return (
        <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                    <div className="p-1 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Need help?</h4>
                        <p className="text-sm text-blue-700">
                            You can find the ISBN on the back cover or copyright page of most books.
                            It's usually a 10 or 13-digit number that helps identify the book uniquely.
                            Adding an ISBN or detailed title/author information helps us find the book cover automatically.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HelpCard;
