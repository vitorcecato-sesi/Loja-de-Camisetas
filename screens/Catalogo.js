import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  // Estado para armazenar a conexão com o banco de dados
  const [db, setDb] = useState(null);

  // Estado para armazenar os resultados da consulta
  const [results, setResults] = useState([]);

  // Estado para os campos de pesquisa
  const [searchText, setSearchText] = useState('');

  // Estado para a mensagem de status
  const [status, setStatus] = useState('Inicializando...');

  // Inicializa o banco de dados e cria a tabela se não existir
  useEffect(() => {
    async function setupDatabase() {
      try {
        const database = await SQLite.openDatabaseAsync('bd_camisas.db');
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS camisetas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagem TEXT NOT NULL,
            cor TEXT NOT NULL,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            time TEXT NOT NULL,
            descricao TEXT NOT NULL,
            estoque INTEGER NOT NULL
          );
        `);

        setStatus('✅ Banco de dados e tabela prontos!');
      } catch (error) {
        console.error('Erro ao conectar ou criar tabela:', error);
        setStatus('❌ Erro ao inicializar o banco de dados. Veja o log.');
        Alert.alert('Erro', 'Não foi possível conectar ao banco de dados.');
      }
    }
    setupDatabase();
  }, []);

  // Função genérica para executar consultas
  const executarConsulta = async (query, params = []) => {
    if (!db) {
      Alert.alert('Erro', 'O banco de dados não está pronto.');
      return;
    }

    try {
      const rows = await db.getAllAsync(query, params);
      setResults(rows);
      if (rows.length === 0) {
        Alert.alert('Aviso', 'Nenhum resultado encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na consulta. Verifique o console.');
      console.error('Erro na consulta:', error);
    }
  };

  // Exibir todas as camisetas
  const exibirTodos = async () => {
    await executarConsulta('SELECT * FROM camisetas;');
  };

  // Pesquisar por nome
  const pesquisarNome = async () => {
    if (!searchText.trim()) {
      Alert.alert('Aviso', 'Digite um nome para pesquisar.');
      return;
    }
    await executarConsulta('SELECT * FROM camisetas WHERE nome LIKE ?;', [
      `%${searchText}%`,
    ]);
  };

  // Função para abrir detalhes da camisa (exemplo simples)
  const abrirDetalhesCamisa = (item) => {
    Alert.alert(
      item.nome,
      `Descrição: ${item.descricao}\nCor: ${item.cor}\nTime: ${item.time}\nEstoque: ${item.estoque}\nPreço: R$ ${item.preco.toFixed(2)}`
    );
  };

  // Renderização do item da lista
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={estilos.cardCamisa}
      onPress={() => abrirDetalhesCamisa(item)}
    >
      <Image source={{ uri: item.imagem }} style={estilos.imagemCamisa} />
      <View style={estilos.infoCamisa}>
        <Text style={estilos.nomeCamisa}>{item.nome}</Text>
        <Text style={estilos.precoCamisa}>R$ {item.preco.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  // Cor dinâmica para o status
  const statusColor = status.startsWith('✅')
    ? estilos.colors.success
    : status.startsWith('❌')
    ? estilos.colors.error
    : estilos.colors.info;

  return (
    <View style={estilos.container}>
      <View style={estilos.headerCard}>
        <Text style={estilos.title}>Catálogo</Text>
        <Text style={[estilos.statusText, { color: statusColor }]}>{status}</Text>
      </View>

      <View style={estilos.searchCard}>
        <TextInput
          style={estilos.input}
          placeholder="Nome"
          placeholderTextColor="#9AA4B2"
          value={searchText}
          onChangeText={setSearchText}
        />

        <View style={estilos.buttonContainer}>
          <View style={estilos.btnWrapper}>
            <Button title="Exibir Todos" onPress={exibirTodos} disabled={!db} />
          </View>
          <View style={estilos.btnWrapper}>
            <Button
              title="Pesquisar Nome"
              onPress={pesquisarNome}
              disabled={!db}
            />
          </View>
        </View>
      </View>

      <FlatList
        style={estilos.list}
        contentContainerStyle={estilos.listContent}
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={estilos.emptyText}>Nenhuma camisa encontrada.</Text>
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  colors: {
    background: '#F3F7FB',
    card: '#FFFFFF',
    primary: '#2563EB',
    info: '#0EA5E9',
    success: '#16A34A',
    error: '#DC2626',
    muted: '#6B7280',
    text: '#0F1724',
  },

  container: {
    flex: 1,
    backgroundColor: '#F3F7FB',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },

  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F1724',
    marginBottom: 6,
    textAlign: 'center',
  },

  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },

  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  input: {
    height: 48,
    backgroundColor: '#F9FBFD',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCE7F3',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F1724',
    marginBottom: 12,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  btnWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 24,
  },

  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginTop: 20,
  },

  // Estilos do card da camisa
  cardCamisa: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  imagemCamisa: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },

  infoCamisa: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },

  nomeCamisa: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },

  precoCamisa: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
});