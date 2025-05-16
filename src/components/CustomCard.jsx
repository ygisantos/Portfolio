import { Card } from "pixel-retroui"
function CustomCard({
    className, 
    children, 
    bg = "#f8f4e1", 
    textColor = "#74512d", 
    borderColor = "#543310", 
    shadowColor = "#543310",
    hoverEffect = true
}) {
    return (
        <Card
            bg={bg}
            textColor={textColor}
            borderColor={borderColor}
            shadowColor={shadowColor}
            className={`${className} p-4 ${hoverEffect ? 'hover:shadow-lg transition-all duration-300' : ''}`}
        >
            {children}
        </Card>
    )
}

export default CustomCard