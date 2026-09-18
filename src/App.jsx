import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import ErrorBoundary from "./ComponentCommon/ErrorBoundary";
import AppRouter from "./Pages/Router";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <SearchProvider>
            <AppRouter />
          </SearchProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;