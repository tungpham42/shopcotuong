import { getXiangqiProducts } from "@/lib/cj-api";
import ProductCard from "@/components/ProductCard";
import { Layout, Typography, Row, Col, Empty } from "antd";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface Product {
  pid: string;
  productNameEn?: string;
  productName: string;
  productImage: string;
  sellPrice: string;
}

export default async function Home() {
  const products = await getXiangqiProducts(1, 24);

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#5e0b0b", // Deep red
          padding: "0 50px",
        }}
      >
        <div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>
          🐘 Xiangqi Masters
        </div>
        <div style={{ color: "rgba(255,255,255,0.8)" }}>Global Store</div>
      </Header>

      <Content
        style={{
          padding: "50px",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Title level={2}>Premium Chinese Chess Sets</Title>
          <Text type="secondary">
            Authentic craftsmanship sourced directly from manufacturers
          </Text>
        </div>

        {products.length > 0 ? (
          <Row gutter={[24, 24]}>
            {products.map((item: Product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.pid}>
                <ProductCard
                  product={{
                    pid: item.pid,
                    productName: item.productNameEn || item.productName,
                    productImage: item.productImage,
                    sellPrice: item.sellPrice,
                    inventory: 100,
                  }}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ padding: "100px 0" }}>
            <Empty description="No products found" />
          </div>
        )}
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Xiangqi Masters Shop ©2025 Created with Next.js & Ant Design
      </Footer>
    </Layout>
  );
}
