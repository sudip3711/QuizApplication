// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import { authService, LoginCredentials, RegisterCredentials } from '../services/authService';

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   mode: 'login' | 'register';
// }

// export function AuthModal({ isOpen, onClose, onSuccess, mode }: AuthModalProps) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     try {
//       if (mode === 'login') {
//         const credentials: LoginCredentials = { username, password };
//         await authService.login(credentials);
//       } else {
//         const credentials: RegisterCredentials = { username, email, password };
//         await authService.register(credentials);
//         // After successful registration, automatically log in
//         await authService.login({ username, password });
//       }
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'An error occurred');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <X size={24} />
//         </button>
        
//         <h2 className="text-2xl font-bold mb-6">
//           {mode === 'login' ? 'Login' : 'Register'}
//         </h2>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 mb-2">Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
          
//           {mode === 'register' && (
//             <div>
//               <label className="block text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           )}
          
//           <div>
//             <label className="block text-gray-700 mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
          
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//           >
//             {mode === 'login' ? 'Login' : 'Register'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { X } from 'lucide-react';
import { authService } from '../services/authService';

export function AuthModal({ isOpen, onClose, onSuccess, mode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await authService.login({ username, password });
      } else {
        await authService.register({ username, email, password });
        await authService.login({ username, password });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'An error occurred during authentication'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
