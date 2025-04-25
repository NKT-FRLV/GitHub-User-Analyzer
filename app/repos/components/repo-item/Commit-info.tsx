import TextInfo from '@/app/components/common/TextInfo'
import { useEffect, useState, useCallback } from 'react'

interface CommitInfoProps {
    repoUrl: string;
    expanded: boolean;
    isSmallScreen: boolean;
}

const CommitInfo = ({ repoUrl, expanded, isSmallScreen }: CommitInfoProps) => {

    const [commitCount, setCommitCount] = useState<number | null>(null);

    const fetchCommitCount = useCallback(async () => {
        try {
          const response = await fetch(`${repoUrl}/commits?per_page=1`);
          const link = response.headers.get("link");
          if (link) {
            const match = link.match(/page=(\d+)>; rel="last"/);
            if (match) {
              setCommitCount(parseInt(match[1]));
            }
          }
        } catch (error) {
          console.error("Error fetching commit count:", error);
        }
      }, [repoUrl]);
    
      useEffect(() => {
        const fetchData = async () => {
          if (expanded && !commitCount) {
            await fetchCommitCount();
          }
        };
    
        fetchData();
    
      }, [expanded, fetchCommitCount, commitCount]);

  return (
    <TextInfo
        text="Total commits"
        value={commitCount || "Loading..."}
        isSmallScreen={isSmallScreen}
        fsMax="1rem"
        fsMin="0.8rem"
    />
  )
}

export default CommitInfo