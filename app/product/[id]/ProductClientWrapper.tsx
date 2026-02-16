// app/product/[id]/ProductClientWrapper.tsx
"use client";

import React, { useState } from "react";
import {
  Button,
  Radio,
  InputNumber,
  Space,
  Typography,
  message,
  Divider,
} from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useCart } from "@/lib/CartContext";
import type { RadioChangeEvent } from "antd";

const { Title, Text } = Typography;

interface Variant {
  vid: string;
  name: string;
  price: number;
  weight: number;
  image?: string;
}

interface Product {
  pid: string;
  name: string;
  image: string;
  variants: Variant[];
}

export default function ProductClientWrapper({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0],
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Handle Variant Change
  const handleVariantChange = (e: RadioChangeEvent) => {
    const variantId = e.target.value;
    const variant = product.variants.find((v) => v.vid === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    setLoading(true);

    // Simulate a brief network delay for better UX feel
    setTimeout(() => {
      addToCart({
        id: selectedVariant.vid, // CJ Variant ID
        pid: product.pid, // Product ID
        name: product.name,
        variantName: selectedVariant.name,
        price: selectedVariant.price,
        image: selectedVariant.image || product.image,
        weight: selectedVariant.weight,
        quantity: quantity,
      });

      message.success(`${quantity} x ${product.name} added to cart!`);
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      {/* 1. Dynamic Price Display */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ color: "#cf1322", margin: 0 }}>
          ${selectedVariant.price.toFixed(2)}
        </Title>
        {selectedVariant.weight > 0 && (
          <Text type="secondary">Weight: {selectedVariant.weight}g</Text>
        )}
      </div>

      {/* 2. Variant Selector */}
      <div style={{ marginBottom: "24px" }}>
        <Text strong style={{ display: "block", marginBottom: "8px" }}>
          Select Option:
        </Text>
        <Radio.Group
          value={selectedVariant.vid}
          onChange={handleVariantChange}
          buttonStyle="solid"
          size="large"
        >
          {product.variants.map((variant) => (
            <Radio.Button key={variant.vid} value={variant.vid}>
              {variant.name}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <Divider />

      {/* 3. Quantity & Action Buttons */}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space align="center">
          <Text strong>Quantity:</Text>
          <InputNumber
            min={1}
            max={99}
            value={quantity}
            onChange={(value) => setQuantity(value || 1)}
            size="large"
          />
        </Space>

        <Space style={{ width: "100%" }} direction="vertical">
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            loading={loading}
            onClick={handleAddToCart}
            block
            style={{ height: "50px", fontSize: "18px" }}
          >
            Add to Cart
          </Button>

          {/* Optional: "Buy Now" button could go directly to checkout */}
          <Button
            size="large"
            icon={<ThunderboltOutlined />}
            block
            style={{
              height: "50px",
              fontSize: "18px",
              borderColor: "#faad14",
              color: "#faad14",
            }}
            onClick={() => {
              handleAddToCart();
              // In a real app, you might redirect: router.push('/cart');
            }}
          >
            Buy Now
          </Button>
        </Space>
      </Space>

      {/* 4. Safe Seals (Visual Trust) */}
      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <Space size="large" style={{ opacity: 0.6 }}>
          <Space direction="vertical" size={0} align="center">
            <ThunderboltOutlined style={{ fontSize: "24px" }} />
            <Text style={{ fontSize: "12px" }}>Fast Shipping</Text>
          </Space>
          <Space direction="vertical" size={0} align="center">
            <ShoppingCartOutlined style={{ fontSize: "24px" }} />
            <Text style={{ fontSize: "12px" }}>Secure Checkout</Text>
          </Space>
        </Space>
      </div>
    </div>
  );
}
