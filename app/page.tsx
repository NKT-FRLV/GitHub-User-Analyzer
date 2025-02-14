import { Octokit } from "@octokit/rest";
import Home from "./Home"; // Подключаем клиентский компонент
import { GitHubUser } from "./types/github";

// SERVER MI-VIEJO-AMIGO USER DATA 
// СЕРВЕРНЫЙ КОМПОНЕНТ

const octokit = new Octokit();

async function getUserData(username: string): Promise<GitHubUser | null> {
  try {
    
    const response = await octokit.request("GET /users/{username}", {
      username,
    });

    return {
      id: response.data.id,
      login: response.data.login,
      name: response.data.name || "no name",
      avatar_url: response.data.avatar_url,
      public_repos: response.data.public_repos,
      bio: response.data.bio,
      followers: response.data.followers,
      following: response.data.following,
      repos_url: response.data.repos_url,
    };
  } catch (error) {
    console.error("Ошибка запроса к GitHub API:", error);
    return null;
  }
}

export default async function Page() {
  const user = await getUserData("mi-viejo-amigo");

  return <Home initialUser={user} />;
}