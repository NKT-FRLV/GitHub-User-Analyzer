import { create } from 'zustand'
import { RepoStore, RepoState } from './types'


const initialState: RepoState = {
  repos: [],
  filteredRepos: [],
  selectedRepo: null,
  expandedRepoId: null,
  languages: null,
  loadingLangs: false,
  loading: true,
  error: null,
  selectedPage: 'list',
  selectedLanguage: 'All Langs'
}

export const useRepoStore = create<RepoStore>((set, get) => ({
  ...initialState,

  setFilteredRepos: (repos) => set({ filteredRepos: repos }),
  setSelectedRepo: (repo) => set({ selectedRepo: repo }),
  setExpandedRepoId: (id) => set({ expandedRepoId: id }),
  setLanguages: (langs) => set({ languages: langs }),
  setLoadingLangs: (loading) => set({ loadingLangs: loading }),
  setError: (error) => set({ error: error }),
  setSelectedPage: (page) => set({ selectedPage: page }),
  setSelectedLanguage: (lang) => set({ selectedLanguage: lang }),

  filterByLanguage: (language) => {
    const { repos } = get()
    if (language === "All Langs") {
      set({ filteredRepos: [], selectedLanguage: language })
      return
    }
    const filtered = repos.filter((repo) => repo.language === language)
    set({ filteredRepos: filtered, selectedLanguage: language })
  },

  sortByRecentCommit: () => {
    const { filteredRepos, repos } = get()
    const reposToFilter = filteredRepos.length > 0 ? filteredRepos : repos
    const sorted = [...reposToFilter].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    set({ filteredRepos: sorted })
  },

  sortByDevelopmentTime: () => {
    const { filteredRepos, repos } = get()
    const reposToFilter = filteredRepos.length > 0 ? filteredRepos : repos
    const sorted = [...reposToFilter].sort((a, b) => {
      const aTime = new Date(a.updated_at).getTime() - new Date(a.created_at).getTime()
      const bTime = new Date(b.updated_at).getTime() - new Date(b.created_at).getTime()
      return bTime - aTime
    })
    set({ filteredRepos: sorted })
  },

  setLoading: (loading) => set({ loading }),
})) 