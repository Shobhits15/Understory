"""
STEP 1: DATA GENERATION
-----------------------
In a real project this data would come from your e-commerce database
(products table + orders/reviews table). For this final year project,
we simulate a realistic dataset so the whole system can be demoed
without needing a live company database.

Output:
  products.csv  -> product catalog (id, name, category, description, price, brand)
  ratings.csv   -> user-product interactions (user_id, product_id, rating)
"""

import pandas as pd
import numpy as np
import random

random.seed(42)
np.random.seed(42)

# ---------------------------------------------------------
# 1. Create a product catalog across multiple categories
# ---------------------------------------------------------
categories = {
    "Smartphone": ["Samsung", "Apple", "OnePlus", "Xiaomi", "Realme"],
    "Laptop": ["Dell", "HP", "Lenovo", "Asus", "Apple"],
    "Headphones": ["Sony", "JBL", "Boat", "Bose", "Apple"],
    "Smartwatch": ["Noise", "Fire-Boltt", "Apple", "Samsung", "Fitbit"],
    "Shoes": ["Nike", "Adidas", "Puma", "Reebok", "Bata"],
    "Camera": ["Canon", "Nikon", "Sony", "GoPro", "Fujifilm"],
}

adjectives = ["Pro", "Max", "Ultra", "Lite", "Plus", "Air", "Neo", "Edge", "X", "2024"]

products = []
pid = 1
for cat, brands in categories.items():
    for brand in brands:
        for adj in adjectives:
            name = f"{brand} {cat} {adj}"
            description = (
                f"{brand} {cat} {adj} is a {cat.lower()} known for great "
                f"performance, build quality and value for money. Ideal for "
                f"daily use, {cat.lower()} lovers, and tech enthusiasts."
            )
            price = round(np.random.uniform(999, 89999), 2)
            products.append([pid, name, cat, brand, description, price])
            pid += 1

products_df = pd.DataFrame(
    products, columns=["product_id", "name", "category", "brand", "description", "price"]
)

# ---------------------------------------------------------
# 2. Simulate users and their ratings (1-5) for products
#    Each user has a "taste" for 1-2 categories to make the
#    data realistic (not pure random), so collaborative
#    filtering has real patterns to learn from.
# ---------------------------------------------------------
num_users = 300
ratings = []

all_categories = list(categories.keys())

for user_id in range(1, num_users + 1):
    liked_categories = random.sample(all_categories, k=random.choice([1, 2]))
    num_interactions = random.randint(8, 25)

    liked_products = products_df[products_df["category"].isin(liked_categories)]
    other_products = products_df[~products_df["category"].isin(liked_categories)]

    # Mostly rate products from liked categories (high ratings)
    sample_liked = liked_products.sample(min(len(liked_products), int(num_interactions * 0.8)))
    for _, row in sample_liked.iterrows():
        rating = np.random.choice([3, 4, 5], p=[0.15, 0.35, 0.5])
        ratings.append([user_id, row["product_id"], rating])

    # A few random ratings from other categories (lower ratings on average)
    sample_other = other_products.sample(min(len(other_products), int(num_interactions * 0.2)))
    for _, row in sample_other.iterrows():
        rating = np.random.choice([1, 2, 3, 4], p=[0.3, 0.3, 0.25, 0.15])
        ratings.append([user_id, row["product_id"], rating])

ratings_df = pd.DataFrame(ratings, columns=["user_id", "product_id", "rating"])

# ---------------------------------------------------------
# 3. Save to CSV
# ---------------------------------------------------------
products_df.to_csv("products.csv", index=False)
ratings_df.to_csv("ratings.csv", index=False)

print(f"Generated {len(products_df)} products and {len(ratings_df)} ratings.")
print(products_df.head())
print(ratings_df.head())
