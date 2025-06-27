import NovoTecnico from './screens/NovoTecnico';
import ListaTecnicosScreen from './screens/ListaTecnicosScreen';
import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import NovoEquipamento from './screens/NovoEquipamento';
import ListaEquipamentosScreen from './screens/ListaEquipamentosScreen';
import NovoServico from './screens/NovoServico';
import ListaServicosScreen from './screens/ListaServicosScreen';
import NovaManutencao from './screens/NovaManutencao';
import ListaManutencoesScreen from './screens/ListaManutencoesScreen';

export default function App() {

  const Drawer = createDrawerNavigator();

  function DrawerNavigation(){
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Novo Tecnico" component={NovoTecnico}/>
        <Drawer.Screen name="Lista de Técnicos" component={ListaTecnicosScreen}/>
        <Drawer.Screen name="Novo Equipamento" component={NovoEquipamento}/>
        <Drawer.Screen name="Lista de Equipamentos" component={ListaEquipamentosScreen}/>
        <Drawer.Screen name="Novo Serviço" component={NovoServico}/>
        <Drawer.Screen name="Lista de Serviços" component={ListaServicosScreen}/>
        <Drawer.Screen name="Nova Manutenção" component={NovaManutencao}/>
        <Drawer.Screen name="Lista de Manutenções" component={ListaManutencoesScreen}/>
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <DrawerNavigation/>
    </NavigationContainer>
  );
}

