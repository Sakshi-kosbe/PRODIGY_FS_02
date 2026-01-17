import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { FileText, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuditLogs, AuditLogFilters } from '@/hooks/useAuditLogs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const actionColors: Record<string, string> = {
  INSERT: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  UPDATE: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  DELETE: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function AuditLogs() {
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: logs = [], isLoading, error } = useAuditLogs(filters);

  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const searchLower = search.toLowerCase();
    return logs.filter((log) => {
      const newData = log.new_data as Record<string, unknown> | null;
      const oldData = log.old_data as Record<string, unknown> | null;
      const employeeName = (newData?.full_name || oldData?.full_name || '') as string;
      const employeeId = (newData?.employee_id || oldData?.employee_id || '') as string;
      return (
        employeeName.toLowerCase().includes(searchLower) ||
        employeeId.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower)
      );
    });
  }, [logs, search]);

  const getEmployeeInfo = (log: typeof logs[0]) => {
    const data = log.new_data || log.old_data;
    if (!data) return { name: 'Unknown', id: 'N/A' };
    return {
      name: (data.full_name as string) || 'Unknown',
      id: (data.employee_id as string) || 'N/A',
    };
  };

  const getChangeSummary = (log: typeof logs[0]) => {
    if (log.action === 'INSERT') return 'New employee record created';
    if (log.action === 'DELETE') return 'Employee record deleted';
    
    if (!log.old_data || !log.new_data) return 'Data modified';
    
    const changes: string[] = [];
    const oldData = log.old_data as Record<string, unknown>;
    const newData = log.new_data as Record<string, unknown>;
    
    Object.keys(newData).forEach((key) => {
      if (key === 'updated_at') return;
      if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        changes.push(key.replace(/_/g, ' '));
      }
    });
    
    return changes.length > 0 ? `Changed: ${changes.join(', ')}` : 'No visible changes';
  };

  return (
    <DashboardLayout title="Audit Logs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Employee Data Access History</h2>
            <p className="text-sm text-muted-foreground">
              Track all changes made to employee records for compliance
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Select
                value={filters.action || 'all'}
                onValueChange={(value) => setFilters({ ...filters, action: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="INSERT">Created</SelectItem>
                  <SelectItem value="UPDATE">Updated</SelectItem>
                  <SelectItem value="DELETE">Deleted</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="Start date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />

              <Input
                type="date"
                placeholder="End date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />

              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setSearch('');
                }}
                className="w-full"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                Failed to load audit logs. Make sure you have admin access.
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No audit logs found matching your criteria.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const employee = getEmployeeInfo(log);
                    const isExpanded = expandedRow === log.id;
                    
                    return (
                      <Collapsible key={log.id} asChild open={isExpanded}>
                        <>
                          <TableRow className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-6 w-6"
                                  onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={actionColors[log.action] || ''}
                              >
                                {log.action}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  ID: {employee.id}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {getChangeSummary(log)}
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={5} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {log.old_data && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                                        Previous Data
                                      </h4>
                                      <pre className="text-xs bg-background p-3 rounded-lg overflow-auto max-h-48 border">
                                        {JSON.stringify(log.old_data, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  {log.new_data && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                                        New Data
                                      </h4>
                                      <pre className="text-xs bg-background p-3 rounded-lg overflow-auto max-h-48 border">
                                        {JSON.stringify(log.new_data, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                                <div className="mt-3 text-xs text-muted-foreground">
                                  Record ID: {log.record_id || 'N/A'} • User ID: {log.user_id || 'System'}
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {!isLoading && filteredLogs.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredLogs.length} log entries
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
