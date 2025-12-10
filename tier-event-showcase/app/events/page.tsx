import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase'

async function getEvents(userTier: string) {
  const supabase = createClient()
  
  const tierLevels = {
    'free': 0,
    'silver': 1, 
    'gold': 2,
    'platinum': 3
  }
  
  const userLevel = tierLevels[userTier as keyof typeof tierLevels]
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .lte('tier_level', userLevel)
    .order('event_date', { ascending: true })
  
  return events || []
}

export default async function EventsPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  const userTier = user.publicMetadata?.tier as string || 'free'
  const events = await getEvents(userTier)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Events</h1>
          <p className="text-gray-600 mt-2">
            Current tier: <span className="font-semibold capitalize">{userTier}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={event.image_url || '/placeholder-event.jpg'} 
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.tier === 'free' ? 'bg-gray-100 text-gray-800' :
                    event.tier === 'silver' ? 'bg-blue-100 text-blue-800' :
                    event.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.tier}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.event_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
