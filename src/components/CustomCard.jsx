import { Card } from "pixel-retroui"
function CustomCard({className, children, bg = "#f8f4e1", textColor = "#74512d", borderColor = "#543310", shadowColor = "#543310"}) {
    return (
        <Card
            bg={bg}
            textColor={textColor}
            borderColor={borderColor}
            shadowColor={shadowColor}
            className={`${className} p-2`}
            >
                {children}
        </Card>
    )
}

export default CustomCard