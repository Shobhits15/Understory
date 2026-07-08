import { useState, useEffect } from "react";
import { X, Package, Calendar, User, MapPin, Phone, CreditCard, Loader } from "lucide-react";
import { COLORS } from "../constants/colors";
import { getOrderHistory } from "../api/checkout";

export function OrderHistory({ username, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderHistory(username || "guest");
        setOrders(data || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [username]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#F59E0B";
      case "confirmed":
        return "#10B981";
      case "shipped":
        return "#3B82F6";
      case "delivered":
        return "#059669";
      case "cancelled":
        return "#EF4444";
      default:
        return COLORS.gold;
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(32,43,34,0.8)", overflow: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800, margin: "2rem auto", background: COLORS.bg, borderRadius: 16, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", borderBottom: `1px solid ${COLORS.line}`, background: `${COLORS.gold}08` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Package size={24} style={{ color: COLORS.gold }} />
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.4rem", margin: 0 }}>Order History</h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ maxHeight: "80vh", overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <Loader size={32} style={{ color: COLORS.gold, animation: "spin 1s linear infinite" }} />
              <p style={{ color: COLORS.inkSoft }}>Loading your orders...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem", background: `${COLORS.gold}15`, borderRadius: 12, border: `1px solid ${COLORS.gold}`, color: COLORS.gold }}>
              <p style={{ margin: 0 }}>❌ {error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <Package size={48} style={{ color: COLORS.inkSoft, margin: "0 auto", display: "block", marginBottom: "1rem" }} />
              <p style={{ color: COLORS.inkSoft, fontSize: "1rem" }}>No orders yet</p>
              <p style={{ color: COLORS.gold, fontSize: "0.9rem" }}>Start shopping to place your first order!</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.orderId} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 12, overflow: "hidden" }}>
                <div
                  onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    background: COLORS.line,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${COLORS.gold}10`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.line)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                      <p style={{ fontWeight: 600, fontSize: "1rem", margin: 0, color: COLORS.ink }}>{order.orderId}</p>
                      <span style={{ background: getStatusColor(order.orderStatus), color: "white", padding: "0.25rem 0.75rem", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "2rem", fontSize: "0.9rem", color: COLORS.inkSoft }}>
                      <span>🗓️ {formatDate(order.createdAt)}</span>
                      <span>💰 ₹{order.totalAmount?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.5rem", transform: expandedOrder === order.orderId ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                </div>

                {expandedOrder === order.orderId && (
                  <div style={{ padding: "1.5rem", borderTop: `1px solid ${COLORS.line}`, display: "grid", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.25rem 0" }}>
                          <User size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
                          CUSTOMER
                        </p>
                        <p style={{ margin: "0 0 0.75rem 0", fontWeight: 500, color: COLORS.ink }}>{order.fullName}</p>
                        <p style={{ fontSize: "0.85rem", color: COLORS.inkSoft, margin: "0 0 0.5rem 0" }}>{order.email}</p>
                        <p style={{ fontSize: "0.85rem", color: COLORS.inkSoft, margin: 0 }}>
                          <Phone size={14} style={{ display: "inline", marginRight: "0.5rem" }} />
                          {order.phone}
                        </p>
                      </div>

                      <div>
                        <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.25rem 0" }}>
                          <MapPin size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
                          DELIVERY ADDRESS
                        </p>
                        <p style={{ margin: "0 0 0.5rem 0", fontWeight: 500, color: COLORS.ink }}>{order.address}</p>
                        <p style={{ fontSize: "0.85rem", color: COLORS.inkSoft, margin: 0 }}>
                          {order.city}, {order.pincode}
                        </p>
                      </div>
                    </div>

                    <div style={{ background: COLORS.line, borderRadius: 8, padding: "1rem" }}>
                      <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.75rem 0" }}>
                        <CreditCard size={16} style={{ display: "inline", marginRight: "0.5rem" }} />
                        PAYMENT MODE
                      </p>
                      <p style={{ margin: 0, fontWeight: 500, color: COLORS.ink, textTransform: "uppercase" }}>
                        {order.paymentMode === "cod" ? "Cash on Delivery" : order.paymentMode === "card" ? "Debit/Credit Card" : order.paymentMode === "upi" ? "UPI Apps" : "Net Banking"}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.75rem 0" }}>📦 ITEMS</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", padding: "0.5rem", background: COLORS.line, borderRadius: 6, paddingLeft: "0.75rem" }}>
                            <span style={{ color: COLORS.ink }}>
                              {item.productName || item.name} (×{item.quantity || item.qty})
                            </span>
                            <span style={{ fontWeight: 600, color: COLORS.gold }}>₹{(item.price * (item.quantity || item.qty)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", borderTop: `1px solid ${COLORS.line}`, fontWeight: 600, fontSize: "1.1rem" }}>
                      <span>Total:</span>
                      <span style={{ color: COLORS.gold }}>₹{order.totalAmount?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
