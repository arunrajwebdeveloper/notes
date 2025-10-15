import { Provider } from "react-redux";
import NoteList from "./components/NoteList";
import MainLayout from "./layout/MainLayout";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <MainLayout>
        <NoteList />
      </MainLayout>
    </Provider>
  );
}

export default App;
