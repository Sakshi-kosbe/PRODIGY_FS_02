import { format } from 'date-fns';
import { Mail, Phone, Calendar, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Department {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  department_id: string | null;
  departments?: Department | null;
  role: string;
  date_of_joining: string;
  employment_status: 'active' | 'inactive';
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  animationDelay?: number;
}

export function EmployeeCard({ employee, onEdit, onDelete, animationDelay = 0 }: EmployeeCardProps) {
  const initials = employee.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card 
      className="shadow-card hover:shadow-medium transition-all duration-300 animate-slide-up overflow-hidden"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">{initials}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">{employee.full_name}</h3>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
              </div>
              <Badge 
                variant={employee.employment_status === 'active' ? 'default' : 'secondary'}
                className={employee.employment_status === 'active' ? 'bg-success hover:bg-success/90 flex-shrink-0' : 'flex-shrink-0'}
              >
                {employee.employment_status}
              </Badge>
            </div>
            
            {/* Details */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{employee.employee_id}</span>
                {employee.departments?.name && (
                  <>
                    <span className="text-border">•</span>
                    <span className="truncate">{employee.departments.name}</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{employee.email}</span>
              </div>
              
              {employee.phone_number && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{employee.phone_number}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Joined {format(new Date(employee.date_of_joining), 'MMM d, yyyy')}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(employee.id)}
                className="flex-1"
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(employee.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
