import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import ThreatFeed from './pages/ThreatFeed';
import About from './pages/About';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="feed" element={<ThreatFeed />} />
              <Route path="history" element={<History />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
