'use server'
// import { GetServerSideProps } from 'next';
// import RepoListModal from '../components/user-card/modals/RepoListModal';
import { fetchReposApi } from '../api/API';
import RepoListModal from '../components/user-card/modals/RepoListModal';
import { Repository, GitHubUser } from '../types/github';

type SearchParamsObject = { url?: string };

const ReposPage = async ({ searchParams } : {
  searchParams?: SearchParamsObject | Promise<SearchParamsObject>;
}) => {
  // Проверяем, Promise это или нет
  let sParams: SearchParamsObject | undefined;
  if (searchParams && typeof (searchParams as Promise<any>).then === "function") {
    sParams = await (searchParams as Promise<SearchParamsObject>);
  } else {
    sParams = searchParams as SearchParamsObject;
  }

  const reposUrl = sParams?.url;

  if (!reposUrl) {
    return <div>No `url` query param found</div>;
  }
  const reposData: Repository[] | null = await fetchReposApi(reposUrl);
  
  if (!reposData) {
    return <div>Error fetching data</div>;
  }

  const userData: GitHubUser = reposData[0].owner;


  return (
    <RepoListModal repos={reposData} user={userData} />
  );
};

export default ReposPage;