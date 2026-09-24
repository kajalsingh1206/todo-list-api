import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Shop() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });

        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    const addToCart = (product) => {
        const existingProduct = cart.find(
            (item) => item._id === product._id
        );

        let updatedCart;

        if (existingProduct) {
            updatedCart = cart.map((item) =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [
                ...cart,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        alert(`${product.name} added to cart!`);
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>🛒 Mini E-Commerce Store</h1>

            <div style={{ marginBottom: "30px" }}>
                <Link to="/dashboard">Dashboard</Link>
                {" | "}
                <Link to="/cart">
                    Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
                </Link>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "25px",
                }}
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px",
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />

                        <h2>{product.name}</h2>

                        <p>{product.description}</p>

                        <p>
                            <strong>Category:</strong> {product.category}
                        </p>

                        <h3>₹{product.price}</h3>

                        <button onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Shop;