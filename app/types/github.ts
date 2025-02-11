import { languageColors } from "../utils";

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  bio: string | null;
  followers: number;
  following: number;
  repos_url: string;
}

export interface UserSearchProps {
  user: GitHubUser | null;
  error: string;
}

export interface Repository {
  id: number;
  name: string;
  url: string;
  html_url: string;
  description?: string;
  languages_url: string;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  language?: string;
  forks_count: number;
  pushed_at: string;
  owner: GitHubUser;
  open_issues_count: number;
  size: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  default_branch: string;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  };
  forks: number;
  open_issues: number;
  watchers: number;
  subscribers_count: number;
  network_count: number;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
}

export type LanguagesObject = Record<keyof typeof languageColors, number>;
