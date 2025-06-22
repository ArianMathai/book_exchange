import React, { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Mail, Edit3, Loader2 } from 'lucide-react';
import { client } from '@/lib/amplifyClient';
import { fetchUserAttributes } from 'aws-amplify/auth';

interface UserData {
    email: string;
    address?: string;
    city?: string;
    postalCode?: string;
    coordinates?: {
        lat: number;
        long: number;
    };
}

const Profile: React.FC = () => {
    const { user } = useAuthenticator();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const attributes = await fetchUserAttributes();
                const sub = attributes.sub;

                if (!sub) {
                    throw new Error('No user ID found');
                }

                // Fetch user data from the database
                const result = await client.models.User.get({ sub });

                if (result?.data) {
                    setUserData(result.data as UserData);
                } else {
                    // User exists in Cognito but not in our database yet
                    setUserData({
                        email: attributes.email || 'No email',
                    });
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load profile data');
                console.log("ERROR: ", error)
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const hasAddressInfo = userData?.address || userData?.city || userData?.postalCode;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center p-4">
                <Card className="shadow-lg border-slate-200 w-full max-w-md">
                    <CardContent className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span className="text-slate-600">Loading profile...</span>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
            <div className="max-w-2xl mx-auto space-y-4">
                {/* Profile Header */}
                <Card className="shadow-lg border-slate-200">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-slate-800">Profile</CardTitle>
                                <CardDescription>Manage your account information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* User Information */}
                <Card className="shadow-lg border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-slate-600" />
                            Account Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-slate-600 font-medium">Username:</span>
                            <Badge variant="secondary" className="text-sm">
                                {user?.signInDetails?.loginId || 'Guest'}
                            </Badge>
                        </div>


                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                <Separator />
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Address Information */}
                <Card className="shadow-lg border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-slate-600" />
                            Home Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {hasAddressInfo ? (
                            <div className="space-y-3">
                                {userData?.address && (
                                    <div className="flex justify-between items-start py-2">
                                        <span className="text-slate-600 font-medium">Address:</span>
                                        <span className="text-slate-800 text-right">{userData.address}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    {userData?.city && (
                                        <div className="flex flex-col">
                                            <span className="text-slate-600 font-medium text-sm">City:</span>
                                            <span className="text-slate-800">{userData.city}</span>
                                        </div>
                                    )}

                                    {userData?.postalCode && (
                                        <div className="flex flex-col">
                                            <span className="text-slate-600 font-medium text-sm">Postal Code:</span>
                                            <span className="text-slate-800">{userData.postalCode}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-end">
                                    <Button asChild variant="outline" className="hover:bg-slate-50">
                                        <Link to="/setup" className="flex items-center">
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Change Home Address
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-600 mb-3">
                                    No home address set up yet. Add your address to help find books near you.
                                </p>
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Link to="/setup" className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Set Up Home Address
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;