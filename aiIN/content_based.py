"""
STEP 2: CONTENT-BASED FILTERING (AI Model #1)
----------------------------------------------
Idea: "Recommend products that are SIMILAR to a product the user likes,
based on the product's own text content (description, category, brand)."

AI/ML technique used: TF-IDF (Term Frequency - Inverse Document Frequency)
+ Cosine Similarity.

- TF-IDF converts each product's text description into a numeric vector,
  where words that are frequent in one product but rare across all
  products get a higher weight (these words are more "meaningful").
- Cosine Similarity then measures the angle between two product vectors
  to say how similar two products are (1 = identical, 0 = unrelated).

This is a classic NLP-based recommendation approach used by Amazon,
Netflix, etc. as one part of their recommendation pipeline.
"""

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class ContentBasedRecommender:
    def __init__(self, products_csv="products.csv"):
        self.products = pd.read_csv(products_csv)

        # Combine multiple text fields into one "content soup" per product
        self.products["content"] = (
            self.products["category"] + " " +
            self.products["brand"] + " " +
            self.products["description"]
        )

        # --- AI STEP: Convert text -> numeric vectors ---
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(self.products["content"])

        # --- AI STEP: Precompute similarity between every pair of products ---
        self.similarity_matrix = cosine_similarity(self.tfidf_matrix)

        # Map product_id -> row index for fast lookup
        self.index_map = pd.Series(
            self.products.index, index=self.products["product_id"]
        )

    def recommend(self, product_id, top_n=5):
        """Given a product the user liked/viewed, return top_n similar products."""
        if product_id not in self.index_map:
            return pd.DataFrame()

        idx = self.index_map[product_id]
        scores = list(enumerate(self.similarity_matrix[idx]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)

        # Skip index 0 because that's the product itself
        top_indices = [i for i, _ in scores[1: top_n + 1]]

        results = self.products.iloc[top_indices][
            ["product_id", "name", "category", "brand", "price"]
        ].copy()
        results["similarity_score"] = [round(scores[i + 1][1], 3) for i in range(len(top_indices))]
        return results


if __name__ == "__main__":
    cb = ContentBasedRecommender()
    sample_product = cb.products.iloc[0]
    print(f"Because you viewed: {sample_product['name']} ({sample_product['category']})\n")
    print(cb.recommend(sample_product["product_id"], top_n=5))
