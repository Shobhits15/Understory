import { TAG_LABELS } from "../constants/products";

export function imageUrl(product) {
  if (!product || !product.image) return "";
  if (typeof product.image === "string" && product.image.startsWith("http")) return product.image;
  const lock = product.id ? product.id.replace(/\D/g, "") : "";
  return `https://loremflickr.com/400/300/${encodeURIComponent(product.image)}?lock=${lock}`;
}

export function scoreProduct(product, profile) {
  let score = 0;
  for (const tag in product.tags) {
    if (profile[tag]) score += product.tags[tag] * profile[tag];
  }
  return score;
}

export function topSharedTags(product, profile, n = 2) {
  return Object.keys(product.tags)
    .filter((t) => profile[t])
    .sort((a, b) => product.tags[b] * profile[b] - product.tags[a] * profile[a])
    .slice(0, n)
    .map((t) => TAG_LABELS[t]);
}

export function bumpProfileObj(base, tags, weight) {
  const next = { ...base };
  for (const t in tags) {
    next[t] = Math.max(0, (next[t] || 0) + tags[t] * weight);
  }
  return next;
}
