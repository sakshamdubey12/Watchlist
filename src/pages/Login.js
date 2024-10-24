import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [email, setEmail] = useState('')
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate();

  const handleSubmit = async (event, action) => {
    event.preventDefault()
    
    const response = await fetch(`http://localhost:3001/${action}`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include'
  })
  const data = await response.json();
  if (response.ok) {
    if(data.message==="Logged in."){
      navigate('/dashboard');
    }
    console.log(`${action} successful!`); // Handle user data as needed
    } else {
      if(data.message==="User not registered."){
        setActiveTab('signup')
      }
      else if(data.message==="User already registered."){
        setActiveTab('login')
      }
      else{
        console.log("Internal Error")
      }
    }
      }

  return (
    <div className="min-h-screen w-[100%] bg-cover bg-center flex items-center justify-center p-4" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
    }}>
      <div className="w-full max-w-md">
        <div className="bg-black/70 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden border border-gray-600">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18v15.64C2 21.03 2.97 22 4.18 22h15.64c1.21 0 2.18-.97 2.18-2.18V4.18C22 2.97 21.03 2 19.82 2z"/>
                <path d="M7 2v20"/>
                <path d="M17 2v20"/>
                <path d="M2 12h20"/>
                <path d="M2 7h5"/>
                <path d="M2 17h5"/>
                <path d="M17 17h5"/>
                <path d="M17 7h5"/>
              </svg>
              <h1 className="text-4xl font-bold text-white ml-4">CineTrack</h1>
            </div>
            <div className="mb-8">
              <div className="grid grid-cols-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`py-2 text-center ${activeTab === 'login' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`py-2 text-center ${activeTab === 'signup' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>
            {activeTab === 'login' ? (
              <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-white">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-800/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, 'signup')} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="block text-white">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-800/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                  Sign Up
                </button>
              </form>
            )}
          </div>
          <div className="px-8 py-4 bg-black/50 border-t border-gray-600">
            <p className="text-xs text-gray-400 text-center">
              By signing up, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          {['Action', 'Comedy', 'Drama'].map((genre) => (
            <div key={genre} className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-white font-bold">{genre[0]}</span>
              </div>
              <span className="text-xs text-white">{genre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}