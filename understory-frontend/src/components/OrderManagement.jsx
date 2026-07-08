import { useState, useEffect } from "react";
import { X, Package, CheckCircle, XCircle, Truck, Home, Loader } from "lucide-react";
import { COLORS } from "../constants/colors";
import { API_BASE } from "../api/client";

export function OrderManagement({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/orders/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data || []);
      setError("");
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdating(orderId);
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? updatedOrder : o))
      );

      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusUpdating(null);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "confirmed":
        return "✅";
      case "shipped":
        return "🚚";
      case "delivered":
        return "📦";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === filter);

  const statuses = [
    { value: "pending", label: "Pending ⏳", color: "#F59E0B" },
    { value: "confirmed", label: "Confirmed ✅", color: "#10B981" },
    { value: "shipped", label: "Shipped 🚚", color: "#3B82F6" },
    { value: "delivered", label: "Delivered 📦", color: "#059669" },
    { value: "cancelled", label: "Cancelled ❌", color: "#EF4444" },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(32,43,34,0.8)", overflow: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 1000, margin: "2rem auto", background: COLORS.bg, borderRadius: 16, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", borderBottom: `1px solid ${COLORS.line}`, background: `${COLORS.gold}08` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Package size={24} style={{ color: COLORS.gold }} />
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.4rem", margin: 0 }}>Order Management</h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ maxHeight: "80vh", overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
            <div style={{ background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: "1rem", textAlign: "center" }}>
              <p style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>📦</p>
              <p style={{ fontSize: "0.9rem", color: COLORS.inkSoft, margin: "0 0 0.25rem 0" }}>Total Orders</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 600, color: COLORS.ink, margin: 0 }}>{orders.length}</p>
            </div>
            {statuses.slice(0, 4).map((status) => (
              <div key={status.value} style={{ background: `${status.color}15`, border: `1px solid ${status.color}`, borderRadius: 12, padding: "1rem", textAlign: "center" }}>
                <p style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0" }}>{getStatusIcon(status.value)}</p>
                <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, margin: "0 0 0.25rem 0" }}>{status.label}</p>
                <p style={{ fontSize: "1.3rem", fontWeight: 600, color: status.color, margin: 0 }}>
                  {orders.filter((o) => o.orderStatus === status.value).length}
                </p>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "1rem", background: `#EF44441A`, border: `1px solid #EF4444`, borderRadius: 8, color: "#EF4444", fontSize: "0.9rem" }}>
              <XCircle size={18} />
              {error}
            </div>
          )}

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                border: `2px solid ${filter === "all" ? COLORS.gold : COLORS.line}`,
                background: filter === "all" ? `${COLORS.gold}15` : "transparent",
                color: filter === "all" ? COLORS.gold : COLORS.inkSoft,
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.9rem",
                transition: "all 0.2s",
              }}
            >
              All ({orders.length})
            </button>
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: `2px solid ${filter === status.value ? status.color : COLORS.line}`,
                  background: filter === status.value ? `${status.color}15` : "transparent",
                  color: filter === status.value ? status.color : COLORS.inkSoft,
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                }}
              >
                {status.label} ({orders.filter((o) => o.orderStatus === status.value).length})
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <Loader size={32} style={{ color: COLORS.gold, animation: "spin 1s linear infinite" }} />
              <p style={{ color: COLORS.inkSoft }}>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <Package size={48} style={{ color: COLORS.inkSoft, margin: "0 auto", display: "block", marginBottom: "1rem" }} />
              <p style={{ color: COLORS.inkSoft, fontSize: "1rem" }}>No orders found</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filteredOrders.map((order) => (
                <div key={order.orderId} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 12, overflow: "hidden" }}>
                  {/* Order Header */}
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
                        <span
                          style={{
                            background: getStatusColor(order.orderStatus),
                            color: "white",
                            padding: "0.25rem 0.75rem",
                            borderRadius: 20,
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {getStatusIcon(order.orderStatus)} {order.orderStatus}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "2rem", fontSize: "0.85rem", color: COLORS.inkSoft }}>
                        <span>👤 {order.fullName}</span>
                        <span>💰 ₹{order.totalAmount?.toFixed(2) || "0.00"}</span>
                        <span>📅 {formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "1.5rem", transform: expandedOrder === order.orderId ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                  </div>

                  {/* Order Details */}
                  {expandedOrder === order.orderId && (
                    <div style={{ padding: "1.5rem", borderTop: `1px solid ${COLORS.line}`, display: "grid", gap: "1.5rem" }}>
                      {/* Customer & Delivery Info */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div>
                          <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.75rem 0" }}>CUSTOMER</p>
                          <p style={{ margin: "0 0 0.5rem 0", fontWeight: 500, color: COLORS.ink }}>{order.fullName}</p>
                          <p style={{ fontSize: "0.85rem", color: COLORS.inkSoft, margin: "0 0 0.25rem 0" }}>📧 {order.email}</p>
                          <p style={{ fontSize: "0.85rem", color: COLORS.inkSoft, margin: 0 }}>📱 {order.phone}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.75rem 0" }}>DELIVERY ADDRESS</p>
                          <p style={{ margin: "0 0 0.5rem 0", fontWeight: 500, color: COLORS.ink }}>{order.address}</p>
                          <p style={{ fontSize: "0.85rem", color: COLORS.inkSoft, margin: 0 }}>
                            {order.city}, {order.pincode}
                          </p>
                        </div>
                      </div>

                      {/* Payment & Items */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ background: COLORS.line, borderRadius: 8, padding: "1rem" }}>
                          <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.75rem 0" }}>PAYMENT MODE</p>
                          <p style={{ margin: 0, fontWeight: 500, color: COLORS.ink, textTransform: "uppercase" }}>
                            {order.paymentMode === "cod"
                              ? "Cash on Delivery"
                              : order.paymentMode === "card"
                              ? "Debit/Credit Card"
                              : order.paymentMode === "upi"
                              ? "UPI Apps"
                              : "Net Banking"}
                          </p>
                        </div>
                        <div style={{ background: COLORS.line, borderRadius: 8, padding: "1rem" }}>
                          <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.75rem 0" }}>TOTAL AMOUNT</p>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: "1.2rem", color: COLORS.gold }}>₹{order.totalAmount?.toFixed(2) || "0.00"}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.75rem 0" }}>📦 ITEMS</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", padding: "0.75rem", background: COLORS.line, borderRadius: 6 }}>
                              <span style={{ color: COLORS.ink }}>
                                {item.productName || item.name} (×{item.quantity || item.qty})
                              </span>
                              <span style={{ fontWeight: 600, color: COLORS.gold }}>₹{(item.price * (item.quantity || item.qty)).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Update Buttons */}
                      <div>
                        <p style={{ fontSize: "0.8rem", color: COLORS.inkSoft, fontWeight: 600, margin: "0 0 0.75rem 0" }}>UPDATE STATUS</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.75rem" }}>
                          {statuses.map((status) => (
                            <button
                              key={status.value}
                              onClick={() => updateOrderStatus(order.orderId, status.value)}
                              disabled={statusUpdating === order.orderId || order.orderStatus === status.value}
                              style={{
                                padding: "0.75rem",
                                borderRadius: 8,
                                border: `2px solid ${status.color}`,
                                background: order.orderStatus === status.value ? status.color : `${status.color}15`,
                                color: order.orderStatus === status.value ? "white" : status.color,
                                cursor: statusUpdating === order.orderId || order.orderStatus === status.value ? "not-allowed" : "pointer",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                transition: "all 0.2s",
                                opacity: statusUpdating === order.orderId || order.orderStatus === status.value ? 0.6 : 1,
                              }}
                            >
                              {statusUpdating === order.orderId ? "..." : `${getStatusIcon(status.value)} ${status.label.split(" ")[0]}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
