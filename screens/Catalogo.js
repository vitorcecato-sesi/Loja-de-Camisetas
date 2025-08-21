import React,{ useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, RefreshControl, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

function TelaListaDeCamisas({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);

     const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500); // tempo curto só para mostrar o efeito de refresh
    };

    const camisas = [
        {
            id: 1,
            nome: 'Camisa Mirassol',
            preco: 249.99,
            imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgy05GWcIrMmRYRd5DceIE1FcuRdxpa4vVPWmFnrhOoLC7wpQknIsPeKUp2lO9ILOlrmBtNAKrmjsHPidyOzKdmkT0zVTpELm_wPk3V4U1y9adLRGVdhFHiOmBebsIFCFR2tZhdjt0lUSTP/s1600/Mirassol+2020+1.png',
            descricao: 'Camisa do Mirassol: amarela vibrante com detalhes verdes e o leão no escudo destacando a identidade do clube',
            estoque: 15,
          
        },
        {
            id: 2,
            nome: 'Camisa Palmeiras',
            preco: 499.99,
            imagem: 'https://www.mundodofutebol.com.br/lojas/00057707/prod/palmeiraawe.png',
            descricao: 'Camisa do Palmeiras: verde tradicional com detalhes brancos e o escudo alviverde simbolizando tradição e glórias',
            estoque: 8,
     
        },
        {
            id: 3,
            nome: 'Camisa São Paulo',
            preco: 350.00,
            imagem: 'https://acdn-us.mitiendanube.com/stores/002/265/580/products/1-removebg-preview-61-3c145f7fc21634815716862426061398-640-0.png',
            descricao: 'Camisa do São Paulo: branca com faixas horizontais vermelha e preta no peito, destacando o escudo tricolor',
            estoque: 30,
       
        },
        {
            id: 4,
            nome: 'Camisa Grêmio',
            preco: 199.99,
            imagem: 'https://gremio1903.wordpress.com/wp-content/uploads/2011/01/grc3aamiofrente.png?w=584',
            descricao: 'Camisa do Grêmio: listrada em azul, preto e branco, com o escudo tricolor centralizado no peito.',
            estoque: 32,
       
        },
         {
            id: 5,
            nome: 'Camisa Vasco',
            preco: 599.99,
            imagem: 'https://webshop.vteximg.com.br/arquivos/ids/213214-1000-1000/M_0105_00200632002.png?v=638579612893500000',
            descricao: ' Camisa do Vasco: preta com detalhes em branco e o icônico escudo cruzmaltino, simbolizando tradição e paixão.',
            estoque: 28,
    
        },
        {
            id: 6,
            nome: 'Camisa Santos',
            preco: 159.99,
            imagem: 'https://dasports.com.br/cdn/shop/files/Santos-Comemorativa_24_25_1_1024x.png?v=1749439987',
            descricao: ' Camisa do Santos: branca com detalhes em preto e o escudo do peixe, representando a história e a tradição do clube.',
            estoque: 18,
         
        },
        {
            id: 7,
            nome: 'Corinthians',
            preco: 1.99,
            imagem: 'https://www.futebolreligiao.com.br/image/cache/catalog/Corinthians/Camisa%20III%20Corinthians%202024%20Third-900x900.png',
            descricao: '    Camisa do Corinthians: branca com detalhes em preto e o famoso escudo alvinegro, simbolizando a força e a paixão da torcida.',
            estoque: 10,
        
        },
        {
            id: 8,
            nome: 'Camisa Bahia',
            preco: 292.99,
            imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWOxai7wqz-fesnAPAWMRIwR_GHFB8s-RCRwa23okJ3JTeM9Jypbu6O4k32WBTsWTz3x6TaJ-A_V2lehjeLKdIySZufs7nBha454QSiisxd5VV1FDXtDKFVlWyi-kxJtVxL9DUT3P20e8/s1600/Bahia+2014+2.png',
            descricao: ' Camisa do Bahia: azul e vermelho com listras horizontais, destacando o escudo tricolor e a tradição do clube baiano.',
            estoque: 11,
            
        },
        {
            id: 9,
            nome: 'Camisa Fluminense',
            preco: 250.00,
            imagem: 'https://fluminense.vteximg.com.br/arquivos/ids/158648-1000-1000/FPON9VgXsAAiUqm-removebg-preview.png?v=637844182303130000',
            descricao: ' Camisa do Fluminense: verde, branco e grená com listras verticais, destacando o escudo tricolor e a história do clube carioca.',
            estoque: 15,
       
        },
        {
            id: 10,
            nome: 'Flamengo',
            preco: 499.99,
            imagem: 'https://www.camarotedotorcedor.com.br/wp-content/uploads/2025/03/m_0115_00100724113_1_2.png',
            descricao: ' Camisa do Flamengo: vermelha e preta com listras horizontais, destacando o escudo rubro-negro e a paixão da torcida carioca.',
            estoque: 8,
     
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
            </View>
        </TouchableOpacity>
    );

    return (
<>
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Catálogo de Camisas</Text>
            <FlatList
                data={camisas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarCamisa}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={estilos.linhaCamisas}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                        title="Atualizando catálogo..."
                    />
                }
            />
        </View>
    </>
    
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
        width: width * 0.4,
        height: height * 0.2,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: 'white',
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
});
