import { useEffect, useMemo, useCallback, useState } from "react"
import { Modal, Container, Card, CardTitle, CardBody, CardFooter } from "reactstrap"

interface Product {
    productId: string,
    name: string,
    brand: string,
}

interface ProductOrder {
    product: Product
    strikePrice: number,
    maturityDate: string,
}

let products = [
    { 'productId': "43032-32432", 'name': 'Dyson v12', 'brand': 'Dyson' }
]

let orderBook = [
    { 'product': products[0], 'strikePrice': 380, 'maturityDate': 'Dec-25' },
    { 'product': products[0], 'strikePrice': 380, 'maturityDate': 'Dec-25' },
    { 'product': products[0], 'strikePrice': 380, 'maturityDate': 'Dec-25' },
    { 'product': products[0], 'strikePrice': 390, 'maturityDate': 'Dec-25' },
    { 'product': products[0], 'strikePrice': 390, 'maturityDate': 'Dec-25' },
    { 'product': products[0], 'strikePrice': 400, 'maturityDate': 'Dec-25' },

]

let user = {
    'name': 'Janet'
}

export default function Main() {
    const [productOrders, setProductOrders] = useState<ProductOrder[]>([])

    useEffect(() => {
        console.log("useEffect on load")
        setProductOrders(orderBook)
    }, [])

    return (
        <Container fluid>
            <h1>Vendor Page</h1>
            <h4>Welcome {user.name}</h4>
            <h5>You have {products.length} {products.length == 1 ? 'product' : 'products'}:</h5>

            {products.map((product: Product, index: number) => (
                <Card key={index} size={2}>
                    <CardTitle>{product.brand}</CardTitle>
                    <CardBody>
                        {product.name}
                    </CardBody>
                    <CardFooter>
                        Order book:
                        <ul>
                            {productOrders.map((order: ProductOrder, index: number) => (
                                <li key={index}>{order.product.name} - {order.strikePrice}</li>
                            ))}
                        </ul>
                    </CardFooter>

                </Card>
            ))}




        </Container>
    )
}