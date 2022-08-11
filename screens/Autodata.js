import * as React from "react";
import { TouchableOpacity, View, Text, TextInput } from "react-native";
import db from "../config";

class Autodata extends React.Component {
  constructor() {
    super();
    this.state = {
      text: "",
      amt: "",
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textinput}
          placeholder="Amount to generate"
          placeholderTextColor={"#ffffff"}
          onChangeText={(value) => this.setState({ amt: value })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.generateData();
          }}
        >
          <Text style={styles.buttonText}>Generate!</Text>
        </TouchableOpacity>
        <Text style={styles.text}>{this.state.text}</Text>
      </View>
    );
  }
  generateData = async () => {
    //Generates data from the random user API
    console.log();
    if (isNaN(this.state.amt) || this.state.amt <= 0) {
      alert("Please enter a number, or a number greater than zero.");
      return;
    }
    this.setState({ text: `Generating ${this.state.amt} random users...` });
    let data = await fetch(
      `https://randomuser.me/api/?results=${
        parseInt(this.state.amt) + 1
      }&nat=au`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.generateStudentData(responseJson);
      })
      .catch((error) => {
        console.error(error);
        alert("Error generating data");
      });
  };
  generateStudentData = async (data) => {
    for (let index = 1; index < parseInt(this.state.amt) + 1; index++) {
      this.setState({ text: "Generating student data #" + index + "..." }); //Progress update
      let section;
      switch (
        Math.floor(Math.random() * 4) //Randomly generates a num and converts into letter
      ) {
        case 1:
          section = "A";
          break;
        case 2:
          section = "B";
          break;
        case 3:
          section = "C";
          break;
        case 4:
          section = "D";
          break;
        default:
          section = "A";
          break;
      }
      let id;
      switch (
        index.toString().length //Uses the index to add leading zeros to create the id
      ) {
        case 1:
          id = "ST-00" + index;
          break;
        case 2:
          id = "ST-0" + index;
          break;
        case 3:
          id = "ST-" + index;
          break;
      }
      //The student data object is created and then pushed to the database
      let studentData = {
        books_issued: 0,
        student_id: id,
        student_details: {
          student_grade: Math.floor(Math.random() * 12),
          //Results from random user API
          student_name:
            data.results[index].name.first +
            " " +
            data.results[index].name.last,
          student_roll_no: Math.floor(Math.random() * 30),
          student_section: section,
        },
      };
      this.setState({ text: "Pushing changes to database..." });
      await db.collection("students").doc(id).set(studentData); //Push to database
    }
    this.setState({ text: "Done!" }); //Progress Update
  };
}

export default Autodata;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5653D4",
  },
  button: {
    width: "60%",
    padding: 5,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    color: "#FFFFFF",
    marginBottom: 10,
  },
};
