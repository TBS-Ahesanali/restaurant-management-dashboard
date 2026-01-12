import { Suspense } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes/routes';
import { Loader } from 'lucide-react';

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <AppRoutes />
      </Router>
    </Suspense>
  );
}

export default App;
