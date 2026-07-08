import { API_BASE } from "./client";

const API_URL = API_BASE;

export async function submitCheckout(orderData) {
  const response = await fetch(`${API_URL}/orders/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to place order");
  }

  return response.json();
}

export async function getOrderHistory(username) {
  const response = await fetch(`${API_URL}/orders/user/${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order history");
  }

  return response.json();
}

export async function getOrderById(orderId) {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }

  return response.json();
}
