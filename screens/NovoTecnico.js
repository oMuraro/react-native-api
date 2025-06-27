import React, { useState } from 'react';
import {Button, TextInput, Card, MD3LightTheme as PaperTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import axios from 'axios';

const NovoTecnico = () => {

    const [nome, setNome] = useState('');
    const [contato, setContato] = useState('');

    const salvarTecnico = async () => {
        try{
            await axios.post('http://localhost:3001/api/tecnicos', {name: nome, contact: contato});
            alert('Técnico cadastrado!');
        } catch(error){
            console.log(error);
        }
        setNome('');
        setContato('');
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Novo Técnico" 
                    subtitle="Informe os dados do novo técnico"/>
                <Card.Content>
                    <TextInput label="Nome" value={nome}
                        onChangeText={text => setNome(text)} style={styles.margem}/>
                    <TextInput label="Contato" value={contato}
                        onChangeText={text => setContato(text)} style={styles.margem}/>
                    <Button mode="contained" onPress={salvarTecnico} style={styles.margem}>
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

export default NovoTecnico;