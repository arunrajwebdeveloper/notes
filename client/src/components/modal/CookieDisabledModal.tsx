const CookieDisabledModal = () => {
  const handleRetry = () => window.location.reload();

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-[99999] select-none">
      <div className="bg-white px-8 py-12 rounded-lg shadow-xl max-w-sm w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="mb-6 text-center text-yellow-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            width="80px"
            height="80px"
            viewBox="0 0 32 32"
            className="mx-auto"
          >
            <path
              fill="#fdc700"
              d="M 16 3 C 8.832 3 3 8.832 3 16 C 3 23.168 8.832 29 16 29 C 23.168 29 29 23.168 29 16 C 29 8.832 23.168 3 16 3 z M 16 5 C 22.065 5 27 9.935 27 16 C 27 22.065 22.065 27 16 27 C 9.935 27 5 22.065 5 16 C 5 9.935 9.935 5 16 5 z M 14 9 A 1 1 0 0 0 14 11 A 1 1 0 0 0 14 9 z M 19.5 10 A 1.5 1.5 0 0 0 19.5 13 A 1.5 1.5 0 0 0 19.5 10 z M 11 13 A 2 2 0 0 0 11 17 A 2 2 0 0 0 11 13 z M 17 15 A 1 1 0 0 0 17 17 A 1 1 0 0 0 17 15 z M 22 16 A 1 1 0 0 0 22 18 A 1 1 0 0 0 22 16 z M 12.5 19 A 1.5 1.5 0 0 0 12.5 22 A 1.5 1.5 0 0 0 12.5 19 z M 19.5 20 A 1.5 1.5 0 0 0 19.5 23 A 1.5 1.5 0 0 0 19.5 20 z"
            />
          </svg>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center mb-2 lg:mb-4">
          Cookies are disabled
        </h2>
        <p className="text-gray-900 text-base m-0 text-center">
          Your browser’s cookies are disabled. Please enable cookies to continue
          using this app securely.
        </p>
        <div className="text-sm text-gray-400 mt-4 text-center">
          Check your browser settings under <br />
          <span className="text-gray-500">Privacy & Security → Cookies</span>
        </div>
        <div className="text-center mt-8">
          <button
            className="bg-gray-600 hover:bg-gray-500 text-white outline-0 border-0 px-6 py-3 rounded-sm text-base cursor-pointer transition-colors duration-300"
            onClick={handleRetry}
          >
            I've enabled them, try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieDisabledModal;
