// pages/api/analyze.ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const jokeLanguages = ["Shyriiwook, Wookie Language, from Star Wars", "Quenya, Elvish Language from The Lord of the Rings", "Dothraki, from Game of Thrones"];

export async function POST(req: Request) {
  try {
    const { owner, repoName, skills, language, file } = await req.json();
    const isJoking = jokeLanguages.includes(language);
    let fileResponse: Response;
    let readme = "";
    let fileContent = "";

    if (file === "README.md" && !isJoking) {
        // 1. Получаем README
        fileResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/readme`,
        {
            headers: { Accept: "application/vnd.github.v3.raw" },
        }
        );

        if (!fileResponse.ok) {
            return NextResponse.json(
                { error: `Failed to fetch README (${fileResponse.status})` },
                { status: 400 }
            );
        }
        readme = await fileResponse.text();
    } else if (file === "Code" && !isJoking) {
        // 2. Если analyzeWhat === "code", ищем biggest code file
        // a) Получаем default_branch
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
        if (!repoRes.ok) {
        return NextResponse.json({ error: "Repo not found" }, { status: 404 });
        }
        const repoData = await repoRes.json();
        const branch = repoData.default_branch; // e.g. "main"

        // b) Получаем дерево
        const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/git/trees/${branch}?recursive=1`
        );
        const treeData = await treeRes.json();

        // c) Фильтруем
        const codeExtensions = [".js", ".ts", ".py", ".java", ".cs", ".cpp", ".go", ".rb", ".php"];
        function isCodeFile(path: string) {
        return codeExtensions.some(ext => path.toLowerCase().endsWith(ext));
        }

        const blobs = treeData.tree.filter((item: any) => 
            item.type === "blob" && isCodeFile(item.path)
        );

        if (blobs.length === 0) {
            return NextResponse.json({ error: "No code files found" }, { status: 404 });
        }

        // d) Сортируем по size
        blobs.sort((a: any, b: any) => (b.size || 0) - (a.size || 0));
        const biggestFile = blobs[0];

        // e) Получаем содержимое
        const fileUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${biggestFile.path}`;
        const fileRes = await fetch(fileUrl, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        },
        });

        fileContent = await fileRes.text();
        // console.log(fileContent);
    }

    
    let sistemPrompt = "";
    let userPrompt = "";


    if (isJoking) {
        sistemPrompt = `You are funny assistant, you should joke using ${language}, 
                    - Say a funny phrase in this language (no more than 2 sentences).
                    - Provide an **English translation**.
                    - Briefly **explain the language** (its origin, where it is used, and how it sounds).
                `;
        userPrompt = `Just joke on ${language}, or say something funny on ${language}, and explain what is ${language}, 30 words max.`;
    }

    

    if (file === "README.md" && !isJoking) {
        sistemPrompt = `You analyze projects and give feedback to the recruiter, to define if the project is good for the programmer with the following skills: ${skills}.`;
        userPrompt = `Analyze the repository ${repoName}.
                Its README.md file:\n${readme}\nAnalyze the programmer's stack, his experience and skills, which he could have gained in the current project.\n
                Give a short summary (up to 200 words) for the recruiter, in ${language} language, highlighting the strong and weak sides of the programmer, and is it a good match for selected skills.
                `;
    } else if (file === "Code" && !isJoking) {
        sistemPrompt = `You are a code reviewer AI.`;
        userPrompt = `
                Please review the following code snippet. The programmer’s relevant skills are: ${skills}.

                **Goals**:
                1. Guess the purpose or functionality of this file.
                2. Check how the code aligns with the mentioned skills (${skills}).
                3. Evaluate code quality, best practices, potential issues, usage of modern standards, and any red flags (e.g., repeated patterns, code smells).
                4. Mark the positive and negative points.
                5. Evaluate the programmer's level: Trainee, Junior, Middle, or Senior.
                6. Provide a concluding summary.

                **Code**:
                \`\`\`
                ${fileContent.slice(0, 8000)}
                \`\`\`

                **Constraints**:
                - Write the entire response in ${language} language.
                - Keep your final summary under 200 words.

                Thank you.
                `;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: sistemPrompt },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content || "No content";
    return NextResponse.json({ summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
