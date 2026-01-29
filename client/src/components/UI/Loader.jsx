const Loader = ({ fullPage = false, size = 'default' }) => {
    const sizes = {
        small: 'h-8 w-8',
        default: 'h-16 w-16',
        large: 'h-24 w-24',
    };

    const loader = (
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${sizes[size]}`}></div>
    );

    if (fullPage) {
        return (
            <div className="h-screen flex items-center justify-center">
                {loader}
            </div>
        );
    }

    return loader;
};

export default Loader;
