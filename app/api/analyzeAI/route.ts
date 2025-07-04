// pages/api/analyze.ts
import OpenAI from 'openai';
import fs from 'fs';
import { NextResponse } from 'next/server';
import { calculateCost } from './aiCostCalculator';
import { clearOldAudioFiles, jokeLanguages } from './utils';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    
    const { owner, repoName, skills, language, file, isSpeechAllowed, selectedFilePath, selectedFileContent } = await req.json();
    const isJoking = jokeLanguages.includes(language);
    let fileResponse: Response;
    let readme = "";
    let fileContent = "";
    let fileType = "plaintext";

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
        fileType = "markdown";
    } else if (file === "SelectedFile" && !isJoking) {
        // 2. Если analyzeWhat === "SelectedFile", используем переданный файл
        fileContent = selectedFileContent;
        fileType = selectedFilePath?.split('.').pop() || "plaintext";
    } else if (file === "Code" && !isJoking) {
        // 3. Если analyzeWhat === "code", ищем biggest code file
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
        const codeExtensions = [".js", ".ts", ".py", ".java", ".cs", ".cpp", ".go", ".rb", ".php", ".css"];
        function isCodeFile(path: string) {
          return codeExtensions.some(ext => path.toLowerCase().endsWith(ext));
        }

        const blobs = treeData.tree.filter((item: { type: string; path: string }) => 
            item.type === "blob" && isCodeFile(item.path)
        );

        if (blobs.length === 0) {
            return NextResponse.json({ error: "No code files found" }, { status: 404 });
        }

        // d) Сортируем по size
        blobs.sort((a: { size: number }, b: { size: number }) => (b.size || 0) - (a.size || 0));
        const biggestFile = blobs[0];
        fileType = biggestFile.path.split('.').pop() || "plaintext"; // Достаем расширение файла
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

    
    let systemPrompt = "";
    let userPrompt = "";


    if (isJoking) {
        systemPrompt = `You are funny assistant, you should joke using ${language}, 
                    - Say a funny phrase in this language (no more than 2 sentences).
                    - Provide an **English translation**.
                    - Briefly **explain the language** (its origin, where it is used, and how it sounds).
                `;
        userPrompt = `Just joke on ${language}, or say something funny on ${language}, and explain what is ${language}, 30 words max.`;
    }

    

    if (file === "README.md" && !isJoking) {
        systemPrompt = `You analyze projects and give feedback to the recruiter, to define if the project is good for the programmer with the following skills: ${skills}.`;
        userPrompt = `Analyze the repository ${repoName}.
                Its README.md file:\n${readme}\nAnalyze the programmer's stack, his experience and skills, which he could have gained in the current project.\n
                Give a short summary (up to 200 words) for the recruiter, in ${language} language, highlighting the strong and weak sides of the programmer, and is it a good match for selected skills.
                `;
    } else if ((file === "Code" || file === "SelectedFile") && !isJoking) {
        systemPrompt = `You are a code reviewer AI, you should review the code and give feedback to the recruiter, make a smoll resume of the programmer's skills and code base quality.`;
        userPrompt = `
                Please review the following code snippet from file ${selectedFilePath || 'auto-selected file'}. Recrutier looks for the following skills: ${skills}.

                **Goals**:
                1. Describe the purpose or functionality of this file.
                2. Check how the code aligns with the mentioned skills (${skills}).
                3. Evaluate code quality, best practices, potential issues, usage of modern standards, and any red flags (e.g., repeated patterns, code smells).
                4. Mark the positive and negative points of the code.
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
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });
    // Считаем стоимость запроса
    const costInfo = calculateCost(completion);

    const summary = completion.choices[0]?.message?.content || "No content";

    // 1. Инициализируем переменную для аудиофайла
    let audioUrl = null;
    if (isSpeechAllowed) {
      // 1. Удаляем все старые аудиофайлы
      clearOldAudioFiles();
      // 2. Генерация аудио из текста (TTS)
      const speechResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: summary,
      });
      
      // 3. Сохранение аудиофайла
      audioUrl = `/speech_${Date.now()}.mp3`;
      const audioFilePath = path.join(process.cwd(), "public", audioUrl);
      const buffer = Buffer.from(await speechResponse.arrayBuffer());
      await fs.promises.writeFile(audioFilePath, buffer);
    }
    
    return NextResponse.json({
      summary,
      fileContent: fileContent || readme || "No content",
      fileType,
      costInfo,
      audioUrl: audioUrl
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
