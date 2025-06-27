import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {Divider, MD3LightTheme as PaperTheme, Button, TextInput, Dialog, Portal, Provider} from 'react-native-paper';
import axios from 'axios';

const ListaEquipamentosScreen = ({navigation}) => {
    const [equipamentos, setEquipamentos] = useState([]);
    const [editando, setEditando] = useState(null);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [numeroSerie, setNumeroSerie] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);
    const [modalExcluir, setModalExcluir] = useState(false);

    const carregarEquipamentos = async () => {
        try {
            const resposta = await axios.get('http://localhost:3001/api/equipamentos');
            setEquipamentos(resposta.data);
        } catch(error){
            console.log(error);
        }
    };

    useEffect(() => {
        carregarEquipamentos();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            carregarEquipamentos();
        });
        return unsubscribe;
    }, [navigation]);

    const excluirEquipamento = (id) => {
        setIdParaExcluir(id);
        setModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/equipamentos/${idParaExcluir}`);
            setModalExcluir(false);
            setIdParaExcluir(null);
            carregarEquipamentos();
        } catch (error) {
            console.log(error);
        }
    };

    const abrirEdicao = (equipamento) => {
        setEditando(equipamento.id);
        setNome(equipamento.nome);
        setDescricao(equipamento.descricao);
        setNumeroSerie(equipamento.numero_serie);
        setDialogVisible(true);
    };

    const salvarEdicao = async () => {
        try {
            await axios.put(`http://localhost:3001/api/equipamentos/${editando}`, {
                name: nome,
                description: descricao,
                serial_number: numeroSerie
            });
            setDialogVisible(false);
            setEditando(null);
            setNome('');
            setDescricao('');
            setNumeroSerie('');
            carregarEquipamentos();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Provider>
        <View style={styles.container}>
            <FlatList data={equipamentos}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View style={styles.itemRow}>
                        <View style={{flex:1}}>
                            <Text style={styles.text}>{item.nome} - {item.numero_serie}</Text>
                            <Text style={styles.textDesc}>{item.descricao}</Text>
                        </View>
                        <Button mode="outlined" onPress={() => abrirEdicao(item)} style={styles.btn}>Editar</Button>
                        <Button mode="contained" onPress={() => excluirEquipamento(item.id)} style={styles.btn} buttonColor="#d32f2f">Excluir</Button>
                    </View>
                )}
            />
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={()=>setDialogVisible(false)}>
                    <Dialog.Title>Editar Equipamento</Dialog.Title>
                    <Dialog.Content>
                        <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.margem}/>
                        <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} style={styles.margem}/>
                        <TextInput label="Número de Série" value={numeroSerie} onChangeText={setNumeroSerie} style={styles.margem}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>setDialogVisible(false)}>Cancelar</Button>
                        <Button onPress={salvarEdicao}>Salvar</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={modalExcluir} onDismiss={()=>setModalExcluir(false)}>
                    <Dialog.Title>Excluir Equipamento</Dialog.Title>
                    <Dialog.Content>
                        <Text>Tem certeza que deseja excluir este equipamento?</Text>
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
    text: {marginTop: 10, marginLeft: 20, marginBottom: 0, fontWeight: 'bold'},
    textDesc: {marginLeft: 20, marginBottom: 10, color: '#555'},
    container: {flex: 1, backgroundColor: PaperTheme.colors.elevation.level1},
    itemRow: {flexDirection: 'row', alignItems: 'center', marginHorizontal: 10},
    btn: {marginHorizontal: 2},
    margem: {marginTop: 5}
});

export default ListaEquipamentosScreen;
