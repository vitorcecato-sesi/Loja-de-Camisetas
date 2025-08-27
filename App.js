/* Imports para a Navegação */
import { NavigationContainer } from '@react-navigation/native'; /* é um "container" que envolve toda a navegação do app */
import { createNativeStackNavigator } from '@react-navigation/native-stack'; /* ele cria uma "pilha" de telas (Stack) para navegar entre elas. */

/* Imports das telas do App */
import TelaListaDeCamisas from './screens/Catalogo';
import ListaDetalhesProdutos from './screens/DetalhesProdutos';
import TelaLogin from './screens/TelaLogin';

const Stack = createNativeStackNavigator(); /* Criamos o Stack, que ao navegar, uma nova tela é "empilhada" à outra */

export default function App() {
    return (
        <NavigationContainer>  {/* Envolve toda a Navegação do App */}

            {/* Stack.Navigator agrupa as telas que pertencem a esta pilha.
                initialRouteName define qual tela aparece primeiro quando o app abre. */}
            <Stack.Navigator initialRouteName="Login">

                {/* Cada Stack.Screen registra uma rota:
                    - name: o nome lógico da rota (usado em navigation.navigate('Nome')).
                    - component: o componente que será renderizado para essa rota.
                    - options: configurações visuais da barra de topo (título, etc.). */}
                <Stack.Screen
                    name="Login"                 // nome da rota de login
                    component={TelaLogin}        // componente que será mostrado
                    options={{ title: 'Login' }} // título exibido na barra superior
                />

                <Stack.Screen
                    name="Catalogo"                   
                    component={TelaListaDeCamisas}    
                    options={{ title: 'Catálogo' }}
                />

                <Stack.Screen
                    name="DetalhesCamisas"                
                    component={ListaDetalhesProdutos}     
                    options={{ title: 'Detalhes do Produto' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
