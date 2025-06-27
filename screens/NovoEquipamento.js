import React, { useState } from 'react';
import {Button, TextInput, Card, MD3LightTheme as PaperTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import axios from 'axios';

const NovoEquipamento = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [numeroSerie, setNumeroSerie] = useState('');

    const salvarEquipamento = async () => {
        try{
            await axios.post('http://localhost:3001/api/equipamentos', {
                name: nome,
                description: descricao,
                serial_number: numeroSerie
            });
            alert('Equipamento cadastrado!');
        } catch(error){
            console.log(error);
        }
        setNome('');
        setDescricao('');
        setNumeroSerie('');
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Novo Equipamento" 
                    subtitle="Informe os dados do novo equipamento"/>
                <Card.Content>
                    <TextInput label="Nome" value={nome}
                        onChangeText={text => setNome(text)} style={styles.margem}/>
                    <TextInput label="Descrição" value={descricao}
                        onChangeText={text => setDescricao(text)} style={styles.margem}/>
                    <TextInput label="Número de Série" value={numeroSerie}
                        onChangeText={text => setNumeroSerie(text)} style={styles.margem}/>
                    <Button mode="contained" onPress={salvarEquipamento} style={styles.margem}>
                        Salvar
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { margin: 10, padding: 10},
    margem: {marginTop: 5},
    container: {flex: 1, backgroundColor: PaperTheme.colors.elevation.level1}
});

export default NovoEquipamento;
