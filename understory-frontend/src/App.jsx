import { useState, useEffect } from "react";
import { COLORS } from "./constants/colors";
import { PRODUCTS, TAG_LABELS } from "./constants/products";
import { scoreProduct, bumpProfileObj } from "./utils/productUtils";
import { apiRegister, apiLogin, saveProfileRecord } from "./api/client";

import { GlobalStyle } from "./components/GlobalStyle";
import { AuthScreen } from "./components/AuthScreen";
import { Header } from "./components/Header";
import { TasteProfilePanel } from "./components/TasteProfilePanel";
import { RecommendationsSection } from "./components/RecommendationsSection";
import { CatalogSection } from "./components/CatalogSection";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutForm } from "./components/CheckoutForm";
import { OrderHistory } from "./components/OrderHistory";
import { ProductDetail } from "./components/ProductDetail";
import { AdminPanel } from "./components/AdminPanel";

export default function App() {
  const [screen, setScreen] = useState("auth");
  const [authMode, setAuthMode] = useState("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  const [likes, setLikes] = useState({});
  const [cart, setCart] = useState({});
  const [profile, setProfile] = useState({});
  const [profileVersion, setProfileVersion] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState("All");
  const [checkoutNote, setCheckoutNote] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    console.log('App mounted');
  }, []);

  function persist(username, nextLikes, nextCart, nextProfile) {
    if (!username) return;
    saveProfileRecord(username, { likes: nextLikes, cart: nextCart, profile: nextProfile });
  }

  function toggleLike(product) {
    const willLike = !likes[product.id];
    const nextLikes = { ...likes };
    if (willLike) nextLikes[product.id] = true;
    else delete nextLikes[product.id];
    const nextProfile = bumpProfileObj(profile, product.tags, willLike ? 1 : -1);
    setLikes(nextLikes);
    setProfile(nextProfile);
    setProfileVersion((v) => v + 1);
    if (currentUser && !isGuest) persist(currentUser, nextLikes, cart, nextProfile);
  }

  function addToCart(product) {
    const nextCart = { ...cart, [product.id]: (cart[product.id] || 0) + 1 };
    const nextProfile = bumpProfileObj(profile, product.tags, 1.5);
    setCart(nextCart);
    setProfile(nextProfile);
    setProfileVersion((v) => v + 1);
    setCartOpen(true);
    if (currentUser && !isGuest) persist(currentUser, likes, nextCart, nextProfile);
  }

  function changeQty(id, delta) {
    const nextCart = { ...cart };
    const q = (nextCart[id] || 0) + delta;
    if (q <= 0) delete nextCart[id];
    else nextCart[id] = q;
    setCart(nextCart);
    if (currentUser && !isGuest) persist(currentUser, likes, nextCart, profile);
  }

  async function handleSignup() {
    setAuthError("");
    const uname = authUsername.trim().toLowerCase();
    const email = authEmail.trim().toLowerCase();
    if (!uname || !email || !authPassword) {
      setAuthError("Enter a username, email, and password.");
      return;
    }
    if (!email.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return;
    }
    setAuthBusy(true);
    try {
      await apiRegister(uname, email, authPassword);
      setCurrentUser(uname);
      setIsGuest(false);
      setLikes({});
      setCart({});
      setProfile({});
      setProfileVersion((v) => v + 1);
      setScreen("shop");
      setAuthError("");
    } catch (err) {
      setAuthError(err.message || "Signup failed.");
    } finally {
      setAuthBusy(false);
    }
  }

  function handleBackFromOtp() {
    setAuthError("");
  }

  async function handleLogin() {
    setAuthError("");
    const uname = authUsername.trim().toLowerCase();
    if (!uname || !authPassword) {
      setAuthError("Enter a username and password.");
      return;
    }
    setAuthBusy(true);
    try {
      const saved = await apiLogin(uname, authPassword);
      setCurrentUser(uname);
      setIsGuest(false);
      setLikes((saved && saved.likes) || {});
      setCart((saved && saved.cart) || {});
      setProfile((saved && saved.profile) || {});
      setProfileVersion((v) => v + 1);
      setScreen("shop");
    } catch (err) {
      setAuthError(err.message || "Wrong username or password.");
    } finally {
      setAuthBusy(false);
    }
  }

  function handleGuest() {
    setAuthError("");
    setCurrentUser(null);
    setIsGuest(true);
    setLikes({});
    setCart({});
    setProfile({});
    setProfileVersion((v) => v + 1);
    setScreen("shop");
  }

  function handleLogout() {
    setCurrentUser(null);
    setIsGuest(false);
    setLikes({});
    setCart({});
    setProfile({});
    setProfileVersion((v) => v + 1);
    setAuthUsername("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthMode("login");
    setScreen("auth");
  }

  function handleCheckoutSuccess() {
    setCart({});
    setCartOpen(false);
    setCheckoutOpen(false);
  }

  if (screen === "auth") {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        username={authUsername}
        setUsername={setAuthUsername}
        email={authEmail}
        setEmail={setAuthEmail}
        password={authPassword}
        setPassword={setAuthPassword}
        error={authError}
        busy={authBusy}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGuest={handleGuest}
      />
    );
  }

  const maxProfileVal = Math.max(1, ...Object.values(profile));
  const topTags = Object.entries(profile)
    .filter(([, v]) => v > 0.01)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const recommendations = PRODUCTS.filter((p) => !likes[p.id])
    .map((p) => ({ ...p, score: scoreProduct(p, profile) }))
    .filter((p) => p.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const filteredProducts = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const cartItems = Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty }));
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const cartProfile = {};
  cartItems.forEach((item) => {
    for (const t in item.tags) cartProfile[t] = (cartProfile[t] || 0) + item.tags[t];
  });
  const crossSell = cartItems.length
    ? PRODUCTS.filter((p) => !cart[p.id]).map((p) => ({ ...p, score: scoreProduct(p, cartProfile) })).sort((a, b) => b.score - a.score)[0]
    : null;

  const topTagName = topTags[0] ? TAG_LABELS[topTags[0][0]] : null;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.ink, fontFamily: "'Inter', sans-serif" }}>
      <GlobalStyle />

      <div style={{ position: 'fixed', top: 8, left: 8, zIndex: 10000, background: '#fff9', padding: '0.25rem 0.5rem', borderRadius: 6, fontSize: '0.8rem', color: COLORS.ink }}>
        DEBUG: App mounted
      </div>

      <Header
        isGuest={isGuest}
        currentUser={currentUser}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenOrderHistory={() => setOrderHistoryOpen(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onLogout={handleLogout}
      />

      {isGuest && (
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0.6rem 1.25rem 0" }}>
          <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, margin: 0 }}>
            Browsing as a guest — your picks won't be saved.{" "}
            <button onClick={handleLogout} style={{ background: "none", border: "none", padding: 0, color: COLORS.gold, textDecoration: "underline", cursor: "pointer", fontSize: "0.8rem" }}>
              Sign up to keep them
            </button>
            .
          </p>
        </div>
      )}

      <TasteProfilePanel topTags={topTags} maxProfileVal={maxProfileVal} profileVersion={profileVersion} />

      <RecommendationsSection
        recommendations={recommendations}
        topTagName={topTagName}
        likes={likes}
        profile={profile}
        profileVersion={profileVersion}
        onLike={toggleLike}
        onAdd={addToCart}
        onProductClick={setSelectedProduct}
      />

      <CatalogSection
        filteredProducts={filteredProducts}
        category={category}
        setCategory={setCategory}
        likes={likes}
        onLike={toggleLike}
        onAdd={addToCart}
        onProductClick={setSelectedProduct}
      />

      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          cartTotal={cartTotal}
          crossSell={crossSell}
          checkoutNote={checkoutNote}
          onClose={() => setCartOpen(false)}
          onChangeQty={changeQty}
          onAddCrossSell={addToCart}
          onCheckout={() => setCheckoutOpen(true)}
        />
      )}

      {checkoutOpen && (
        <CheckoutForm
          cartItems={cartItems}
          cartTotal={cartTotal}
          username={currentUser}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {orderHistoryOpen && (
        <OrderHistory
          username={currentUser}
          onClose={() => setOrderHistoryOpen(false)}
        />
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          isLiked={likes[selectedProduct.id]}
          onClose={() => setSelectedProduct(null)}
          onLike={() => toggleLike(selectedProduct)}
          onAddToCart={() => {
            addToCart(selectedProduct);
            setSelectedProduct(null);
          }}
        />
      )}

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
