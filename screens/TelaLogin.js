import React, { useState, useEffect } from "react";
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

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as SQLite from 'expo-sqlite';


function TelaLogin({ navigation }) {
  const { control, watch } = useForm();

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [status, setStatus] = useState('Verificando conexão com o banco de dados...');

  useEffect(() => {
    async function testarConexao() {
      try {
        // Abre (ou cria) o banco de dados local
        const db = await SQLite.openDatabaseAsync('bd_camisas.db');
        // Executa um comando simples só para testar a conexão
        await db.execAsync('PRAGMA user_version;');
        setStatus('✅ Conexão com o banco de dados estabelecida com sucesso!');
      } catch (error) {
        // Se der erro, mostra mensagem de erro
        console.error('Erro na conexão:', error);
        setStatus('❌ Erro ao conectar com o banco de dados. Veja o log para mais detalhes.');
      }
    }
    testarConexao();
  }, []);

  let statusColor = '#007bff'; // info padrão
  if (status.startsWith('✅')) statusColor = '#28a745'; // verde sucesso
  if (status.startsWith('❌')) statusColor = '#dc3545'; // vermelho erro

  const usuarioDigitado = watch("usuario");
  const senhaDigitada = watch("senha");

  const usuariosValidos = [
    {
      usuario: "aluno",
      senha: "123",
    },
  ];


  // Função para verificar login
  const realizarLogin = () => {

    if (!usuarioDigitado || !senhaDigitada) {
      setErro("Preencha usuário e senha");
      return;
    }

    const usuarioValido = usuariosValidos.find(
      (u) => u.usuario === usuarioDigitado && u.senha === senhaDigitada
    );

    if (!usuarioValido) {
      setErro("Usuário ou senha incorretos");
      return;
    }

    setErro(""); 
    setCarregando(true); 

    setTimeout(() => {
      setCarregando(false);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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

            {/* Status do banco de dados */}
            <BlurView intensity={50} tint="light" style={estilos.statusContainer}>
              <Text style={[estilos.statusText, { color: statusColor }]}>{status}</Text>
            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  statusContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    overflow: 'hidden',
    width: '95%',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
    marginBottom: 20,
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
