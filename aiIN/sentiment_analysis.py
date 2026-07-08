"""
BONUS MODULE — SENTIMENT ANALYSIS & INSIGHT EXTRACTION
----------------------------------------------------------
Takes the raw review text (from review_scraper.py) and turns it into
something useful: an overall sentiment score, plus a short list of
"pros" and "cons" sentences.

AI/NLP technique used: TextBlob's sentiment analysis, which uses a
pretrained pattern-based model (no internet download required) to
score text on:
  - polarity: -1 (very negative) to +1 (very positive)
  - subjectivity: 0 (factual) to 1 (opinion-based)

We classify each review as positive / negative / neutral based on its
polarity score, then surface the most positive review as a "pro" and
the most negative as a "con" — a lightweight version of what the
Tobiadefami/recommender project does with a full LLM (OpenAI), but
running entirely offline and for free.
"""

from textblob import TextBlob


def analyze_reviews(reviews):
    """
    reviews: list of {"source": ..., "text": ...} dicts
    returns: dict with overall sentiment score, distribution, and top pros/cons
    """
    scored = []
    for r in reviews:
        polarity = TextBlob(r["text"]).sentiment.polarity
        scored.append({**r, "polarity": polarity})

    if not scored:
        return {
            "average_sentiment": 0,
            "positive_count": 0,
            "negative_count": 0,
            "neutral_count": 0,
            "pros": [],
            "cons": [],
        }

    positive = [r for r in scored if r["polarity"] > 0.15]
    negative = [r for r in scored if r["polarity"] < -0.15]
    neutral = [r for r in scored if -0.15 <= r["polarity"] <= 0.15]

    avg_sentiment = sum(r["polarity"] for r in scored) / len(scored)

    top_pros = sorted(positive, key=lambda r: r["polarity"], reverse=True)[:3]
    top_cons = sorted(negative, key=lambda r: r["polarity"])[:3]

    return {
        "average_sentiment": round(avg_sentiment, 3),
        "positive_count": len(positive),
        "negative_count": len(negative),
        "neutral_count": len(neutral),
        "pros": [r["text"] for r in top_pros],
        "cons": [r["text"] for r in top_cons],
    }


def sentiment_label(score):
    """Convert a numeric average sentiment score into a human-readable label."""
    if score > 0.25:
        return "Mostly Positive"
    elif score > 0.05:
        return "Somewhat Positive"
    elif score > -0.05:
        return "Mixed / Neutral"
    elif score > -0.25:
        return "Somewhat Negative"
    else:
        return "Mostly Negative"


if __name__ == "__main__":
    from review_scraper import get_reviews

    reviews = get_reviews("Samsung Smartphone Pro", "Samsung", num_reviews=12)
    result = analyze_reviews(reviews)

    print(f"Average sentiment: {result['average_sentiment']} ({sentiment_label(result['average_sentiment'])})")
    print(f"Positive: {result['positive_count']} | Negative: {result['negative_count']} | Neutral: {result['neutral_count']}\n")

    print("Top Pros:")
    for p in result["pros"]:
        print(f"  + {p}")

    print("\nTop Cons:")
    for c in result["cons"]:
        print(f"  - {c}")
