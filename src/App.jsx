import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { WishlistProvider } from "./context/WishlistContext";
import ErrorBoundary from "./ComponentCommon/ErrorBoundary";
import AppRouter from "./Pages/Router";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <AppRouter />
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;