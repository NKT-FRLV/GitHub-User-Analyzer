"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Code as CodeIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileItem {
  path: string;
  size: number;
  type: string;
}

interface FileSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (filePath: string, fileContent: string, fileType: string) => void;
  owner: string;
  repoName: string;
  isSmallScreen: boolean;
}

const FileSelectionModal: React.FC<FileSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectFile,
  owner,
  repoName,
  isSmallScreen
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/repoFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repoName })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, [owner, repoName]);

  // Загружаем список файлов при открытии модалки
  useEffect(() => {
    if (isOpen && owner && repoName) {
      fetchFiles();
    }
  }, [isOpen, owner, repoName, fetchFiles]);

  const fetchFileContent = async (filePath: string) => {
    setLoadingContent(true);
    try {
      const response = await fetch('/api/fileContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repoName, filePath })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }

      const data = await response.json();
      setFileContent(data.content);
    } catch (error) {
      console.error('Error fetching file content:', error);
      setFileContent('Error loading file content');
    } finally {
      setLoadingContent(false);
    }
  };

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
    fetchFileContent(file.path);
  };

  const handleSelectFile = () => {
    if (selectedFile && fileContent) {
      onSelectFile(selectedFile.path, fileContent, selectedFile.type);
      onClose();
    }
  };

  const getFileIcon = (type: string) => {
    if (['md', 'txt', 'readme'].includes(type.toLowerCase())) {
      return <DescriptionIcon />;
    }
    return <CodeIcon />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  // Группируем файлы по папкам
  const groupFilesByFolder = (files: FileItem[]) => {
    const grouped: { [key: string]: FileItem[] } = {};
    
    files.forEach(file => {
      const pathParts = file.path.split('/');
      if (pathParts.length === 1) {
        // Файл в корне
        if (!grouped['root']) grouped['root'] = [];
        grouped['root'].push(file);
      } else {
        // Файл в папке
        const folder = pathParts[0];
        if (!grouped[folder]) grouped[folder] = [];
        grouped[folder].push(file);
      }
    });

    return grouped;
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const groupedFiles = groupFilesByFolder(files);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isSmallScreen}
    >
      <DialogTitle>
        Select a file for analysis - {repoName}
      </DialogTitle>
      
      <DialogContent sx={{ height: isSmallScreen ? '100%' : 600 }}>
        <Box display="flex" height="100%" gap={2}>
          {/* Список файлов */}
          <Box sx={{ width: isSmallScreen ? '100%' : '40%', borderRight: isSmallScreen ? 'none' : '1px solid #e0e0e0' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ maxHeight: '100%', overflow: 'auto' }}>
                {Object.entries(groupedFiles).map(([folder, folderFiles]) => (
                  <React.Fragment key={folder}>
                    {folder !== 'root' && (
                      <ListItem 
                        component="button"
                        onClick={() => toggleFolder(folder)}
                        sx={{ backgroundColor: '#f5f5f5' }}
                      >
                        <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={folder} />
                        <IconButton size="small">
                          {expandedFolders.has(folder) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </ListItem>
                    )}
                    
                    <Collapse in={folder === 'root' || expandedFolders.has(folder)}>
                      {folderFiles.map((file) => (
                        <ListItem
                          key={file.path}
						  component="button"
                          onClick={() => handleFileClick(file)}
                          //selected={selectedFile?.path === file.path}
						  
                          sx={{ pl: folder === 'root' ? 2 : 4 }}
                        >
                          <ListItemIcon>
                            {getFileIcon(file.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" noWrap>
                                  {folder === 'root' ? file.path : file.path.replace(`${folder}/`, '')}
                                </Typography>
                                <Chip
                                  label={file.type.toUpperCase()}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={formatFileSize(file.size)}
                          />
                        </ListItem>
                      ))}
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Предварительный просмотр */}
          {!isSmallScreen && (
            <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
              {selectedFile ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {selectedFile.path}
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip label={selectedFile.type.toUpperCase()} size="small" />
                      <Chip label={formatFileSize(selectedFile.size)} size="small" variant="outlined" />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {loadingContent ? (
                      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                      </Box>
                    ) : (
                      <SyntaxHighlighter
                        language={selectedFile.type === 'tsx' ? 'typescript' : selectedFile.type}
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          fontSize: '12px',
                          maxHeight: '400px'
                        }}
                        showLineNumbers
                      >
                        {fileContent.length > 5000 
                          ? fileContent.substring(0, 5000) + '\n\n... (file truncated for faster preview)'
                          : fileContent
                        }
                      </SyntaxHighlighter>
                    )}
                  </Box>
                </>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="textSecondary">
                    Select a file for preview
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSelectFile}
          disabled={!selectedFile}
        >
          Analyze this file
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileSelectionModal; 