import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProfilePage } from './components/profile/ProfilePage';
import { MissionsPage } from './components/missions/MissionsPage';
import { WorkoutPage } from './components/workout/WorkoutPage';
import { StrengthPage } from './components/strength/StrengthPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CoachPage } from './components/coach/CoachPage';
import { QuestsPage } from './components/quests/QuestsPage';
import { AchievementsPage } from './components/achievements/AchievementsPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/strength" element={<StrengthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
