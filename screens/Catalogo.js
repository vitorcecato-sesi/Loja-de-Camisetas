import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

function TelaListaDeCamisas({ navigation }) {
    const camisas = [
        {
            id: 1,
            nome: 'Camisa Mirassol',
            preco: 249.99,
            imagem: ' https://cdn.awsli.com.br/1789/1789507/produto/332196537/15-camiseta-algod-o-amarela-f-d7n5kc685w.jpg',
            descricao: '',
            estoque: 15,
            avaliacoes: 4.8,
        },
        {
            id: 2,
            nome: 'Camisa Palmeiras',
            preco: 299.99,
            imagem: 'https://verdebrancomania.com.br/wp-content/uploads/2022/09/086019790-1200x1454.png',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 3,
            nome: 'Camisa São Paulo',
            preco: 199.99,
            imagem: 'https://webshop.vteximg.com.br/arquivos/ids/202254-1000-1000/M_00900545701_01.jpg?v=638757467796870000',
            descricao: '',
            estoque: 30,
            avaliacoes: 4.2,
        },
        {
            id: 4,
            nome: 'Camisa Grêmio',
            preco: 199.99,
            imagem: ' https://gremiofbpa.vtexassets.com/arquivos/ids/720779/Camisa_Masc_Umbro_Of1_2025_Torcedor_SN_1291869_Frente1.jpg?v=638889747050900000',
            descricao: '',
            estoque: 30,
            avaliacoes: 4.2,
        },
         {
            id: 5,
            nome: 'Camisa Vasco',
            preco: 49.99,
            imagem: 'https://oldensports.fbitsstatic.net/img/p/camisa-vasco-da-gama-retro-kappa-1998-libertadores-masculino-153504/347678.jpg?v=202502270914',
            descricao: '',
            estoque: 30,
            avaliacoes: 4.2,
        },
        {
            id: 6,
            nome: 'Camisa Santos',
            preco: 299.99,
            imagem: 'https://static.santosstore.com.br/produtos/camisa-santos-2526-sn-torcedor-edicao-especial-umbro-masculina/08/2IB-2265-108/2IB-2265-108_zoom1.jpg?ts=1749570107&ims=544x',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 7,
            nome: 'Camisa Sport',
            preco: 299.99,
            imagem: 'https://a-static.mlcdn.com.br/800x560/camisa-sport-recife-classic-rubro-negro-masculino-retromania/sportretro/30017006md/5214aacea33ac4f3fe31a82330b1b732.jpeg',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 8,
            nome: 'Camisa Bahia',
            preco: 299.99,
            imagem: 'https://images.tcdn.com.br/img/img_prod/311840/camisa_esquadrao_bahia_ii_2018_52427_1_20210806215432.jpg',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 9,
            nome: 'Camisa Fluminense',
            preco: 299.99,
            imagem: 'https://www.camarotedotorcedor.com.br/wp-content/uploads/2022/12/Camisa-Fluminense-Choice-Masculina-2.png',
            descricao: '',
            estoque: 8,
            avaliacoes: 4.5,
        },
        {
            id: 10,
            nome: 'Camisa Vitoria',
            preco: 299.99,
            imagem: 'https://images.tcdn.com.br/img/img_prod/311840/camisa_topper_vitoria_i_2017_40974_1_20210806215520.jpg',
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
