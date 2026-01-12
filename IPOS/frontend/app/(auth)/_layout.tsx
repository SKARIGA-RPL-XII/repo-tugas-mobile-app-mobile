import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
        animation: 'slide_from_right',
      }}
    >
      {/* Login Screen */}
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />

      {/* Register Screen */}
      <Stack.Screen
        name="register"
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />

      {/* Forgot Password Screen */}
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Forgot Password',
          headerShown: false,
        }}
      />

      {/* OTP Verification Screen */}
      <Stack.Screen
        name="otp-verification"
        options={{
          title: 'Verify OTP',
          headerShown: false,
          // Prevent going back
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}