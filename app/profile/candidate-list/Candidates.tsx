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
          <TableCell sx={{ minWidth: { xs: 60, sm: 80 } }}>
            <Avatar
              src={candidate.avatarUrl}
              alt={candidate.githubName}
              sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
              className={styles.candidateListAvatar}
              onClick={() => handleAvatarOpen(candidate)}
            />
          </TableCell>
          <TableCell align="center" sx={{ minWidth: { xs: 120, sm: 150 } }}>
            <MuiLink
              href={candidate.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              <GitHubIcon fontSize="small" />
              <Box component="span" sx={{ 
                wordBreak: 'break-word',
                display: { xs: 'none', sm: 'inline' }
              }}>
                {candidate.githubName}
              </Box>
              <Box component="span" sx={{ 
                display: { xs: 'inline', sm: 'none' },
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {candidate.githubName}
              </Box>
            </MuiLink>
          </TableCell>
          <TableCell align="center" sx={{ 
            minWidth: { xs: 100, sm: 120 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {format(new Date(candidate.savedAt), 'dd MMMM yyyy', { locale: enGB })}
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              {format(new Date(candidate.savedAt), 'dd/MM/yy', { locale: enGB })}
            </Box>
          </TableCell>
          <TableCell align="center" sx={{ minWidth: { xs: 60, sm: 80 } }}>
            <IconButton
              onClick={() => handleReposAnalyze(candidate.reposUrl)}
              sx={{ color: 'green' }}
              size="small"
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </TableCell>
          <TableCell align="right" sx={{ minWidth: { xs: 60, sm: 80 } }}>
            <DeleteCandidateButton candidateId={candidate.id} deleteCandidate={handleDelete} />
          </TableCell>
        </TableRow>
      ))
    }

    const renderContent = () => {
      // Если идет загрузка, показываем таблицу со скелетоном
      if (loading) {
        return (
          <Box className={styles.tableWrapper}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: { xs: 400, sm: 600 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: { xs: 60, sm: 80 } }}>Avatar</TableCell>
                    <TableCell align="center" sx={{ minWidth: { xs: 120, sm: 150 } }}>GitHub Username</TableCell>
                    <TableCell align="center" sx={{ minWidth: { xs: 100, sm: 120 } }}>Saved Date</TableCell>
                    <TableCell align="center" sx={{ minWidth: { xs: 60, sm: 80 } }}>Analyze</TableCell>
                    <TableCell align="right" sx={{ minWidth: { xs: 60, sm: 80 } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <CandidatesSkeleton />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
        <Box className={styles.tableWrapper}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 400, sm: 600 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: { xs: 60, sm: 80 } }}>Avatar</TableCell>
                  <TableCell align="center" sx={{ minWidth: { xs: 120, sm: 150 } }}>GitHub Username</TableCell>
                  <TableCell align="center" sx={{ minWidth: { xs: 100, sm: 120 } }}>Saved Date</TableCell>
                  <TableCell align="center" sx={{ minWidth: { xs: 60, sm: 80 } }}>Analyze</TableCell>
                  <TableCell align="right" sx={{ minWidth: { xs: 60, sm: 80 } }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderCandidatesList()}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )
    }

    return (
      <>
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
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