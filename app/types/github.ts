import { languageColors } from "../utils";
import { components } from "@octokit/openapi-types";

// types for github api
export type GitHubUser = components["schemas"]["public-user"];

// types for authentication
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
}

export interface initialServerUser {
  initialUser: GitHubUser;
  isMobile: boolean;
}

// Type for a candidate saved in the database
export interface Candidate {
  id: string;
  githubName: string;
  githubUrl: string;
  avatarUrl: string;
  savedAt: string;
  userId: string;
}

export interface UserCardProps {
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
