// This is the starting point for the new app. Make sure to replace the contents of this component completely
// with the user requested app and remove this comment. Do not append things here.

function App() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col items-center text-center space-y-16">
          {/* Logo/Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <svg
                aria-label="Fiber Logo"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <title>Fiber Logo</title>
                <rect
                  x="12"
                  y="8"
                  width="16"
                  height="2"
                  fill="currentColor"
                  rx="1"
                />
                <rect
                  x="8"
                  y="13"
                  width="20"
                  height="2"
                  fill="currentColor"
                  rx="1"
                />
                <rect
                  x="4"
                  y="18"
                  width="24"
                  height="2"
                  fill="currentColor"
                  rx="1"
                />
                <rect
                  x="0"
                  y="23"
                  width="28"
                  height="2"
                  fill="currentColor"
                  rx="1"
                />
              </svg>
              <h1 className="text-4xl font-normal tracking-tight text-white">
                fiber
              </h1>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <div className="flex gap-1">
              <div
                className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-pulse"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-pulse"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-pulse"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <span>Your app is getting built</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
