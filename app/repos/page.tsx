'use server'
// import { GetServerSideProps } from 'next';
// import RepoListModal from '../components/user-card/modals/RepoListModal';
import { fetchReposApi } from '../api/API';
import RepoListModal from '../components/user-card/modals/RepoListModal';
import { Repository, GitHubUser } from '../types/github';

const ReposPage = async (props: {
  searchParams: { url: string };
}) => {
  
  const reposUrl = props?.searchParams?.url;
  // const reposUrl = (await sParams)?.url;

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