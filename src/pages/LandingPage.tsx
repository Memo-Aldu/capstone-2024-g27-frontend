import React from 'react'
import { Link } from 'react-router-dom'

const heroBg = '/hero-image.jpg'

const featureImages = {
  messaging: '/message-image.png',
  conversation: '/convo-image.png',
  tracking: '/history-image.png'
}

export default function LandingPage (): JSX.Element {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section
        className="relative w-full flex flex-col items-center justify-center text-white h-[85vh]"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${heroBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            The Future of Customer Engagement
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-gray-300">
            Manage your customer communications across SMS, MMS, and Conversation from one platform.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link
              to="/app/dashboard"
              className="bg-pink-600 text-white font-bold px-10 py-4 rounded-full shadow-lg text-lg hover:bg-pink-700 transition"
            >
              Access App
            </Link>
          </div>
        </div>
      </section>

      {/* Messaging Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <img src={featureImages.messaging} alt="Messaging Feature" className="rounded-lg shadow-lg" />
          <div>
            <h2 className="text-4xl font-bold mb-6">Messaging (SMS/MMS)</h2>
            <p className="text-gray-600 mb-4">
              Engage your audience via SMS and MMS messages with ease. Our platform supports personalized messages,
              multimedia content, and automated workflows to ensure your communication reaches the right people at the right
              time.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Send SMS and MMS messages to your customers</li>
              <li>Support for multimedia attachments (images, videos)</li>
              <li>Create reusable message templates for quick communication</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Conversation Tracking Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">Contacts & Conversation</h2>
            <p className="text-gray-600 mb-4">
              Stay on top of your customer interactions with our conversation tracking feature. Easily manage ongoing
              conversations, view message history, and ensure no message goes unanswered.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Track all incoming and outgoing messages</li>
              <li>View complete message history for each contact</li>
              <li>Organize and manage your contact lists efficiently</li>
            </ul>
          </div>
          <img src={featureImages.conversation} alt="Conversation Tracking" className="rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Message Tracking Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <img src={featureImages.tracking} alt="Message Tracking" className="rounded-lg shadow-lg" />
          <div>
            <h2 className="text-4xl font-bold mb-6">Message Tracking</h2>
            <p className="text-gray-600 mb-4">
              Monitor the status of your messages in real-time. Our message tracking feature provides delivery reports, read
              receipts, and analytics to help you optimize your communication strategy.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Real-time delivery reports</li>
              <li>Read receipts and open tracking</li>
              <li>Send bulk SMS/MMS campaigns and track performance</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Quick Sign-Up CTA */}
      <section className="bg-gradient-to-r from-pink-50 to-orange-50 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Access our platform through Azure Active Directory and start managing your customer communications today.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/app/dashboard"
              className="bg-pink-600 text-white font-bold px-8 py-4 rounded-full shadow-lg text-lg hover:bg-pink-700 transition"
            >
              Access App
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            New to our platform? We are working on enabling user registration soon.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} RelayCom BCS. All rights reserved.</p>
      </footer>
    </div>
  )
}
