import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Modal";

const NoteFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6 p-8">
        <div className="text-center">
          <svg
            width="110px"
            height="110px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="m-auto"
          >
            <path
              d="M2 8L8 10"
              stroke="#1C274C"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M6 4L8 7"
              stroke="#1C274C"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M11 6.56252L14.7001 2.93755C16.1597 1.50753 18.7629 1.73938 20.5145 3.4554C22.266 5.17142 22.5027 7.72176 21.043 9.15178L18.1358 12"
              stroke="#f3c72d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M15 15.5866L10.9653 20.001C9.57254 21.5247 7.0887 21.2777 5.41744 19.4492C3.74618 17.6207 3.52038 14.9032 4.91309 13.3795L6.17395 12"
              stroke="#f3c72d"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-600">Sorry, we can't find that page.</p>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/notes")} variant="primary">
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteFound;
