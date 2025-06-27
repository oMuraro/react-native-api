import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {Divider, MD3LightTheme as PaperTheme, Button, TextInput, Dialog, Portal, Provider} from 'react-native-paper';
import axios from 'axios';

const ListaServicosScreen = ({navigation}) => {
    const [servicos, setServicos] = useState([]);
    const [editando, setEditando] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [custo, setCusto] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);
    const [modalExcluir, setModalExcluir] = useState(false);

    const carregarServicos = async () => {
        try {
            const resposta = await axios.get('http://localhost:3001/api/servicos');
            setServicos(resposta.data);
        } catch(error){
            console.log(error);
        }
    };

    useEffect(() => {
        carregarServicos();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            carregarServicos();
        });
        return unsubscribe;
    }, [navigation]);

    const excluirServico = (id) => {
        setIdParaExcluir(id);
        setModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/servicos/${idParaExcluir}`);
            setModalExcluir(false);
            setIdParaExcluir(null);
            carregarServicos();
        } catch (error) {
            console.log(error);
        }
    };

    const abrirEdicao = (servico) => {
        setEditando(servico.id);
        setDescricao(servico.descricao);
        setCusto(servico.custo.toString());
        setDialogVisible(true);
    };

    const salvarEdicao = async () => {
        try {
            await axios.put(`http://localhost:3001/api/servicos/${editando}`, {
                description: descricao,
                cost: custo
            });
            setDialogVisible(false);
            setEditando(null);
            setDescricao('');
            setCusto('');
            carregarServicos();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Provider>
        <View style={styles.container}>
            <FlatList data={servicos}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View style={styles.itemRow}>
                        <View style={{flex:1}}>
                            <Text style={styles.text}>{item.descricao}</Text>
                            <Text style={styles.textCusto}>Custo: R$ {parseFloat(item.custo).toFixed(2)}</Text>
                        </View>
                        <Button mode="outlined" onPress={() => abrirEdicao(item)} style={styles.btn}>Editar</Button>
                        <Button mode="contained" onPress={() => excluirServico(item.id)} style={styles.btn} buttonColor="#d32f2f">Excluir</Button>
                    </View>
                )}
            />
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={()=>setDialogVisible(false)}>
                    <Dialog.Title>Editar Serviço</Dialog.Title>
                    <Dialog.Content>
                        <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} style={styles.margem}/>
                        <TextInput label="Custo" value={custo} onChangeText={setCusto} style={styles.margem} keyboardType="numeric"/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>setDialogVisible(false)}>Cancelar</Button>
                        <Button onPress={salvarEdicao}>Salvar</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={modalExcluir} onDismiss={()=>setModalExcluir(false)}>
                    <Dialog.Title>Excluir Serviço</Dialog.Title>
                    <Dialog.Content>
                        <Text>Tem certeza que deseja excluir este serviço?</Text>
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
    textCusto: {marginLeft: 20, marginBottom: 10, color: '#555'},
    container: {flex: 1, backgroundColor: PaperTheme.colors.elevation.level1},
    itemRow: {flexDirection: 'row', alignItems: 'center', marginHorizontal: 10},
    btn: {marginHorizontal: 2},
    margem: {marginTop: 5}
});

export default ListaServicosScreen;
