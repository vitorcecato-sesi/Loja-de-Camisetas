// Tela Detalhes

import { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'

function ListaDetalhesProdutos({ route, navigation }) {
    const { produtoSelecionado } = route.params
    const [quantidade, setQuantidade] = useState(1)

    const adicionarAoCarrinho = () => {
        Alert.alert(
            'Sucesso!',
            `${quantidade} ${produtoSelecionado.nome} adicionado(s) ao carrinho!`,
            [
                {
                    text: 'Continuar Comprando',
                    onPress: () => navigation.goBack(),
                },
                {
                    text: 'Ver Carrinho',
                    onPress: () => console.log('Ir para carrinho!'),
                },
            ]
        )
    }

    const alterarQuantidade = (incremento) => {
        const novaQuantidade = quantidade + incremento
        if (novaQuantidade >= 1 && novaQuantidade <= produtoSelecionado.estoque) {
            setQuantidade(novaQuantidade)
        }
    }

    return (
        <View style={estilos.container}>
            <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()}>
                <Text style={estilos.textoVoltar}>🔙 Voltar</Text>
            </TouchableOpacity>

            <Image source={{ uri: produtoSelecionado.imagem }} style={estilos.imagemGrande} />

            <Text style={estilos.nomeProduto}>{produtoSelecionado.nome}</Text>

            <Text style={estilos.categoriaProduto}>{produtoSelecionado.categoria}</Text>

            <Text style={estilos.precoProduto}>R$ {produtoSelecionado.preco.toFixed(2)}</Text>

            <Text style={estilos.descricaoProduto}>{produtoSelecionado.descricao}</Text>

            <Text style={estilos.estoque}>Estoque: {produtoSelecionado.estoque} unidades</Text>

            <Text style={estilos.avaliacao}>{produtoSelecionado.avaliacoes} ⭐</Text>
            
            {/* Controlador de quantidade */}
            <View style={estilos.selectorQuantidade}>
                <TouchableOpacity style={estilos.botaoQuantidade} onPress={() => alterarQuantidade(-1)}>
                    <Text style={estilos.textoQuantidade}>-</Text>
                </TouchableOpacity>
                <Text style={estilos.numeroQuantidade}>{quantidade}</Text>
                <TouchableOpacity style={estilos.botaoQuantidade} onPress={() => alterarQuantidade(1)}>
                    <Text style={estilos.textoQuantidade}>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={estilos.botaoComprar} onPress={adicionarAoCarrinho}>
                <Text style={estilos.textoBotaoComprar}>Adicionar ao Carrinho</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ListaDetalhesProdutos

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },

    botaoVoltar: {
        marginBottom: 12,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#ddd',
        borderRadius: 8,
    },
    textoVoltar: {
        fontSize: 16,
        color: '#333',
    },

    imagemGrande: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        resizeMode: 'contain',
        marginBottom: 16,
        backgroundColor: '#fff',
    },

    nomeProduto: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 4,
    },
    categoriaProduto: {
        fontSize: 16,
        color: '#777',
        marginBottom: 8,
    },
    precoProduto: {
        fontSize: 22,
        color: '#27ae60',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    descricaoProduto: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
        lineHeight: 22,
    },
    estoque: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    avaliacao: {
        fontSize: 16,
        color: '#f1c40f',
        marginBottom: 16,
    },

    selectorQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
    },
    botaoQuantidade: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    textoQuantidade: {
        fontSize: 22,
        color: '#333',
        fontWeight: 'bold',
    },
    numeroQuantidade: {
        marginHorizontal: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },

    botaoComprar: {
        backgroundColor: '#3498db',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    textoBotaoComprar: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
})