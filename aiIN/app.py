"""
STEP 5: WEB APP (Demo Interface)
---------------------------------
A simple Streamlit UI so you can DEMO the recommendation system live
during your presentation, instead of just showing code output in a
terminal. Streamlit turns this Python script into a web app with almost
no extra frontend code.

To run:
    streamlit run app.py
"""

import streamlit as st
from hybrid_recommender import HybridRecommender

st.set_page_config(page_title="AI Product Recommender", layout="wide")

st.title("🛍️ AI-Based Product Recommendation System")
st.caption("Content-Based Filtering + Collaborative Filtering (SVD) + Hybrid AI Model")

# Load the model once and cache it (so it isn't rebuilt/retrained on every click)
@st.cache_resource
def load_model():
    return HybridRecommender(alpha=0.4, beta=0.3, use_deep=True)

with st.spinner("Training models (TF-IDF, SVD, and Neural Network)... this happens once."):
    hybrid = load_model()
products = hybrid.products

col1, col2 = st.columns(2)

with col1:
    # Display user names instead of user IDs
    user_options = [f"{hybrid.cf_model.user_names.get(uid, f'User {uid}')} (ID: {uid})" for uid in hybrid.cf_model.user_ids]
    selected_user = st.selectbox("Select a User", user_options)
    user_id = int(selected_user.split("ID: ")[1].rstrip(")"))

with col2:
    product_name = st.selectbox("Product recently viewed by this user", products["name"])
    product_id = int(products[products["name"] == product_name]["product_id"].values[0])

st.markdown("**Adjust blend weights** (must add up to ≤ 1; remainder goes to SVD collaborative filtering)")
c1, c2 = st.columns(2)
with c1:
    alpha = st.slider("Content-Based weight", 0.0, 1.0, 0.4, 0.1)
with c2:
    beta = st.slider("Deep Learning (NCF) weight", 0.0, 1.0, 0.3, 0.1)
hybrid.alpha = alpha
hybrid.beta = beta

if st.button("Get Recommendations 🚀"):
    st.subheader("🔀 Final Hybrid Recommendations (Content + SVD + Deep Learning)")
    recs = hybrid.recommend(user_id, product_id, top_n=8)
    st.dataframe(recs, use_container_width=True)

    col_a, col_b, col_c = st.columns(3)
    with col_a:
        st.markdown("**📝 Content-Based**\n(TF-IDF + Cosine Similarity)")
        st.dataframe(hybrid.cb_model.recommend(product_id, top_n=5), use_container_width=True)
    with col_b:
        st.markdown("**👥 Collaborative Filtering**\n(SVD Matrix Factorization)")
        st.dataframe(hybrid.cf_model.recommend(user_id, top_n=5), use_container_width=True)
    with col_c:
        st.markdown("**🧠 Deep Learning**\n(Neural Collaborative Filtering)")
        st.dataframe(hybrid.deep_model.recommend(user_id, top_n=5), use_container_width=True)

    st.divider()
    st.subheader(f"💬 What people are saying about: {product_name}")
    st.caption("Pulled from Reddit/YouTube reviews (real API if configured, simulated otherwise) and scored with sentiment analysis.")

    with st.spinner("Analyzing reviews..."):
        insights = hybrid.get_review_insights(product_id)

    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Overall Verdict", insights["sentiment_label"])
    m2.metric("Positive Reviews", insights["positive_count"])
    m3.metric("Negative Reviews", insights["negative_count"])
    m4.metric("Neutral Reviews", insights["neutral_count"])

    rc1, rc2 = st.columns(2)
    with rc1:
        st.markdown("**✅ Top Pros**")
        if insights["pros"]:
            for p in insights["pros"]:
                st.markdown(f"- {p}")
        else:
            st.caption("No strongly positive reviews found.")
    with rc2:
        st.markdown("**⚠️ Top Cons**")
        if insights["cons"]:
            for c in insights["cons"]:
                st.markdown(f"- {c}")
        else:
            st.caption("No strongly negative reviews found.")

with st.expander("ℹ️ How this works"):
    st.markdown("""
    - **Content-Based Filtering**: Uses TF-IDF + Cosine Similarity on product
      descriptions to find products similar to what the user viewed.
    - **Collaborative Filtering (SVD)**: Uses matrix factorization on the
      user-product ratings matrix to predict how a user would rate products
      they haven't tried yet, based on linear patterns from similar users.
    - **Deep Learning (Neural Collaborative Filtering)**: A PyTorch neural
      network learns user & product embeddings and combines them through a
      multi-layer perceptron, capturing non-linear taste patterns that SVD
      can miss.
    - **Hybrid Model**: Combines all three scores using tunable weights, so
      recommendations are personalized, relevant to recent activity, and
      benefit from deep pattern learning.
    - **Review Mining (bonus)**: Pulls real or simulated Reddit/YouTube
      comments about a product and scores them with sentiment analysis
      (TextBlob) to surface an overall verdict plus top pros and cons —
      giving a "why" behind the numbers, not just a predicted rating.
    """)
