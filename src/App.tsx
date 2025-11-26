import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameBoardScreen } from './components/BeniasBoard/GameBoardScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/board" element={<GameBoardScreen />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
