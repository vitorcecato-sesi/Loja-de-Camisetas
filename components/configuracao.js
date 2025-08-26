import { useState, useEffect } from "react"
import { Dimensions, View, Text, Pressable, Modal, StyleSheet, TouchableHighlight, ScrollView, Switch, Alert, ActivityIndicator } from "react-native"
import Slider from "@react-native-community/slider"
import { Picker } from "@react-native-picker/picker"

export default function Configuracao() {

    const [modalVisivel, setModalVisivel] = useState(false)
    const [dimensoes, setDimensoes] = useState(Dimensions.get('window'))
    const [valor, setValor] = useState(0.5)
    const [notificacoes, setNotificacoes] = useState(true)
    const [loading, setLoading] = useState(false)


    const { width, height } = dimensoes

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensoes(window)
        })

        return () => subscription.remove()
    }, [])


    const salvarConfig = async () => {

        setLoading(true)

        // Simulando uma requisição para API
        setTimeout(() => {

            Alert.alert(
                "Sucesso! 🎉",
                `As configurações foram salvas com sucesso!`,
                [
                    {
                        text: "Obrigado!",
                        onPress: () => setModalVisivel(false),
                    },
                ]
            )
            setLoading(false)
        }, 2000)
    }


    return (
        <>
            {/* Botão que será retornado */}
            <View style={styles.buttonContainer}>
                <Pressable
                    title={"Configurações ⚙"}
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed ? "#d1c4e9" : "#673ab7",
                            padding: 5,
                            width: width * 0.4, // Ajuste a largura do botão
                            borderRadius: 12,
                        }
                    ]}
                    onPress={() => setModalVisivel(true)}
                >
                    <Text style={{ ...styles.buttonText, fontSize: 15, fontWeight: 'bold' }}>
                        Configuração
                    </Text>
                </Pressable>
            </View>

            {/* Modal */}
            <Modal
                visible={modalVisivel}
                animationType="slide"
                onRequestClose={() => setModalVisivel(false)}
            >
                <ScrollView style={styles.modalContainer}>

                    {/* Titulo */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.titulo}>Configurações</Text>
                    </View>

                    {/* Notificações - Switch */}
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}><Text style={{ fontWeight: 'bold' }}>Notificações: </Text> {notificacoes ? "Ativadas" : "Desativadas"}</Text>
                        <Switch value={notificacoes} onValueChange={setNotificacoes} />
                    </View>


                    {/* Volume - Slider */}
                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderText}>
                            <Text style={{ fontWeight: 'bold' }}>Volume:</Text> {Math.round(valor * 100)}%
                        </Text>
                        <Slider
                            value={valor}
                            onValueChange={setValor}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.01}
                            minimumTrackTintColor="#007bff"
                            maximumTrackTintColor="#bbb"
                            thumbTintColor="#333"
                        />
                    </View>

                    {/* Linguagem - Picker */}
                    <View style={styles.pickerContainer}>
                        <Text style={[styles.pickerLabel, { fontWeight: 'bold' }]}>Idioma:</Text>
                        <Picker>
                            <Picker.Item label="Português" value={"pt"} />
                            <Picker.Item label="Inglês" value={"en"} />
                        </Picker>
                    </View>

                    {/* Dimensões da Tela */}
                    <View style={[styles.switchContainerStart, { flexDirection: 'column', width: width * 0.9, }]}>
                        <Text style={styles.switchTextBold}>
                            Dimensões da Tela:
                        </Text>
                        <Text style={styles.switchText}>
                            {width.toFixed(0)} x {height}
                        </Text>
                    </View>

                    {/* Botão para salvar e fechar */}

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <TouchableHighlight
                            style={{ width: width * 0.6, padding: 10, backgroundColor: 'lightgray', borderRadius: 5, alignItems: 'center' }}
                            activeOpacity={0.7}
                            onPress={() => salvarConfig()}
                            disabled={loading}
                        >
                            <Text>{loading ? "Salvando..." : "Fechar"}</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        padding: 20,
        width: 200,
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 15,
        margin: 10,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#673ab7',
        padding: 15,
        borderRadius: 10,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    switchContainerStart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        gap: 10,
    },
    switchText: {
        fontSize: 16,
        color: '#333',
    },
    switchTextBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sliderContainer: {
        paddingVertical: 24,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    sliderText: {
        marginBottom: 10,
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        marginVertical: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    pickerLabel: {
        fontSize: 16,
        color: '#333',
    },
})
