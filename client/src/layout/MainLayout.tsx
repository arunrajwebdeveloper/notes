import { type ReactNode } from "react";
import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
import NoteModal from "../components/NoteModal";

// import { decrement, increment } from "../store/features/counterSlice";
// import { useAppDispatch, useAppSelector } from "../hooks";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  // const count = useAppSelector((state) => state.counter.value);
  // const dispatch = useAppDispatch();

  return (
    <div>
      <Header />
      <div className="flex w-full">
        {/* <div className="">
          <Sidebar />
        </div> */}
        {/* <h2>Count: {count}</h2>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button> */}
        <div className="">{children}</div>
      </div>

      {/* MODAL */}

      <NoteModal />
    </div>
  );
}

export default MainLayout;
