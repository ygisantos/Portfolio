function ButtonIcon({onclick, icon, className = null, tooltip = null}) {
    return (
        <div 
            className={`${className} text-beige flex items-center justify-center p-3 rounded-md bg-brown-dark cursor-pointer 
                hover:!bg-[#ddceb4] hover:!text-[#543310] hover:!scale-110 hover:shadow-lg 
                transition-all duration-300 ease-out relative group`}
            onClick={onclick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onclick && onclick()}
            aria-label={tooltip || "Social media button"}
        >
            {icon}
            {tooltip && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brown-dark text-beige py-1 px-2 rounded text-xs 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {tooltip}
                </span>
            )}
        </div>
    )
}

export default ButtonIcon