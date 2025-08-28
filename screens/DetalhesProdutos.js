import { useState, useEffect } from 'react'

import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'

// Importação para a utilização do storage
import AsyncStorage from '@react-native-async-storage/async-storage';


function ListaDetalhesProdutos({ route, navigation }) {

  const { produtoSelecionado } = route.params || {}

  const [quantidade, setQuantidade] = useState(1)

  const [apelidoUser, setApelidoUser] = useState("")

  // Lista de Desejos
  const [listaDesejos, setListaDesejos] = useState([])
  
  // Controle de carregamento de dados 
  const [carregado, setCarregando] = useState(false)

  // Função para carregar dados do AsyncStorage
  const carregarDados = async () => {
    try {  // Tenta carregar os dados

      // Armazena o apelido do usuário
      const apelido = await AsyncStorage.getItem('apelido')

      // Armazena a informação do localStorage
      const listaDesejosString = await AsyncStorage.getItem('listaDesejos')

      // Se o apelido existir, atualiza o estado, senão exibe um alerta e define como "Anônimo"
      if (apelido !== null) {
        setApelidoUser(apelido)
        console.log(apelido)
      }
      else {
        Alert.alert("Erro", "Nome não encontrado.")
        setApelidoUser("Anonimo")
      }

      if (listaDesejosString) {
        setListaDesejos(() => JSON.parse(listaDesejosString))

      } else {
        Alert.alert("Erro", "Lista de desejos está vazia.")
      }

      setCarregando(true)

    } catch (e) { // Em caso de erro em buscar, exibe um alerta e o erro no console
      Alert.alert("Erro", 'Erro ao carregar dados.')
      console.error(e)
    }
  }

  // Faz a busca de dados quando iniciar
  useEffect(() => {
    carregarDados()
  }, [])


  useEffect(() => {
    if (!produtoSelecionado) {
      Alert.alert('Erro', 'Produto não encontrado', [

        { text: 'Voltar', onPress: () => navigation.goBack() },
      ])
    }
  }, [produtoSelecionado])


  if (!produtoSelecionado) {
    return null
  }


  const adicionarAoCarrinho = () => {
    Alert.alert(
      'Sucesso!',
      `${quantidade} ${produtoSelecionado.nome} adicionado(s) ao carrinho!`,
      [
        {
          text: 'Continuar Comprando',
          onPress: () => navigation.goBack(),
        },
      ]
    )
  }


  // Altera a quantidade das camisas
  const alterarQuantidade = (incremento) => {
    const novaQuantidade = quantidade + incremento

    if (novaQuantidade >= 1 && novaQuantidade <= (produtoSelecionado.estoque || 0)) {
      setQuantidade(novaQuantidade)
    }
  }


  const imagemUri = (produtoSelecionado.imagem || '').trim() || 'https://via.placeholder.com/400'

  // --------------------- AsyncDesejos

  // Função para salvar dados no AsyncStorage
  const salvarDados = async () => {
    try { // Tenta salvar os dados

      console.log(listaDesejos)


      // Salva a lista de desejos no AsyncStorage
      await AsyncStorage.setItem("listaDesejos", JSON.stringify(listaDesejos));

    } catch (error) { // Em caso de erro, exibe no console
      console.error("Erro ao salvar dados:", error);
    }
  }

  // Salva os dados quando forem alterados
  useEffect(() => {

    // Evita erros de salvamentos sem ter carregado os dados
    if (carregado) {
      salvarDados()
    }
  }, [listaDesejos, carregado])

  // Adiciona um item na lista de desejo
  const adicionarDesejo = () => {

    // Tratamento para evitar bugs (não tão necessário agora)
    if (listaDesejos.find(item => item.id === produtoSelecionado.id)) {
      Alert.alert('Aviso', `${produtoSelecionado.nome} já está na lista de desejos.`)
      return
    }

    // Criação da nova array com os itens passados e o novo
    const novaLista = [...listaDesejos, produtoSelecionado]

    // Definindo a nova lista
    setListaDesejos(novaLista)

    Alert.alert(
      `Sucesso, ${apelidoUser}!`,
      `${produtoSelecionado.nome} adicionado aos desejos!`,
      [
        {
          text: 'Obrigado!',
        },
      ]
    )
  }

  // Remover da lista de desejo
  const removerDesejo = () => {

    // Filtra a array, criando uma nova somente com itens diferentes do que a gente selecionou
    setListaDesejos(listaDesejos.filter(item => item.id !== produtoSelecionado.id))

    Alert.alert(
      `Sucesso, ${apelidoUser}!`,
      `${produtoSelecionado.nome} removido dos desejos!`,
      [
        {
          text: 'Obrigado!',
        },
      ]
    )
  }

  return (

    <ScrollView style={estilos.container}>


      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()}>
        <Text style={estilos.textoVoltar}> Voltar </Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15, color: '#3300ffff' }} >Bem vindo(a), {apelidoUser}</Text>

      <Image source={{ uri: imagemUri }} style={estilos.imagemGrande} />


      <Text style={estilos.nomeProduto}> {produtoSelecionado.nome} </Text>


      <Text style={estilos.precoProduto}>
        R$ {(produtoSelecionado.preco || 0).toFixed(2)}
      </Text>


      <Text style={estilos.estoque}>
        Estoque: {produtoSelecionado.estoque ? produtoSelecionado.estoque : 0} unidades
      </Text>


      <Text style={estilos.descricaoProduto}> {produtoSelecionado.descricao} </Text>


      <View style={estilos.tamanhosContainer}>
        {['P', 'M', 'G', 'XG'].map((tamanho) => (

          <View key={tamanho} style={estilos.tagTamanho}>
            <Text style={estilos.textoTagTamanho}> {tamanho} </Text>
          </View>
        ))}
      </View>


      <View style={estilos.selectorQuantidade}>

        <TouchableOpacity style={estilos.botaoQuantidade} onPress={() => alterarQuantidade(-1)}>
          <Text style={estilos.textoQuantidade}> - </Text>
        </TouchableOpacity>


        <Text style={estilos.numeroQuantidade}> {quantidade} </Text>


        <TouchableOpacity style={estilos.botaoQuantidade} onPress={() => alterarQuantidade(1)}>
          <Text style={estilos.textoQuantidade}> + </Text>
        </TouchableOpacity>
      </View>

      <View>
        {!listaDesejos.find(item => item.id === produtoSelecionado.id) &&
          <TouchableOpacity style={estilos.botaoComprar} onPress={adicionarDesejo}>
            <Text style={estilos.textoBotaoComprar}> Adicionar Lista de Desejos </Text>
          </TouchableOpacity>}

        {listaDesejos.find(item => item.id === produtoSelecionado.id) &&
          <TouchableOpacity style={estilos.botaoRemover} onPress={removerDesejo}>
            <Text style={estilos.textoBotaoComprar}> Remover Lista de Desejos </Text>
          </TouchableOpacity>}

      </View>
      <TouchableOpacity style={estilos.botaoComprar} onPress={adicionarAoCarrinho}>
        <Text style={estilos.textoBotaoComprar}> Adicionar ao Carrinho </Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

export default ListaDetalhesProdutos

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 18,
  },

  botaoVoltar: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  textoVoltar: {
    fontSize: 17,
    color: '#374151',
    fontWeight: '600',
  },

  imagemGrande: {
    width: '100%',
    height: 360,
    borderRadius: 16,
    resizeMode: 'cover',
    marginBottom: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },

  nomeProduto: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  precoProduto: {
    fontSize: 24,
    color: '#22c55e',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  estoque: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 6,
    textAlign: 'center',
  },

  descricaoProduto: {
    fontSize: 17,
    color: '#334155',
    marginBottom: 14,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  tamanhosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 10,
  },

  tagTamanho: {
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginHorizontal: 4,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  textoTagTamanho: {
    fontSize: 16,
    color: '#3730a3',
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  selectorQuantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
    gap: 10,
  },
  botaoQuantidade: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  textoQuantidade: {
    fontSize: 26,
    color: '#3730a3',
    fontWeight: 'bold',
  },
  numeroQuantidade: {
    marginHorizontal: 24,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    elevation: 1,
  },

  botaoComprar: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  textoBotaoComprar: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  botaoRemover: {
    backgroundColor: '#f16363ff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#f16363ff',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  }
})