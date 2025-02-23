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
export const getUserData = async (username: string): Promise<GitHubUser | null> => {
  try {
    const response = await octokit.request("GET /users/{username}", { username });
    if (response.status !== 200) {
      console.error(`GitHub API Error: ${response.status}`);
      return null;
    }

    return response.data as GitHubUser;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка запроса к GitHub API:", error.message);

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
      console.error(`Ошибка при получении репозиториев: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: Repository[] = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка сети или сервера при запросе к GitHub API:", error);
    return null;
  }
};

export const fetchLanguagesApi = async (url: string): Promise<LanguagesObject | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Ошибка при получении языков: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: LanguagesObject = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка сети или сервера при запросе к GitHub API:", error);
    return null;
  }
};

export const analyzeRepoWithAI = async (
  owner: string,
  repoName: string,
  skills: string[]
): Promise<string | null> => {
  try {
    const response = await fetch('/api/analyzeAI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner, repoName, skills }),
    });

    if (!response.ok) {
      console.error('Ошибка при анализе репозитория:', response.status);
      return null;
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Ошибка при запросе к API анализа:', error);
    return null;
  }
};
