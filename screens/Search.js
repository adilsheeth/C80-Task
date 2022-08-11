import * as React from "react";
import { Text, View } from "react-native";

class Search extends React.Component {
    render() { 
        return (  
            <View style={styles.container}>
                <Text style={styles.text}>This is the Search Screen.</Text>
            </View>
        );
    }
}
 
export default Search;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5653D4",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
};