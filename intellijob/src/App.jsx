// src/App.jsx
import { useLocation } from 'react-router-dom';
import { useAuth } from './context/Authcontext'; // Import your auth context
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';
import './styles/index.css';

const App = () => {
  const location = useLocation();
  const { user } = useAuth(); // Get the user from auth context

  const hideHeaderPaths = ['/login', '/signup'];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="font-sans antialiased">
      {shouldShowHeader && <Header userName={user?.name || "Guest User"} />}
      <AppRoutes />
    </div>
  );
};

export default App;