import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TodayPage from './pages/TodayPage';
import CalendarPage from './pages/CalendarPage';
import RoutinesPage from './pages/RoutinesPage';
import GrowthPage from './pages/GrowthPage';
import GoalsPage from './pages/GoalsPage';
import SettingsPage from './pages/SettingsPage';
import { goalsAPI } from './services/api';
import { differenceInDays, format } from 'date-fns';

export default function App() {
  const [entered, setEntered] = useState(() => !!localStorage.getItem('gwd_entered'));
  const [activeGoal, setActiveGoal] = useState(null);
  const [streak, setStreak] = useState(0);

  const loadGoal = async () => {
    try {
      const res = await goalsAPI.getAll();
      const active = res.data.find(g => g.isActive) || res.data[0];
      if (active) {
        const daysLeft = differenceInDays(new Date(active.endDate), new Date());
        const progressPct = Math.min(100, Math.round(
          ((active.durationDays - daysLeft) / active.durationDays) * 100
        ));
        setActiveGoal({ ...active, daysLeft, progressPct });
      }
    } catch (e) { /* backend not connected yet */ }
  };

  useEffect(() => {
    if (entered) loadGoal();
  }, [entered]);

  const handleEnter = () => {
    localStorage.setItem('gwd_entered', '1');
    setEntered(true);
  };

  if (!entered) return <SplashScreen onEnter={handleEnter} />;

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar goal={activeGoal} streak={streak} />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard goal={activeGoal} />} />
          <Route path="/today" element={<TodayPage goal={activeGoal} />} />
          <Route path="/calendar" element={<CalendarPage goal={activeGoal} />} />
          <Route path="/routines" element={<RoutinesPage goal={activeGoal} />} />
          <Route path="/growth" element={<GrowthPage goal={activeGoal} />} />
          <Route path="/goals" element={<GoalsPage activeGoal={activeGoal} onGoalChange={loadGoal} />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
