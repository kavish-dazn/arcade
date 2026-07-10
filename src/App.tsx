import AppRouter from '@router/AppRouter';
import { FocusProvider } from '@focus';

import './App.scss';

function App() {
    return (
        <FocusProvider>
            <div className="root-container">
                <AppRouter />
            </div>
        </FocusProvider>
    );
}

export default App
