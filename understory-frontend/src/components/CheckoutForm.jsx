import { X, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { COLORS } from "../constants/colors";
import { CATEGORY_META } from "../constants/products";
import { imageUrl } from "../utils/productUtils";
import { submitCheckout } from "../api/checkout";

export function CheckoutForm({ cartItems, cartTotal, username, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMode: "cod",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Phone must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    if (!formData.paymentMode) newErrors.paymentMode = "Select a payment mode";
    if (!cartItems || cartItems.length === 0) newErrors.submit = "Your cart is empty";
    if (cartTotal <= 0) newErrors.submit = "Cart total must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        username: username || "guest",
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        paymentMode: formData.paymentMode,
        items: cartItems.map((item) => ({ id: item.id, name: item.name, price: item.price, qty: item.qty })),
        totalAmount: cartTotal,
      };

      console.log("📦 Submitting order:", orderData);
      const response = await submitCheckout(orderData);
      console.log("✅ Order success:", response);
      setSuccessMsg(`✓ Order #${response.orderId} placed successfully! We'll contact you soon.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Order error:", err);
      setErrors({ submit: err.message || "Failed to place order" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(32,43,34,0.5)", overflow: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600, margin: "2rem auto", background: COLORS.bg, borderRadius: 16, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", borderBottom: `1px solid ${COLORS.line}` }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.4rem", margin: 0 }}>Checkout</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {successMsg ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <CheckCircle size={56} style={{ color: COLORS.gold, margin: "0 auto", display: "block", marginBottom: "1.5rem" }} />
              <p style={{ fontSize: "1.1rem", fontWeight: 600, color: COLORS.ink, marginBottom: "0.5rem" }}>Order Placed Successfully! 🎉</p>
              <p style={{ fontSize: "0.95rem", color: COLORS.inkSoft, marginBottom: "1.5rem" }}>{successMsg}</p>
              <p style={{ fontSize: "0.85rem", color: COLORS.gold, fontStyle: "italic" }}>Redirecting you back...</p>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div style={{ background: COLORS.line, borderRadius: 12, padding: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, margin: "0 0 0.75rem 0", color: COLORS.inkSoft }}>ORDER SUMMARY</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span>{item.name} × {item.qty}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${COLORS.line}`, marginTop: "0.75rem", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                  <span>Total:</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Personal Details */}
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.ink, marginBottom: "0.75rem" }}>Personal Details</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} style={{ padding: "0.75rem", border: `1px solid ${errors.fullName ? COLORS.gold : COLORS.line}`, borderRadius: 8, fontFamily: "inherit", fontSize: "0.95rem", boxSizing: "border-box" }} />
                    {errors.fullName && <span style={{ fontSize: "0.75rem", color: COLORS.gold }}>{errors.fullName}</span>}

                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} style={{ padding: "0.75rem", border: `1px solid ${errors.email ? COLORS.gold : COLORS.line}`, borderRadius: 8, fontFamily: "inherit", fontSize: "0.95rem", boxSizing: "border-box" }} />
                    {errors.email && <span style={{ fontSize: "0.75rem", color: COLORS.gold }}>{errors.email}</span>}

                    <input type="tel" name="phone" placeholder="Phone Number (10 digits)" value={formData.phone} onChange={handleInputChange} style={{ padding: "0.75rem", border: `1px solid ${errors.phone ? COLORS.gold : COLORS.line}`, borderRadius: 8, fontFamily: "inherit", fontSize: "0.95rem", boxSizing: "border-box" }} />
                    {errors.phone && <span style={{ fontSize: "0.75rem", color: COLORS.gold }}>{errors.phone}</span>}
                  </div>
                </div>

                {/* Address Details */}
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.ink, marginBottom: "0.75rem" }}>Delivery Address</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <textarea name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} rows={3} style={{ padding: "0.75rem", border: `1px solid ${errors.address ? COLORS.gold : COLORS.line}`, borderRadius: 8, fontFamily: "inherit", fontSize: "0.95rem", boxSizing: "border-box", resize: "none" }} />
                    {errors.address && <span style={{ fontSize: "0.75rem", color: COLORS.gold }}>{errors.address}</span>}

                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} style={{ padding: "0.75rem", border: `1px solid ${errors.city ? COLORS.gold : COLORS.line}`, borderRadius: 8, fontFamily: "inherit", fontSize: "0.95rem", boxSizing: "border-box" }} />
                    {errors.city && <span style={{ fontSize: "0.75rem", color: COLORS.gold }}>{errors.city}</span>}

                    <input type="text" name="pincode" placeholder="Pincode (6 digits)" value={formData.pincode} onChange={handleInputChange} style={{ padding: "0.75rem", border: `1px solid ${errors.pincode ? COLORS.gold : COLORS.line}`, borderRadius: 8, fontFamily: "inherit", fontSize: "0.95rem", boxSizing: "border-box" }} />
                    {errors.pincode && <span style={{ fontSize: "0.75rem", color: COLORS.gold }}>{errors.pincode}</span>}
                  </div>
                </div>

                {/* Payment Mode */}
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: COLORS.ink, marginBottom: "0.75rem" }}>Payment Mode</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {[
                      { value: "cod", label: "💵 Cash on Delivery" },
                      { value: "card", label: "💳 Debit/Credit Card" },
                      { value: "upi", label: "📱 UPI Apps" },
                      { value: "netbanking", label: "🏦 Net Banking" },
                    ].map((option) => (
                      <label key={option.value} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem", border: `2px solid ${formData.paymentMode === option.value ? COLORS.gold : COLORS.line}`, borderRadius: 8, cursor: "pointer", background: formData.paymentMode === option.value ? `${COLORS.goldSoft}20` : "transparent", transition: "all 0.2s" }}>
                        <input type="radio" name="paymentMode" value={option.value} checked={formData.paymentMode === option.value} onChange={handleInputChange} style={{ cursor: "pointer" }} />
                        <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.paymentMode && <span style={{ fontSize: "0.75rem", color: COLORS.gold, display: "block", marginTop: "0.5rem" }}>{errors.paymentMode}</span>}
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.75rem", background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}`, borderRadius: 8, color: COLORS.gold, fontSize: "0.9rem" }}>
                    <AlertCircle size={18} />
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button */}
                <button type="submit" disabled={loading} style={{ padding: "1rem", background: COLORS.ink, color: COLORS.bg, border: "none", borderRadius: 10, fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Processing..." : `Place Order - $${cartTotal.toFixed(2)}`}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
