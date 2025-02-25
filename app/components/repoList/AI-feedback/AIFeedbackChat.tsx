"use client";

import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, tomorrow, coy } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Box, Typography, Dialog, DialogTitle, DialogContent, IconButton, Button } from "@mui/material";
import AIChatPanel from "./AI-chat-panel/AIChatPanel";

import { mapFileTypeToSyntaxHighlighter } from "@/app/utils";
import PromptSettings from "./Prompt-Settings/PromptSettings";
import FileOpenIcon from '@mui/icons-material/FileOpen';
/**
 * Пример компонента: Chat-окно,
 * где при нажатии на кнопку запрашивается AI и
 * отображается ответ "постепенно".
 */

interface AiFeedbackChatProps {
  owner: string;
  repoName: string | null;
  isSmallScreen: boolean;
}


export default function AiFeedbackChat({ owner, repoName, isSmallScreen }: AiFeedbackChatProps) {
  // const [aiMessage, setAiMessage] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileType, setFileType] = useState("plaintext");
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Code Duplication', 'AI Integration', 'Grammar']);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Russian");
  const [selectedFile, setSelectedFile] = useState<string>("Code");
  const [fileStyle, setFileStyle] = useState<any>(dracula);

  useEffect(() => {
    // setAiMessage("AI feedback about project " + (repoName || ""));
    setFileContent("");
    setDone(false);
  }, [repoName, owner, selectedSkills, selectedLanguage, selectedFile]);

  /**
   * Функция, которая:
   * 1) делает запрос к API `/api/analyze` (или другой ваш эндпоинт).
   * 2) получает итоговый текст и "печатает" его с анимацией.
   */
  const handleAskAi = async (callback: React.Dispatch<React.SetStateAction<string>>) => {
    if (!repoName) {
      callback("No repo selected");
      return;
    }
    callback("");
    setLoading(true);

    try {
        // Запрос с Клиента на Серверный Роут /api/analyzeAI, 
        // который обращается к API OpenAI
      const response = await fetch("/api/analyzeAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repoName,
          skills: selectedSkills,
          language: selectedLanguage,
          file: selectedFile,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      const fullMessage = data.summary || "No AI response...";
      // Получаем содержимое файла
      const fileContent = data.fileContent;
      const fileType = data.fileType;
      setFileContent(fileContent);
      setFileType(fileType);

      // Псевдо-анимация "печатания"
      let i = 0;
      const typingInterval = setInterval(() => {
        callback((prev) => prev + fullMessage.charAt(i));
        i++;
        // Когда дошли до конца сообщения - останавливаем
        if (i >= fullMessage.length) {
          clearInterval(typingInterval);
        }
      }, 30); // скорость печати (мс на символ)

    } catch (error: unknown) {
      console.error(error);
      callback("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
      setDone(true);
    }
  };

  return (
    <Box display='flex' flexDirection='column' sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
            Ask AI feedback about project {repoName}:
        </Typography>

        {/* Prompt Settings */}
        <PromptSettings
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            isSmallScreen={isSmallScreen}
            loading={loading}
          />

        {/* AI Chat Panel */}
        <AIChatPanel
            fileContent={fileContent}
            loading={loading}
            done={done}
            repoName={repoName}
            setOpenFileDialog={() => setOpenFileDialog(true)}
            handleAskAi={(callback: React.Dispatch<React.SetStateAction<string>>) => handleAskAi(callback)}
        />

        {/* Analyzed file content */}
        <Dialog
          open={openFileDialog}
          onClose={() => setOpenFileDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Typography sx={{ fontWeight: "bold" }}>
              Analyzed file content ( .{fileType} )
            </Typography>
            <Box display='flex' flexDirection='row' alignItems='center' gap={2}>
              <Typography sx={{ fontWeight: "bold" }}>
                Choose file style
              </Typography>
              <Box display='flex' flexDirection='row' gap={2}>
                <Button
                  onClick={() => setFileStyle(dracula)}
                >
                  Dracula
                </Button>
                <Button
                  onClick={() => setFileStyle(tomorrow)}
                >
                  Tomorrow
                </Button>
                <Button
                  onClick={() => setFileStyle(coy)}
                >
                  coy ( default light )
                </Button>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ maxHeight: "80vh", overflow: "auto" }}>
          <SyntaxHighlighter
            language={mapFileTypeToSyntaxHighlighter(fileType)}
            style={fileStyle}
            showLineNumbers
            wrapLongLines
          >
            {fileContent}
          </SyntaxHighlighter>
          </DialogContent>
        </Dialog>
    </Box>
  );
}
