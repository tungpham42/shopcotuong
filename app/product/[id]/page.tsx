// app/product/[id]/page.tsx
import { getProductDetail } from "@/lib/cj-api";
import {
  Space,
  Tag,
  Divider,
  Typography,
  Row,
  Col,
  Card,
  Image,
  Breadcrumb,
  Empty,
  Button,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import ProductClientWrapper from "./ProductClientWrapper";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

interface ProductVariant {
  vid: string;
  variantKey?: string;
  sellPrice: string | number;
  productWeight?: string | number;
  variantImage?: string;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. Fetch Real Data
  const rawProduct = await getProductDetail(params.id);

  // 2. Handle 404 / Not Found
  if (!rawProduct) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <Empty description="Product not found or removed by supplier" />
        <Link href="/">
          <Button type="primary" style={{ marginTop: 16 }}>
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  // 3. Transform Data
  // CJ prices are wholesale. We must add a markup (e.g., 2x) for retail.
  const RETAIL_MARKUP = 2.0;

  const product = {
    pid: rawProduct.pid,
    name: rawProduct.productNameEn || rawProduct.productName,
    // CJ descriptions are often HTML, we strip tags for a cleaner look or use a safe parser
    description:
      rawProduct.description?.replace(/<[^>]*>?/gm, "") ||
      "Premium Xiangqi Set imported directly from manufacturer.",
    image: rawProduct.productImage,
    variants: rawProduct.variants.map((v: ProductVariant) => ({
      vid: v.vid,
      name: v.variantKey || "Standard",
      // Calculate retail price: (Wholesale Cost * Markup)
      price: parseFloat(String(v.sellPrice)) * RETAIL_MARKUP,
      weight: v.productWeight,
      image: v.variantImage || rawProduct.productImage,
    })),
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
      <Breadcrumb
        items={[
          { href: "/", title: <HomeOutlined /> },
          { title: "Products" },
          { title: product.name },
        ]}
        style={{ marginBottom: "24px" }}
      />

      <Card bordered={false}>
        <Row gutter={[48, 24]}>
          {/* Left Column: Image */}
          <Col xs={24} md={12}>
            <div
              style={{
                background: "#fafafa",
                padding: "24px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                style={{ maxWidth: "100%" }}
              />
            </div>
          </Col>

          {/* Right Column: Details */}
          <Col xs={24} md={12}>
            <Title level={2}>{product.name}</Title>

            <Paragraph
              type="secondary"
              style={{
                fontSize: "16px",
                maxHeight: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.description}
            </Paragraph>

            <Divider />

            {/* Client component handles interactive "Add to Cart" logic */}
            {/* We pass the transformed product object containing real variants */}
            <ProductClientWrapper product={product} />

            <Divider />

            <Space direction="vertical">
              <Text type="secondary">
                <small>Product ID: {product.pid}</small>
              </Text>
              <Space>
                <Tag color="blue">Global Shipping</Tag>
                <Tag color="gold">Verified Supplier</Tag>
              </Space>
              <Text type="warning" style={{ fontSize: "12px" }}>
                * Shipping calculated at checkout
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
