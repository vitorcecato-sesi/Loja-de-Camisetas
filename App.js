import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
// ...existing code...