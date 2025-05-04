// store/candidateStore.ts
import { GitHubUser } from '@/app/types/github';
import { Candidate } from '@prisma/client';
import { create } from 'zustand';

type PartialGitHubUser = Partial<GitHubUser>;
type ModalPerson = PartialGitHubUser | GitHubUser | Candidate;

interface ModalsOpenState {
  isAvatarOpen: boolean;
  person: ModalPerson | null;
  isAnaliticsOpen: boolean;
  handleAvatarOpen: (person: ModalPerson) => void;
  handleAvatarClose: () => void;
  handleAnaliticsOpen: () => void;
  handleAnaliticsClose: () => void;
}

export const useModalsOpenStore = create<ModalsOpenState>((set) => ({
  isAvatarOpen: false,
  isAnaliticsOpen: false,
  person: null,
  handleAvatarOpen: (person: ModalPerson) => {
    set({ isAvatarOpen: true, person });
  },
  handleAvatarClose: () => {
    set({ isAvatarOpen: false, person: null });
  },
  handleAnaliticsOpen: () => {
    set({ isAnaliticsOpen: true });
  },
  handleAnaliticsClose: () => {
    set({ isAnaliticsOpen: false });
  },
}));
