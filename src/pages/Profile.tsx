import React, { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Mail, Edit3, Loader2, Save, X, UserCircle } from 'lucide-react';
import { client } from '@/lib/amplifyClient';
import { fetchUserAttributes, updateUserAttribute } from 'aws-amplify/auth';
import type { Schema } from '@/amplify/data/resource';

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

type PublicProfileType = Schema['PublicProfile']['type'];

const Profile: React.FC = () => {
    const { user } = useAuthenticator();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [publicProfile, setPublicProfile] = useState<PublicProfileType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form state for editing
    const [editForm, setEditForm] = useState({
        username: '',
        bio: ''
    });

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

                // Fetch public profile
                const profileResult = await client.models.PublicProfile.list({
                    filter: { userId: { eq: sub } }
                });

                if (profileResult.data && profileResult.data.length > 0) {
                    const profile = profileResult.data[0];
                    setPublicProfile(profile);
                    setEditForm({
                        username: profile.username || '',
                        bio: profile.bio || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEditProfile = () => {
        setIsEditingProfile(true);
    };

    const handleCancelEdit = () => {
        setIsEditingProfile(false);
        // Reset form to current values
        if (publicProfile) {
            setEditForm({
                username: publicProfile.username || '',
                bio: publicProfile.bio || ''
            });
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setError(null);

        try {
            if (!publicProfile) {
                throw new Error('No public profile found');
            }

            // Update the public profile
            const updateResult = await client.models.PublicProfile.update({
                id: publicProfile.id,
                username: editForm.username,
                bio: editForm.bio || null
            });

            if (updateResult.data) {
                setPublicProfile(updateResult.data);
                
                // Also update the preferredUsername in Cognito
                try {
                    await updateUserAttribute({
                        userAttribute: {
                            attributeKey: 'preferred_username',
                            value: editForm.username
                        }
                    });
                } catch (cognitoErr) {
                    console.error('Failed to update Cognito username:', cognitoErr);
                    // Continue even if Cognito update fails
                }
                
                setIsEditingProfile(false);
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile changes');
        } finally {
            setIsSaving(false);
        }
    };

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

                {/* Public Profile */}
                <Card className="shadow-lg border-slate-200">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                                <UserCircle className="w-5 h-5 mr-2 text-slate-600" />
                                Public Profile
                            </CardTitle>
                            {!isEditingProfile && (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleEditProfile}
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditingProfile ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        placeholder="Enter your display name"
                                        disabled={isSaving}
                                    />
                                    <p className="text-xs text-slate-500">This is how other users will see you</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        placeholder="Tell others about yourself..."
                                        rows={4}
                                        disabled={isSaving}
                                    />
                                    <p className="text-xs text-slate-500">Optional: Share your interests or favorite genres</p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button 
                                        onClick={handleSaveProfile}
                                        disabled={isSaving || !editForm.username.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        disabled={isSaving}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-slate-600 font-medium mb-1">Username</p>
                                        <p className="text-slate-800">{publicProfile?.username || 'Not set'}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-slate-600 font-medium mb-1">Email</p>
                                        <p className="text-slate-800">{publicProfile?.email || userData?.email || 'Not set'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-600 font-medium mb-1">Bio</p>
                                        <p className="text-slate-800">
                                            {publicProfile?.bio || <span className="text-slate-400 italic">No bio added yet</span>}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Account Details */}
                <Card className="shadow-lg border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-slate-600" />
                            Account Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-slate-600 font-medium">Login Email:</span>
                            <Badge variant="secondary" className="text-sm">
                                {user?.signInDetails?.loginId || 'Guest'}
                            </Badge>
                        </div>
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
                                        <Link to="/app/setup" className="flex items-center">
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
                                    <Link to="/app/setup" className="flex items-center">
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