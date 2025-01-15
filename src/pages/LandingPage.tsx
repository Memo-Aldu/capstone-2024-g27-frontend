import React from 'react'
import { Link } from 'react-router-dom'

const heroBg = '/hero-image.jpg'

const featureIcons = {
  analytics: 'https://img.icons8.com/fluency/96/customer-insight.png',
  messaging: 'https://img.icons8.com/fluency/96/sms.png',
  teamwork: 'https://img.icons8.com/fluency/96/conference-background-selected.png'
}

export default function LandingPage (): JSX.Element {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section
        className="relative w-full flex flex-col items-center justify-center text-white h-[70vh]"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${heroBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            The Future of Customer Engagement
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-300">
            Manage your customer communications across SMS, Email, Post, and Voice—all from one intuitive platform.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-pink-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-pink-700 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="app/dashboard"
              className="bg-gray-200 text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-300 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">
            Simplify Your Communication Process
          </h2>
          <p className="text-gray-600 mb-12">
            PharmFinder CRM is a powerful platform that lets you engage your customers across multiple channels with ease. Here’s how it can help you streamline your communications:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature #1 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition">
              <img src={featureIcons.analytics} alt="Analytics" className="mx-auto mb-4 h-20" />
              <h3 className="text-xl font-semibold mb-4">Powerful Analytics</h3>
              <p className="text-gray-600">
                Gain real-time insights to track your messaging campaigns and optimize performance.
              </p>
            </div>

            {/* Feature #2 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition">
              <img src={featureIcons.messaging} alt="Messaging" className="mx-auto mb-4 h-20" />
              <h3 className="text-xl font-semibold mb-4">Omnichannel Messaging</h3>
              <p className="text-gray-600">
                Send SMS, Emails, and Voice messages from one platform and reach your customers where they are.
              </p>
            </div>

            {/* Feature #3 */}
            <div className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition">
              <img src={featureIcons.teamwork} alt="Team Collaboration" className="mx-auto mb-4 h-20" />
              <h3 className="text-xl font-semibold mb-4">Team Collaboration</h3>
              <p className="text-gray-600">
                Manage roles, permissions, and workflows to empower your entire team to work together efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gradient-to-r from-pink-50 to-orange-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-700 mb-6">
              Get started with PharmFinder CRM in just a few simple steps:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Create or import your contact lists</li>
              <li>Draft your SMS or email campaigns</li>
              <li>Track delivery status and customer engagement</li>
              <li>Analyze results and optimize your strategy</li>
            </ul>
            <Link
              to="/signup"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-pink-700 transition"
            >
              Start Now
            </Link>
          </div>
          <img
            src="/convo-image.png"
            alt="Product Dashboard"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Quick Sign-Up CTA */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            No upfront fees, no lock-ins. Get started for free and only pay for what you use.
          </p>
          <form className="flex flex-col md:flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 focus:ring-pink-600 rounded-md px-4 py-2 w-full md:w-1/3"
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 focus:ring-pink-600 rounded-md px-4 py-2 w-full md:w-1/3"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-pink-700 transition"
            >
              Sign Up Free
            </button>
          </form>
          <p className="text-gray-600 text-sm mt-4">
            Already have an account?{' '}
            <Link to="app/dashboard" className="text-pink-600 hover:underline">
              Login here
            </Link>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} PharmFinder CRM. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
