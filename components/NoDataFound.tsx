interface NoDataFoundProp {
    content?: string;
}

const NoDataFound: React.FC<NoDataFoundProp> = ({ content }) => {
    return (
        <div className="m-4 mt-4 flex h-80 flex-col items-center justify-center gap-8 rounded-lg border border-slate-6 p-6">
            <div className="flex max-w-md flex-col gap-2 text-center font-semibold text-2xl">
                {content ? content : 'No result found'}
            </div>
        </div>
    );
};

export default NoDataFound;
