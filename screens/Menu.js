import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

let db = null;

async function openDb() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('bd_camisas.db');
  return db;
}


export default function Menu({ navigation }) {
  const nomeTabelaDados = 'camisetas';


  const [nomeUser, setNomeUser] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisivel, setModalVisivel] = useState(false);

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estoque, setEstoque] = useState('');
  const [time, setTime] = useState('');
  const [cor, setCor] = useState('');

  const adicionarCamisa = async () => {
    const PrecoConvertido = Number(preco)
    const EstoqueConvertido = Number(estoque)

    if (
      !nome.trim() ||
      PrecoConvertido == 0 ||
      !imagem.trim() ||
      !descricao.trim() ||
      EstoqueConvertido == 0 ||
      !time.trim() ||
      !cor.trim()
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      console.log(nome, PrecoConvertido, imagem, descricao, EstoqueConvertido, time, cor);
      return;
    }

    try {
      const conn = await openDb();
      await conn.runAsync(
        `INSERT INTO ${nomeTabelaDados} (nome, preco, imagem, descricao, estoque, time, cor) values (?, ?, ?, ?, ?, ?, ?);`,
        [nome, PrecoConvertido, imagem, descricao, EstoqueConvertido, time, cor]
      );

      Alert.alert('Sucesso', 'Camisa adicionada com sucesso! 🚀');
      setNome('');
      setCor('');
      setDescricao('');
      setDescricao('');
      setEstoque('');
      setImagem('');
      setPreco('');
      setTime('');
      setModalVisivel(false);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar camisa. 😢');
      console.error('Erro ao inserir:', error);
    }
  };

  // Função para carregar dados do AsyncStorage
  const carregarDados = async () => {
    try {
      // Tenta carregar os dados

      // Armazena o apelido do usuário
      const apelido = await AsyncStorage.getItem('apelido');

      // Se o apelido existir, atualiza o estado, senão exibe um alerta e define como "Anônimo"
      if (apelido !== null) {
        setNomeUser(apelido);
        console.log(apelido);
      } else {
        Alert.alert('Erro', 'Nome não encontrado.');
        setNomeUser('Anonimo');
      }
    } catch (e) {
      // Em caso de erro em buscar, exibe um alerta e o erro no console
      Alert.alert('Erro', 'Erro ao carregar dados.');
      console.error(e);
    }
  };

  // Busca o apelido toda vez que o usuário der um refresh
  useEffect(() => {
    carregarDados();
  }, [refreshing]);

  const listarTudo = async () => {
    navigation.navigate('Catalogo');
  };

  const inserirCamisas = () => {
    setModalVisivel(true)
  };

  const listarNome = async () => {
    navigation.navigate('ListagemNome');
  };

  const listarCor = async () => {
    navigation.navigate('ListagemCor');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.bloco}>
          <Text style={styles.title}>Menu 📚</Text>
          <Text style={styles.apelido}> 👋 Bem vindo(a), {nomeUser}</Text>

          <TouchableOpacity style={styles.button} onPress={listarTudo}>
            <Text style={styles.tituloB}> Listar Camisas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={inserirCamisas}>
            <Text style={styles.tituloB}> Inserir Camisas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={listarNome}>
            <Text style={styles.tituloB}> Listar por Nome</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={listarCor}>
            <Text style={styles.tituloB}> Listar por Cor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisivel(false)}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.containerModal}>
            <Text style={styles.titleModal}>Adicionar Nova Camisa</Text>
            <TextInput
              style={styles.inputModal}
              placeholder="Nome da Camisa"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.inputModal}
              placeholder="Time"
              value={time}
              onChangeText={setTime}
            />
            <TextInput
              style={styles.inputModal}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />
            <TextInput
              style={styles.inputModal}
              placeholder="Cor"
              value={cor}
              onChangeText={setCor}
            />
            <TextInput
              style={styles.inputModal}
              placeholder="Imagem"
              value={imagem}
              onChangeText={setImagem}
            />
            <TextInput
              style={styles.inputModal}
              placeholder="Preço"
              keyboardType="numeric"
              value={preco}
              onChangeText={setPreco}
            />
            <TextInput
              style={styles.inputModal}
              placeholder="Estoque"
              value={estoque}
              onChangeText={setEstoque}
            />
            <Button title="Adicionar Camisa" onPress={adicionarCamisa} />
          </ScrollView>

          <TouchableOpacity
            style={styles.botaoFechar}
            onPress={() => setModalVisivel(false)}>
            <Text style={styles.textoFechar}>❌ Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#8FBC8F',
  },
  bloco: {
    backgroundColor: '#BDF2BD',
    width: 330,
    height: 500,
    justifyContent: 'center',
    borderRadius: 10,
    boxShadow: '1px 4px 8px rgba(1,0,0,0.4)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '70%',
    marginBottom: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  tituloB: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  apelido: {
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 50,
  },
  containerModal: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleModal: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputModal: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoFechar: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 20,
    },
    textoFechar: {
        fontSize: 16,
        fontWeight: "bold",
    },
});