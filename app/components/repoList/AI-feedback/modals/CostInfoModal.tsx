import React from 'react'
import { Dialog, DialogTitle, DialogContent, Divider } from '@mui/material'
import TextInfo from '@/app/components/common/TextInfo'
import { CostInfo } from '@/app/types/types'

interface CostInfoModalProps {
  isOpen: boolean
  setClose: () => void
  costInfo: CostInfo
  isSmallScreen: boolean
}

const CostInfoModal = ({ isOpen, setClose, costInfo, isSmallScreen }: CostInfoModalProps) => {
  return (
    <Dialog
          open={isOpen}
          onClose={setClose}
          maxWidth="lg"
        > 
          <DialogTitle sx={{ fontWeight: "bold", paddingInline: 5, paddingTop: 4 }}>
              Cost Info
          </DialogTitle>
          <DialogContent sx={{ paddingInline: 5, paddingBottom: 4 }}>
            <TextInfo text="Total request cost" value={`${costInfo?.totalRequestCost} $`} isSmallScreen={isSmallScreen} />
            <TextInfo text="Total tokens" value={costInfo?.totalTokens} isSmallScreen={isSmallScreen} />
            <Divider sx={{ my: 2 }} />
            <TextInfo text="Prompt cost" value={`${costInfo?.promptCost} $`} isSmallScreen={isSmallScreen} />
            <TextInfo text="Prompt tokens" value={costInfo?.promptTokens} isSmallScreen={isSmallScreen} />
            <Divider sx={{ my: 1 }} />
            <TextInfo text="Completion cost" value={`${costInfo?.completionCost} $`} isSmallScreen={isSmallScreen} />
            <TextInfo text="Completion tokens" value={costInfo?.completionTokens} isSmallScreen={isSmallScreen} />
            <Divider sx={{ my: 1 }} />
            <TextInfo text="Cached prompt cost" value={`${costInfo?.cachedPromptCost} $`} isSmallScreen={isSmallScreen} />
            <TextInfo text="Cached prompt tokens" value={costInfo?.cachedPromptTokens} isSmallScreen={isSmallScreen} />
            <Divider sx={{ my: 1 }} />
            <TextInfo text="Reasoning tokens" value={costInfo?.reasoningTokens} isSmallScreen={isSmallScreen} />
          </DialogContent>
        </Dialog>
  )
}

export default CostInfoModal