'use client';

import { store } from 'redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import PageLoading from 'components/PageLoading';

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<PageLoading content="Enrollment in progress" />}>
        {children}
      </PersistGate>
    </Provider>
  );
};
