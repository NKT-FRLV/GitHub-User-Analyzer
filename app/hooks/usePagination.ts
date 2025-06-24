import { useState, useEffect } from "react";

interface UsePaginationReturn<T> {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	currentItems: T[];
	totalPages: number;
}

const usePagination = <T>(
	totalItems: number, 
	itemsPerPage: number, 
	items: T[]
): UsePaginationReturn<T> => {
	const [currentPage, setCurrentPage] = useState(1);
	
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	
	// Сбрасываем текущую страницу при изменении данных
	useEffect(() => {
		setCurrentPage(1);
	}, [totalItems, items.length]);
	
	// Валидация: если currentPage больше totalPages, сбрасываем на 1
	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [currentPage, totalPages]);
	
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
	
	const handlePageChange = (page: number) => {
		// Дополнительная валидация при изменении страницы
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return { 
		currentPage, 
		setCurrentPage: handlePageChange, 
		currentItems,
		totalPages 
	};
};

export default usePagination;