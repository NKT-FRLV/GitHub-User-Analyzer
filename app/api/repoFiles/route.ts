import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { owner, repoName } = await req.json();

    // Получаем информацию о репозитории для получения default branch
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
    if (!repoRes.ok) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }
    const repoData = await repoRes.json();
    const branch = repoData.default_branch;

    // Получаем дерево файлов рекурсивно
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/${branch}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        },
      }
    );

    if (!treeRes.ok) {
      return NextResponse.json({ error: "Failed to fetch repository tree" }, { status: 400 });
    }

    const treeData = await treeRes.json();

    // Фильтруем только интересные файлы для анализа
    const allowedExtensions = [
      '.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.cs', '.cpp', '.c', '.h',
      '.go', '.rb', '.php', '.css', '.scss', '.html', '.vue', '.swift', '.kt',
      '.rs', '.dart', '.scala', '.r', '.m', '.sql', '.sh', '.ps1', '.md'
    ];

    const excludePatterns = [
      'node_modules', '.git', 'dist', 'build', '.next', 'coverage',
      'package-lock.json', 'yarn.lock', '.env', '.gitignore'
    ];

    const shouldIncludeFile = (path: string) => {
      // Исключаем файлы по паттернам
      if (excludePatterns.some(pattern => path.includes(pattern))) {
        return false;
      }
      
      // Включаем файлы с нужными расширениями
      return allowedExtensions.some(ext => path.toLowerCase().endsWith(ext));
    };

    const files = treeData.tree
      .filter((item: any) => 
        item.type === "blob" && 
        shouldIncludeFile(item.path) &&
        item.size && item.size < 100000 // Ограничиваем размер файла до 100KB
      )
      .map((item: any) => ({
        path: item.path,
        size: item.size,
        url: item.url,
        type: item.path.split('.').pop()?.toLowerCase() || 'unknown'
      }))
      .sort((a: any, b: any) => {
        // Сортируем: README сначала, потом по размеру
        if (a.path.toLowerCase().includes('readme')) return -1;
        if (b.path.toLowerCase().includes('readme')) return 1;
        return b.size - a.size;
      });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching repository files:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 