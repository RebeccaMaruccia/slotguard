import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import store from "./store/store";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";
import {RouterProvider} from "react-router";
import {router} from "./route/router";
import Loader from './components/Base/Loader/loader.component';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
let persistor = persistStore(store);
root.render(<Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
        <React.Suspense fallback={<Loader isActive full></Loader>}>
            <RouterProvider router={router} />
        </React.Suspense>
    </PersistGate>
</Provider>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
