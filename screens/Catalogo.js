import { useState, useEffect, use } from "react";
import { StyleSheet, Text, View, FlatList, Alert, Image, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite"; // Biblioteca para banco de dados SQLite no Expo
import { useNavigation } from "@react-navigation/native"; // Hook para navegação entre telas

export default function Catalogo() {
  // Obtém o objeto navigation para navegação entre telas
  const navigation = useNavigation();

  // Estado para armazenar a conexão com o banco de dados SQLite
  const [db, setDb] = useState(null);

  // Estado para armazenar os resultados das consultas SQL (lista de camisetas)
  const [results, setResults] = useState([]);

  // Estado para armazenar o texto digitado no campo de pesquisa por nome
  const [searchText, setSearchText] = useState("");

  // Estado para armazenar o texto digitado no campo de pesquisa por cor
  const [searchCor, setSearchCor] = useState("");

  // Estado para mostrar mensagens de status da aplicação (ex: banco pronto, erros)
  const [status, setStatus] = useState("Inicializando...");

  // Estado para indicar se o banco de dados e a tabela estão prontos
  const [carregado, setCarregado] = useState(false);

  // useEffect para inicializar o banco de dados e criar a tabela ao montar o componente
  useEffect(() => {
    async function setupDatabase() {
      try {
        // Abre (ou cria) o banco de dados local bd_camisas.db
        const database = await SQLite.openDatabaseAsync("bd_camisas.db");
        setDb(database); // Salva a conexão no estado

        // Cria a tabela camisetas caso ela não exista ainda
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS camisetas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagem TEXT NOT NULL,
            cor TEXT NOT NULL,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            time TEXT NOT NULL,
            descricao TEXT NOT NULL,
            estoque INTEGER NOT NULL
          );
        `);

        // Atualiza o status para indicar sucesso
        setStatus("✅ Banco de dados e tabela prontos!");
        setCarregado(true);
      } catch (error) {
        // Em caso de erro, loga no console e mostra alerta para o usuário
        console.error("Erro ao conectar ou criar tabela:", error);
        setStatus("❌ Erro ao inicializar o banco de dados. Veja o log.");
        Alert.alert("Erro", "Não foi possível conectar ao banco de dados.");
      }
    }
    setupDatabase();
  }, []); // Executa apenas uma vez ao montar o componente

  // Loga o status sempre que ele mudar
  useEffect(() => {
    console.log(status);
  }, [status]);

  // Função para lidar com a atualização e geração de itens do banco de dados
  useEffect(() => {
    if (db && carregado) {
      exibirTodos();
    }
  }, [db, carregado]);

  useEffect(() => {   // Fica atualizando para atualizar as camisas
    const timer = setTimeout(() => {
      if (db && carregado) {
        exibirTodos();
      }
    }, 1000);
    return () => clearTimeout(timer);
  })

  // Função genérica para executar consultas SQL e atualizar os resultados
  const executarConsulta = async (query, params = []) => {
    if (!db) {
      // Se o banco não estiver pronto, avisa o usuário
      Alert.alert("Erro", "O banco de dados não está pronto.");
      return;
    }

    try {
      // Executa a consulta SQL com os parâmetros fornecidos
      const rows = await db.getAllAsync(query, params);
      setResults(rows); // Atualiza o estado com os resultados

      // Se não encontrou nenhum resultado, avisa o usuário
      if (rows.length === 0) {
        Alert.alert("Aviso", "Nenhum resultado encontrado.");
      }
    } catch (error) {
      // Em caso de erro na consulta, mostra alerta e loga no console
      Alert.alert("Erro", "Falha na consulta. Verifique o console.");
      console.error("Erro na consulta:", error);
    }
  };

  // Função para exibir todas as camisetas cadastradas
  const exibirTodos = async () => {
    if (!db) {
      Alert.alert("Erro", "O banco de dados não está pronto.");
      return;
    }
    await executarConsulta("SELECT * FROM camisetas;");
  };

  
  // Função para abrir a tela de detalhes da camisa selecionada
  const abrirDetalhesCamisa = (camisa) => {
    // Normaliza os dados do produto para evitar erros
    const produtoNormalizado = {
      ...camisa,
      imagem: (camisa.imagem || "").trim(), // Remove espaços extras da URL da imagem
      descricao: camisa.descricao || "Descrição não disponível.",
      categoria: camisa.categoria || "Camiseta de time",
      estoque: typeof camisa.estoque === "number" ? camisa.estoque : 0,
      avaliacoes: camisa.avaliacoes || 0,
    };

    // Navega para a tela 'DetalhesCamisas' passando os dados do produto e outras infos
    navigation.navigate("DetalhesCamisas", {
      produtoSelecionado: produtoNormalizado,
      origemNavegacao: "lista_camisas",
      timestampVisita: Date.now(),
    });
  };

  // Função para renderizar cada item da lista de camisetas
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={estilos.cardCamisa}
      onPress={() => abrirDetalhesCamisa(item)} // Ao tocar, abre detalhes da camisa
    >
      {/* Imagem da camisa */}
      <Image source={{ uri: item.imagem }} style={estilos.imagemCamisa} />
      {/* Informações da camisa */}
      <View style={estilos.infoCamisa}>
        <Text style={estilos.nomeCamisa}>{item.nome}</Text>
        <Text style={estilos.precoCamisa}>R$ {item.preco.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  // Define a cor do texto de status dinamicamente conforme o status atual
  const statusColor = status.startsWith("✅")
    ? estilos.colors.success
    : status.startsWith("❌")
    ? estilos.colors.error
    : estilos.colors.info;

  return (
    <View style={estilos.container}>
      {/* Cabeçalho com título e status */}
      <View style={estilos.headerCard}>
        <Text style={estilos.title}>Catálogo</Text>
        <Text style={[estilos.statusText, { color: statusColor }]}>
          {status}
        </Text>
      </View>

      <FlatList
        style={estilos.list}
        contentContainerStyle={estilos.listContent}
        data={results} // Dados da lista
        renderItem={renderItem} // Função para renderizar cada item
        keyExtractor={(item) => item.id.toString()} // Chave única para cada item
        ListEmptyComponent={
          <Text style={estilos.emptyText}>Nenhuma camisa encontrada.</Text>
        } // Texto exibido se a lista estiver vazia
      />
    </View>
  );
}

// Estilos da aplicação
const estilos = StyleSheet.create({
  colors: {
    background: "#F3F7FB",
    card: "#FFFFFF",
    primary: "#2563EB",
    info: "#0EA5E9",
    success: "#16A34A",
    error: "#DC2626",
    muted: "#6B7280",
    text: "#0F1724",
  },

  container: {
    flex: 1,
    backgroundColor: "#F3F7FB",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 21,
  },

  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#0b1724",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F1724",
    marginBottom: 6,
    textAlign: "center",
  },

  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },

  searchCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#0b1724",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  input: {
    height: 48,
    backgroundColor: "#F9FBFD",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCE7F3",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F1724",
    marginBottom: 12,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  btnWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 24,
  },

  emptyText: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 14,
    marginTop: 20,
  },

  // Estilos do card da camisa
  cardCamisa: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row", // Alinha imagem e texto na horizontal
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  imagemCamisa: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f0f0f0", // Cor de fundo enquanto a imagem carrega
  },

  infoCamisa: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },

  nomeCamisa: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },

  precoCamisa: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
  },
});
