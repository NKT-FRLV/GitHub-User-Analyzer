import { Octokit } from "@octokit/rest";
import { GitHubUser, Repository, LanguagesObject } from "../types/github";

const isClient = typeof window !== 'undefined';

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

/**
 * Получает данные пользователя GitHub
 * @param username - GitHub username
 * @returns GitHubUser или null в случае ошибки
 */
export const getCandidateData = async (username: string): Promise<GitHubUser | null> => {
  try {
    const response = await octokit.request("GET /users/{username}", { username });
    if (response.status !== 200) {
      console.error(`GitHub API Error: ${response.status}`);
      return null;
    }

    return response.data as GitHubUser;
  } catch (error) {
    if (error instanceof Error) {
      console.error("GitHub API request error:", error.message);

      // Проверяем на лимит API
      if (error.message.includes("403")) {
        console.warn("API Rate Limit exceeded");
        return null;
      }
    }

    return null;
  }
};

export const fetchReposApi = async (url: string): Promise<Repository[] | null> => {
  try {
    // Если мы на клиенте, используем публичный токен
    const token = isClient ? process.env.NEXT_PUBLIC_GITHUB_API_TOKEN : process.env.GITHUB_API_TOKEN;
    
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "MyGitHubApp"
      }
    });
    if (!response.ok) {
      console.error(`Error fetching repositories: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: Repository[] = await response.json();
    return data;
  } catch (error) {
    console.error("Network or server error when fetching GitHub API:", error);
    return null;
  }
};

export const fetchLanguagesApi = async (url: string): Promise<LanguagesObject | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching languages: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: LanguagesObject = await response.json();
    return data;
  } catch (error) {
    console.error("Network or server error when fetching GitHub API:", error);
    return null;
  }
};
