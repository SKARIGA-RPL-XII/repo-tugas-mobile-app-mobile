import { Stack } from "expo-router";
import { OrderProvider } from "../context/OrderContext";

// Pastikan rute awal selalu ke "/" (index.tsx akan redirect ke /login).
export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <OrderProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OrderProvider>
  );
}
