function ButtonIcon({onclick, icon}) {
    return (
        <div className="p-3 rounded-md bg-brown-dark cursor-pointer hover:!bg-[#ddceb4] transition-all duration-1000"
            onClick={onclick}>
            {icon}
        </div>
    )
}

export default ButtonIcon