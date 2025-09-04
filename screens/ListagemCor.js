import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
 
export default function ListagemCor() {
  const [db, setDb] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [corCamisa, setCorCamisa] = useState('');
  const [status, setStatus] = useState('Inicializando...');
  const [temTexto, setTemTexto] = useState(false);

  useEffect(() => {
    async function setupDatabase() {
      try {
        const database = await SQLite.openDatabaseAsync('meu_banco.db');
        setDb(database);

        await database.execAsync(`CREATE TABLE IF NOT EXISTS camisetas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagem TEXT NOT NULL,
            cor TEXT NOT NULL,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            time TEXT NOT NULL,
            descricao TEXT NOT NULL,
            estoque INTEGER NOT NULL)`);
        setStatus('✅ Banco de dados e tabela prontos!');
      } catch (error) {
        console.error('Erro ao conectar ou criar tabela:', error);
        setStatus('❌ Erro ao inicializar o banco de dados. Veja o log.');
        Alert.alert('Erro', 'Não foi possível conectar ao banco de dados.');
      }
    }

    setupDatabase();
  }, []);

  const executarConsulta = async (query, params = []) => {
    if (!db) {
      Alert.alert('Erro', 'O banco de dados não está pronto.');
      return;
    }

    try {
      const rows = await db.getAllAsync(query, params);
      setResultados(rows);
      if (rows.length === 0) {
        Alert.alert('Aviso', 'Nenhum resultado encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na consulta. Verifique o console.');
      console.error('Erro na consulta:', error);
    }
  };

  const pesquisarCor = async () => {
    if (!corCamisa.trim()) {
      Alert.alert('Aviso', 'Digite um nome para pesquisar.');
      return;
    }
    await executarConsulta('SELECT * FROM camisetas WHERE cor LIKE ?;', [
      `%${corCamisa}%`,
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={estilos.itemLista}>
      <Text style={estilos.textoItem}>{item.cor}</Text>
    </View>
  );

  const corStatus = status.startsWith('✅')
    ? estilos.cores.sucesso
    : status.startsWith('❌')
    ? estilos.cores.erro
    : estilos.cores.texto;

  return (
    <View style={estilos.tela}>
      <View style={estilos.bloco}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Consultar Cor da Camiseta</Text>
        </View>

        <View style={estilos.caixaPesquisa}>
          <View style={estilos.blocoInput}>
            <Text style={estilos.label}>Pesquisar</Text>
            <View
              style={[
                estilos.linha,
                { borderBottomColor: temTexto ? '#90EE90' : '#6B7280' },
              ]}>
              <TextInput
                style={estilos.campoTexto}
                placeholder="Digite uma cor de camiseta"
                placeholderTextColor="#6B7280"
                value={corCamisa}
                onChangeText={(texto) => {
                  setCorCamisa(texto);
                  setTemTexto(texto.trim().length > 0);
                }}
              />
            </View>

            <TouchableOpacity
              style={estilos.botao}
              onPress={pesquisarCor}
              disabled={!db}>
              <Text style={estilos.textoBotao}>🔎</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          style={estilos.lista}
          contentContainerStyle={estilos.conteudoLista}
          data={resultados}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={estilos.textoVazio}>Nenhuma camiseta encontrada</Text>
          }
        />
        <Text style={[estilos.textoStatus, { color: corStatus }]}>
          {status}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cores: {
    fundo: '#87CEEB',
    primario: '#90EE90',
    texto: '#0F1724',
    apagado: '#6B7280',
    sucesso: '#16A34A',
    erro: '#DC2626',
  },
  tela: {
    flex: 1,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  bloco: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    width: '100%',
    maxWidth: 500,
    height: '90%',
    backgroundColor: '#87CEEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cabecalho: {
    backgroundColor: '#90EE90',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  caixaPesquisa: {
    width: '110%',
    maxWidth: 500,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F1724',
    marginBottom: 8,
  },
  linha: {
    borderBottomWidth: 2,
    marginBottom: 12,
  },
  campoTexto: {
    height: 40,
    fontSize: 15,
    color: '#0F1724',
    textAlign: 'center',
  },
  botao: {
    backgroundColor: '#90EE90',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
    width: '25%',
  },
  textoBotao: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lista: {
    width: '100%',
    flex: 1,
  },
  conteudoLista: {
    paddingBottom: 24,
  },
  itemLista: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  textoItem: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F1724',
  },
  textoVazio: {
    textAlign: 'center',
    fontSize: 16,
    color: '#475569',
    marginTop: 50,
  },
  textoStatus: {
    fontSize: 12,
    marginTop: 80,
    textAlign: 'center',
  },
  blocoInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    width: '100%', // ocupa largura total disponível
    alignSelf: 'center',
  },
});
