// cafe-website/proxy.js (or wherever your proxy file is located)
import { NextResponse } from 'next/server'

export function proxy(request) {
  const { pathname } = request.nextUrl
  
  console.log('🔐 Proxy checking access to:', pathname)
  
  // Allow public pages and API endpoints
  const publicPaths = [
    '/admin',                     // Login page
    '/admin/login',              // Login page alternative
    '/api/admin/login',          // Login API
    '/api/admin/logout',         // Logout API
    '/api/admin/verify',         // Verify API (might need auth, handled by API)
    '/_next',                    // Next.js static files
    '/favicon.ico',              // Favicon
    '/public',                   // Public assets
  ]
  
  // Check if path is public
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path))
  
  if (isPublicPath) {
    console.log('✅ Allowing public access to:', pathname)
    return NextResponse.next()
  }
  
  // Check for admin paths (excluding public ones)
  if (pathname.startsWith('/admin')) {
    console.log('🛡️ Checking admin access for:', pathname)
    
    // Get token from cookies
    const token = request.cookies.get('adminToken')?.value
    const authFlag = request.cookies.get('adminAuth')?.value
    
    console.log('🍪 adminToken cookie exists:', !!token)
    console.log('🍪 adminAuth cookie value:', authFlag)
    console.log('🍪 All cookies:', Array.from(request.cookies.getAll()).map(c => c.name))
    
    // Check if user is authenticated
    if (!token || authFlag !== 'true') {
      console.log('❌ No valid auth cookies, redirecting to login')
      
      // Create redirect response
      const loginUrl = new URL('/admin', request.url)
      
      // Add redirect message
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'no_auth')
      
      return NextResponse.redirect(loginUrl)
    }
    
    // Optional: Add JWT verification here for extra security
    // For now, just having the token is enough
    
    console.log('✅ Admin authenticated, allowing access to:', pathname)
    return NextResponse.next()
  }
  
  // Allow all non-admin paths
  console.log('➡️ Allowing non-admin path:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all admin paths
    '/admin/:path*',
    // Also match API endpoints that need protection
    '/api/admin/:path*'
  ]
}