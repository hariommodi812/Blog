import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import AuthPage from "@/pages/AuthPage";
import MainLayout from "@/layouts/MainLayout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <MainLayout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/blog/:slug" component={BlogDetailPage} />
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/profile" component={() => <div className="max-w-7xl mx-auto px-4 py-8">User Profile Page (Protected)</div>} />
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
