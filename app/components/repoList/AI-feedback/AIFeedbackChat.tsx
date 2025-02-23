"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import SkillsSelector from "../../common/SkillsSelector";
import LanguageSelector from "../../common/LanguageSelector";
import FileSelector from "../../common/FileSelector";

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
  const [aiMessage, setAiMessage] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Technical Documentation', 'AI Integration', 'Grammar']);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Russian");
  const [selectedFile, setSelectedFile] = useState<string>("README.md");

  useEffect(() => {
    setAiMessage("AI feedback about project " + (repoName || ""));
    setDone(false);
  }, [repoName, owner, selectedSkills, selectedLanguage, selectedFile]);

  /**
   * Функция, которая:
   * 1) делает запрос к API `/api/analyze` (или другой ваш эндпоинт).
   * 2) получает итоговый текст и "печатает" его с анимацией.
   */
  const handleAskAi = async () => {
    if (!repoName) {
      setAiMessage("No repo selected");
      return;
    }
    setAiMessage("");
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

      // Псевдо-анимация "печатания"
      let i = 0;
      const typingInterval = setInterval(() => {
        setAiMessage((prev) => prev + fullMessage.charAt(i));
        i++;
        // Когда дошли до конца сообщения - останавливаем
        if (i >= fullMessage.length) {
          clearInterval(typingInterval);
          setLoading(false);
          setDone(true);
        }
      }, 30); // скорость печати (мс на символ)

    } catch (error: unknown) {
      console.error(error);
      setAiMessage("Error: " + (error as Error).message);
      setLoading(false);
    }
  };

  return (
    <Box display='flex' flexDirection='column' sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Ask AI feedback about project {repoName}:
        </Typography>

        <Divider sx={{ my: 2 }} />
        
        <SkillsSelector
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            isSmallScreen={isSmallScreen}
            isDisabled={loading}
        />
        <Box display='flex' flexDirection='row' width='100%' gap={2}>
            <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} isDisabled={loading} />
            <FileSelector selectedFile={selectedFile} onFileChange={setSelectedFile} isDisabled={loading} />
            <Button
                variant="contained"
                sx={{ width: '60%', backgroundColor: 'black', fontWeight: 'bold' }}
                disabled={loading || !repoName || done}
                onClick={handleAskAi}
            >
                { done ? "Select another repo" : loading ? "Asking AI..." : "Ask AI"}
            </Button>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Окно, где показываем "напечатанный" ответ */}
        <Box
            sx={{
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                minHeight: 120,
                backgroundColor: "#f9f9f9",
            }}
        >
            <Typography
                component="pre"
                sx={{ whiteSpace: "pre-wrap", fontFamily: "Roboto", fontWeight: 'bold' }}
            >
                {aiMessage || "No AI feedback yet."}
            </Typography>
        </Box>
    </Box>
  );
}
