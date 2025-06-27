import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MD3LightTheme as PaperTheme, Button, TextInput, Dialog, Portal, Provider, Menu } from 'react-native-paper';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const ListaManutencoesScreen = ({ navigation }) => {
    const [manutencoes, setManutencoes] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [editando, setEditando] = useState(null);
    const [equipamentoId, setEquipamentoId] = useState('');
    const [tecnicoId, setTecnicoId] = useState('');
    const [servicoId, setServicoId] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);
    const [modalExcluir, setModalExcluir] = useState(false);
    const [menuEquip, setMenuEquip] = useState(false);
    const [menuTec, setMenuTec] = useState(false);
    const [menuServ, setMenuServ] = useState(false);

    const carregarTudo = async () => {
        try {
            const [man, eq, tec, serv] = await Promise.all([
                axios.get('http://localhost:3001/api/manutencoes'),
                axios.get('http://localhost:3001/api/equipamentos'),
                axios.get('http://localhost:3001/api/tecnicos'),
                axios.get('http://localhost:3001/api/servicos')
            ]);
            setManutencoes(man.data);
            setEquipamentos(eq.data);
            setTecnicos(tec.data);
            setServicos(serv.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { carregarTudo(); }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => { carregarTudo(); });
        return unsubscribe;
    }, [navigation]);

    const excluirManutencao = (id) => {
        setIdParaExcluir(id);
        setModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/manutencoes/${idParaExcluir}`);
            setModalExcluir(false);
            setIdParaExcluir(null);
            carregarTudo();
        } catch (error) {
            console.log(error);
        }
    };

    const abrirEdicao = (manutencao) => {
        setEditando(manutencao.id);
        setEquipamentoId(manutencao.equipamento_id.toString());
        setTecnicoId(manutencao.tecnico_id.toString());
        setServicoId(manutencao.servico_id.toString());
        setDataInicio(manutencao.data_inicio);
        setDataFim(manutencao.data_prevista_termino);
        setDialogVisible(true);
    };

    const salvarEdicao = async () => {
        try {
            await axios.put(`http://localhost:3001/api/manutencoes/${editando}`, {
                equipment_id: equipamentoId,
                technician_id: tecnicoId,
                service_id: servicoId,
                start_date: dataInicio,
                end_date: dataFim
            });
            setDialogVisible(false);
            setEditando(null);
            setEquipamentoId('');
            setTecnicoId('');
            setServicoId('');
            setDataInicio('');
            setDataFim('');
            carregarTudo();
        } catch (error) {
            console.log(error);
        }
    };

    const getNomeEquipamento = (id) => equipamentos.find(e => e.id == id)?.nome || '';
    const getNomeTecnico = (id) => tecnicos.find(t => t.id == id)?.nome || '';
    const getNomeServico = (id) => servicos.find(s => s.id == id)?.descricao || '';

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toISOString().slice(0, 10);
    };

    function DateInputDialog({ label, value, onChange }) {
        if (Platform.OS === 'web') {
            return (
                <View style={{ marginTop: 5 }}>
                    <label style={{ fontSize: 14, color: '#888', marginBottom: 2, marginLeft: 2, fontWeight: 500 }}>{label}</label>
                    <input
                        type="date"
                        value={value}
                        style={{
                            height: 40,
                            fontSize: 16,
                            width: '100%',
                            border: '1.5px solid #BDBDBD',
                            borderRadius: 4,
                            padding: '0 12px',
                            background: '#fff',
                            color: '#222',
                            outline: 'none',
                            boxSizing: 'border-box',
                            marginTop: 0
                        }}
                        onChange={e => onChange(e.target.value)}
                    />
                </View>
            );
        } else {
            const [show, setShow] = React.useState(false);
            return (
                <>
                    <TouchableOpacity activeOpacity={1} onPress={() => setShow(true)}>
                        <TextInput label={label} value={value} style={styles.margem} editable={false} pointerEvents="none" />
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            value={value ? new Date(value) : new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShow(false);
                                if (selectedDate) {
                                    const d = selectedDate;
                                    onChange(d.toISOString().slice(0,10));
                                }
                            }}
                        />
                    )}
                </>
            );
        }
    }

    return (
        <Provider>
        <View style={styles.container}>
            <FlatList data={manutencoes}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View style={styles.itemRow}>
                        <View style={{flex:1}}>
                            <Text style={styles.text}>Equipamento: {getNomeEquipamento(item.equipamento_id)}</Text>
                            <Text style={styles.text}>Técnico: {getNomeTecnico(item.tecnico_id)}</Text>
                            <Text style={styles.text}>Serviço: {getNomeServico(item.servico_id)}</Text>
                            <Text style={styles.textDesc}>Início: {formatDate(item.data_inicio)} | Prev. Término: {formatDate(item.data_prevista_termino)}</Text>
                        </View>
                        <Button mode="outlined" onPress={() => abrirEdicao(item)} style={styles.btn}>Editar</Button>
                        <Button mode="contained" onPress={() => excluirManutencao(item.id)} style={styles.btn} buttonColor="#d32f2f">Excluir</Button>
                    </View>
                )}
            />
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={()=>setDialogVisible(false)}>
                    <Dialog.Title>Editar Manutenção</Dialog.Title>
                    <Dialog.Content>
                        <DateInputDialog label="Data de Início" value={formatDate(dataInicio)} onChange={setDataInicio} />
                        <DateInputDialog label="Data Prevista de Término" value={formatDate(dataFim)} onChange={setDataFim} />
                        <Menu
                            visible={menuEquip}
                            onDismiss={() => setMenuEquip(false)}
                            anchor={
                                <TouchableOpacity activeOpacity={1} onPress={() => setMenuEquip(true)}>
                                    <TextInput label="Equipamento" value={getNomeEquipamento(equipamentoId)} style={styles.margem} editable={false} pointerEvents="none" />
                                </TouchableOpacity>
                            }
                        >
                            {equipamentos.map(e => (
                                <Menu.Item key={e.id} onPress={() => { setEquipamentoId(e.id.toString()); setMenuEquip(false); }} title={e.nome} />
                            ))}
                        </Menu>
                        <Menu
                            visible={menuTec}
                            onDismiss={() => setMenuTec(false)}
                            anchor={
                                <TouchableOpacity activeOpacity={1} onPress={() => setMenuTec(true)}>
                                    <TextInput label="Técnico" value={getNomeTecnico(tecnicoId)} style={styles.margem} editable={false} pointerEvents="none" />
                                </TouchableOpacity>
                            }
                        >
                            {tecnicos.map(t => (
                                <Menu.Item key={t.id} onPress={() => { setTecnicoId(t.id.toString()); setMenuTec(false); }} title={t.nome} />
                            ))}
                        </Menu>
                        <Menu
                            visible={menuServ}
                            onDismiss={() => setMenuServ(false)}
                            anchor={
                                <TouchableOpacity activeOpacity={1} onPress={() => setMenuServ(true)}>
                                    <TextInput label="Serviço" value={getNomeServico(servicoId)} style={styles.margem} editable={false} pointerEvents="none" />
                                </TouchableOpacity>
                            }
                        >
                            {servicos.map(s => (
                                <Menu.Item key={s.id} onPress={() => { setServicoId(s.id.toString()); setMenuServ(false); }} title={s.descricao} />
                            ))}
                        </Menu>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=>setDialogVisible(false)}>Cancelar</Button>
                        <Button onPress={salvarEdicao}>Salvar</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={modalExcluir} onDismiss={()=>setModalExcluir(false)}>
                    <Dialog.Title>Excluir Manutenção</Dialog.Title>
                    <Dialog.Content>
                        <Text>Tem certeza que deseja excluir esta manutenção?</Text>
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
};

const styles = StyleSheet.create({
    text: {marginTop: 10, marginLeft: 20, marginBottom: 0, fontWeight: 'bold'},
    textDesc: {marginLeft: 20, marginBottom: 10, color: '#555'},
    container: {flex: 1, backgroundColor: PaperTheme.colors.elevation.level1},
    itemRow: {flexDirection: 'row', alignItems: 'center', marginHorizontal: 10},
    btn: {marginHorizontal: 2},
    margem: {marginTop: 5}
});

export default ListaManutencoesScreen;
