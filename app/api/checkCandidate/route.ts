import { NextRequest, NextResponse } from "next/server";
import { isCandidateSaved } from "../utils/candidate";

export async function POST(request: NextRequest) {

	const { githubName, userId } = await request.json();

	if (!userId || !githubName) {
		return NextResponse.json({ isSaved: false });
	}

	const isSaved = await isCandidateSaved(githubName, userId);

	return NextResponse.json({ isSaved });
}