interface FeedGridType {
	children: React.ReactNode;
}

const FeedGrid = ({ children }: FeedGridType) => {
	return <div className="grid grid-cols-4 gap-4">{children}</div>;
};
export default FeedGrid;
