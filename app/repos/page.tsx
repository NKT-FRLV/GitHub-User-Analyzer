'use server'

// import { fetchReposApi } from '../api/API';
import RepoListModal from './components/outer/RepoListModal';
// import { Repository, GitHubUser } from '../types/github';

type SearchParamsObject = { url?: string };

const ReposPage = async ({ searchParams } : {
  searchParams: Promise<SearchParamsObject>
}) => {

  const { url: reposUrl }: SearchParamsObject = await searchParams

  console.log('reposUrl', reposUrl)

  if (!reposUrl) {
    return <div>No url query param found</div>;
  }

  // const reposData: Repository[] | null = await fetchReposApi(reposUrl);
  
  // if (!reposData) {
  //   return <div>Error fetching data</div>;
  // }

  // const userData: GitHubUser = reposData[0].owner;


  return (
    <RepoListModal url={reposUrl} />
  );
};

export default ReposPage;