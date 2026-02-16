"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "@/lib/CartContext";
import {
  Typography,
  List,
  Button,
  Card,
  Row,
  Col,
  Avatar,
  Space,
  Divider,
  message,
} from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Text } = Typography;

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <ShoppingOutlined
          style={{ fontSize: "64px", color: "#ccc", marginBottom: "24px" }}
        />
        <Title level={3}>Your cart is empty</Title>
        <Link href="/">
          <Button type="primary" size="large">
            Browse Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
      <Title level={2} style={{ marginBottom: "32px" }}>
        Shopping Cart
      </Title>

      <Row gutter={[32, 32]}>
        {/* Left Col: Cart Items */}
        <Col xs={24} lg={16}>
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.image} shape="square" size={64} />}
                  title={<Text strong>{item.name}</Text>}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">Variant: {item.variantName}</Text>
                      <Text>Qty: {item.quantity}</Text>
                    </Space>
                  }
                />
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </List.Item>
            )}
          />
        </Col>

        {/* Right Col: Checkout Summary */}
        <Col xs={24} lg={8}>
          <Card
            title="Order Summary"
            bordered={false}
            style={{ background: "#f9f9f9" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <Text>Subtotal</Text>
              <Text strong>${cartTotal.toFixed(2)}</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <Text>Shipping</Text>
              <Text type="success">Free</Text>
            </div>

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <Title level={4}>Total</Title>
              <Title level={4}>${cartTotal.toFixed(2)}</Title>
            </div>

            {/* PayPal Buttons */}
            <PayPalScriptProvider
              options={{
                clientId: process.env.PAYPAL_CLIENT_ID!,
                currency: "USD",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                createOrder={async () => {
                  const response = await fetch("/api/paypal/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cart }),
                  });
                  const order = await response.json();
                  return order.id;
                }}
                onApprove={async (data) => {
                  try {
                    const response = await fetch("/api/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderID: data.orderID }),
                    });

                    const details = await response.json();
                    if (details.success) {
                      message.success("Payment successful! Order placed.");
                      clearCart();
                      router.push("/success"); // You'll need to create this page
                    } else {
                      message.error("Payment failed.");
                    }
                  } catch {
                    message.error("Transaction error.");
                  }
                }}
              />
            </PayPalScriptProvider>

            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Secure checkout powered by PayPal
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
