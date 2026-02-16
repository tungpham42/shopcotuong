"use client";

import { Card, Button, Tag, Typography, Space } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

const { Meta } = Card;
const { Text } = Typography;

interface ProductProps {
  pid: string;
  productName: string;
  productImage: string;
  sellPrice: string;
  inventory: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  return (
    <Card
      hoverable
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
      bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
      cover={
        <div
          style={{
            height: 250,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f5f5",
            overflow: "hidden",
          }}
        >
          <Image
            alt={product.productName}
            src={product.productImage}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      }
      actions={[
        <Link href={`/product/${product.pid}`} key="view">
          <Button type="text" icon={<EyeOutlined />}>
            Details
          </Button>
        </Link>,
        <Button key="buy" type="primary" icon={<ShoppingCartOutlined />}>
          Add
        </Button>,
      ]}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Meta
          title={
            <div
              style={{
                whiteSpace: "normal",
                height: "48px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {product.productName}
            </div>
          }
        />
        <div style={{ marginTop: "auto", paddingTop: "16px" }}>
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: "20px", color: "#cf1322" }}>
              ${product.sellPrice}
            </Text>
            <div>
              {product.inventory > 0 ? (
                <Tag color="success">In Stock</Tag>
              ) : (
                <Tag color="error">Out of Stock</Tag>
              )}
            </div>
          </Space>
        </div>
      </div>
    </Card>
  );
}
