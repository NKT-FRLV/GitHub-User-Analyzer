import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress, Grid } from '@mui/material';

// Динамически импортируем компонент кандидатов для ленивой загрузки
const DynamicCandidates = dynamic(
  () => import('../candidate-list/Candidates'),
  {
    loading: () => (
      <Grid item xs={12} display="flex" justifyContent="center">
        <CircularProgress />
      </Grid>
    ),
  }
);

/**
 * Компонент-обертка для секции кандидатов
 * Использует динамический импорт для улучшения производительности
 */
export const CandidatesSection = () => {
  return (

      <DynamicCandidates />
  );
}; 