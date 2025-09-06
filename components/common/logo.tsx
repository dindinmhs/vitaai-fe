export const Logo = ({variant, size="w-10"}:{variant:"icon"|"text", size?:string}) => {
    if (variant=="icon") {
        return (
            <img src="/logo.png" className={`${size} aspect-square`}/>
        )
    }
    return (
        <div className="flex gap-2 items-center">
            <img src="/logo.png" className={`${size} aspect-square`}/>
            <h3 className="font-bold text-xl">Vita AI</h3>
        </div>
    )
}
