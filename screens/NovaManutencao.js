import React, { useEffect, useState } from 'react';
import { Button, TextInput, Card, MD3LightTheme as PaperTheme, Menu } from 'react-native-paper';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Provider as PaperProvider } from 'react-native-paper';

// Componente auxiliar para input de data no web
function DateInputWeb({ label, value, onChange }) {
    // Cores do tema react-native-paper
    const borderColor = PaperTheme.colors.outline || '#BDBDBD';
    const backgroundColor = PaperTheme.colors.surfaceVariant || '#F5F5F5';
    const textColor = PaperTheme.colors.onSurface || '#222';
    // Cor clara para a label
    const labelColor = '#bbb';
    const focusColor = PaperTheme.colors.primary || '#1976D2';
    // Estado de foco
    const [focused, setFocused] = React.useState(false);
    return (
        <View style={{ marginTop: 5 }}>
            <label style={{
                fontSize: 14,
                color: focused ? focusColor : labelColor,
                marginBottom: 2,
                marginLeft: 2,
                fontWeight: 500
            }}>{label}</label>
            <input
                type="date"
                value={value}
                style={{
                    height: 48,
                    fontSize: 16,
                    width: '100%',
                    border: `1.5px solid ${focused ? focusColor : borderColor}`,
                    borderRadius: 4,
                    padding: '0 12px',
                    background: backgroundColor,
                    color: textColor,
                    outline: 'none',
                    transition: 'border 0.2s',
                    boxSizing: 'border-box',
                    marginTop: 0
                }}
                onChange={e => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </View>
    );
}

const NovaManutencao = ({ navigation }) => {
    const [equipamentos, setEquipamentos] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [equipamentoId, setEquipamentoId] = useState('');
    const [tecnicoId, setTecnicoId] = useState('');
    const [servicoId, setServicoId] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [menuEquip, setMenuEquip] = useState(false);
    const [menuTec, setMenuTec] = useState(false);
    const [menuServ, setMenuServ] = useState(false);
    const [showInicio, setShowInicio] = useState(false);
    const [showFim, setShowFim] = useState(false);

    useEffect(() => {
        async function fetchAll() {
            try {
                const eq = await axios.get('http://localhost:3001/api/equipamentos');
                setEquipamentos(eq.data);
                const tec = await axios.get('http://localhost:3001/api/tecnicos');
                setTecnicos(tec.data);
                const serv = await axios.get('http://localhost:3001/api/servicos');
                setServicos(serv.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAll();
    }, []);

    const salvarManutencao = async () => {
        try {
            await axios.post('http://localhost:3001/api/manutencoes', {
                equipment_id: equipamentoId,
                technician_id: tecnicoId,
                service_id: servicoId,
                start_date: dataInicio,
                end_date: dataFim
            });
            alert('Manutenção cadastrada!');
            setEquipamentoId('');
            setTecnicoId('');
            setServicoId('');
            setDataInicio('');
            setDataFim('');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Nova Manutenção" subtitle="Informe os dados da manutenção"
                    titleStyle={styles.cardTitle} subtitleStyle={styles.cardSubtitle} />
                <Card.Content>
                    <View style={{marginBottom: 10}}>
                        <span style={{color: '#222', fontWeight: 500}}></span>
                    </View>
                    {/* Equipamento */}
                    <Menu
                        visible={menuEquip}
                        onDismiss={() => setMenuEquip(false)}
                        anchor={
                            <TouchableOpacity activeOpacity={1} onPress={() => setMenuEquip(true)}>
                                <TextInput label="Equipamento" value={equipamentoId ? (equipamentos.find(e => e.id == equipamentoId)?.nome || '') : ''} style={[styles.margem, styles.input]} editable={false} pointerEvents="none" />
                            </TouchableOpacity>
                        }
                    >
                        {equipamentos.map(e => (
                            <Menu.Item key={e.id} onPress={() => { setEquipamentoId(e.id.toString()); setMenuEquip(false); }} title={e.nome} />
                        ))}
                    </Menu>
                    {/* Técnico */}
                    <Menu
                        visible={menuTec}
                        onDismiss={() => setMenuTec(false)}
                        anchor={
                            <TouchableOpacity activeOpacity={1} onPress={() => setMenuTec(true)}>
                                <TextInput label="Técnico" value={tecnicoId ? (tecnicos.find(t => t.id == tecnicoId)?.nome || '') : ''} style={[styles.margem, styles.input]} editable={false} pointerEvents="none" />
                            </TouchableOpacity>
                        }
                    >
                        {tecnicos.map(t => (
                            <Menu.Item key={t.id} onPress={() => { setTecnicoId(t.id.toString()); setMenuTec(false); }} title={t.nome} />
                        ))}
                    </Menu>
                    {/* Serviço */}
                    <Menu
                        visible={menuServ}
                        onDismiss={() => setMenuServ(false)}
                        anchor={
                            <TouchableOpacity activeOpacity={1} onPress={() => setMenuServ(true)}>
                                <TextInput label="Serviço" value={servicoId ? (servicos.find(s => s.id == servicoId)?.descricao || '') : ''} style={[styles.margem, styles.input]} editable={false} pointerEvents="none" />
                            </TouchableOpacity>
                        }
                    >
                        {servicos.map(s => (
                            <Menu.Item key={s.id} onPress={() => { setServicoId(s.id.toString()); setMenuServ(false); }} title={s.descricao} />
                        ))}
                    </Menu>
                    {/* Data de Início */}
                    {Platform.OS === 'web' ? (
                        <DateInputWeb
                            label="Data de Início"
                            value={dataInicio}
                            onChange={val => setDataInicio(val)}
                        />
                    ) : (
                        <TouchableOpacity activeOpacity={1} onPress={() => setShowInicio(true)}>
                            <TextInput label="Data de Início" value={dataInicio} style={styles.margem} editable={false} pointerEvents="none" />
                        </TouchableOpacity>
                    )}
                    {showInicio && Platform.OS !== 'web' && (
                        <DateTimePicker
                            value={dataInicio ? new Date(dataInicio) : new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowInicio(false);
                                if (selectedDate) {
                                    const d = selectedDate;
                                    setDataInicio(d.toISOString().slice(0,10));
                                }
                            }}
                        />
                    )}
                    {/* Data Prevista de Término */}
                    {Platform.OS === 'web' ? (
                        <DateInputWeb
                            label="Data Prevista de Término"
                            value={dataFim}
                            onChange={val => setDataFim(val)}
                        />
                    ) : (
                        <TouchableOpacity activeOpacity={1} onPress={() => setShowFim(true)}>
                            <TextInput label="Data Prevista de Término" value={dataFim} style={styles.margem} editable={false} pointerEvents="none" />
                        </TouchableOpacity>
                    )}
                    {showFim && Platform.OS !== 'web' && (
                        <DateTimePicker
                            value={dataFim ? new Date(dataFim) : new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowFim(false);
                                if (selectedDate) {
                                    const d = selectedDate;
                                    setDataFim(d.toISOString().slice(0,10));
                                }
                            }}
                        />
                    )}
                    <Button mode="contained" onPress={salvarManutencao} style={styles.margem}>
                        Salvar
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { margin: 10, padding: 10 },
    margem: { marginTop: 5 },
    container: { flex: 1, backgroundColor: PaperTheme.colors.elevation.level1 }
});

export default function NovaManutencaoWrapper(props) {
    return (
        <PaperProvider>
            <NovaManutencao {...props} />
        </PaperProvider>
    );
}
