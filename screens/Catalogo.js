import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, RefreshControl, Dimensions, StatusBar, Platform, ActivityIndicator, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Configuracao from '../components/configuracao';

// Obtem as dimensões da tela
const { width, height } = Dimensions.get('window');

function TelaListaDeCamisas({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);    // Controle do Refresh visual
    const [timeSelecionado, setTimeSelecionado] = useState('todos');  // Filtro do Picker
    const [loading, setLoading] = useState(true);  // Controle de loading inicial

    // Simula carregamento inicial (ex: carregando StatusBar e dados)
    useEffect(() => {
        // Simula carregamento inicial (ex: carregando StatusBar e dados)
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Função de refresh (puxe para o refresh)
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    };

    // Array de objetos com as informações das camisas
    const camisas = [
        {
            id: 1,
            nome: 'Camisa Mirassol',
            preco: 249.99,
            imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgy05GWcIrMmRYRd5DceIE1FcuRdxpa4vVPWmFnrhOoLC7wpQknIsPeKUp2lO9ILOlrmBtNAKrmjsHPidyOzKdmkT0zVTpELm_wPk3V4U1y9adLRGVdhFHiOmBebsIFCFR2tZhdjt0lUSTP/s1600/Mirassol+2020+1.png',
            descricao: 'Camisa do Mirassol: amarela vibrante com detalhes verdes e o leão no escudo destacando a identidade do clube',
            estoque: 15,
            time: 'Mirassol',
        },
        {
            id: 2,
            nome: 'Camisa Palmeiras',
            preco: 499.99,
            imagem: 'https://www.mundodofutebol.com.br/lojas/00057707/prod/palmeiraawe.png',
            descricao: 'Camisa do Palmeiras: verde tradicional com detalhes brancos e o escudo alviverde simbolizando tradição e glórias',
            estoque: 8,
            time: 'Palmeiras',
        },
        {
            id: 3,
            nome: 'Camisa São Paulo',
            preco: 350.00,
            imagem: 'https://acdn-us.mitiendanube.com/stores/002/265/580/products/1-removebg-preview-61-3c145f7fc21634815716862426061398-640-0.png',
            descricao: 'Camisa do São Paulo: branca com faixas horizontais vermelha e preta no peito, destacando o escudo tricolor',
            estoque: 30,
            time: 'São Paulo',
        },
        {
            id: 4,
            nome: 'Camisa Grêmio',
            preco: 199.99,
            imagem: 'https://gremio1903.wordpress.com/wp-content/uploads/2011/01/grc3aamiofrente.png?w=584',
            descricao: 'Camisa do Grêmio: listrada em azul, preto e branco, com o escudo tricolor centralizado no peito.',
            estoque: 32,
            time: 'Grêmio',
        },
        {
            id: 5,
            nome: 'Camisa Vasco',
            preco: 599.99,
            imagem: 'https://webshop.vteximg.com.br/arquivos/ids/213214-1000-1000/M_0105_00200632002.png?v=638579612893500000',
            descricao: ' Camisa do Vasco: preta com detalhes em branco e o icônico escudo cruzmaltino, simbolizando tradição e paixão.',
            estoque: 28,
            time: 'Vasco',
        },
        {
            id: 6,
            nome: 'Camisa Santos',
            preco: 159.99,
            imagem: 'https://dasports.com.br/cdn/shop/files/Santos-Comemorativa_24_25_1_1024x.png?v=1749439987',
            descricao: ' Camisa do Santos: branca com detalhes em preto e o escudo do peixe, representando a história e a tradição do clube.',
            estoque: 18,
            time: 'Santos',
        },
        {
            id: 7,
            nome: 'Corinthians',
            preco: 1.99,
            imagem: 'https://www.futebolreligiao.com.br/image/cache/catalog/Corinthians/Camisa%20III%20Corinthians%202024%20Third-900x900.png',
            descricao: '    Camisa do Corinthians: branca com detalhes em preto e o famoso escudo alvinegro, simbolizando a força e a paixão da torcida.',
            estoque: 10,
            time: 'Corinthians',
        },
        {
            id: 8,
            nome: 'Camisa Bahia',
            preco: 292.99,
            imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWOxai7wqz-fesnAPAWMRIwR_GHFB8s-RCRwa23okJ3JTeM9Jypbu6O4k32WBTsWTz3x6TaJ-A_V2lehjeLKdIySZufs7nBha454QSiisxd5VV1FDXtDKFVlWyi-kxJtVxL9DUT3P20e8/s1600/Bahia+2014+2.png',
            descricao: ' Camisa do Bahia: azul e vermelho com listras horizontais, destacando o escudo tricolor e a tradição do clube baiano.',
            estoque: 11,
            time: 'Bahia',
        },
        {
            id: 9,
            nome: 'Camisa Fluminense',
            preco: 250.00,
            imagem: 'https://fluminense.vteximg.com.br/arquivos/ids/158648-1000-1000/FPON9VgXsAAiUqm-removebg-preview.png?v=637844182303130000',
            descricao: ' Camisa do Fluminense: verde, branco e grená com listras verticais, destacando o escudo tricolor e a história do clube carioca.',
            estoque: 15,
            time: 'Fluminense',
        },
        {
            id: 10,
            nome: 'Flamengo',
            preco: 499.99,
            imagem: 'https://www.camarotedotorcedor.com.br/wp-content/uploads/2025/03/m_0115_00100724113_1_2.png',
            descricao: ' Camisa do Flamengo: vermelha e preta com listras horizontais, destacando o escudo rubro-negro e a paixão da torcida carioca.',
            estoque: 8,
            time: 'Flamengo',
        },
    ];

    // Lista de times para o Picker
    const times = [
        'todos',    // Opção fixa (para mostrar todas as camisas)
        ...Array.from(new Set(camisas.map(c => c.time))),   // Copia a array extraindo só a informação de times
        // new Set cria um objeto com os valores sem duplicadas (Ex: { Flamengo, Corinthians, Palmeiras })
        // Array.from transforma esse objeto em array (Ex: { Flamengo, Corinthians, Palmeiras } -> [] Flamengo, Corinthians, Palmeiras ] )
        // O spread "..." copia essa array para dentro do const times (para não ter uma array dentro da array)
    ];

    // Filtra as camisas pelo time selecionado
    const camisasFiltradas = timeSelecionado === 'todos'    // Verifica se o picker está em todos
        ? camisas   // Se tiver, mostra todas as camisas
        : camisas.filter(c => c.time === timeSelecionado)   // Caso não, ele filtra a array em busca do time filtrado

    const abrirDetalhesCamisa = (camisa) => {
        // normaliza dados para evitar undefined / espaços nas URLs
        const produtoNormalizado = {    // Dados da camisa normalizados
            ...camisa,
            imagem: (camisa.imagem || '').trim(),
            descricao: camisa.descricao || 'Descrição não disponível.', // Texto padrão se descrição estiver vazia
            categoria: camisa.categoria || 'Camiseta de time',  // Categoria padrão se não existir
            estoque: typeof camisa.estoque === 'number' ? camisa.estoque : 0,   // Garante que estoque é do tipo number
            avaliacoes: camisa.avaliacoes || 0, // Garante que avaliações é um número (padrão 0)
        };

        // Navega para a tela de detalhes, passando os dados normalizados e informações extras
        navigation.navigate('DetalhesCamisas', {
            produtoSelecionado: produtoNormalizado,
            origemNavegacao: 'lista_camisas',
            timestampVisita: Date.now()
        });
    };

    // Função para renderizar bloco de camisa
    const renderizarCamisa = ({ item }) => (
        <TouchableOpacity style={estilos.cardCamisa} onPress={() => abrirDetalhesCamisa(item)}>
            <Image source={{ uri: item.imagem }} style={estilos.imagemCamisa} />
            <View style={estilos.infoCamisa}>
                <Text style={estilos.nomeCamisa}>{item.nome}</Text>
                <Text style={estilos.precoCamisa}>R$ {item.preco.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    // Mostra tela de loading enquanto carrega
    if (loading) {
        return (
            <>
                <StatusBar
                    barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                    backgroundColor={Platform.OS === 'android' ? 'transparent' : 'transparent'}
                    translucent={Platform.OS === 'android'}
                />
                <View style={estilos.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text style={estilos.loadingText}>Carregando catálogo...</Text>
                </View>
            </>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <StatusBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                backgroundColor={Platform.OS === 'android' ? '#6366f1' : 'transparent'}
                translucent={Platform.OS === 'android'}
            />
            <View style={estilos.statusBarFalsa} />
            <View style={estilos.container}>
                <Text style={estilos.titulo}>Catálogo de Camisas</Text>
                <Configuracao />
                <View style={estilos.pickerContainer}>
                    <Text style={estilos.pickerLabel}>Filtrar por time:</Text>
                    <Picker
                        selectedValue={timeSelecionado} // Valor selecionado
                        style={estilos.picker}  // Estilização
                        onValueChange={(itemValue) => setTimeSelecionado(itemValue)}    // Altera o time do filtro (time selecionado)
                        mode="dropdown" // Modo de visualização do picker
                        dropdownIconColor="#6366f1" // Estilização
                    >
                        {times.map((time, idx) => ( // Cria os itens do picker (opções)
                            <Picker.Item key={idx} label={time.charAt(0).toUpperCase() + time.slice(1)} value={time} />
                        ))}
                    </Picker>
                </View>
                <FlatList
                    data={camisasFiltradas} // Informações da array (camisas filtradas)
                    keyExtractor={(item) => item.id.toString()} // Chave única para cada item
                    renderItem={renderizarCamisa}   // Função do renderizar camisa para criar blocos
                    numColumns={2}  // Número de colunas
                    showsVerticalScrollIndicator={false}    // Ocultar o vertical scroll (barra)
                    columnWrapperStyle={estilos.linhaCamisas}   // Estilização da coluna
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing} // Define se está ativo ou não
                            onRefresh={onRefresh}   // Ativa o refresh
                            colors={['#6366f1']}
                            tintColor="#6366f1"
                            title="Atualizando catálogo..."
                        />
                    }
                    ListEmptyComponent={
                        <Text style={estilos.semCamisas}>Nenhuma camisa encontrada para o filtro selecionado.</Text>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

export default TelaListaDeCamisas;

const estilos = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6366f1',
        padding: 12,
        marginBottom: 10,
        textAlign: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 8,
        elevation: 2,
    },
    pickerLabel: {
        fontSize: 16,
        color: '#6366f1',
        fontWeight: 'bold',
        marginRight: 8,
    },
    picker: {
        flex: 1,
        color: '#222',
        height: 60,
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
    semCamisas: {
        textAlign: 'center',
        color: '#888',
        marginTop: 30,
        fontSize: 16,
    },
});