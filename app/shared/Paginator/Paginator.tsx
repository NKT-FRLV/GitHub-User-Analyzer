import React, { Dispatch, SetStateAction } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface PaginatorProps {
	totalPages: number;
	currentPage: number;
	onPageChange: Dispatch<SetStateAction<number>>;
}

const Paginator: React.FC<PaginatorProps> = ({
	totalPages,
	currentPage,
	onPageChange,
}) => {
	const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
		onPageChange(page);
	};

	// Не показываем пагинацию если страниц меньше 2
	if (totalPages <= 1) {
		return null;
	}

	return (
		<Stack
			spacing={2}
			sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
		>
			<Pagination
				count={totalPages}
				page={currentPage}
				onChange={handleChange}
				variant="outlined"
				color="primary"
				size="small"
				sx={{
					"& .MuiPagination-ul": {
						gap: 1,
					},
				}}
			/>
		</Stack>
	);
};

export default Paginator;
