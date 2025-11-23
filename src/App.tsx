import { AppShell, Burger, Group, MantineProvider, Skeleton, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Alias for Friends</Title>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <p>Navbar content</p>
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Navbar>

        <AppShell.Main>
          <Title order={2}>Welcome</Title>
          <p>Main content goes here.</p>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
