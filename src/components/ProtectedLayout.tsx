import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '@/styles/authenticator.css';
import BurgerMenu from './BurgerMenu';
import { NotificationProvider } from '@/context/notificationsContext';

const ProtectedLayout: React.FC = () => {
  return (
    <Authenticator
      formFields={{
        signIn: {
          username: {
            label: 'Email Address',
            placeholder: 'your.email@example.com'
          },
          password: {
            label: 'Password',
            placeholder: 'Enter your password'
          }
        },
        signUp: {
          password: {
            label: 'Create Password',
            placeholder: 'Choose a secure password'
          },
          confirm_password: {
            label: 'Confirm Password',
            placeholder: 'Confirm your password'
          },
          preferred_username: {
            label: 'Display Name',
            placeholder: 'How should we call you?'
          }
        }
      }}
      components={{
        SignIn: {
          Footer() {
            return (
              <div className="text-center mt-4 p-4 bg-amber-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-amber-700 font-playfair italic">
                  📚 Ready to discover your next great read?
                </p>
              </div>
            );
          }
        },
        SignUp: {
          Footer() {
            return (
              <div className="text-center mt-4 p-4 bg-amber-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-amber-700 font-playfair italic">
                  🌟 "There is no friend as loyal as a book" – Ernest Hemingway.
                </p>
              </div>
            );
          }
        }
      }}
    >
      {({ user }) => (
        user ? (
          <NotificationProvider>
            <BurgerMenu />
          </NotificationProvider>
        ) : (
          <div>Please sign in to continue...</div>
        )
      )}
    </Authenticator>
  );
};

export default ProtectedLayout;