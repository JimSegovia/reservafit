import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function CheckoutRouteFallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(client)/(tabs)/classes');
  }, [router]);

  return null;
}
