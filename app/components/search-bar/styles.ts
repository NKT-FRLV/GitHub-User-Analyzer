export const paperStyles = (isExpanded: boolean, isMobile: boolean) => ({
	p: isExpanded && !isMobile ? 2 : 1.5,
	display: "flex",
	flexDirection: "column",
	gap: 1.5,
	borderRadius: 4,
	boxShadow: isExpanded
		? `0 8px 16px rgba(0,0,0,0.1)`
		: `0 4px 10px rgba(0,0,0,0.05)`,
	bgcolor: "background.paper",
	width: isMobile ? 300 : isExpanded ? 650 : 600,
	transition: "all 0.3s ease",
	position: "relative",
	overflow: "hidden",
});

export const presetBoxStyles = (isExpanded: boolean, isMobile: boolean) => ({
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "flex-start",
	gap: isExpanded && !isMobile ? 1 : 0.5,
	height: "auto",
	mt: isExpanded && !isMobile ? 0.5 : 0,
	ml: { xs: 0, md: 4 },
	transition: "all 0.3s ease",
});

export const chipStyles = (color: string) => ({
  borderColor: color,
  "&:hover": {
    backgroundColor: `${color}20`,
    transform: "translateY(-2px)",
    transition: "all 0.2s",
  },
}); 

export const iconButtonStyles = (color: string) => ({
	color: color,
	backgroundColor: "transparent",
	borderRadius: "50%",
	padding: 1,
	"&:hover": {
		backgroundColor: `${color}20`,
		transform: "scale(1.1)",
		transition: "all 0.2s",
	},
});