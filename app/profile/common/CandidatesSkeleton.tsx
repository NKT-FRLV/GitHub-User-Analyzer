import React from 'react';
import { 
  Skeleton, 
  TableRow, 
  TableCell, 

} from '@mui/material';

const CandidatesSkeleton = () => {
  // Создаем массив из 2 элементов для имитации строк таблицы
  const skeletonRows = Array.from({ length: 2 }, (_, index) => index);

  return (
    <>
        {skeletonRows.map((index) => (
            <TableRow key={`skeleton-${index}`}>
            <TableCell>
                <Skeleton 
                  variant="circular" 
                  width={40} 
                  height={40} 
                />
            </TableCell>
            <TableCell align="center">
                <Skeleton 
                  variant="text" 
                  width={100} 
                  sx={{ mx: 'auto' }} 
                />
            </TableCell>
            <TableCell align="center">
                <Skeleton variant="text" sx={{ mx: 'auto' }} width={80} />
            </TableCell>
            <TableCell align="center">
                <Skeleton 
                  variant="circular" 
                  width={25} 
                  height={25} 
                  sx={{ mx: 'auto' }} 
                />
            </TableCell>
            <TableCell >
                <Skeleton 
                  variant="circular" 
                  width={25} 
                  height={25} 
                  sx={{ ml: 'auto' }} 
                />
            </TableCell>
            </TableRow>
        ))}
    </>
  );
};

export default CandidatesSkeleton;