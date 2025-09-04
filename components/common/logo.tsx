export const Logo = ({variant}:{variant:"icon"|"text"}) => {
    if (variant=="icon") {
        return (
            <img src="logo.png" className="w-10 aspect-square"/>
        )
    }
    return (
        <div className="flex gap-2 items-center">
            <img src="logo.png" className="w-10 aspect-square"/>
            <h3 className="font-bold text-xl">Vita AI</h3>
        </div>
    )
}
