import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Users, Shield, BarChart3, ArrowRight, Loader2 } from 'lucide-react';

export default function Index() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-tr from-accent/15 to-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Enterprise-Grade Security
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Employee Management
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              A comprehensive, secure, and professional system to manage your organization's 
              workforce efficiently. Built for modern enterprises.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4 sm:px-0">
              <Button 
                size="lg" 
                className="gradient-primary text-base sm:text-lg px-6 sm:px-8 h-11 sm:h-12 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate('/auth')}
              >
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 h-11 sm:h-12 hover:bg-muted/50 transition-colors"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Everything You Need</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">Powerful tools to streamline your workforce management</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            {
              icon: Users,
              title: 'Employee Records',
              description: 'Manage complete employee profiles with all essential information in one centralized location.',
            },
            {
              icon: Shield,
              title: 'Secure Access',
              description: 'Role-based access control ensures only authorized personnel can view and modify sensitive data.',
            },
            {
              icon: BarChart3,
              title: 'Real-time Analytics',
              description: 'Get instant insights into your workforce with comprehensive dashboards and reports.',
            },
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card border shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 transition-transform">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm sm:text-base">EMS</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              © {new Date().getFullYear()} Employee Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
