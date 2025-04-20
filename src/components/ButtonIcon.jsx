function ButtonIcon({onclick, icon, className = null}) {
    return (
        <div className={`${className} flex items-center justify-center p-3 rounded-md bg-brown-dark cursor-pointer hover:!bg-[#ddceb4] hover:!scale-105 transition-all duration-1000`}
            onClick={onclick}>
            {icon}
        </div>
    )
}

export default ButtonIcon