// src/App.jsx
import AppRoutes from './routes/AppRoutes';
import './styles/index.css';  // Tailwind CSS import

const App = () => {
  return (
    <div className="font-sans antialiased">
      <AppRoutes />
    </div>
  );
};

export default App;
