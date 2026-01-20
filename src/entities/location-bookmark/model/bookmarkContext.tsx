import { createContext, useContext, useState, type ReactNode } from 'react'

import type { Weather } from '@/shared/types'

interface LocationBookmark {
  district: string
  weather: Weather | null
  title?: string
}

interface BookmarkContextType {
  locationBookmarkList: LocationBookmark[]
  setLocationBookmarkList: (list: LocationBookmark[]) => void
  locationBookmarkListWithWeather: LocationBookmark[]
  setLocationBookmarkListWithWeather: (list: LocationBookmark[]) => void
  titleInput: string
  setTitleInput: (input: string) => void
  titleOrigin: string
  setTitleOrigin: (origin: string) => void
  titleChanged: boolean
  setTitleChanged: (changed: boolean) => void
  titleSaved: boolean
  setTitleSaved: (saved: boolean) => void
  isBookmarked: boolean
  setIsBookmarked: (bookmarked: boolean) => void
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [locationBookmarkList, setLocationBookmarkList] = useState<LocationBookmark[]>([])
  const [locationBookmarkListWithWeather, setLocationBookmarkListWithWeather] = useState<LocationBookmark[]>([])
  const [titleInput, setTitleInput] = useState('')
  const [titleOrigin, setTitleOrigin] = useState('')
  const [titleChanged, setTitleChanged] = useState(false)
  const [titleSaved, setTitleSaved] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <BookmarkContext.Provider value={{ locationBookmarkList, setLocationBookmarkList, locationBookmarkListWithWeather, setLocationBookmarkListWithWeather, titleInput, setTitleInput, titleOrigin, setTitleOrigin, titleChanged, setTitleChanged, titleSaved, setTitleSaved, isBookmarked, setIsBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarkContext() {
  const context = useContext(BookmarkContext)
  if (context === undefined) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider')
  }
  return context
}

