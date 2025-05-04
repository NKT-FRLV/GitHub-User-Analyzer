'use client'
import { Avatar, TableBody, TableRow, TableHead, TableCell, Table, TableContainer, Divider, Typography, CardContent, Card, Grid, Link as MuiLink, Box, Button, IconButton } from '@mui/material'
import { DeleteCandidateButton } from '../common/DeleteCandidateButton'
import CandidatesSkeleton from '../common/CandidatesSkeleton'
import { useRouter } from 'next/navigation'
import { enGB } from 'date-fns/locale'
import { format } from 'date-fns'
import { Candidate } from '@prisma/client';
import SearchIcon from '@mui/icons-material/Search'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useState, useEffect, useCallback } from 'react'
import { useModalsOpenStore } from '@/app/store/modals-open/store' 
import AvatarModal from '@/app/components/common/modals/Avatar-Modal/Avatar-Modal'
import styles from '../profile.module.css'

const Candidates = () => {
    const router = useRouter()
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)
    const handleAvatarOpen = useModalsOpenStore(state => state.handleAvatarOpen)


    useEffect(() => {
      const fetchCandidates = async () => {
        try {
          setLoading(true)
          const response = await fetch('/api/candidates')
          const { success, candidates } = await response.json()
          if (success) {
            setCandidates(candidates)
          }
        } catch (error) {
          console.error('Error fetching candidates:', error)
        } finally {
          setLoading(false)
        }
      }
      
      fetchCandidates()
    }, [])

    const handleDelete = useCallback((candidateId: string) => {
        setCandidates(prevCandidates => prevCandidates.filter(candidate => candidate.id !== candidateId))
    }, [])

    const handleReposAnalyze = (reposUrl: string) => {    
      // setIsLoading(true);
      if (reposUrl) {
        router.push(`/repos?url=${reposUrl}`);
      }
    };


    const renderCandidatesList = () => {
      return candidates.map((candidate) => (
        <TableRow key={candidate.id}>
          <TableCell>
            <Avatar
              src={candidate.avatarUrl}
              alt={candidate.githubName}
              sx={{ width: 40, height: 40 }}
              className={styles.candidateListAvatar}
              onClick={() => handleAvatarOpen(candidate)}
            />
          </TableCell>
          <TableCell align="center">
            <MuiLink
              href={candidate.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
            >
              <GitHubIcon fontSize="small" />
              {candidate.githubName}
            </MuiLink>
          </TableCell>
          <TableCell align="center">
            {format(new Date(candidate.savedAt), 'dd MMMM yyyy', { locale: enGB })}
          </TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() => handleReposAnalyze(candidate.reposUrl)}
              sx={{ color: 'green' }}
              size="small"
            >
              <SearchIcon />
            </IconButton>
          </TableCell>
          <TableCell align="right">
            <DeleteCandidateButton candidateId={candidate.id} deleteCandidate={handleDelete} />
          </TableCell>
        </TableRow>
      ))
    }

    const renderContent = () => {
      // Если идет загрузка, показываем таблицу со скелетоном
      if (loading) {
        return (
          <TableContainer>
            <Table sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell width={80} >Avatar</TableCell>
                  <TableCell align="center">GitHub Username</TableCell>
                  <TableCell align="center">Saved Date</TableCell>
                  <TableCell width={100} align="center">Analyze</TableCell>
                  <TableCell width={100} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <CandidatesSkeleton />
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
      
      // Если список пуст, показываем сообщение
      if (candidates.length === 0) {
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No saved candidates yet
            </Typography>
          </Box>
        )
      }
      
      // Если есть данные, показываем таблицу с кандидатами
      return (
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell width={80} >Avatar</TableCell>
                <TableCell align="center">GitHub Username</TableCell>
                <TableCell align="center">Saved Date</TableCell>
                <TableCell width={100} align="center">Analyze</TableCell>
                <TableCell width={100} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderCandidatesList()}
            </TableBody>
          </Table>
        </TableContainer>
      )
    }

    return (
      <>
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Saved Candidates
            </Typography>
            <Divider />
            {renderContent()}
          </CardContent>
        </Card>
      </Grid>
      <AvatarModal />
      </>
    )
}

export default Candidates