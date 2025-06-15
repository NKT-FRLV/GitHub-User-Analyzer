import React, { useState, useCallback } from "react";

export const useSearchBar = (onSearch: (query: string) => void) => {
	const [query, setQuery] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);

	const handleSend = useCallback(() => {
		if (!query.trim()) return;
		onSearch(query);
	}, [query, onSearch]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				handleSend();
			}
		},
		[handleSend]
	);

	const focusHandler = useCallback(() => {
		setIsExpanded(true);
	}, []);

	const blurHandler = useCallback(() => {
		if (!query.trim()) {
			setIsExpanded(false);
		}
	}, [query]);

	return {
		query,
		setQuery,
		isExpanded,
		setIsExpanded,
		handleSend,
		handleKeyDown,
		focusHandler,
		blurHandler,
	};
};
