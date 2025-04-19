import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import MainLayout from "@/layouts/MainLayout";

function App() {
  return (
    <TooltipProvider>
      <MainLayout>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/blog/:slug" component={BlogDetailPage} />
          <Route component={NotFound} />
        </Switch>
      </MainLayout>
    </TooltipProvider>
  );
}

export default App;
