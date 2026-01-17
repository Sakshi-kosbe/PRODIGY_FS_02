import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useEmployees } from '@/hooks/useEmployees';
import { Users, UserCheck, Building2, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { employees, departments, isLoading } = useEmployees();

  const activeEmployees = employees.filter(e => e.employment_status === 'active');
  const recentEmployees = employees.slice(0, 5);

  // Department distribution
  const departmentCounts = employees.reduce((acc, emp) => {
    const deptName = emp.departments?.name || 'Unassigned';
    acc[deptName] = (acc[deptName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatsCard
            title="Total Employees"
            value={employees.length}
            icon={Users}
            variant="primary"
            description="All registered employees"
          />
          <StatsCard
            title="Active Employees"
            value={activeEmployees.length}
            icon={UserCheck}
            variant="success"
            description={`${((activeEmployees.length / Math.max(employees.length, 1)) * 100).toFixed(0)}% of total`}
          />
          <StatsCard
            title="Departments"
            value={departments.length}
            icon={Building2}
            description="Active departments"
          />
          <StatsCard
            title="Growth Rate"
            value="+12%"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Employees */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Employees</CardTitle>
            </CardHeader>
            <CardContent>
              {recentEmployees.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No employees added yet. Add your first employee to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentEmployees.map((employee, index) => (
                    <div 
                      key={employee.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{employee.full_name}</p>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>
                      <Badge variant={employee.employment_status === 'active' ? 'default' : 'secondary'}>
                        {employee.employment_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(departmentCounts).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No employees in any department yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(departmentCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dept, count], index) => {
                      const percentage = (count / employees.length) * 100;
                      return (
                        <div 
                          key={dept} 
                          className="space-y-2 animate-slide-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{dept}</span>
                            <span className="text-muted-foreground">{count} employees</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full gradient-primary rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
