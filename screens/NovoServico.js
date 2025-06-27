import React, { useState } from 'react';
import {Button, TextInput, Card, MD3LightTheme as PaperTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import axios from 'axios';

const NovoServico = () => {
    const [descricao, setDescricao] = useState('');
    const [custo, setCusto] = useState('');

    const salvarServico = async () => {
        try{
            await axios.post('http://localhost:3001/api/servicos', {
                description: descricao,
                cost: custo
            });
            alert('Serviço cadastrado!');
        } catch(error){
            console.log(error);
        }
        setDescricao('');
        setCusto('');
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Novo Serviço" 
                    subtitle="Informe os dados do novo serviço"/>
                <Card.Content>
                    <TextInput label="Descrição" value={descricao}
                        onChangeText={text => setDescricao(text)} style={styles.margem}/>
                    <TextInput label="Custo" value={custo}
                        onChangeText={text => setCusto(text)} style={styles.margem} keyboardType="numeric"/>
                    <Button mode="contained" onPress={salvarServico} style={styles.margem}>
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

export default NovoServico;
