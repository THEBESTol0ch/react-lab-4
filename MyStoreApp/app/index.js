import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('cart.db');

export default function Index() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  // Инициализация базы данных
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY NOT NULL, title TEXT, price REAL, image TEXT);'
      );
    });
  }, []);

  // Загрузка товаров
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  // Добавление в корзину
  const addToCart = (item) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO cart (id, title, price, image) VALUES (?, ?, ?, ?);',
        [item.id, item.title, item.price, item.image]
      );
    });
    alert(`${item.title} добавлен в корзину`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Button title="Добавить в корзину" onPress={() => addToCart(item)} />
          </View>
        )}
      />
      <Button title="Перейти в корзину" onPress={() => router.push('/basket')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  image: { width: '100%', height: 150, resizeMode: 'contain' },
  title: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  price: { fontSize: 14, color: 'green', marginBottom: 5 },
  description: { fontSize: 12, marginBottom: 10 },
});
