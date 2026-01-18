import { Stack } from 'expo-router';
import { OrderProvider } from "../app/components/orderContext";

export default function RootLayout() {
  return (
    <OrderProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OrderProvider>
  );
}