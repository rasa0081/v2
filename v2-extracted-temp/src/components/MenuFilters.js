'use client'

import { Box, Chip, Stack } from '@mui/material'
import { useState } from 'react'

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'popular', label: 'Popular' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'food', label: 'Food' },
  { id: 'pastries', label: 'Pastries' },
]

export function MenuFilters({ onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId)
    onFilterChange?.(filterId)
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {filterOptions.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.label}
            clickable
            onClick={() => handleFilterClick(filter.id)}
            color={activeFilter === filter.id ? 'primary' : 'default'}
            sx={{
              backgroundColor: activeFilter === filter.id ? '#795548' : 'transparent',
              color: activeFilter === filter.id ? 'white' : 'text.primary',
              border: activeFilter === filter.id ? 'none' : '1px solid #ddd',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: activeFilter === filter.id ? '#5d4037' : 'rgba(121, 85, 72, 0.1)',
              }
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}