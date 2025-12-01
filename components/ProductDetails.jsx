import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductDetails = ({ product, onBack }) => {
  if (!product) return <View style={styles.empty}><Text>Producto no disponible</Text></View>;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalles</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>ID</Text>
          <View style={styles.inputBox}><Text>{product.id}</Text></View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Producto</Text>
          <View style={styles.inputBox}><Text>{product.name}</Text></View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Imagen</Text>
            <View style={styles.imageWrap}>
              <Image source={product.image} style={styles.image} />
            </View>
          </View>

          <View style={styles.sideCols}>
            <Text style={styles.label}>Stock</Text>
            <View style={styles.inputBox}><Text>{product.stock}</Text></View>

            <Text style={[styles.label, { marginTop: 8 }]}>Precio</Text>
            <View style={styles.inputBox}><Text>{product.price}</Text></View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>BarCode</Text>
          <View style={styles.inputBox}><Text>{product.barcode}</Text></View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { backgroundColor: '#EDF2FB' },
  container: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backBtn: { padding: 6 },
  backTxt: { fontSize: 22, color: '#000' },
  title: { fontSize: 18, fontWeight: '700', marginLeft: 8 },
  card: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, gap: 10 },
  field: { marginBottom: 10 },
  label: { fontSize: 12, color: '#333', marginBottom: 6 },
  inputBox: { backgroundColor: '#fff', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  imageWrap: { width: 120, height: 120, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%', resizeMode: 'contain' },
  sideCols: { width: 140, marginLeft: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default ProductDetails;
