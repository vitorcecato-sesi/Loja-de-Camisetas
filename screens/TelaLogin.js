import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage'

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";

function TelaLogin({ navigation }) {
  const { control, watch } = useForm();

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const usuarioDigitado = watch("usuario");
  const senhaDigitada = watch("senha");
  const apelidoDigitado = watch("apelido")

  const salvarDados = async () => {
    try {
      await AsyncStorage.setItem("apelido", apelidoDigitado);

    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  }

  const usuariosValidos = [
    {
      usuario: "aluno",
      senha: "123",
    },
  ];

  const realizarLogin = () => {

    if (!usuarioDigitado || !senhaDigitada || !apelidoDigitado) {
      setErro("Preencha usuário, apelido e senha");
      return;
    }

    const usuarioValido = usuariosValidos.find(
      (u) => u.usuario === usuarioDigitado && u.senha === senhaDigitada
    );

    if (!usuarioValido) {
      setErro("Usuário incorreto");
      return;
    }

    setErro("");
    setCarregando(true);

    setTimeout(() => {
      setCarregando(false);
      salvarDados()
      navigation.navigate('Catalogo');
    }, 3000);
  }

  return (
    <LinearGradient
      colors={["#0c3479ff", "#90EE90"]}
      style={estilos.tela}
    >
      {/*Evita que o teclado sobreponha os campos (iOS e Android)*/}
      <KeyboardAvoidingView
        behaivor={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>

          {/* Permite rolar a tela em dispositivos menores */}
          <View style={estilos.container}>
            <Text style={estilos.titulo}>Time de Craques ⚽</Text>

            <BlurView intensity={40} style={estilos.contInp}>

              {/* Área com desfoque para os inputs */}
              <View style={estilos.conInpueTitu}>
                <Text style={estilos.titInpu}> Faça Login</Text>

                {/* Campo de entrada do usuário */}
                <Controller
                  control={control}
                  name="usuario"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Usuário"
                      value={value}
                      onChangeText={onChange}
                      style={estilos.input}
                    />
                  )}
                />

                {/* Campo de entrada da senha */}
                <Controller
                  control={control}
                  name="senha"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Senha"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="password"
                      secureTextEntry
                      style={estilos.input}
                    />
                  )}
                />

                {/* Campo de entrada do apelido */}
                <Controller
                  control={control}
                  name="apelido"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Apelido (Obrigatório)"
                      value={value}
                      onChangeText={onChange}
                      style={estilos.input}
                    />
                  )}
                />

                {/* Exibe mensagem de erro, se houver */}
                {erro !== "" && <Text style={estilos.error}>{erro}</Text>}
              </View>
            </BlurView>

            {/* Se estiver carregando, mostra texto e spinner */}
            {carregando && (
              <>
                <View style={{ marginVertical: 60 }}>
                  <Text>
                    Carregando, segura aí!
                  </Text>
                  <ActivityIndicator size="large" color="#218cff" />
                </View>
              </>
            )}
            {/* Botão de login (só aparece se não estiver carregando) */}
            {!carregando && (
              <TouchableOpacity style={estilos.botao} onPress={realizarLogin}>
                <Text style={estilos.textoBotao}>Entrar</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tela: {
    flex: 1,
    minHeight: '100%',
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    paddingTop: 30,
    paddingBottom: 100,
  },
  botao: {
    backgroundColor: "#0c3479ff",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    marginBottom: 200,
  },
  textoBotao: {
    color: "#90EE90",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 35,
    backgroundColor: "azure",
  },
  contInp: {
    width: "95%",
    padding: 25,
    height: "50%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
  titInpu: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  conInpueTitu: {
    paddingTop: 20,
  },
  error: {
    color: "red",
    margimBottom: 10,
    textAlign: "center",
  },
});

export default TelaLogin;
