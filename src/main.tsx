import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'
import { CloudContext, cloud } from './cloudbase/cloudContext' 

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <CloudContext.Provider value={cloud}>
                <App />
            </CloudContext.Provider>
        </Provider>
    </React.StrictMode>
)