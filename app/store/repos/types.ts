import { Repository, LanguagesObject } from '../../types/github'
export type SelectedPage = 'ai' | 'list'

export interface RepoState {
  repos: Repository[]
  reposUrl: string
  filteredRepos: Repository[]
  selectedRepo: Repository | null
  expandedRepoId: number | null
  languages: LanguagesObject | null
  loadingLangs: boolean
  loading: boolean
  error: string | null
  selectedPage: SelectedPage
  selectedLanguage: string
}

export interface RepoActions {
  setReposUrl: (url: string) => void
  setFilteredRepos: (repos: Repository[]) => void
  setSelectedRepo: (repo: Repository | null) => void
  setExpandedRepoId: (id: number | null) => void
  setLanguages: (langs: LanguagesObject | null) => void
  setLoadingLangs: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedPage: (page: SelectedPage) => void
  setSelectedLanguage: (lang: string) => void
  
  // Filter actions
  filterByLanguage: (language: string) => void
  sortByRecentCommit: () => void
  sortByDevelopmentTime: () => void
  setLoading: (loading: boolean) => void

  // Fetch actions
  fetchRepos: (url: string) => void

}

export type RepoStore = RepoState & RepoActions 