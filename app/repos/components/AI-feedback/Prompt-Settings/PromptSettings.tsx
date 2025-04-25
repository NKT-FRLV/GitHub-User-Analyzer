import { Dispatch, SetStateAction } from 'react'
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SkillsSelector from '@/app/components/common/SkillsSelector'
import LanguageSelector from '@/app/components/common/LanguageSelector'
import FileSelector from '@/app/components/common/FileSelector'
import { Divider } from '@mui/material'
import { Box } from '@mui/material'
import { useState, useRef } from 'react'

const TTS_PASSWORD = process.env.NEXT_PUBLIC_TTS_PASSWORD

interface PromptSettingsProps {
    selectedLanguage: string
    setSelectedLanguage: (language: string) => void
    selectedFile: string
    setSelectedFile: (file: string) => void
    selectedSkills: string[]
    setSelectedSkills: (skills: string[]) => void
    isSmallScreen: boolean
    loading: boolean
    isSpeechAllowed: boolean
    setSpeechAllowed: Dispatch<SetStateAction<boolean>>
}

const PromptSettings = ({ selectedLanguage, setSelectedLanguage, selectedFile, setSelectedFile, selectedSkills, setSelectedSkills, isSmallScreen, loading, isSpeechAllowed, setSpeechAllowed }: PromptSettingsProps) => {

    const [password, setPassword] = useState<string>("");
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState<boolean>(false);
    const checkBoxRef = useRef<HTMLButtonElement>(null);

    const handleCheckBoxChange = () => {
        if (!isSpeechAllowed) {
            setIsPasswordDialogOpen(true)
        } else {
            setSpeechAllowed(false)
        }
    }

    const handlePasswordDialogClose = () => {
        setIsPasswordDialogOpen(false)
        if (checkBoxRef.current) {
            checkBoxRef.current.focus();
        }
    }

    const handleCheckPassword = () => {
        if (password === TTS_PASSWORD) {
            setSpeechAllowed(true)
            setIsPasswordError(false)
            setPassword("")
        } else {
            setIsPasswordError(true)
            setPassword("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
        if (e.key === 'Enter') {
            callback()
        }
    }
    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setIsPasswordError(false)
    }

  return (
    <>
        <Box display='flex' flexDirection='column' width='100%' >
            <Divider sx={{ my: 2 }} />

            <Box display='flex' flexDirection='row' alignItems='center' width='100%' justifyContent={isSmallScreen ? 'center' : 'space-between'}>
                {!isSmallScreen && <Typography variant="h6" sx={{ fontWeight: "bold"}}>
                    Prompt Settings:
                </Typography>}
                <Box display='flex' alignItems='center' flexDirection='row' gap={2}>
                    <Box sx={{ minWidth: 50, aspectRatio: 1 }}>
                        <Checkbox color="secondary" checked={isSpeechAllowed} onChange={handleCheckBoxChange} onKeyDown={(e) => handleKeyDown(e, handleCheckBoxChange)} ref={checkBoxRef} />
                    </Box>
                    <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} isDisabled={loading} />
                    <FileSelector selectedFile={selectedFile} onFileChange={setSelectedFile} isDisabled={loading} />
                </Box>
            </Box>
            <SkillsSelector
                selectedSkills={selectedSkills}
                onSkillsChange={setSelectedSkills}
                isSmallScreen={isSmallScreen}
                isDisabled={loading}
            />
            <Divider sx={{ my: 2 }} />
        </Box>
        {/* Password dialog to enable speech generation */}
        <Dialog open={isPasswordDialogOpen} onClose={handlePasswordDialogClose} >
            <IconButton onClick={handlePasswordDialogClose} sx={{ position: 'absolute', top: 0, right: 0 }}>
              <CloseIcon />
            </IconButton>
            <DialogTitle>
                Allow Speech generation.
            </DialogTitle>
            <DialogContent>
                <Typography>
                    This feature is available only for allowed users.
                </Typography>
                <Box display='flex' flexDirection='row' my={2} gap={2} alignItems='center'>
                    <TextField
                        value={password}
                        error={isPasswordError}
                        onChange={handleChangePassword}
                        onKeyDown={(e) => handleKeyDown(e, handleCheckPassword)}
                        label="Enter password"
                        type="password"
                        autoComplete="off"
                        size='medium'
                        fullWidth
                    />
                    <Button variant='contained' size="large" sx={{backgroundColor: '#000', color: 'white'}} onClick={handleCheckPassword}>
                        Allow
                    </Button>
                </Box>
                <Typography variant='caption' sx={{color: isPasswordError ? 'red' : 'green', visibility: !isPasswordError && !isSpeechAllowed ? 'hidden' : 'visible'}}>
                    {isPasswordError ? 'Wrong password' : 'Access allowed.'}
                </Typography>

            </DialogContent>
        </Dialog>
        
    </>
  )
}

export default PromptSettings