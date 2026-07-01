// cafe-website/src/components/ThemeRegistry.js
'use client'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import rtlPlugin from 'stylis-plugin-rtl'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import theme from '@/lib/theme' // Import your theme file

// Create RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

// This MUST be a function component
const ThemeRegistry = ({ children }) => {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div dir="rtl">
          {children}
        </div>
      </ThemeProvider>
    </CacheProvider>
  )
}

// This MUST be a default export
export default ThemeRegistry