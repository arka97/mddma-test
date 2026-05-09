import { AppProviders } from "@/providers/AppProviders";
import { CartFab } from "@/components/cart/CartFab";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AppRoutes } from "@/routes";

const App = () => (
  <AppProviders>
    <CartFab />
    <CartDrawer />
    <AppRoutes />
  </AppProviders>
);

export default App;
