import { useState } from "react";
import { Link } from "react-router-dom";



function Cart() {
    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem("cart")) || []
    );

    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const increaseQuantity = (id) => {
        const updatedCart = cart.map((item) =>
            item._id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );

        updateCart(updatedCart);
    };

    const decreaseQuantity = (id) => {
        const updatedCart = cart
            .map((item) =>
                item._id === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0);

        updateCart(updatedCart);
    };

    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item._id !== id);
        updateCart(updatedCart);
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
            <h1>🛒 Shopping Cart</h1>

            <div style={{ marginBottom: "30px" }}>
                <Link to="/shop">← Continue Shopping</Link>
            </div>

            {cart.length === 0 ? (
                <div>
                    <h2>Your cart is empty</h2>
                    <Link to="/shop">Go to Shop</Link>
                </div>
            ) : (
                <>
                    {cart.map((item) => (
                        <div
                            key={item._id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "15px",
                                marginBottom: "15px",
                            }}
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />

                            <div style={{ flex: 1 }}>
                                <h3>{item.name}</h3>
                                <p>₹{item.price}</p>

                                <div>
                                    <button
                                        onClick={() =>
                                            decreaseQuantity(item._id)
                                        }
                                    >
                                        −
                                    </button>

                                    <span
                                        style={{
                                            margin: "0 15px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQuantity(item._id)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div>
                                <strong>
                                    ₹{item.price * item.quantity}
                                </strong>

                                <br />

                                <button
                                    onClick={() => removeItem(item._id)}
                                    style={{ marginTop: "10px" }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div
                        style={{
                            textAlign: "right",
                            borderTop: "2px solid #ddd",
                            paddingTop: "20px",
                            marginTop: "20px",
                        }}
                    >
                        <h2>Total: ₹{total}</h2>

                        <button
                            onClick={() =>
                                alert("Checkout feature coming soon!")
                            }
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
