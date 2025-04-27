import { Card } from "pixel-retroui"
function CustomCard({className, children}) {
    return (
        <Card
            bg="#f8f4e1"
            textColor="#74512d"
            borderColor="#543310"
            shadowColor="#543310"
            className={`${className} p-2`}
            >
                {children}
        </Card>
    )
}

export default CustomCard