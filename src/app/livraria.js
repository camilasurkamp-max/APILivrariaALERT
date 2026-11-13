import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";


const API_URL = "https://6aededada677fe0fc14fa462.mockapi.io/livros";


// Componente principal do aplicativo.
export default function Livraria() {


  // Armazena a lista de livros cadastrados.
  const [livros, setLivros] = useState([]);


  // Armazena as informações digitadas nos campos.
  const [tituloLivro, setTituloLivro] = useState("");
  const [autorLivro, setAutorLivro] = useState("");
  const [generoLivro, setGeneroLivro] = useState("");
  const [paginasLivro, setPaginasLivro] = useState("");
  const [adaptacao, setAdaptacao] = useState("");
  const [idEditando, setIdEditando] = useState(0);


  // Busca os livros cadastrados no MockAPI.
  // GET é utilizado para consultar os dados.
  async function buscarLivros() {
    const resposta = await fetch(API_URL);


    // Converte a resposta da API para JSON.
    const dados = await resposta.json();


    // Atualiza a lista de livros na tela.
    setLivros(dados);
  }


  // Salva um novo livro no MockAPI.
  // POST é utilizado para enviar os dados.
  async function salvarLivro() {
    const livroAtualizado = {
      titulo: tituloLivro,
      autor: autorLivro,
      genero: generoLivro,
      paginas: Number(paginasLivro),
      adaptacao: adaptacao.trim().toLowerCase() === "sim",
    };


    if (idEditando) {
      await fetch(`${API_URL}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livroAtualizado),
      });
      setIdEditando(0);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(livroAtualizado),
      });
    }


    // Limpa os campos após salvar o livro.
    setTituloLivro("");
    setAutorLivro("");
    setGeneroLivro("");
    setPaginasLivro("");
    setAdaptacao("");


    // Atualiza a lista com o livro cadastrado.
    buscarLivros();
  }


  // Pergunta antes de excluir um livro.
  function excluir(id) {
    Alert.alert(
      "Excluir livro",
      "Tem certeza que deseja excluir este livro?",
      [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            await fetch(`${API_URL}/${id}`, {
              method: "DELETE",
            });


            buscarLivros();
          },
        },
      ]
    );
  }


  async function editar(item) {
    setIdEditando(item.id);
    setTituloLivro(item.titulo);
    setAutorLivro(item.autor);
    setGeneroLivro(item.genero);
    setPaginasLivro(String(item.paginas));
    setAdaptacao(item.adaptacao ? "Sim" : "Não");
  }


  // Executa a busca quando o aplicativo é aberto.
  useEffect(() => {
    buscarLivros();
  }, []);


  // Início da interface do aplicativo.
  return (
    <SafeAreaView style={styles.tela} edges={["bottom"]}>


      {/* Título exibido na parte superior. */}
      <Stack.Screen options={{ title: "Minha Livraria" }} />


      {/* Campo para informar o título do livro. */}
      <TextInput
        style={styles.campo}
        value={tituloLivro}
        onChangeText={setTituloLivro}
        placeholder="Título do livro"
      />


      {/* Campo para informar o autor ou a autora. */}
      <TextInput
        style={styles.campo}
        value={autorLivro}
        onChangeText={setAutorLivro}
        placeholder="Autor ou autora"
      />


      {/* Campo para informar o gênero do livro. */}
      <TextInput
        style={styles.campo}
        value={generoLivro}
        onChangeText={setGeneroLivro}
        placeholder="Gênero do livro"
      />


      {/* Campo para informar o número de páginas. */}
      <TextInput
        style={styles.campo}
        value={paginasLivro}
        onChangeText={setPaginasLivro}
        keyboardType="numeric"
        placeholder="Número de páginas"
      />


      {/* Campo para informar se possui adaptação. */}
      <TextInput
        style={styles.campo}
        value={adaptacao}
        onChangeText={setAdaptacao}
        placeholder="Possui adaptação? Sim ou Não"
      />


      {/* Botão que executa a função salvarLivro. */}
      <Pressable style={styles.botaoSalvar} onPress={salvarLivro}>
        <Text style={styles.iconeBotao}>💾</Text>
      </Pressable>


      {/* Exibe os livros cadastrados na API. */}
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={{ fontWeight: "bold" }}>Meus Livros!!!</Text>
          </View>
        }


        style={styles.lista}
        data={livros}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.cardItem}>


            <Text style={styles.item}>
              {item.id} - {item.titulo} - {item.autor}
            </Text>


            {/* Abertura do container dos botões */}
            <View style={styles.botoesCaixa}>
              <Button
                title="🗑️"
                color="#bf4f51"
                onPress={() => excluir(item.id)}
              />


              <Button
                title="✏️"
                color="white"
                onPress={() => editar(item)}
              />
            </View>
            {/* Fechamento correto do container dos botões */}


          </View>
        )}
      />
    </SafeAreaView>
  );
}


// Define a aparência dos componentes.
const styles = StyleSheet.create({


  // Estilo geral da tela.
  tela: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },


  // Estilo dos campos de preenchimento.
  campo: {
    borderWidth: 1,
    borderColor: "rgb(255, 0, 98)",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "black",
    marginBottom: 12,
  },


  // Estilo da lista de livros.
  lista: {
    flex: 1,
    marginTop: 16,
  },


  // Estilo das informações de cada livro.
  item: {
    backgroundColor: "#fb607f",
    padding: 16,
    borderRadius: 10,
    fontSize: 15,
    color: "#ffff",
    flex: 1,
    marginRight: 8,
  },


  cardItem: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },


  botoesCaixa: {
    flexDirection: "row",
    gap: 8,
  },


  botaoSalvar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#dc143c",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 12,
  },


  iconeBotao: {
    fontSize: 24,
  },


});


