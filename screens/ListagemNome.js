import React, { useState, useEffect } from "react";
import {StyleSheet,Text,View,TextInput,TouchableOpacity,FlatList, Alert} from "react-native";
import * as SQLite from "expo-sqlite";// Importa biblioteca SQLite do Expo para banco de dados local

export default function ListagemNome() {
  const [db, setDb] = useState(null); // Estado que armazena a conexão com o banco de dados
  const [resultados, setResultados] = useState([]); // Estado que guarda os resultados das consultas SQL
  const [nomeCamisa, setNomeCamisa] = useState(""); // Estado que guarda o texto digitado no campo de pesquisa
  const [status, setStatus] = useState("Inicializando..."); // Estado que guarda o status do app (carregando, sucesso, erro)
  const [temTexto, setTemTexto] = useState(false); // Estado para indicar se o campo de pesquisa tem algum texto

  useEffect(() => {
    async function setupDatabase() {  // Função assíncrona para criar/abrir banco e tabela
      try {
        const database = await SQLite.openDatabaseAsync("bd_camisas.db"); // Abre ou cria banco de dados chamado "bd_camisas.db"
        setDb(database);// salva o objeto do banco no estado

        // Cria tabela "camisetas" se não existir
        // id: chave primária auto increment
        // imagem: URL ou caminho da imagem da camiseta
        // cor: cor da camiseta
        // nome: nome da camiseta
        // preco: preço
        // time: time relacionado
        // descricao: descrição da camiseta
        // estoque: quantidade em estoque

        await database.execAsync(`CREATE TABLE IF NOT EXISTS camisetas (   
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagem TEXT NOT NULL,
            cor TEXT NOT NULL,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            time TEXT NOT NULL,
            descricao TEXT NOT NULL,
            estoque INTEGER NOT NULL`);
    // Atualiza o status para mostrar que banco e tabela estão prontos
        setStatus("✅ Banco de dados e tabela prontos!");
      } catch (error) {
        // Em caso de erro, mostra no console e alerta usuário
        console.error("Erro ao conectar ou criar tabela:", error);
        setStatus("❌ Erro ao inicializar o banco de dados. Veja o log.");
        Alert.alert("Erro", "Não foi possível conectar ao banco de dados.");
      }
    }

    // Chama a função para configurar o banco
    setupDatabase();
  }, []); // array vazio significa que roda apenas uma vez, ao montar

  // Função genérica para executar consultas SQL
  const executarConsulta = async (query, params = []) => {
 // Verifica se o banco está pronto
    if (!db) {
      Alert.alert("Erro", "O banco de dados não está pronto.");
      return;
    }

    try {
        // Executa consulta e retorna todas as linhas
      const rows = await db.getAllAsync(query, params);
       // Salva resultados no estado
      setResultados(rows);
      // Se não houver resultados, mostra aviso
      if (rows.length === 0) {
        Alert.alert("Aviso", "Nenhum resultado encontrado.");
      }
    } catch (error) {
        // Em caso de erro, mostra alerta e log
      Alert.alert("Erro", "Falha na consulta. Verifique o console.");
      console.error("Erro na consulta:", error);
    }
  };

  // Função específica para pesquisar camisetas pelo nome
  const pesquisarNome = async () => {
    // Verifica se o campo está vazio
    if (!nomeCamisa.trim()) {
      Alert.alert("Aviso", "Digite um nome para pesquisar.");
      return;
    }
    // Executa consulta SQL usando LIKE para buscar parcialmente
    await executarConsulta("SELECT * FROM camisetas WHERE nome LIKE ?;", [
      `%${nomeCamisa}%`,
    ]);
  };

  // Função para renderizar cada item da lista de resultados
const renderItem = ({ item }) => (
  <View style={estilos.itemLista}>
    {/* Imagem da camiseta */}
    <Image
      source={{ uri: item.imagem }} // URL ou caminho local
      style={estilos.imagemItem}
    />
    
    {/* Nome */}
    <Text style={estilos.textoItem}>{item.nome}</Text>

    {/* Preço */}
    <Text style={estilos.textoPreco}>R$ {item.preco.toFixed(2)}</Text>

    {/* Descrição */}
    <Text style={estilos.textoDescricao}>{item.descricao}</Text>
  </View>
);

  // Define cor do texto de status baseado na mensagem
  const corStatus = status.startsWith("✅")
    ? estilos.cores.sucesso
    : status.startsWith("❌")
    ? estilos.cores.erro
    : estilos.cores.texto;

  return (
    <View style={estilos.tela}>
      <View style={estilos.bloco}> {/* Bloco principal que contém tudo */}
        <View style={estilos.cabecalho}>    {/* Cabeçalho com título */}
          <Text style={estilos.titulo}>Consultar Nome da Camiseta</Text>
        </View>

        <View style={estilos.caixaPesquisa}>{/* Caixa de pesquisa */}
          <View style={estilos.blocoInput}>
            <Text style={estilos.label}>Pesquisar</Text> {/* Label do campo */}
            {/* Linha de borda que muda de cor se tem texto */}
            <View 
              style={[
                estilos.linha,
                { borderBottomColor: temTexto ? "#90EE90" : "#6B7280" },
              ]}
            >
              {/* Input de texto */}
              <TextInput  
                style={estilos.campoTexto}
                placeholder="Digite um nome de camiseta"
                placeholderTextColor="#6B7280"
                value={nomeCamisa}
                onChangeText={(texto) => {
                  setNomeCamisa(texto); // atualiza estado
                  setTemTexto(texto.trim().length > 0); // atualiza se tem texto
                }}
              />
            </View>

             {/* Botão de pesquisa */}
            <TouchableOpacity
              style={estilos.botao}
              onPress={pesquisarNome}  // chama função de pesquisa
              disabled={!db} // desabilita se banco não estiver pronto
            >
              <Text style={estilos.textoBotao}>🔎</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de resultados */}
        <FlatList 
          style={estilos.lista}
          contentContainerStyle={estilos.conteudoLista}
          data={resultados} // dados da lista
          renderItem={renderItem} // função que renderiza cada item
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={estilos.textoVazio}>Nenhuma camiseta encontrada</Text>
          }
        />
        {/* Status do banco (sucesso, erro ou carregando) */}
        <Text style={[estilos.textoStatus, { color: corStatus }]}>
          {status}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cores: {
    fundo: "#87CEEB",
    primario: "#90EE90",
    texto: "#0F1724",
    apagado: "#6B7280",
    sucesso: "#16A34A",
    erro: "#DC2626",
  },

  tela: {
    flex: 1,
    backgroundColor: "#DCDCDC",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },

  bloco: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    padding: 16,
    width: "100%",
    maxWidth: 500,
    height: "90%",
    backgroundColor: "#87CEEB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  cabecalho: {
    backgroundColor: "#90EE90",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  caixaPesquisa: {
    width: "100%",
    maxWidth: 500,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    alignSelf: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F1724",
    marginBottom: 8,
  },

  linha: {
    borderBottomWidth: 2,
    marginBottom: 12,
  },

  campoTexto: {
    height: 40,
    fontSize: 15,
    color: "#0F1724",
    textAlign: "center",
  },

  botao: {
    backgroundColor: "#90EE90",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 15,
    width: "25%",
  },

  textoBotao: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  lista: {
    width: "100%",
    flex: 1,
  },

  conteudoLista: {
    paddingBottom: 24,
  },

  itemLista: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  textoItem: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0F1724",
  },

  textoVazio: {
    textAlign: "center",
    fontSize: 16,
    color: "#475569",
    marginTop: 50,
  },

  textoStatus: {
    fontSize: 12,
    marginTop: 80,
    textAlign: "center",
  },

  blocoInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    width: "100%",
    alignSelf: "center",
  },
  imagemItem: {
  width: 150,
  height: 150,
  resizeMode: "contain",
  marginBottom: 10,
},

textoPreco: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000",
  marginBottom: 5,
},

textoDescricao: {
  fontSize: 14,
  color: "#333",
  textAlign: "center",
},

});
