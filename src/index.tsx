import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { getMsalInstance } from 'src/msalConfig';
import { store, persistor } from './app/store'
import SharedSnackbar from 'src/components/SharedSnackbar'
import {MsalProvider} from "@azure/msal-react";
import Loading from "src/components/Loading";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate
          loading={ <Loading message={'Authenticating...'} description={'Please wait while we verify your credentials.'}/> }
          persistor={persistor}
          onBeforeLift={() => {
            console.log('PersistGate has rehydrated the state.');
          }}
        >
          <MsalProvider instance={getMsalInstance()}>
            <App />
            <SharedSnackbar />
          </MsalProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
);

reportWebVitals()
