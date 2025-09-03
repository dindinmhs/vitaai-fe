interface Props {
    error? : string | null;
    otherStyles? : string;
    isSuccess? : boolean;
}

export const MessageRes = ({ error, isSuccess=false, otherStyles="text-end" } : Props) => {
    return (
        <small className={`${isSuccess?'text-green-500':'text-red-500'} ${otherStyles}`}>{error}</small>
    )
}