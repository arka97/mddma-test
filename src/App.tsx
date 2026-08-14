import { AppProviders } from "@/providers/AppProviders";
import { AppRoutes } from "@/routes";
import { SplashScreen } from "@/components/pwa/SplashScreen";

const App = () => (
  <AppProviders>
    <SplashScreen />
    <AppRoutes />
  </AppProviders>
);

export default App;
