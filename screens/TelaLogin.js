import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient"; // Cor do fundo gradiente
import { BlurView } from "expo-blur"; // Efeito borrado
import { TextInput } from "react-native-paper"; // Imput Estilizado
import { useForm, Controller } from "react-hook-form"; // Hook para gerenciar formulários

function TelaLogin({ navigation }) {
  const { control, handleSubmit, watch } = useForm(); // Hook do react-hook-form para controlar os inputs

  // Estados para controlar mensagens de erro e carregamento
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Obtém os valores digitados nos campos "usuario" e "senha"
  const usuarioDigitado = watch("usuario");
  const senhaDigitada = watch("senha");

  // Simulando base de usuários
  const usuariosValidos = [
    {
      usuario: "aluno",
      senha: "123",
    },
  ];

  // Função chamada ao pressionar o botão de login
  const realizarLogin = () => {
    // Verifica se os campos foram preenchidos
    if (!usuarioDigitado || !senhaDigitada) {
      setErro("Preencha usuário e senha");
      return;
    }

    // Verifica se os dados digitados correspondem a algum usuário válido
    const usuarioValido = usuariosValidos.find(
      (u) => u.usuario === usuarioDigitado && u.senha === senhaDigitada
    );
    //(u) é um objeto que contém as propriedades usuario senha.

    // Se não encontrar usuário válido, exibe erro
    if (!usuarioValido) {
      setErro("Usuário ou senha incorretos");
      return;
    }

    setErro(""); //Limpa o erro
    setCarregando(true); // Inicia o carregamento

    // Simula um atraso de 3 segundos antes de navegar
    setTimeout(() => {
      setCarregando(false);
      navigation.navigate("TelaListaProdutos"); // Navega para a próxima tela
    }, 3000);
  };

  return (
    // Evita que o teclado sobreponha os campos (iOS e Android)
    <KeyboardAvoidingView
      behaivor={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        {" "}
        {/* Permite rolar a tela em dispositivos menores */}
        <LinearGradient
          colors={["#0c3479ff", "#90EE90"]} // Gradiente azul com verde
          style={estilos.tela}
        >
          <View style={estilos.container}>
            <Text style={estilos.titulo}>Time de Craques ⚽</Text>

            <BlurView intensity={40} style={estilos.contInp}>
              {" "}
              {/* Área com desfoque para os inputs */}
              <View style={estilos.conInpueTitu}>
                <Text style={estilos.titInpu}> Faça Login</Text>

                {/* Campo de entrada do usuário */}
                <Controller
                  control={control} // Objeto vindo do useForm()
                  name="usuario" // Nome do campo (chave do formulário)
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Usuário"
                      value={value} //Valor atual do campo
                      onChangeText={onChange} // Atualiza o valor quando o usuário digita
                      style={estilos.input}
                    />
                  )}
                />

                {/* Campo de entrada da senha */}
                <Controller
                  control={control} // Objeto vindo do useForm()
                  name="senha"     // Nome do campo (chave do formulário)
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Senha"
                      value={value} //Valor atual do campo
                      onChangeText={onChange} // Atualiza o valor quando o usuário digita
                      keyboardType="password"
                      secureTextEntry // Oculta o texto da senha
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
                <Text style={{ marginVertical: 10 }}>
                  Carregando, segura aí!
                </Text>
                <ActivityIndicator size="large" color="#218cff" />
              </>
            )}
            {/* Botão de login (só aparece se não estiver carregando) */}
            {!carregando && (
              <TouchableOpacity style={estilos.botao} onPress={realizarLogin}>
                <Text style={estilos.textoBotao}>Entrar</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
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
