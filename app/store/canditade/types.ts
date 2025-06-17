import { GitHubUser } from "../../types/github";

export interface CandidateState {
    candidate: GitHubUser | null;
    loading: boolean;
    error: string | null;
	isSaved: boolean;
}

export interface CandidateStore extends CandidateState {
    setCandidate: (candidate: GitHubUser | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    fetchCandidate: (username: string) => Promise<void>;
    resetState: () => void;
	checkSaved: (username: string, userId: string) => Promise<void>;
}