// ...existing code...
import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'

function ListaDetalhesProdutos({ route, navigation }) {
    const { produtoSelecionado } = route.params || {}
    const [quantidade, setQuantidade] = useState(1)

    useEffect(() => {
        if (!produtoSelecionado) {
            Alert.alert('Erro', 'Produto não encontrado', [
                { text: 'Voltar', onPress: () => navigation.goBack() }
            ])
        }
    }, [produtoSelecionado])

    if (!produtoSelecionado) {
        return null // já chamou goBack no useEffect
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

    const alterarQuantidade = (incremento) => {
        const novaQuantidade = quantidade + incremento
        if (novaQuantidade >= 1 && novaQuantidade <= (produtoSelecionado.estoque || 0)) {
            setQuantidade(novaQuantidade)
        }
    }

    const imagemUri = (produtoSelecionado.imagem).trim()

    return (
        <View style={estilos.container}>

            <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()}>
                <Text style={estilos.textoVoltar}> Voltar </Text>
            </TouchableOpacity>

            <Image source={{ uri: imagemUri }} style={estilos.imagemGrande} />

            <Text style={estilos.nomeProduto}> {produtoSelecionado.nome} </Text>

            <Text style={estilos.precoProduto}>R$ {produtoSelecionado.preco} </Text>

            <Text style={estilos.estoque}>Estoque: {produtoSelecionado.estoque} unidades</Text>

            <Text style={estilos.descricaoProduto}> {produtoSelecionado.descricao} </Text>

            <View style={estilos.tamanhosContainer}>
    {['P', 'M', 'G', 'XG'].map((tamanho) => (
        <View key={tamanho} style={estilos.tagTamanho}>
            <Text style={estilos.textoTagTamanho}>{tamanho}</Text>
        </View>
    ))}
</View>


            {/* Controlador de quantidade */}
            <View style={estilos.selectorQuantidade}>

                <TouchableOpacity style={estilos.botaoQuantidade} onPress={() => alterarQuantidade(-1)}>
                    <Text style={estilos.textoQuantidade}> - </Text>
                </TouchableOpacity>

                <Text style={estilos.numeroQuantidade}> {quantidade} </Text>

                <TouchableOpacity style={estilos.botaoQuantidade} onPress={() => alterarQuantidade(1)}>
                    <Text style={estilos.textoQuantidade}>+</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity style={estilos.botaoComprar} onPress={adicionarAoCarrinho}>
                <Text style={estilos.textoBotaoComprar}> Adicionar ao Carrinho </Text>
            </TouchableOpacity>

        </View>
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
        height: 260,
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
        marginTop: 10,
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