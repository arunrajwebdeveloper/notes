import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import NoteModal from "../components/NoteModal";
import NoteList from "../components/NoteList";
// import { useAuth } from "../hooks/useAuth";

// import { decrement, increment } from "../store/features/counterSlice";
// import { useAppDispatch, useAppSelector } from "../hooks";

function NotesPage() {
  // const count = useAppSelector((state) => state.counter.value);
  // const dispatch = useAppDispatch();

  // const { user, logout } = useAuth();

  return (
    <div className="flex h-dvh w-full">
      <Sidebar />
      <div className="flex w-full">
        <Header />
        {/* <div className="">
        </div> */}
        {/* <h2>Count: {count}</h2>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button> */}
        <div>
          <NoteList />
        </div>
      </div>

      {/* MODAL */}

      <NoteModal />
    </div>
  );
}

export default NotesPage;
