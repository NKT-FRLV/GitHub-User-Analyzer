"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import { CostInfo } from "@/app/types/types";

import { Box, Typography, Button} from "@mui/material";
import AIChatPanel from "./AI-chat-panel/AIChatPanel";

import PromptSettings from "./Prompt-Settings/PromptSettings";
import CostInfoModal from "./modals/CostInfoModal";
import FilePreviewModal from "./modals/FilePreviewModal";
import FileSelectionModal from "./modals/FileSelectionModal";
import { useRepoStore } from "@/app/store/repos/store";
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

const AIFeedbackChat = ({ owner, repoName, isSmallScreen }: AiFeedbackChatProps) => {
  const [fileContent, setFileContent] = useState("");
  const [fileType, setFileType] = useState("plaintext");
  const [costInfo, setCostInfo] = useState<CostInfo | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Code Duplication', 'AI Integration', 'Grammar']);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Russian");
  const [selectedFile, setSelectedFile] = useState<string>("Code");
  const [isSpeechAllowed, setIsSpeechAllowed] = useState<boolean>(false);
  const [isCostInfoDialogOpen, setIsCostInfoDialogOpen] = useState(false);

  // Стор для работы с выбранным файлом
  const selectedFileFromStore = useRepoStore(state => state.selectedFile);
  const isFileSelectionModalOpen = useRepoStore(state => state.isFileSelectionModalOpen);
  const setFileSelectionModalOpen = useRepoStore(state => state.setFileSelectionModalOpen);
  const setSelectedFileInStore = useRepoStore(state => state.setSelectedFile);

  console.log("AIFeedbackChat rendered");

  useEffect(() => {
    setFileContent("");
    setDone(false);
  }, [repoName, owner, selectedSkills, selectedLanguage, selectedFile]);



  // Обработчик выбора файла из модалки
  const handleFileSelection = useCallback((filePath: string, content: string, type: string) => {
    setSelectedFileInStore({ path: filePath, content, type });
    setFileSelectionModalOpen(false);
  }, [setSelectedFileInStore, setFileSelectionModalOpen]);


  /**
   * Функция, которая открывает модалку выбора файлов или сразу запускает анализ, если файл уже выбран
   */
  const handleAskAi = useCallback(async (callback: React.Dispatch<React.SetStateAction<string>>) => {
    if (!repoName) {
      callback("No repo selected");
      return;
    }

    // Если уже есть выбранный файл, анализируем его
    if (selectedFileFromStore) {
      performAiAnalysis(selectedFileFromStore.path, selectedFileFromStore.content, selectedFileFromStore.type, callback);
    } else {
      // Иначе открываем модалку выбора файлов
      setFileSelectionModalOpen(true);
    }
  }, [repoName, selectedFileFromStore, setFileSelectionModalOpen]);

  /**
   * Функция, которая выполняет анализ выбранного файла
   */
  const performAiAnalysis = useCallback(async (
    filePath: string, 
    content: string, 
    type: string, 
    callback?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!callback) return;
    
    callback("");
    setLoading(true);

    try {
      // Запрос с выбранным файлом
      const response = await fetch("/api/analyzeAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repoName,
          skills: selectedSkills,
          language: selectedLanguage,
          file: "SelectedFile", // Новый тип для анализа конкретного файла
          isSpeechAllowed,
          selectedFilePath: filePath,
          selectedFileContent: content
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      const fullMessage = data.summary || "No AI response...";
      // Получаем содержимое файла
      const { fileContent, fileType, costInfo, audioUrl } = data;
      setFileContent(fileContent);
      setFileType(fileType);
      setCostInfo({...costInfo});
      setAudioUrl(audioUrl);

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
  }, [owner, repoName, selectedSkills, selectedLanguage, isSpeechAllowed]);

  const handleOpenFileDialog = useCallback(() => setOpenFileDialog(true), []);
  const handleCloseFileDialog = useCallback(() => setOpenFileDialog(false), []);
  const handleOpenCostInfoDialog = useCallback(() => setIsCostInfoDialogOpen(true), []);
  const handleCloseCostInfoDialog = useCallback(() => setIsCostInfoDialogOpen(false), []);
  const handleResetSelectedFile = useCallback(() => {
    setSelectedFileInStore(null);
  }, [setSelectedFileInStore]);

  return (
	<Box sx={{ border: '1px solid #e0e0e0',
			mt: 2,
				borderRadius: 2,
				padding: 1,
				boxShadow: 24,
				overflow: "hidden", }}>
		<Box display='flex' flexDirection='column' sx={{  padding: 4,  border: '1px solid #e0e0e0',
					borderRadius: 2,
					boxShadow: 4,
					overflow: "hidden", }}>
			<Typography variant="h5" sx={{ fontWeight: "bold", fontSize: isSmallScreen ? 18 : 24 }}>
				Ask AI feedback about project
			</Typography>

			{/* Показываем информацию о выбранном файле */}
			{selectedFileFromStore && (
				<Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
					<Typography variant="body2" color="primary">
						Выбранный файл: <strong>{selectedFileFromStore.path}</strong>
					</Typography>
					<Button 
						size="small" 
						onClick={handleResetSelectedFile}
						sx={{ mt: 1 }}
					>
						Выбрать другой файл
					</Button>
				</Box>
			)}
			
			{audioUrl && (
			<audio controls style={{ marginTop: "10px" }}>
			<source src={audioUrl} type="audio/mpeg" />
			Your browser does not support the audio element.
			</audio>
		)}

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
				isSpeechAllowed={isSpeechAllowed}
				setSpeechAllowed={setIsSpeechAllowed}
			/>

			{/* AI Chat Panel */}
			<AIChatPanel
				fileContent={fileContent}
				loading={loading}
				done={done}
				repoName={repoName}
				isSmallScreen={isSmallScreen}
				setOpenFileDialog={handleOpenFileDialog}
				handleAskAi={handleAskAi}
				setOpenCostInfoDialog={handleOpenCostInfoDialog}
			/>

			{/* Analyzed file content MODAL */}
			<FilePreviewModal isOpen={openFileDialog} setClose={handleCloseFileDialog} fileType={fileType} fileContent={fileContent} />

			{/* Cost Info MODAL */}
			<CostInfoModal isOpen={isCostInfoDialogOpen} setClose={handleCloseCostInfoDialog} costInfo={costInfo} isSmallScreen={isSmallScreen} />

			{/* File Selection MODAL */}
			<FileSelectionModal
				isOpen={isFileSelectionModalOpen}
				onClose={() => setFileSelectionModalOpen(false)}
				onSelectFile={handleFileSelection}
				owner={owner}
				repoName={repoName || ''}
				isSmallScreen={isSmallScreen}
			/>
		</Box>
	</Box>
  );
};

export default AIFeedbackChat;
