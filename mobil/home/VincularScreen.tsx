import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import { useAppTheme } from '../config/ThemeContext';
import {Button, Menu, Portal, Text, TextInput, useTheme as usePaperTheme} from 'react-native-paper';
import {Dropdown} from 'react-native-paper-dropdown';
import moment from 'moment';
export default function VincularScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
    const [amount, setAmount] = useState('');

    const [duration, setDuration] = useState<any>();
  
    const items = [
      { label: "3 meses", value: "3 meses" },
      { label: "6 meses", value: "6 meses" },
      { label: "9 meses", value: "9 meses" },
    ];
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const generateCode = () => {    
    // const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // setGeneratedCode(newCode);

    const [monthsStr] = duration!!.split(' ');
const months = parseInt(monthsStr, 10);


const today = moment();
const futureDate = moment().add(months, 'months');

const todayDateObject = today.toDate();
const futureDateObject = futureDate.toDate();

   let body = {
     initialDate : todayDateObject,
     finalDate :  futureDateObject,
     amount:amount
   }
  };

  const handleLinkCode = (code:any) => {
    if (!code.trim()) {
      alert('Por favor, ingresa un código válido');
      return;
    }
    console.log(`Código vinculado: ${code}`);
    alert(`Código vinculado con éxito: ${code}`);
  };
  const copyToClipboard = () => {
    Clipboard.setString(generatedCode);
    alert('Código copiado al portapapeles!');
  };

 

  return (
    <View style={styles.container}>
<View style={{width:"100%"}}>
  
<Text style={{fontSize:22,fontWeight:700,marginBottom:10}}>Crea tu Meta de Ahorro</Text>
<Text style={{fontSize:15,fontWeight:400, color:"#7A7A7A",marginBottom:40}}>Ingresa los datos solicitados</Text>
</View>
<TextInput
                        style={styles.input}
                        label="Monto (Bs)"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                        autoCapitalize="none"
                        mode="outlined"
                        returnKeyType='done'
                        textColor={theme.colors.text}
                        underlineColor={theme.colors.text}
                        outlineColor="#FBFBFB"
                        activeOutlineColor={theme.colors.placeholder}
                        theme={{roundness: 10}}
                        placeholderTextColor={theme.colors.text}
                    />
   <View style={{marginTop:20}}></View>
      <Dropdown
       CustomDropdownInput={(elem)=>{
        return <View style={{height:60, width:390,display:"flex",flexDirection:"row", alignItems:"center",gap:20, backgroundColor:"#F6F6F6",borderRadius:10}}>
         
      
          <Text style={{fontSize:18,marginLeft:20,flex:0.85}}>{duration ? duration :"Duración (meses)"}</Text>
          <View style={{height:30,width:30,flex:0.15}}>
          {elem.rightIcon}
          </View>
    
        </View>
       }}

        mode={"outlined"}
        placeholder='Duración (meses)'
        options={items}
        value={duration}
        onSelect={(val)=>{setDuration(val)}}
       
      />
   

     <View style={{marginTop:40}}></View>

      <Button mode="contained" onPress={generateCode} style={styles.button} >

        <Text style={{color:"white",fontSize:17,fontWeight:600}}> Generar Código</Text>
      </Button>

      {/* {generatedCode ? (
        <TouchableOpacity onPress={copyToClipboard} style={styles.codeContainer}>
          <Text style={styles.codeText}>{generatedCode}</Text>
        </TouchableOpacity>
      ) : null} */}


      {/* Botón para vincular el código ingresado */}
      {/* <Button
        mode="contained"
        onPress={() => handleLinkCode(code)}
        style={styles.button}
      >
        Vincular
      </Button> */}
    </View>

  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  button: {
    marginVertical: 20,
    backgroundColor:"#EB3C85",
    fontSize:20,
    width:"70%",
    height:60,
    borderRadius:1000,
    justifyContent:"center"
  },
  codeContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  codeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    height: 60,
    fontSize:18,
    color: theme.colors.placeholder,
    backgroundColor: "#F6F6F6"
},
});
