import { useAuthenticator } from '@aws-amplify/ui-react';

const Home: React.FC = () => {
    const { user } = useAuthenticator();
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Welcome to Book Exchange, {user?.signInDetails?.loginId || 'Guest'}
            </h2>
            <p className="text-gray-600">Browse, add, and exchange books with others!</p>
        </div>
    );
};

export default Home;