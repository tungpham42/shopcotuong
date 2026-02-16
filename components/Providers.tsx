"use client";

import { CartProvider } from "@/lib/CartContext";
import StyledComponentsRegistry from "@/lib/antd-registry";
import { ConfigProvider } from "antd";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#8c1c13", // Xiangqi Red
            borderRadius: 4,
          },
        }}
      >
        <CartProvider>{children}</CartProvider>
      </ConfigProvider>
    </StyledComponentsRegistry>
  );
}
