import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getStoredToken } from "./api/authAPI";
import { setCredentials } from "./store/authSlice";

async function prepare() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
}

const storedToken = getStoredToken();
if (storedToken) {
  store.dispatch(setCredentials({ accessToken: storedToken.token, userId: null }));
}

const queryClient = new QueryClient();

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  );
});
