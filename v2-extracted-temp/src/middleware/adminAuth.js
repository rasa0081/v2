// cafe-website/src/middleware/adminAuth.js
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Check expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return false
    }
    
    return decoded.role === 'admin'
  } catch (error) {
    console.error('Token verification error:', error.message)
    return false
  }
}

export function requireAdminAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                 req.cookies?.adminToken
    
    if (!token || !verifyAdminToken(token)) {
      return res.status(401).json({ 
        success: false, 
        error: 'دسترسی غیرمجاز. لطفا مجددا وارد شوید.' 
      })
    }
    
    return handler(req, res)
  }
}