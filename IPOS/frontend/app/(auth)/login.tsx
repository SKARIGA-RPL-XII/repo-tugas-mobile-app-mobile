import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    console.log('Login:', { email, password });
    // Add your login logic here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 bg-white"
      >
        {/* Header Image */}
        <View className="relative h-96 bg-black">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Gradient overlay */}
          <View className="absolute inset-0 bg-black/30" />
        </View>

        {/* Login Form Container */}
        <View className="flex-1 bg-white rounded-t-3xl -mt-8 px-6 pt-10">
          {/* Title */}
          <Text className="text-4xl font-bold text-gray-900 mb-8">
            Log In
          </Text>

          {/* Email Input */}
          <View className="mb-4">
            <TextInput
              className="bg-gray-100 rounded-2xl px-6 py-4 text-base text-gray-700"
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View className="mb-4 relative">
            <TextInput
              className="bg-gray-100 rounded-2xl px-6 py-4 pr-14 text-base text-gray-700"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-4"
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity className="mb-6">
            <Text className="text-gray-900 text-base font-medium">
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-black rounded-full py-4 items-center shadow-lg active:opacity-80"
          >
            <Text className="text-white text-lg font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}