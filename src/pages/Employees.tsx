import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useEmployees, Employee } from '@/hooks/useEmployees';
import { EmployeeCard } from '@/components/employees/EmployeeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  ArrowUpDown,
  Mail,
  Phone,
  Calendar,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

type SortField = 'full_name' | 'employee_id' | 'date_of_joining' | 'role';
type SortOrder = 'asc' | 'desc';

export default function Employees() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { employees, departments, isLoading, deleteEmployee } = useEmployees();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('full_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(isMobile ? 'cards' : 'table');

  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        emp =>
          emp.full_name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.employee_id.toLowerCase().includes(query) ||
          emp.role.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (departmentFilter !== 'all') {
      result = result.filter(emp => emp.department_id === departmentFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(emp => emp.employment_status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'full_name':
          comparison = a.full_name.localeCompare(b.full_name);
          break;
        case 'employee_id':
          comparison = a.employee_id.localeCompare(b.employee_id);
          break;
        case 'date_of_joining':
          comparison = new Date(a.date_of_joining).getTime() - new Date(b.date_of_joining).getTime();
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [employees, searchQuery, departmentFilter, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteEmployee.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Employees">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Employees">
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Filters and Actions */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[140px] sm:w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[110px] sm:w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Toggle - Hidden on Mobile */}
            <div className="hidden sm:flex items-center border rounded-lg p-0.5 bg-muted/50">
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-2.5"
                onClick={() => setViewMode('table')}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-2.5"
                onClick={() => setViewMode('cards')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
            
            <Button onClick={() => navigate('/employees/new')} className="gradient-primary ml-auto sm:ml-0">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Employee</span>
            </Button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedEmployees.length} of {employees.length} employees
        </p>

        {/* Mobile Card View */}
        {(viewMode === 'cards' || isMobile) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:hidden lg:hidden md:hidden">
            {filteredAndSortedEmployees.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery || departmentFilter !== 'all' || statusFilter !== 'all'
                    ? 'No employees match your filters.'
                    : 'No employees added yet. Click "+" to get started.'}
                </p>
              </div>
            ) : (
              filteredAndSortedEmployees.map((employee, index) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={(id) => navigate(`/employees/${id}/edit`)}
                  onDelete={(id) => setDeleteId(id)}
                  animationDelay={index * 30}
                />
              ))
            )}
          </div>
        )}

        {/* Desktop Table View */}
        {viewMode === 'table' && !isMobile && (
          <div className="rounded-lg border bg-card shadow-card overflow-hidden hidden sm:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-48 min-w-[180px]">
                      <button 
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => handleSort('full_name')}
                      >
                        Employee
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <button 
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => handleSort('employee_id')}
                      >
                        ID
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[200px]">Contact</TableHead>
                    <TableHead className="min-w-[120px]">Department</TableHead>
                    <TableHead className="min-w-[150px]">
                      <button 
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => handleSort('role')}
                      >
                        Role
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      <button 
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => handleSort('date_of_joining')}
                      >
                        Joined
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead className="min-w-[90px]">Status</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <p className="text-muted-foreground">
                          {searchQuery || departmentFilter !== 'all' || statusFilter !== 'all'
                            ? 'No employees match your filters.'
                            : 'No employees added yet. Click "Add Employee" to get started.'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedEmployees.map((employee, index) => (
                      <TableRow 
                        key={employee.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-primary">
                                {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium truncate max-w-[120px]">{employee.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{employee.employee_id}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate max-w-[160px]">{employee.email}</span>
                            </div>
                            {employee.phone_number && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                {employee.phone_number}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{employee.departments?.name || '-'}</TableCell>
                        <TableCell className="text-sm">{employee.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            {format(new Date(employee.date_of_joining), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={employee.employment_status === 'active' ? 'default' : 'secondary'}
                            className={employee.employment_status === 'active' ? 'bg-success hover:bg-success/90' : ''}
                          >
                            {employee.employment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(`/employees/${employee.id}/edit`)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteId(employee.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        {/* Cards view for non-mobile when selected */}
        {viewMode === 'cards' && !isMobile && (
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedEmployees.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery || departmentFilter !== 'all' || statusFilter !== 'all'
                    ? 'No employees match your filters.'
                    : 'No employees added yet. Click "Add Employee" to get started.'}
                </p>
              </div>
            ) : (
              filteredAndSortedEmployees.map((employee, index) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={(id) => navigate(`/employees/${id}/edit`)}
                  onDelete={(id) => setDeleteId(id)}
                  animationDelay={index * 30}
                />
              ))
            )}
          </div>
        )}
        
        {/* Mobile always shows cards */}
        {isMobile && (
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {filteredAndSortedEmployees.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery || departmentFilter !== 'all' || statusFilter !== 'all'
                    ? 'No employees match your filters.'
                    : 'No employees added yet. Tap "+" to get started.'}
                </p>
              </div>
            ) : (
              filteredAndSortedEmployees.map((employee, index) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={(id) => navigate(`/employees/${id}/edit`)}
                  onDelete={(id) => setDeleteId(id)}
                  animationDelay={index * 30}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteEmployee.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
