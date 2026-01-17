import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Shield, Building2 } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Profile Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account ID</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
                  <span className="text-sm font-mono text-muted-foreground truncate">
                    {user?.id}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Section */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                <Shield className="w-6 h-6 text-success-foreground" />
              </div>
              <div>
                <CardTitle>Role & Permissions</CardTitle>
                <CardDescription>Your access level in the system</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Administrator</p>
                <p className="text-sm text-muted-foreground">
                  Full access to manage employees, departments, and system settings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>About this application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Application</p>
                <p className="font-medium">Employee Management System</p>
              </div>
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Environment</p>
                <p className="font-medium">Production</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
