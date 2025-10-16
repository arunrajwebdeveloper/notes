import { Provider } from "react-redux";
import MainView from "./view/MainView";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MainView />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
