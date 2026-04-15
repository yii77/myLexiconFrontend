import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase('wordbook.db');

export default db;
