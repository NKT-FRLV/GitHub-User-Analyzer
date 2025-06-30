import { useState } from 'react'
import { 
  Box, 
  Typography, 
  CircularProgress, 
  IconButton, 
  Tooltip, 
  Paper,
  Fade,
  Avatar
} from '@mui/material'
import CodeIcon from '@mui/icons-material/Code';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import  { SiOpenai }  from "react-icons/si";
import Button from '@mui/material/Button'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'


interface AIChatPanelProps {
  fileContent: string
  loading: boolean
  done: boolean
  repoName: string
  isSmallScreen: boolean
  setOpenFileDialog: () => void
  handleAskAi: (callback: React.Dispatch<React.SetStateAction<string>>) => void
  setOpenCostInfoDialog: () => void
}

const AIChatPanel = ({ fileContent, loading, done, repoName, isSmallScreen, setOpenFileDialog, handleAskAi, setOpenCostInfoDialog }: AIChatPanelProps) => {

    const [aiMessage, setAiMessage] = useState("Professional review and feedback, by Open AI Model GPT-4o");
    const [copied, setCopied] = useState(false);

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(aiMessage);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

  return (
    <>
    <Box display='flex' flexDirection='row' width='100%' justifyContent='space-between' gap={2}>
            <Button
              variant="outlined"
              sx={{ width: '30%', border: '1px solid black', color: 'black', fontWeight: 'bold' }}
              aria-label="open file content preview"
              component="button"
              onClick={setOpenFileDialog}
              disabled={!fileContent}
            >
              <CodeIcon sx={{ fontSize: 35 }} />
              { !isSmallScreen && <Typography variant="body2" sx={{fontWeight: 'bold', marginLeft: 1 }}>
                File preview
              </Typography>}
            </Button>
            <Button
                variant="outlined"
                component="button"
                aria-label="open cost info"
                sx={{ width: '30%', border: '1px solid black', color: 'black', fontWeight: 'bold' }}
                onClick={setOpenCostInfoDialog}
                disabled={!fileContent}
            >
                <AttachMoneyIcon sx={{ fontSize: 35 }} />
                { !isSmallScreen && <Typography variant="body2" sx={{fontWeight: 'bold', marginLeft: 1 }}>
                    Cost Info
                </Typography>}
            </Button>
            <Button
                variant="contained"
                sx={{ fontSize: 16, minWidth: '40%', backgroundColor: 'black', fontWeight: 'bold' }}
                disabled={loading || !repoName || done}
                onClick={() => handleAskAi(setAiMessage)}
            >
                { done ? "Select another repo" : loading ? "Asking AI..." : "Ask AI"}
            </Button>
        </Box>
        
        <Paper
            elevation={3}
            sx={{
                my: 2,
                p: 0,
                borderRadius: 3,
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative'
            }}
        >
            {/* Header секция */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: 'grey.200',
							boxShadow: 2
                        }}
                    >
                        <SiOpenai size={24} color='black' />
                    </Avatar>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        AI Assistant
                    </Typography>
                </Box>
                
                {aiMessage && !loading && (
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                        <IconButton
                            onClick={handleCopyToClipboard}
                            size="small"
                            sx={{
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                        >
                            {copied ? <CheckIcon sx={{ fontSize: 18, color: 'success.main' }} /> : <ContentCopyIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Контент секция */}
            <Box
                sx={{
                    p: 3,
                    minHeight: 120,
                    maxHeight: 400,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'grey.300',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: 'grey.400',
                    }
                }}
            >
                {loading ? (
                    <Fade in={loading}>
                        <Box 
                            display="flex" 
                            flexDirection="column"
                            alignItems="center" 
                            justifyContent="center" 
                            gap={2}
                            minHeight={100}
                        >
                            <CircularProgress size={40} />
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    textAlign: 'center'
                                }}
                            >
                                AI is analyzing your code...
                            </Typography>
                        </Box>
                    </Fade>
                ) : aiMessage ? (
                    <Fade in={!loading}>
                        <Box>
                            <Typography
                                component="div"
                                sx={{
                                    lineHeight: 1.7,
                                    color: 'text.primary',
                                    '& p': {
                                        margin: '0 0 16px 0',
                                        '&:last-child': {
                                            marginBottom: 0
                                        }
                                    },
                                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        margin: '24px 0 16px 0',
                                        '&:first-of-type': {
                                            marginTop: 0
                                        }
                                    },
                                    '& code': {
                                        backgroundColor: 'grey.100',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '0.875em',
                                        fontFamily: 'monospace'
                                    },
                                    '& pre': {
                                        backgroundColor: 'grey.900',
                                        color: 'common.white',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        overflow: 'auto',
                                        margin: '16px 0'
                                    },
                                    '& ul, & ol': {
                                        paddingLeft: '24px',
                                        margin: '16px 0'
                                    },
                                    '& li': {
                                        margin: '8px 0'
                                    },
                                    '& blockquote': {
                                        borderLeft: '4px solid',
                                        borderColor: 'primary.main',
                                        paddingLeft: '16px',
                                        margin: '16px 0',
                                        color: 'text.secondary',
                                        fontStyle: 'italic'
                                    }
                                }}
                            >
                                <Markdown
                                    components={{
                                        code(props: any) {
                                            const {node, inline, className, children, ...rest} = props
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={dark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{
                                                        borderRadius: '8px',
                                                        fontSize: '14px'
                                                    }}
                                                    {...rest}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...rest}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {aiMessage}
                                </Markdown>
                            </Typography>
                        </Box>
                    </Fade>
                ) : (
                    <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        minHeight={100}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.disabled',
                                textAlign: 'center',
                                fontStyle: 'italic'
                            }}
                        >
                            Click "Ask AI" to get professional code review and feedback
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    </>
  )
}

export default AIChatPanel