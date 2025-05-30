import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';

const UserListScreen = () => {
    const [usuarios, setUsuarios] = ([]);

    useEffect(() => {
        const dados = async () => {
            try {
                const resposta = await axios.get('http://localhost:3000/api/usuarios');
                setUsuarios(resposta.data);
            } catch (err) {
                console.log(err);
            }
        }
        dados();
    }, []);

    return (
        <View>
            <FlatList data={usuarios}
                renderItem={({item}) => (
                    <View>
                        <Text>{usuarios}</Text>
                    </View>
                )} />
        </View>
    );
}

export default UserListScreen;