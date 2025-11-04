import { Tabs } from '@mantine/core';
import DailyView from '../routes/DailyView';
import WeeklyView from '../routes/WeeklyView';
import MonthlyView from '../routes/MonthlyView';

export default function Calendar() {
  return (
    <Tabs defaultValue="daily" variant="outline">
      <Tabs.List>
        <Tabs.Tab value="daily">Daily</Tabs.Tab>
        <Tabs.Tab value="weekly">Weekly</Tabs.Tab>
        <Tabs.Tab value="monthly">Monthly</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="daily"><DailyView /></Tabs.Panel>
      <Tabs.Panel value="weekly"><WeeklyView /></Tabs.Panel>
      <Tabs.Panel value="monthly"><MonthlyView /></Tabs.Panel>
    </Tabs>
  );
}