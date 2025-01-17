import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { StyleSheet, View, ImageBackground, Image, Text, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface IBGEUfResponse{
  sigla: string;
}

interface IBGECityResponse{
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');

  const navigation = useNavigation()

  useEffect(() => {
    axios
      .get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then( response => {
        const ufInitials = response.data.map(uf => uf.sigla);

        setUfs(ufInitials);
      })
  }, [])

  useEffect(() => {
    if(selectedUf === '0'){
      return;
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);

        setCities(cityNames);
      })
  }, [selectedUf])

  function handleNavigateToPoints(){
    const uf = selectedUf;
    const city = selectedCity;
    navigation.navigate('Points', { uf, city });
  }

  function handleSelectUF(ufSelected: string){
    setSelectedUf(ufSelected);
  }

  function handleSelectCity(citySelectd : string){
    setSelectedCity(citySelectd);
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pesoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>
        <Picker
          selectedValue={selectedUf}
          onValueChange={handleSelectUF}
          style={styles.select}
        >
          <Picker.Item label="Selecione uma UF" value='0' />
          {ufs.map(uf => (
            <Picker.Item label={uf} value={uf} key={String(uf)} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedCity}
          onValueChange={handleSelectCity}
          style={styles.select}
        >
          <Picker.Item label="Selecione uma cidade" value='0' />
          {cities.map(city => (
            <Picker.Item label={city} value={city} key={String(city)} />
          ))}
        </Picker>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height:60,
    backgroundColor: '#FFF',
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;