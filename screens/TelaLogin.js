import React, { useState } from 'react';
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
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';

function TelaLogin({ navigation }) {
  const { control, handleSubmit, watch } = useForm();
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const usuarioDigitado = watch('usuario');
  const senhaDigitada = watch('senha');

  // Simulando base de usuários
  const usuariosValidos = [
    {
      usuario: 'aluno',
      senha: '123',
    },
  ];

  const realizarLogin = () => {
    if (!usuarioDigitado || !senhaDigitada) {
      setErro('Preencha usuário e senha');
      return;
    }

    const usuarioValido = usuariosValidos.find(
      (u) => u.usuario === usuarioDigitado && u.senha === senhaDigitada
    );
    //(u) é um objeto que contém as propriedades usuario senha.

    if (!usuarioValido) {
      setErro('Usuário ou senha incorretos');
      return;
    }

    setErro('');
    setCarregando(true); // Inicia o carregamento

    // Simula um atraso de 3 segundos antes de navegar
    setTimeout(() => {
      setCarregando(false);
      navigation.navigate('TelaListaProdutos'); // Navega para a próxima tela
    }, 3000); 
  }

  return (
    <KeyboardAvoidingView
    behaivor={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView>
      <LinearGradient
        colors={['#0c3479ff', '#90EE90']} // gradiente azul
        style={estilos.tela}>
        <View style={estilos.container}>
          <Text style={estilos.titulo}>Time de Craques ⚽</Text>

          <BlurView intensity={40} style={estilos.contInp}>
            <View style={estilos.conInpueTitu}>
              <Text style={estilos.titInpu}> Faça Login</Text>
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

              {/* campo telefone */}
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

              {erro !== '' && <Text style={estilos.error}>{erro}</Text>}

            </View>
          </BlurView>

          
            {carregando && (
              <>
                <Text style={{ marginVertical: 10 }}>
                  Carregando, segura aí!
                </Text>
                <ActivityIndicator size="large" color="#218cff" />
              </>
            )}
            {!carregando && 
            <TouchableOpacity style={estilos.botao} onPress={realizarLogin}>
            <Text style={estilos.textoBotao}>Entrar</Text>
          </TouchableOpacity>
            }

        </View>
      </LinearGradient>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tela: {
    flex: 1,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 30,
    paddingBottom: 100,
  },
  botao: {
    backgroundColor: '#0c3479ff',
    padding: 10,
    borderRadius: 8,
    width: '40%',
    marginBottom: 200,
  },
  textoBotao: {
    color: '#90EE90',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 35,
    backgroundColor: 'azure',
  },
  contInp: {
    width: '95%',
    padding: 25,
    height: '50%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
  },
  titInpu: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  conInpueTitu: {
    paddingTop: 20,
  },
  error: {
    color: 'red',
    margimBottom: 10,
    textAlign: 'center',
  },
});

export default TelaLogin;
