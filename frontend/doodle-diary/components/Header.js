import { Image, StyleSheet, Text, View } from 'react-native';

export default function Header({ }) {
  return (
    <View style={styles.header}>
      <Image source={require("../assets/iconic/bubble_14069591.png")} style={styles.mainIcon} />
      <Text style={styles.headerText}>DOODLE</Text>
      <Text style={styles.subHeaderText}>diary</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: "column",
    alignItems: 'center',
    top: 135,
    position: 'absolute'
  },
  headerText: {
    fontFamily: "noodle_soup",
    color: "black",
    fontSize: 64
  },
  subHeaderText: {
    fontFamily: "poodle",
    color: "black",
    fontSize: 32
  },
  mainIcon: {
    width: 100,
    height: 100,
    margin: -25
  },
});
