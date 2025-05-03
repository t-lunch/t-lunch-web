import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getStoredToken } from "./api/authAPI";
import { setCredentials } from "./store/slices/authSlice";

async function prepare() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
}

const authFromLs = JSON.parse(localStorage.getItem("auth") || "null");
if (authFromLs && authFromLs.accessToken && authFromLs.userId) {
  store.dispatch(
    setCredentials({
      accessToken: authFromLs.accessToken,
      userId: authFromLs.userId,
      userName: authFromLs.userName ?? "",
    })
  );
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
