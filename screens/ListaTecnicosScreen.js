import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {Divider, MD3LightTheme as PaperTheme, Button, TextInput, Dialog, Portal, Provider} from 'react-native-paper';
import axios from 'axios';

const ListaTecnicosScreen = ({navigation}) => {
    const [tecnicos, setTecnicos] = useState([]);
    const [editando, setEditando] = useState(null); // técnico em edição
    const [nome, setNome] = useState('');
    const [contato, setContato] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);
    const [modalExcluir, setModalExcluir] = useState(false);

    const carregarTecnicos = async () => {
        try {
            const resposta = await axios.get('http://localhost:3001/api/tecnicos');
            setTecnicos(resposta.data);
        } catch(error){
            console.log(error);
        }
    };

    useEffect(() => {
        carregarTecnicos();
    }, []);

    // Adiciona um callback para atualizar a lista após cadastro
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            carregarTecnicos();
        });
        return unsubscribe;
    }, [navigation]);

    const excluirTecnico = (id) => {
        setIdParaExcluir(id);
        setModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/tecnicos/${idParaExcluir}`);
            setModalExcluir(false);
            setIdParaExcluir(null);
            carregarTecnicos();
        } catch (error) {
            console.log(error);
        }
    };

    const abrirEdicao = (tecnico) => {
        setEditando(tecnico.id);
        setNome(tecnico.nome);
        setContato(tecnico.contato);
        setDialogVisible(true);
    };

    const salvarEdicao = async () => {
        try {
            await axios.put(`http://localhost:3001/api/tecnicos/${editando}`, {name: nome, contact: contato});
            setDialogVisible(false);
            setEditando(null);
            setNome('');
            setContato('');
            carregarTecnicos();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Provider>
        <View style={styles.container}>
            <FlatList data={tecnicos}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View style={styles.itemRow}>
                        <View style={{flex:1}}>
                            <Text style={styles.text}>{item.nome} - {item.contato}</Text>
                        </View>
                        <Button mode="outlined" onPress={() => abrirEdicao(item)} style={styles.btn}>Editar</Button>
                        <Button mode="contained" onPress={() => excluirTecnico(item.id)} style={styles.btn} buttonColor="#d32f2f">Excluir</Button>
                    </View>
                )}
            />
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={()=>setDialogVisible(false)}>
                    <Dialog.Title>Editar Técnico</Dialog.Title>
                    <Dialog.Content>
                        <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.margem}/>
                        <TextInput label="Contato" value={contato} onChangeText={setContato} style={styles.margem}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>setDialogVisible(false)}>Cancelar</Button>
                        <Button onPress={salvarEdicao}>Salvar</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={modalExcluir} onDismiss={()=>setModalExcluir(false)}>
                    <Dialog.Title>Excluir Técnico</Dialog.Title>
                    <Dialog.Content>
                        <Text>Tem certeza que deseja excluir este técnico?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>setModalExcluir(false)}>Cancelar</Button>
                        <Button onPress={confirmarExclusao} buttonColor="#d32f2f">Excluir</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    text: {marginTop: 10, marginLeft: 20, marginBottom: 10},
    container: {flex: 1, backgroundColor: PaperTheme.colors.elevation.level1},
    itemRow: {flexDirection: 'row', alignItems: 'center', marginHorizontal: 10},
    btn: {marginHorizontal: 2},
    margem: {marginTop: 5}
});

export default ListaTecnicosScreen;