import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { owner, repoName, filePath } = await req.json();

    // Получаем содержимое файла
    const fileUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}`;
    const fileRes = await fetch(fileUrl, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
      },
    });

    if (!fileRes.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileContent = await fileRes.text();
    const fileType = filePath.split('.').pop()?.toLowerCase() || 'plaintext';

    return NextResponse.json({ 
      content: fileContent,
      type: fileType,
      path: filePath
    });
  } catch (error) {
    console.error('Error fetching file content:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 