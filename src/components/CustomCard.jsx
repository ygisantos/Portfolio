import { Card } from "pixel-retroui"
function CustomCard({className, children}) {
    return (
        <Card
            bg="#f8f4e1"
            textColor="#74512d"
            borderColor="#543310"
            shadowColor="#af8f6f"
            className={className}
            >
                {children}
        </Card>
    )
}

export default CustomCard