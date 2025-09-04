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
  Platform
} from "react-native";

/* Importação para a utilização do storage */
import AsyncStorage from '@react-native-async-storage/async-storage'

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as SQLite from 'expo-sqlite';


function TelaLogin({ navigation }) {
  const { control, watch } = useForm();

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function setupDatabase() {
      try {
        const db = await SQLite.openDatabaseAsync('bd_camisas.db');

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS camisetas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagem TEXT,
            cor TEXT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            time TEXT,
            descricao TEXT,
            estoque INTEGER NOT NULL
          );
        `);
        console.log("Tabela 'camisetas' verificada/criada com sucesso.");

        const camisas = [
          { nome: 'Camisa Mirassol', preco: 249.99, imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgy05GWcIrMmRYRd5DceIE1FcuRdxpa4vVPWmFnrhOoLC7wpQknIsPeKUp2lO9ILOlrmBtNAKrmjsHPidyOzKdmkT0zVTpELm_wPk3V4U1y9adLRGVdhFHiOmBebsIFCFR2tZhdjt0lUSTP/s1600/Mirassol+2020+1.png', descricao: 'Camisa do Mirassol: amarela vibrante com detalhes verdes e o leão no escudo destacando a identidade do clube', estoque: 15, time: 'Mirassol', cor: 'amarelo, verde' },
          { nome: 'Camisa Palmeiras', preco: 499.99, imagem: 'https://www.mundodofutebol.com.br/lojas/00057707/prod/palmeiraawe.png', descricao: 'Camisa do Palmeiras: verde tradicional com detalhes brancos e o escudo alviverde simbolizando tradição e glórias', estoque: 8, time: 'Palmeiras', cor: 'verde, branco' },
          { nome: 'Camisa São Paulo', preco: 350.00, imagem: 'https://acdn-us.mitiendanube.com/stores/002/265/580/products/1-removebg-preview-61-3c145f7fc21634815716862426061398-640-0.png', descricao: 'Camisa do São Paulo: branca com faixas horizontais vermelha e preta no peito, destacando o escudo tricolor', estoque: 30, time: 'São Paulo', cor: 'branco, vermelho' },
          { nome: 'Camisa Grêmio', preco: 199.99, imagem: 'https://gremio1903.wordpress.com/wp-content/uploads/2011/01/grc3aamiofrente.png?w=584', descricao: 'Camisa do Grêmio: listrada em azul, preto e branco, com o escudo tricolor centralizado no peito.', estoque: 32, time: 'Grêmio', cor: 'azul, branco' },
          { nome: 'Camisa Vasco', preco: 599.99, imagem: 'https://webshop.vteximg.com.br/arquivos/ids/213214-1000-1000/M_0105_00200632002.png?v=638579612893500000', descricao: ' Camisa do Vasco: preta com detalhes em branco e o icônico escudo cruzmaltino, simbolizando tradição e paixão.', estoque: 28, time: 'Vasco', cor: 'preto, branco' },
          { nome: 'Camisa Santos', preco: 159.99, imagem: 'https://dasports.com.br/cdn/shop/files/Santos-Comemorativa_24_25_1_1024x.png?v=1749439987', descricao: ' Camisa do Santos: branca com detalhes em preto e o escudo do peixe, representando a história e a tradição do clube.', estoque: 18, time: 'Santos', cor: 'branco, preto' },
          { nome: 'Corinthians', preco: 1.99, imagem: 'https://www.futebolreligiao.com.br/image/cache/catalog/Corinthians/Camisa%20III%20Corinthians%202024%20Third-900x900.png', descricao: '    Camisa do Corinthians: branca com detalhes em preto e o famoso escudo alvinegro, simbolizando a força e a paixão da torcida.', estoque: 10, time: 'Corinthians', cor: 'preta, vermelha' },
          { nome: 'Camisa Bahia', preco: 292.99, imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWOxai7wqz-fesnAPAWMRIwR_GHFB8s-RCRwa23okJ3JTeM9Jypbu6O4k32WBTsWTz3x6TaJ-A_V2lehjeLKdIySZufs7nBha454QSiisxd5VV1FDXtDKFVlWyi-kxJtVxL9DUT3P20e8/s1600/Bahia+2014+2.png', descricao: ' Camisa do Bahia: azul e vermelho com listras horizontais, destacando o escudo tricolor e a tradição do clube baiano.', estoque: 11, time: 'Bahia', cor: 'azul, vermelho' },
          { nome: 'Camisa Fluminense', preco: 250.00, imagem: 'https://fluminense.vteximg.com.br/arquivos/ids/158648-1000-1000/FPON9VgXsAAiUqm-removebg-preview.png?v=637844182303130000', descricao: ' Camisa do Fluminense: verde, branco e grená com listras verticais, destacando o escudo tricolor e a história do clube carioca.', estoque: 15, time: 'Fluminense', cor: 'verde, vermelho' },
          { nome: 'Flamengo', preco: 499.99, imagem: 'https://www.camarotedotorcedor.com.br/wp-content/uploads/2025/03/m_0115_00100724113_1_2.png', descricao: ' Camisa do Flamengo: vermelha e preta com listras horizontais, destacando o escudo rubro-negro e a paixão da torcida carioca.', estoque: 8, time: 'Flamengo', cor: 'vemelho, preto' },
        ];

        const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM camisetas');
        if (result.count === 0) {
          console.log('Tabela "camisetas" está vazia. Inserindo dados iniciais...');
          await db.withTransactionAsync(async () => {
            for (const camisa of camisas) {
              await db.runAsync(
                'INSERT INTO camisetas (nome, preco, imagem, descricao, estoque, time, cor) VALUES (?, ?, ?, ?, ?, ?, ?)',
                camisa.nome,
                camisa.preco,
                camisa.imagem,
                camisa.descricao,
                camisa.estoque,
                camisa.time,
                camisa.cor
              );
            }
          });
          console.log('Dados iniciais inseridos na tabela "camisetas".');
          
        } else {
          console.log('Tabela "camisetas" já contém dados.');
          
        }
      } catch (error) {
        console.error('Erro no setup do banco de dados:', error);

      }
    }
    setupDatabase();
  }, []);

  const usuarioDigitado = watch("usuario");
  const senhaDigitada = watch("senha");
  const apelidoDigitado = watch("apelido")

  // Função para salvar dados no AsyncStorage
  const salvarDados = async () => {
    try { // Tenta salvar os dados

      // Salva o apelido no AsyncStorage
      await AsyncStorage.setItem("apelido", apelidoDigitado);

    } catch (error) { // Em caso de erro, exibe no console
      console.error("Erro ao salvar dados:", error);
    }
  }

  const usuariosValidos = [
    {
      usuario: "aluno",
      senha: "123",
    },
  ];


  // Função para verificar login
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
      // Chama a função para salvar os dados no AsyncStorage
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
    paddingBottom: 70,
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
    height: "70%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
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
