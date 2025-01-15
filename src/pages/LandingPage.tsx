import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage (): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our CRM</h1>
      <p className="mb-8 text-gray-600">
        A powerful, multi-tenant CRM and messaging platform.
      </p>
      <div className="flex space-x-4">
        {/* You can link these to your Azure AD B2C sign-up and sign-in flows */}
        <Link
          to="/signup"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Login
        </Link>
      </div>
    </div>
  )
}
