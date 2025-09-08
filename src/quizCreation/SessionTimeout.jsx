
import { XCircleIcon } from "@heroicons/react/24/outline";
const SessionTimeout = ({onLogin }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Oops! Session Expired
            </h2>
            <p className="text-gray-600 mb-6">
              Your authentication token has expired. Please log in again to continue.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onLogin}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Log In Again
              </button>
              
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default SessionTimeout
  