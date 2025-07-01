import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useRepoStore } from "../store/repos/store";
import { SelectedPage, PanelWidthKeys } from "../store/repos/types";

type WithPageConditionOptions = {
	page: SelectedPage;
	key: PanelWidthKeys
};

// HOC exists for 2 reasons:
// 1. Hide component on small screens
// 2. Change component width depending on the key from store.
//  P.S. WIDTH changes by the AppBar Draggable resize slider.

export function withResponsiveVisibility<P>(
	WrappedComponent: React.ComponentType<P>,
	options: WithPageConditionOptions
): React.FC<P> {
	const { page, key } = options;

	const ResponsiveComponent: React.FC<P> = (props) => {
		const isSmallScreen = useMediaQuery("(max-width: 950px)");
		const selectedPage = useRepoStore((state) => state.selectedPage);
		const panelWidths = useRepoStore((state) => state.panelWidths);

		const shouldRender =
			!isSmallScreen || (isSmallScreen && selectedPage === page);

		return shouldRender ? (
			<Box
				sx={{
					width: `${isSmallScreen ? "100" : panelWidths[key]}%`,
				}}
			>
				<WrappedComponent {...props} />
			</Box>
		) : null;
	};

	ResponsiveComponent.displayName = `withResponsiveVisibility(${
		WrappedComponent.displayName || WrappedComponent.name || "Component"
	})`;

	return ResponsiveComponent;
}
