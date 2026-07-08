// Product recommendation API client

export async function getHybridRecommendations(userId, productId, top = 8) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE || "http://localhost:8081/api"}/recommendations/user/${userId}/product/${productId}?top=${top}`
  );
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return await res.json();
}

export async function getContentBasedRecommendations(productId, top = 5) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE || "http://localhost:8081/api"}/recommendations/content-based/${productId}?top=${top}`
  );
  if (!res.ok) throw new Error("Failed to fetch content-based recommendations");
  return await res.json();
}

export async function getAllProducts() {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE || "http://localhost:8081/api"}/recommendations/products`
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

export async function getProductById(productId) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE || "http://localhost:8081/api"}/recommendations/products/${productId}`
  );
  if (!res.ok) throw new Error("Failed to fetch product");
  return await res.json();
}
