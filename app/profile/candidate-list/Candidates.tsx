'use client'
import { Avatar, TableBody, TableRow, TableHead, TableCell, Table, TableContainer, Divider, Typography, CardContent, Card, Grid, Link as MuiLink } from '@mui/material'
import { DeleteCandidateButton } from '../common/DeleteCandidateButton'
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'
import { Candidate } from '@prisma/client';
import GitHubIcon from '@mui/icons-material/GitHub'
import { useState, useEffect } from 'react'

// interface CandidatesProps {
//   candidates: Candidate[]
// }

const Candidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([])

    useEffect(() => {
      const fetchCandidates = async () => {
        const response = await fetch('/api/candidates')
        const { success, candidates } = await response.json()
        if (success) {
          setCandidates(candidates)
        }
      }
      fetchCandidates()
    }, [])

    return (
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Saved Candidates
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {candidates.length === 0 ? (
              <Typography color="text.secondary">
                No saved candidates yet
              </Typography>
            ) : (
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
                    {candidates.map((candidate) => (
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>
    )
}

export default Candidates