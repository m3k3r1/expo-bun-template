import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { ComprehensiveAnalysis } from '@/services/fit-file-parser'

// Types
export interface Ride {
  id: string
  name: string
  fileName: string
  fileSize: number
  uploadDate: string
  fileUri?: string
  analysis?: ComprehensiveAnalysis
}

interface RidesState {
  rides: Ride[]
  loading: boolean
  error: string | null
}

// Actions
type RidesAction =
  | { type: 'ADD_RIDE'; payload: Ride }
  | { type: 'UPDATE_RIDE'; payload: { id: string; updates: Partial<Ride> } }
  | { type: 'DELETE_RIDE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_RIDES' }

// Initial state
const initialState: RidesState = {
  rides: [],
  loading: false,
  error: null,
}

// Reducer
function ridesReducer(state: RidesState, action: RidesAction): RidesState {
  switch (action.type) {
    case 'ADD_RIDE':
      return {
        ...state,
        rides: [action.payload, ...state.rides],
        error: null,
      }
    case 'UPDATE_RIDE':
      return {
        ...state,
        rides: state.rides.map((ride) =>
          ride.id === action.payload.id
            ? { ...ride, ...action.payload.updates }
            : ride,
        ),
        error: null,
      }
    case 'DELETE_RIDE':
      return {
        ...state,
        rides: state.rides.filter((ride) => ride.id !== action.payload),
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case 'CLEAR_RIDES':
      return initialState
    default:
      return state
  }
}

// Context
interface RidesContextType {
  state: RidesState
  addRide: (ride: Omit<Ride, 'id'>) => void
  updateRide: (id: string, updates: Partial<Ride>) => void
  deleteRide: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearRides: () => void
}

const RidesContext = createContext<RidesContextType | undefined>(undefined)

// Provider
interface RidesProviderProps {
  children: ReactNode
}

export function RidesProvider({ children }: RidesProviderProps) {
  const [state, dispatch] = useReducer(ridesReducer, initialState)

  const addRide = (ride: Omit<Ride, 'id'>) => {
    const newRide: Ride = {
      ...ride,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
    }
    dispatch({ type: 'ADD_RIDE', payload: newRide })
  }

  const updateRide = (id: string, updates: Partial<Ride>) => {
    dispatch({ type: 'UPDATE_RIDE', payload: { id, updates } })
  }

  const deleteRide = (id: string) => {
    dispatch({ type: 'DELETE_RIDE', payload: id })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const clearRides = () => {
    dispatch({ type: 'CLEAR_RIDES' })
  }

  const value: RidesContextType = {
    state,
    addRide,
    updateRide,
    deleteRide,
    setLoading,
    setError,
    clearRides,
  }

  return <RidesContext.Provider value={value}>{children}</RidesContext.Provider>
}

// Hook
export function useRides() {
  const context = useContext(RidesContext)
  if (context === undefined) {
    throw new Error('useRides must be used within a RidesProvider')
  }
  return context
}
