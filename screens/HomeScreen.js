import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, Text } from 'react-native';
import axios from 'axios';

const HomeScreen = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const salvarUsuario = async () => {
        try {
            await axios.post('htt´://localhost:3000/api/usuarios', { nome, email, senha });
            alert('Usuário inserido');
            setNome('');
            setEmail('');
            setSenha('');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <Text>Registrar Novo Usuário</Text>
            <TextInput label="Nome"
                value={nome}
                onChangeText={text => setNome(text)} />

            <TextInput label="Email"
                value={email}
                onChangeText={text => setEmail(text)} />

            <TextInput label="Senha"
                value={senha}
                onChangeText={text => setSenha(text)}
                secureTextEntry={true} />

            <Button mode="contained" onPress={salvarUsuario}>Salvar</Button>
        </View>
    )
}

export default HomeScreen;