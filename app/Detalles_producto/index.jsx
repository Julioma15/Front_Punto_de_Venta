import { useRouter } from 'expo-router';
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductDetails from '../../components/ProductDetails';

export default function DetallesProductoPage() {
  const router = useRouter();

  const product = {
    id: '0001',
    name: 'Sabritas Original',
    description: 'Sabritas Original 18gr',
    stock: 32,
    price: '$ 22.00',
    barcode: '784222156864',
    image: require('../assets/images/sabritas_original.png'),
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}> 
      <ProductDetails product={product} onBack={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#006FFD", //Color del navbar
  },
});