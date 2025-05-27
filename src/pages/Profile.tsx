import { useAuthenticator } from '@aws-amplify/ui-react';

const Profile: React.FC = () => {
    const { user } = useAuthenticator();

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Profile</h2>
            <p className="text-gray-600">
                Username: {user?.signInDetails?.loginId || 'Guest'}
            </p>
        </div>
    );
};

export default Profile;