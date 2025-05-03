'use client'
import { Avatar, TableBody, TableRow, TableHead, TableCell, Table, TableContainer, Divider, Typography, CardContent, Card, Grid, Link as MuiLink, Box } from '@mui/material'
import { DeleteCandidateButton } from '../common/DeleteCandidateButton'
import CandidatesSkeleton from '../common/CandidatesSkeleton'
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'
import { Candidate } from '@prisma/client';
import GitHubIcon from '@mui/icons-material/GitHub'
import { useState, useEffect } from 'react'

const Candidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)

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

    const renderCandidatesList = () => {
      return candidates.map((candidate) => (
        <TableRow key={candidate.id}>
          <TableCell>
            <Avatar
              src={candidate.avatarUrl}
              alt={candidate.githubName}
              sx={{ width: 40, height: 40 }}
            />
          </TableCell>
          <TableCell>
            <MuiLink
              href={candidate.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <GitHubIcon fontSize="small" />
              {candidate.githubName}
            </MuiLink>
          </TableCell>
          <TableCell>
            {format(new Date(candidate.savedAt), 'dd MMMM yyyy', { locale: ru })}
          </TableCell>
          <TableCell align="right">
            <DeleteCandidateButton candidateId={candidate.id} />
          </TableCell>
        </TableRow>
      ))
    }

    const renderContent = () => {
      // Если идет загрузка, показываем таблицу со скелетоном
      if (loading) {
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>GitHub Username</TableCell>
                  <TableCell>Saved Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>GitHub Username</TableCell>
                <TableCell>Saved Date</TableCell>
                <TableCell align="right">Actions</TableCell>
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
    )
}

export default Candidates