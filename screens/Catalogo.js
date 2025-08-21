import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

function TelaListaDeCamisas({ navigation }) {
    const camisas = [
        {
            id: 1,
            nome: 'Camisa Mirassol',
            preco: 249.99,
            imagem: ' https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgy05GWcIrMmRYRd5DceIE1FcuRdxpa4vVPWmFnrhOoLC7wpQknIsPeKUp2lO9ILOlrmBtNAKrmjsHPidyOzKdmkT0zVTpELm_wPk3V4U1y9adLRGVdhFHiOmBebsIFCFR2tZhdjt0lUSTP/s1600/Mirassol+2020+1.png',
            descricao: '',
            estoque: 15,
            avaliacoes: 4.8,
        },
        {
            id: 2,
            nome: 'Camisa Palmeiras',
            preco: 299.99,
            imagem: 'https://www.mundodofutebol.com.br/lojas/00057707/prod/palmeiraawe.png',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 3,
            nome: 'Camisa São Paulo',
            preco: 199.99,
            imagem: 'https://acdn-us.mitiendanube.com/stores/002/265/580/products/1-removebg-preview-61-3c145f7fc21634815716862426061398-640-0.png',
            descricao: '',
            estoque: 30,
            avaliacoes: 4.2,
        },
        {
            id: 4,
            nome: 'Camisa Grêmio',
            preco: 199.99,
            imagem: ' https://gremio1903.wordpress.com/wp-content/uploads/2011/01/grc3aamiofrente.png?w=584',
            descricao: '',
            estoque: 30,
            avaliacoes: 4.2,
        },
         {
            id: 5,
            nome: 'Camisa Vasco',
            preco: 49.99,
            imagem: 'https://webshop.vteximg.com.br/arquivos/ids/213214-1000-1000/M_0105_00200632002.png?v=638579612893500000',
            descricao: '',
            estoque: 30,
            avaliacoes: 4.2,
        },
        {
            id: 6,
            nome: 'Camisa Santos',
            preco: 299.99,
            imagem: 'https://dasports.com.br/cdn/shop/files/Santos-Comemorativa_24_25_1_1024x.png?v=1749439987',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 7,
            nome: 'Corinthians',
            preco: 299.99,
            imagem: 'https://www.futebolreligiao.com.br/image/cache/catalog/Corinthians/Camisa%20III%20Corinthians%202024%20Third-900x900.png',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 8,
            nome: 'Camisa Bahia',
            preco: 299.99,
            imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWOxai7wqz-fesnAPAWMRIwR_GHFB8s-RCRwa23okJ3JTeM9Jypbu6O4k32WBTsWTz3x6TaJ-A_V2lehjeLKdIySZufs7nBha454QSiisxd5VV1FDXtDKFVlWyi-kxJtVxL9DUT3P20e8/s1600/Bahia+2014+2.png',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 9,
            nome: 'Camisa Fluminense',
            preco: 299.99,
            imagem: 'https://fluminense.vteximg.com.br/arquivos/ids/158648-1000-1000/FPON9VgXsAAiUqm-removebg-preview.png?v=637844182303130000',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 10,
            nome: 'Flamengo',
            preco: 299.99,
            imagem: 'https://www.camarotedotorcedor.com.br/wp-content/uploads/2025/03/m_0115_00100724113_1_2.png',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
    ];

    const abrirDetalhesCamisa = (camisa) => {
        navigation.navigate('DetalhesCamisas', {
            camisaSelecionada: camisa,
            origemNavegacao: 'lista_camisas',
            timestampVisita: Date.now()
        });
    };

    const renderizarCamisa = ({ item }) => (
        <TouchableOpacity style={estilos.cardCamisa} onPress={() => abrirDetalhesCamisa(item)}>
            <Image source={{ uri: item.imagem || 'https://via.placeholder.com/150' }} style={estilos.imagemCamisa} />
            <View style={estilos.infoCamisa}>
                <Text style={estilos.nomeCamisa}>{item.nome}</Text>
                <Text style={estilos.precoCamisa}>R$ {item.preco.toFixed(2)}</Text>
                <Text style={estilos.avaliacaoCamisa}>⭐ {item.avaliacoes}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Catálogo de Camisas</Text>
            <FlatList
                data={camisas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarCamisa}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={estilos.linhaCamisas}
            />
        </View>
    );
}

export default TelaListaDeCamisas;

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    linhaCamisas: {
        justifyContent: 'space-between',
    },
    cardCamisa: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
        width: '48%',
        alignItems: 'center',
        elevation: 2,
    },
    imagemCamisa: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#eee',
    },
    infoCamisa: {
        alignItems: 'center',
    },
    nomeCamisa: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        textAlign: 'center',
    },
    precoCamisa: {
        fontSize: 15,
        color: '#27ae60',
        marginTop: 4,
    },
    avaliacaoCamisa: {
        fontSize: 13,
        color: '#f39c12',
        marginTop: 2,
    },
});
