import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useEmployees, EmployeeInput } from '@/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { z } from 'zod';

const employeeSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required').max(20, 'ID too long'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please enter a valid email'),
  phone_number: z.string().optional(),
  department_id: z.string().optional(),
  role: z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role too long'),
  date_of_joining: z.string().min(1, 'Date of joining is required'),
  employment_status: z.enum(['active', 'inactive']),
});

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, departments, isLoading, createEmployee, updateEmployee } = useEmployees();
  
  const isEditing = !!id;
  const existingEmployee = employees.find(e => e.id === id);

  const [formData, setFormData] = useState<EmployeeInput>({
    employee_id: '',
    full_name: '',
    email: '',
    phone_number: '',
    department_id: '',
    role: '',
    date_of_joining: new Date().toISOString().split('T')[0],
    employment_status: 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && existingEmployee) {
      setFormData({
        employee_id: existingEmployee.employee_id,
        full_name: existingEmployee.full_name,
        email: existingEmployee.email,
        phone_number: existingEmployee.phone_number || '',
        department_id: existingEmployee.department_id || '',
        role: existingEmployee.role,
        date_of_joining: existingEmployee.date_of_joining,
        employment_status: existingEmployee.employment_status,
      });
    }
  }, [isEditing, existingEmployee]);

  const validateForm = () => {
    try {
      employeeSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const dataToSubmit = {
      ...formData,
      department_id: formData.department_id || undefined,
      phone_number: formData.phone_number || undefined,
    };

    if (isEditing && id) {
      await updateEmployee.mutateAsync({ id, ...dataToSubmit });
    } else {
      await createEmployee.mutateAsync(dataToSubmit);
    }
    navigate('/employees');
  };

  const handleChange = (field: keyof EmployeeInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title={isEditing ? 'Edit Employee' : 'Add Employee'}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isEditing && !existingEmployee) {
    return (
      <DashboardLayout title="Employee Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Employee not found.</p>
          <Button onClick={() => navigate('/employees')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Employees
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={isEditing ? 'Edit Employee' : 'Add Employee'}>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/employees')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Employees
        </Button>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Employee Details' : 'Add New Employee'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Update the employee information below.'
                : 'Fill in the details to add a new employee to the system.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID *</Label>
                  <Input
                    id="employee_id"
                    value={formData.employee_id}
                    onChange={(e) => handleChange('employee_id', e.target.value)}
                    placeholder="EMP001"
                  />
                  {errors.employee_id && (
                    <p className="text-sm text-destructive">{errors.employee_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="John Doe"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-destructive">{errors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john.doe@company.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department_id} 
                    onValueChange={(value) => handleChange('department_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role / Designation *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    placeholder="Software Engineer"
                  />
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_joining">Date of Joining *</Label>
                  <Input
                    id="date_of_joining"
                    type="date"
                    value={formData.date_of_joining}
                    onChange={(e) => handleChange('date_of_joining', e.target.value)}
                  />
                  {errors.date_of_joining && (
                    <p className="text-sm text-destructive">{errors.date_of_joining}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Employment Status *</Label>
                  <Select 
                    value={formData.employment_status} 
                    onValueChange={(value) => handleChange('employment_status', value as 'active' | 'inactive')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/employees')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-primary"
                  disabled={createEmployee.isPending || updateEmployee.isPending}
                >
                  {createEmployee.isPending || updateEmployee.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isEditing ? 'Update Employee' : 'Add Employee'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
