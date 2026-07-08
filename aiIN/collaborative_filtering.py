"""
STEP 3: COLLABORATIVE FILTERING (AI Model #2)
-----------------------------------------------
Idea: "Recommend products liked by OTHER users who have SIMILAR taste
to this user" -- this does not look at product text at all, only at
the user-product rating patterns. This is the technique behind
"Users who bought this also bought..." and Netflix's original
recommendation engine.

AI/ML technique used: Matrix Factorization via Truncated SVD
(Singular Value Decomposition).

Why SVD?
- We build a big User x Product matrix of ratings (mostly empty/sparse,
  since one user rates only a few products out of hundreds).
- SVD decomposes this matrix into "latent features" -- hidden factors
  the model discovers on its own (it might learn something like
  "budget-friendliness" or "premium brand preference" without being
  explicitly told these categories exist).
- We then reconstruct the matrix -> this gives a PREDICTED rating for
  every user-product pair, including products the user never rated.
- We recommend the products with the highest predicted rating that
  the user hasn't already interacted with.
"""

import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD


class CollaborativeRecommender:
    def __init__(self, ratings_csv="ratings.csv", products_csv="products.csv", n_factors=20):
        self.ratings = pd.read_csv(ratings_csv)
        self.products = pd.read_csv(products_csv)

        # --- Build the User-Item ratings matrix ---
        self.user_item_matrix = self.ratings.pivot_table(
            index="user_id", columns="product_id", values="rating"
        ).fillna(0)

        self.user_ids = self.user_item_matrix.index.tolist()
        self.product_ids = self.user_item_matrix.columns.tolist()
        
        # Create a mapping of user_id to user_name
        user_name_map = self.ratings[["user_id", "user_name"]].drop_duplicates()
        self.user_names = dict(zip(user_name_map["user_id"], user_name_map["user_name"]))

        # --- AI STEP: Matrix Factorization (SVD) ---
        # Reduce to n_factors "latent taste dimensions"
        n_factors = min(n_factors, min(self.user_item_matrix.shape) - 1)
        self.svd = TruncatedSVD(n_components=n_factors, random_state=42)
        matrix_reduced = self.svd.fit_transform(self.user_item_matrix)          # Users -> latent factors
        reconstructed = np.dot(matrix_reduced, self.svd.components_)            # Reconstruct full matrix

        self.predicted_ratings = pd.DataFrame(
            reconstructed, index=self.user_ids, columns=self.product_ids
        )

    def recommend(self, user_id, top_n=5):
        """Recommend products this user hasn't rated yet, ranked by predicted rating."""
        if user_id not in self.predicted_ratings.index:
            return pd.DataFrame()

        user_predictions = self.predicted_ratings.loc[user_id]

        # Exclude products already rated by the user
        already_rated = self.ratings[self.ratings["user_id"] == user_id]["product_id"].tolist()
        candidates = user_predictions.drop(labels=already_rated, errors="ignore")

        top_products = candidates.sort_values(ascending=False).head(top_n)

        results = self.products[self.products["product_id"].isin(top_products.index)][
            ["product_id", "name", "category", "brand", "price"]
        ].copy()
        results["predicted_rating"] = results["product_id"].map(top_products.round(2))
        return results.sort_values("predicted_rating", ascending=False)


if __name__ == "__main__":
    cf = CollaborativeRecommender()
    test_user = cf.user_ids[0]
    print(f"Recommended for User {test_user} based on similar users' behavior:\n")
    print(cf.recommend(test_user, top_n=5))
