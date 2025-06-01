import { useAuthenticator } from '@aws-amplify/ui-react';
import FindBook from '@/components/book/FindBook';

const Home: React.FC = () => {
    const { user } = useAuthenticator();
    return (
        <div>
            {/* Welcome Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                    Welcome to Book Exchange, {user?.signInDetails?.loginId || 'Guest'}
                </h2>
                <p className="text-gray-600 mb-2">Browse, add, and exchange books with others!</p>
                <p className="text-gray-500 text-sm">
                    Discover books from other users below that you can request to borrow.
                </p>
            </div>
            
            {/* FindBook Component */}
            <FindBook />
        </div>
    );
};

export default Home;