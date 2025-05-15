import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
      <Button variant="outline">Click Me</Button>
      <Progress value={50} />
    </div>
  );
}

export default Dashboard;
