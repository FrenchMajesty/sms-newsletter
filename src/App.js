import React from 'react';
import './App.css';
import { Outlet, useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, query, collection, where, limit } from 'firebase/firestore';
import { auth, db } from 'lib/firebase';
import { message, ConfigProvider } from 'antd';

function App() {
  const navigate = useNavigate();
  const signUserOut = React.useCallback(() => {
    auth.signOut();
    localStorage.removeItem('account');
    navigate('/login', { replace: true });
  }, [navigate]);
  const loadUserAccount = React.useCallback(
    async (authId) => {
      try {
        // Query the Accounts collection to find the account where auth_id === authId
        const q = query(
          collection(db, 'Accounts'),
          where('auth_id', '==', authId),
          limit(1),
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 1) {
          const userDoc = querySnapshot.docs[0];
          const account = {
            id: '/' + userDoc.ref.path,
            uid: userDoc.id,
            ...userDoc.data(),
          };
          localStorage.setItem('account', JSON.stringify(account));
        } else {
          message.warning('Account not found. Please sign in again.');
          signUserOut();
        }
      } catch (error) {
        message.error('Error while loading account: ', error.message);
      }
    },
    [signUserOut],
  );
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setTimeout(() => loadUserAccount(user.uid), 3 * 1000);
      }
    });
  }, [loadUserAccount]);
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            fontSize: 16,
          },
        }}
      >
        <Outlet />
      </ConfigProvider>
    </div>
  );
}

export default App;
