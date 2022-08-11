import { View } from "react-native";
import BottomTabNav from "./components/BottomTabNav";

export default function App() {
  return (
    <View style={styles.container}>
      <BottomTabNav />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },
};
