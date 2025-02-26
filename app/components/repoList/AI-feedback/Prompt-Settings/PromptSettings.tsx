import { Typography } from '@mui/material'
import SkillsSelector from '@/app/components/common/SkillsSelector'
import LanguageSelector from '@/app/components/common/LanguageSelector'
import FileSelector from '@/app/components/common/FileSelector'
import { Divider } from '@mui/material'
import { Box } from '@mui/material'


interface PromptSettingsProps {
    selectedLanguage: string
    setSelectedLanguage: (language: string) => void
    selectedFile: string
    setSelectedFile: (file: string) => void
    selectedSkills: string[]
    setSelectedSkills: (skills: string[]) => void
    isSmallScreen: boolean
    loading: boolean
}

const PromptSettings = ({ selectedLanguage, setSelectedLanguage, selectedFile, setSelectedFile, selectedSkills, setSelectedSkills, isSmallScreen, loading }: PromptSettingsProps) => {
  return (
    <>
        <Box display='flex' flexDirection='column' width='100%' >
            <Divider sx={{ my: 2 }} />

            <Box display='flex' flexDirection='row' alignItems='start' width='100%' justifyContent={isSmallScreen ? 'center' : 'space-between'}>
                {!isSmallScreen && <Typography variant="h6" sx={{ fontWeight: "bold"}}>
                    Prompt Settings:
                </Typography>}
                <Box display='flex' flexDirection='row' gap={2}>
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
        
        
    </>
  )
}

export default PromptSettings