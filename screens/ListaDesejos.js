import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { RefreshControl, Alert, Image, Text, SafeAreaView, View, StyleSheet, Dimensions, FlatList } from "react-native"

const { width, height } = Dimensions.get('window');

export default function ListaDesejos() {

    const [listaDesejos, setListaDesejos] = useState([])
    const [apelidoUser, setApelidoUser] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    // Função para carregar dados do AsyncStorage
    const carregarDados = async () => {
        try {  // Tenta carregar os dados

            // Armazena o apelido do usuário
            const apelido = await AsyncStorage.getItem('apelido')

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

        } catch (e) { // Em caso de erro em buscar, exibe um alerta e o erro no console
            Alert.alert("Erro", 'Erro ao carregar dados.')
            console.error(e)
        }
    }

    useEffect(() => {
        carregarDados()
    }, [refreshing])

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    };

    const renderizarCamisa = ({ item }) => {
        return (
            <View style={estilos.cardCamisa}>
                <Image source={{ uri: item.imagem }} style={estilos.imagemCamisa} />
                <View style={estilos.infoCamisa}>
                    <Text style={estilos.nomeCamisa}>{item.nome}</Text>
                    <Text style={estilos.precoCamisa}>R$ {item.preco.toFixed(2)}</Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView>
            <View></View>
            <View>
                <FlatList
                    data={listaDesejos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderizarCamisa}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={estilos.linhaCamisas}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
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
    )
}

const estilos = StyleSheet.create({
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
    linhaCamisas: {
        justifyContent: 'space-between',
    },
})