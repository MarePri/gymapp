import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { OnboardingPage } from './components/onboarding/OnboardingPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { MissionsPage } from './components/missions/MissionsPage';
import { WorkoutPage } from './components/workout/WorkoutPage';
import { StrengthPage } from './components/strength/StrengthPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CoachPage } from './components/coach/CoachPage';
import { QuestsPage } from './components/quests/QuestsPage';
import { AchievementsPage } from './components/achievements/AchievementsPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { useUserStore } from './stores/userStore';

function AppRoutes() {
  const profile = useUserStore((s) => s.profile);
  const isOnboarded = profile?.onboarded;

  if (!isOnboarded) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
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
      <Route path="/onboarding" element={<OnboardingPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
