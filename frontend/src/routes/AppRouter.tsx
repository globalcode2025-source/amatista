import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Hero } from '../components/hero.tsx';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
