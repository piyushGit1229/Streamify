import { create } from 'zustand';

export const useWatchPartyStore = create((set, get) => ({
  // Room state
  currentRoom: null,
  participants: [],
  messages: [],

  // Video state
  isPlaying: false,
  currentTime: 0,
  duration: 0,

  // UI state
  isConnected: false,
  isHost: false,

  // Actions
  setCurrentRoom: (room) => set({ currentRoom: room }),

  setParticipants: (participants) => set({ participants }),

  addParticipant: (participant) => set((state) => ({
    participants: [...state.participants, participant]
  })),

  removeParticipant: (participantId) => set((state) => ({
    participants: state.participants.filter(p => p.id !== participantId)
  })),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setVideoState: (videoState) => set(videoState),

  setIsConnected: (connected) => set({ isConnected: connected }),

  setIsHost: (isHost) => set({ isHost }),

  // Reset store
  reset: () => set({
    currentRoom: null,
    participants: [],
    messages: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isConnected: false,
    isHost: false,
  }),
}));
