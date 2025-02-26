"use client";

import React, { useMemo, useEffect, useState } from "react";
import { CostInfo } from "@/app/types/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, tomorrow, coy } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Box, Typography, Dialog, DialogTitle, DialogContent, Button, ToggleButtonGroup, ToggleButton, Divider } from "@mui/material";
import AIChatPanel from "./AI-chat-panel/AIChatPanel";

import { mapFileTypeToSyntaxHighlighter } from "@/app/utils";
import PromptSettings from "./Prompt-Settings/PromptSettings";
import CloseIcon from "@mui/icons-material/Close";
import TextInfo from "../../common/TextInfo";
import CostInfoModal from "./modals/CostInfoModal";
import FilePreviewModal from "./modals/FilePreviewModal";
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
  const [costInfo, setCostInfo] = useState<CostInfo | null>(null);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Code Duplication', 'AI Integration', 'Grammar']);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Russian");
  const [selectedFile, setSelectedFile] = useState<string>("Code");
  const [isCostInfoDialogOpen, setIsCostInfoDialogOpen] = useState(false);

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
      const { fileContent, fileType, costInfo } = data;
      setFileContent(fileContent);
      setFileType(fileType);
      setCostInfo({...costInfo});

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
        <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: isSmallScreen ? 18 : 24 }}>
            Ask AI feedback about project
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
            isSmallScreen={isSmallScreen}
            setOpenFileDialog={() => setOpenFileDialog(true)}
            handleAskAi={(callback: React.Dispatch<React.SetStateAction<string>>) => handleAskAi(callback)}
            setOpenCostInfoDialog={() => setIsCostInfoDialogOpen(true)}
        />

        {/* Analyzed file content MODAL */}
        <FilePreviewModal isOpen={openFileDialog} setClose={() => setOpenFileDialog(false)} fileType={fileType} fileContent={fileContent} />

        {/* Cost Info MODAL */}
        <CostInfoModal isOpen={isCostInfoDialogOpen} setClose={() => setIsCostInfoDialogOpen(false)} costInfo={costInfo} isSmallScreen={isSmallScreen} />
    </Box>
  );
}
