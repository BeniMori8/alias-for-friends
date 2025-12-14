import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameBoardScreen } from './components/BeniasBoard/GameBoardScreen/GameBoardScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { GameStateProvider } from './state/GameState';
import { AccessGate } from './components/AccessGate/AccessGate';

export default function App() {
  return (
    <MantineProvider>
      <AccessGate>
        <GameStateProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/board" element={<GameBoardScreen />} />
            </Routes>
          </BrowserRouter>
        </GameStateProvider>
      </AccessGate>
    </MantineProvider>
  );
}
