// store/candidateStore.ts
import { create } from 'zustand';

interface AnimationState {
  isAnimating: boolean;
  triggerAnimation: () => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  isAnimating: false,
  triggerAnimation: () => {
    set({ isAnimating: true });
    setTimeout(() => set({ isAnimating: false }), 2000);
  },
}));
