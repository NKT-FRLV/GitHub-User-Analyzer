import { create } from 'zustand'
import { CandidateStore, CandidateState } from './types'
import { getCandidateData } from '@/app/api/API';

const initialState: CandidateState = {
    candidate: null,
    loading: false,
    error: null,
}

export const useCandidateStore = create<CandidateStore>((set) => ({
    ...initialState,
    setCandidate: (candidate) => set({ candidate }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    
    fetchCandidate: async (username) => {
        if (!username.trim()) {
            set({ error: "Username is required" });
            return;
        }
      set({ loading: true, error: null });
      try {
        const userData = await getCandidateData(username);
        if (!userData) {
          set({ error: "Candidate not found"});
        } else {
          set({ candidate: userData });
        }
      } catch (error) {
        set({ error: "Error loading candidate" });
      } finally {
        set({ loading: false });
      }
    },
    
    resetState: () => set(initialState),
}))
