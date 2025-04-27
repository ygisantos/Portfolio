function ButtonIcon({onclick, icon, className = null}) {
    return (
        <div className={`${className} text-beige flex items-center justify-center p-3 rounded-md bg-brown-dark cursor-pointer hover:!bg-[#ddceb4] hover:!text-[#543310] hover:!scale-110 hover:shadow-lg transition-all duration-300 ease-out`}
            onClick={onclick}>
            {icon}
        </div>
    )
}

export default ButtonIcon