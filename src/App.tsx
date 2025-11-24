import { MantineProvider } from '@mantine/core';
import { BeniasBoard } from './components/beniasBoard/BeniasBoard';

export default function App() {

  return (
    <MantineProvider>
      <BeniasBoard />
    </MantineProvider>
  );
}
