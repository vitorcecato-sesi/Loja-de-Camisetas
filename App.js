/* Imports para a Navegação */
import { NavigationContainer } from '@react-navigation/native'; /* é um "container" que envolve toda a navegação do app */
import { createNativeStackNavigator } from '@react-navigation/native-stack'; /* ele cria uma "pilha" de telas (Stack) para navegar entre elas. */

/* Imports das telas do App */
import TelaListaDeCamisas from './screens/Catalogo';
import ListaDetalhesProdutos from './screens/DetalhesProdutos';
import TelaLogin from './screens/TelaLogin';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>

            <Stack.Navigator initialRouteName="Login">

                <Stack.Screen
                    name="Login"                 
                    component={TelaLogin}        
                    options={{ title: 'Login' }} 
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
