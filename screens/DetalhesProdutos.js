import { useState, useEffect } from 'react'

// Componentes básicos do React Native usados para montar a tela
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'

/*
  ListaDetalhesProdutos:
  - Esta tela recebe, via rota, um objeto chamado `produtoSelecionado`.
  - Mostra a imagem grande, nome, preço, descrição, tamanhos, controle de quantidade
    e um botão para "Adicionar ao Carrinho" (Apenas demonstração, não funcional).
*/

function ListaDetalhesProdutos({ route, navigation }) { //Parametros
  // route.params vem do navigation.navigate(..., { produtoSelecionado: ... })

  const { produtoSelecionado } = route.params || {} // usamos || {} para evitar erro caso params seja undefined.

  // Quantidade selecionada de camisetas para colocar no carrinho pelo usuário (estado local)
  const [quantidade, setQuantidade] = useState(1)

  // useEffect: roda quando a tela monta. Se não houver produto, avisa e volta.
  useEffect(() => {
    if (!produtoSelecionado) {
      Alert.alert('Erro', 'Produto não encontrado', [
        // botão "Voltar" chama navigation.goBack() para retornar à tela anterior
        { text: 'Voltar', onPress: () => navigation.goBack() },
      ])
    }
  }, [produtoSelecionado]) // Caso o produtoSelecionado mudar, o useEffect será chamado novamente

  // Se não houver produto (fizemos goBack no useEffect), não renderizamos nada
  if (!produtoSelecionado) {
    return null
  }

  // Função chamada ao pressionar "Adicionar ao Carrinho"
  // Aqui só mostramos um alerta de confirmação e voltamos para a lista.
  const adicionarAoCarrinho = () => {
    Alert.alert(
      'Sucesso!',
      `${quantidade} ${produtoSelecionado.nome} adicionado(s) ao carrinho!`,
      [
        {
          text: 'Continuar Comprando', // Texto do botão
          onPress: () => navigation.goBack(), // Quando cliclado, faz o goBack(), que volta para página anterior (Catalogo)
        },
      ]
    )
  }

  // Ajusta a quantidade respeitando o estoque disponível
  const alterarQuantidade = (incremento) => { // Parametro "incremento"
    const novaQuantidade = quantidade + incremento
    // garante que quantidade fique entre 1 e estoque
    if (novaQuantidade >= 1 && novaQuantidade <= (produtoSelecionado.estoque || 0)) {
      setQuantidade(novaQuantidade)
    }
  }

  // Normaliza a URI da imagem (remove espaços e evita undefined)
  const imagemUri = (produtoSelecionado.imagem || '').trim() || 'https://via.placeholder.com/400'

  return (
    // Usamos ScrollView para fazer a rolagem vertical da tela se necessário
    <ScrollView style={estilos.container}>

      {/* Botão de voltar simples */}
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()}> {/* Utiliza o goBack() para voltar a página anterior */}
        <Text style={estilos.textoVoltar}> Voltar </Text>
      </TouchableOpacity>

      {/* Imagem grande do produto */}
      <Image source={{ uri: imagemUri }} style={estilos.imagemGrande} />

      {/* Nome, preço e outras infos - Utiliza o produtoSelecionado vindo da rota */}
      {/* Nome do produto */}
      <Text style={estilos.nomeProduto}> {produtoSelecionado.nome} </Text>

      {/* Preço do produto, deixa o preço ou 0 se nao houver, e sempre com 2 casas decimais no máximo */}
      <Text style={estilos.precoProduto}>
        R$ {(produtoSelecionado.preco || 0).toFixed(2)}
      </Text>

    {/* Usa o operador ternário para verificar estoque, caso nao tiver, coloca 0 */}
      <Text style={estilos.estoque}>
        Estoque: {produtoSelecionado.estoque ? produtoSelecionado.estoque : 0} unidades 
      </Text>

    {/* Descrição do produto */}
      <Text style={estilos.descricaoProduto}> {produtoSelecionado.descricao} </Text>

      {/* Tags de tamanhos — componente visual para mostrar opções */}
      <View style={estilos.tamanhosContainer}>
        {['P', 'M', 'G', 'XG'].map((tamanho) => ( // Percorre o array de tamanhos e cria uma "tag" para cada um

          <View key={tamanho} style={estilos.tagTamanho}>
            <Text style={estilos.textoTagTamanho}> {tamanho} </Text>
          </View>
        ))}
      </View>

      {/* Controle de quantidade: - / número / + */}
      <View style={estilos.selectorQuantidade}>
        {/* Botão de (-) diminuir 1 quantidade */}
        <TouchableOpacity style={estilos.botaoQuantidade} onPress={() => alterarQuantidade(-1)}>
          <Text style={estilos.textoQuantidade}> - </Text>
        </TouchableOpacity>

        {/* Quantidade atual de produtos */}
        <Text style={estilos.numeroQuantidade}> {quantidade} </Text>

        {/* Botão de (+) aumentar 1 quantidade */}
        <TouchableOpacity style={estilos.botaoQuantidade} onPress={() => alterarQuantidade(1)}>
          <Text style={estilos.textoQuantidade}> + </Text>
        </TouchableOpacity>
      </View>

      {/* Botão principal para adicionar ao carrinho */}
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
  // botão de voltar no topo
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
  // imagem principal grande
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
  // nome do produto
  nomeProduto: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // preço
  precoProduto: {
    fontSize: 24,
    color: '#22c55e',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // texto do estoque
  estoque: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 6,
    textAlign: 'center',
  },
  // descrição
  descricaoProduto: {
    fontSize: 17,
    color: '#334155',
    marginBottom: 14,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  // container das tags de tamanhos
  tamanhosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 10,
  },
  // estilo das "tags" de tamanho
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
  // selector de quantidade
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
  // botão principal de compra
  botaoComprar: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 60,
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
})