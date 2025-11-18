import { useRouter } from 'expo-router';
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

  return <ProductDetails product={product} onBack={() => router.back()} />;
}
