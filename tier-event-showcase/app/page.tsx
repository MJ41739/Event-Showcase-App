import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'

export default async function HomePage() {
  const user = await currentUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to EventHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover exclusive events based on your membership tier
          </p>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-lg">
                Welcome back, {user.firstName}!
              </p>
              <Link 
                href="/events"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                View Your Events
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                href="/sign-in"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up"
                className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
