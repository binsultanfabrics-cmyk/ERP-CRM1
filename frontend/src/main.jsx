import { createRoot } from 'react-dom/client';
import './style/app.css';

import RootApp from './RootApp';

const root = createRoot(document.getElementById('root'));
root.render(<RootApp />);
