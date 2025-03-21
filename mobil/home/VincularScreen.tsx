import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Clipboard } from "react-native";
import { useAppTheme } from "../config/ThemeContext";
import {
  Button,
  Menu,
  Portal,
  Text,
  TextInput,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import moment from "moment";
export default function VincularScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [amount, setAmount] = useState("");

  const [duration, setDuration] = useState<any>();

  const items = [
    { label: "3 meses", value: "3 meses" },
    { label: "6 meses", value: "6 meses" },
    { label: "9 meses", value: "9 meses" },
  ];
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState<any>("Crear Ahorro"); // Estado para manejar la pestaña activaß
  const generateCode = () => {
    // const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // setGeneratedCode(newCode);

    const [monthsStr] = duration!!.split(" ");
    const months = parseInt(monthsStr, 10);

    const today = moment();
    const futureDate = moment().add(months, "months");

    const todayDateObject = today.toDate();
    const futureDateObject = futureDate.toDate();

    let body = {
      initialDate: todayDateObject,
      finalDate: futureDateObject,
      amount: amount,
    };
  };



  const joinCode = () => {

    let body = {
       code:code
    };
  };


  const handleLinkCode = (code: any) => {
    if (!code.trim()) {
      alert("Por favor, ingresa un código válido");
      return;
    }
    console.log(`Código vinculado: ${code}`);
    alert(`Código vinculado con éxito: ${code}`);
  };
  const copyToClipboard = () => {
    Clipboard.setString(generatedCode);
    alert("Código copiado al portapapeles!");
  };

  return (
    <View style={styles.container}>
  
      <TabBarOfi activeTab={activeTab} setActiveTab={setActiveTab}  />
       <View style={{marginBottom:30}}></View>
      {activeTab === "Crear Ahorro" ? (
        <>
          <View style={{ width: "100%" }}>
            <Text style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
              Crea tu Meta de Ahorro
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 400,
                color: "#7A7A7A",
                marginBottom: 40,
              }}
            >
              Ingresa los datos solicitados
            </Text>
          </View>
          <TextInput
            style={styles.input}
            label="Monto (Bs)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            autoCapitalize="none"
            mode="outlined"
            returnKeyType="done"
            textColor={theme.colors.text}
            underlineColor={theme.colors.text}
            outlineColor="#FBFBFB"
            activeOutlineColor={theme.colors.placeholder}
            theme={{ roundness: 10 }}
            placeholderTextColor={theme.colors.text}
          />
          <View style={{ marginTop: 20 }}></View>
          <Dropdown
            CustomDropdownInput={(elem) => {
              return (
                <View
                  style={{
                    height: 60,
                    width: 390,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    backgroundColor: "#F6F6F6",
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ fontSize: 18, marginLeft: 20, flex: 0.85 }}>
                    {duration ? duration : "Duración (meses)"}
                  </Text>
                  <View style={{ height: 30, width: 30, flex: 0.15 }}>
                    {elem.rightIcon}
                  </View>
                </View>
              );
            }}
            mode={"outlined"}
            placeholder="Duración (meses)"
            options={items}
            value={duration}
            onSelect={(val) => {
              setDuration(val);
            }}
          />

          <View style={{ marginTop: 40 }}></View>

          <Button mode="contained" onPress={generateCode} style={styles.button}>
            <Text style={{ color: "white", fontSize: 17, fontWeight: 600 }}>
              {" "}
              Generar Código
            </Text>
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
        </>
      ) : (
        <>
          <View style={{ width: "100%" }}>
            <Text style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
              Unéte a una Meta de Ahorro
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 400,
                color: "#7A7A7A",
                marginBottom: 40,
              }}
            >
              Ingresa los datos solicitados
            </Text>
          </View>
          <TextInput
            style={styles.input}
            label="Código"
            value={code}
            onChangeText={setCode}
            keyboardType="decimal-pad"
            autoCapitalize="none"
            mode="outlined"
            returnKeyType="done"
            textColor={theme.colors.text}
            underlineColor={theme.colors.text}
            outlineColor="#FBFBFB"
            activeOutlineColor={theme.colors.placeholder}
            theme={{ roundness: 10 }}
            placeholderTextColor={theme.colors.text}
          />
          <View style={{ marginTop: 20 }}></View>
        

          <View style={{ marginTop: 40 }}></View>

          <Button mode="contained" onPress={joinCode} style={styles.button}>
            <Text style={{ color: "white", fontSize: 17, fontWeight: 600 }}>
              {" "}
              Unirse
            </Text>
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
        </>
      )}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    button: {
      marginVertical: 20,
      backgroundColor: "#EB3C85",
      fontSize: 20,
      width: "70%",
      height: 60,
      borderRadius: 1000,
      justifyContent: "center",
    },
    codeContainer: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    codeText: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      marginVertical: 10,
      height: 60,
      fontSize: 18,
      color: theme.colors.placeholder,
      backgroundColor: "#F6F6F6",
    },
  });


  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0057FF", // Fondo azul
  },
  contentContainer: {
    flex: 1, // Hace que este contenedor ocupe todo el espacio restante
  },
  tabBar: {
    flex: 0, // Evita que el TabBar crezca
  },
  screenContainer: {
    flex: 1, // Ocupa el espacio restante para el contenido de la pantalla
  },
  headerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Transparencia para el efecto glass
    borderRadius: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backdropFilter: "blur(10px)", // Desenfoque para efecto Glassmorphism
  },
  fixedSizeContainer: {
    height: 240, // Fixed height for both views
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  title: {
    fontSize: 25, // Jerarquía 1: Mayor tamaño
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    color: "#000:",
  },
  subtitle: {
    fontSize: 15, // Jerarquía 2: Subtítulo
    fontWeight: "600", // Peso medio
    textAlign: "center",
    color: "#ffffff99", // Color blanco con opacidad
  },
  description: {
    fontSize: 16, // Jerarquía 3: Descripción
    color: "black", // Blanco con más opacidad
    textAlign: "center",
    marginTop: 5,
  },
  image: {
    width: "90%",
    height: 160,
    borderRadius: 15,
    marginTop: 30,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparente con efecto glass
    paddingVertical: 10,
    margin: 10,
    gap:20,
    borderRadius: 10,
    backdropFilter: "blur(10px)",
  },
  tabButton: {
    flex: 1,
    paddingVertical:10,
    padding: 10,

    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#EB3C85",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#1b1b1b", // Color blanco con opacidad
  },
  activeTabButtonText: {
    fontWeight: "bold",
    color: "#1b1b1b",
  },
  scrollView: {
    padding: 10,
  },
  cardText: {
    fontSize: 16, // Tamaño para el texto de precio y duración
    color: "#1b1b1b", // Color del texto
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "#FFFFFF", // Transparente para efecto glass
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // Borde suave para glassmorphism
    backdropFilter: "blur(10px)",
  },
  cardTitle: {
    fontSize: 20, // Jerarquía 1 dentro de la tarjeta
    fontWeight: "bold",
    color: "#000",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  cartContainer: {
    position: "absolute", // Make the cart view float above the content
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF", // Transparente para efecto glass
    padding: 10,
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  cartText: {
    fontSize: 16,
    color: "#000000",
  },
  cartButton: {
    marginLeft: 10,
    backgroundColor: "#D33C3C", // Fondo claro con transparencia
    color: "#000",
  },
  moreInfoContainer: {
    alignItems: "center",
  },
  moreInfoText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  moreInfoLink: {
    fontSize: 18,
    color: "#1E90FF", // Use a blue color to signify a link
    marginBottom: 10,
    textAlign: "center",
    textDecorationLine: "underline", // Underline to indicate it's a clickable link
  },
  linkContainer: {
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Center the icon and text vertically
    marginBottom: 10,
  },
  icon: {
    marginRight: 5, // Margin to space the icon from the text
  },
  iconImage: {
    width: 24, // Set the desired width of the icon image
    height: 24, // Set the desired height of the icon image
    marginRight: 5, // Margin to space the image from the text
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#1E90FF", // Filled dot color
  },
  inactiveDot: {
    backgroundColor: "#C0C0C0", // Unfilled dot color
  },
});


function TabBarOfi({ activeTab, setActiveTab }:any) {
  return (
    <View style={styles.tabBarContainer}>

       

        <Text
        style={[
          styles.tabButton,
          activeTab === "Crear Ahorro" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("Crear Ahorro")}
        >
          Crear Ahorro
        </Text>

  
        <Text
       style={[
        styles.tabButton,
        activeTab === "Unirse" && styles.activeTabButton,
      ]}
      onPress={() => setActiveTab("Unirse")}
        >
          Unirse
        </Text>
 
    </View>
  );
}
