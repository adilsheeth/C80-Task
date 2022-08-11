import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
import {
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";
import firebase from "firebase";

const bgImg = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class Transaction extends React.Component {
  constructor() {
    super();
    this.state = {
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      scannedData: "",
      bookID: "",
      studentID: "",
      bookName: "",
      studentName: "",
    };
  }
  render() {
    const { bookID, studentID, domState, scanned } = this.state;
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.container}>
          <ImageBackground source={bgImg} style={styles.Img}>
            <View style={styles.lowerContainer}>
              <Image source={appName} style={styles.appName} />
              <Image source={appIcon} style={styles.appIcon} />
              <View style={styles.textinputContainer}>
                <TextInput
                  style={styles.textinput}
                  placeholder={"Book ID"}
                  placeholderTextColor={"#ffffff"}
                  value={bookID}
                  onChangeText={(text) => {
                    this.setState({ bookID: text });
                  }}
                />
                <TouchableOpacity
                  style={styles.scanbutton}
                  onPress={() => {
                    this.getCamPerms("bookID");
                  }}
                >
                  <Text style={styles.scanbuttonText}>SCAN</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.textinputContainer}>
                <TextInput
                  style={styles.textinput}
                  placeholder={"Student ID"}
                  placeholderTextColor={"#ffffff"}
                  value={studentID}
                  onChangeText={(text) => {
                    this.setState({ studentID: text });
                  }}
                />
                <TouchableOpacity
                  style={styles.scanbutton}
                  onPress={() => {
                    this.getCamPerms("studentID");
                  }}
                >
                  <Text style={styles.scanbuttonText}>SCAN</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={[styles.button, { marginTop: 25 }]}
                  onPress={() => {
                    this.handleTransaction();
                  }}
                >
                  <Text style={styles.buttonText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    );
  }
  getCamPerms = async (domState) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false,
    });
  };
  handleBarcodeScanned = async ({ type, data }) => {
    const { domState } = this.state;
    if (domState == "bookID") {
      this.setState({
        scanned: true,
        bookID: data,
        domState: "normal",
      });
    }
    if (domState == "studentID") {
      this.setState({
        scanned: true,
        studentID: data,
        domState: "normal",
      });
    }
  };
  handleTransaction = async () => {
    let { bookID, studentID } = this.state;
    await this.addBookDetails(bookID);
    await this.addStudentDetails(studentID);
    db.collection("books")
      .doc(bookID)
      .get()
      .then((doc) => {
        let book = doc.data();
        let { bookName, studentName } = this.state;
        if (book.is_book_available) {
          this.initBookIssue(bookID, studentID, bookName, studentName);
          ToastAndroid.show(
            "Book has been issued to the Student",
            ToastAndroid.SHORT
          );
        } else {
          this.initBookReturn(bookID, studentID, bookName, studentName);
          ToastAndroid.show("Book has been retured", ToastAndroid.SHORT);
        }
      });
  };
  initBookIssue = async (bookID, studentID, bookName, studentName) => {
    //Add a transaction
    db.collection("transactions").add({
      book_id: bookID,
      student_id: studentID,
      book_name: bookName,
      student_name: studentName,
      transaction_type: "issue",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    //Change book status
    db.collection("books").doc(bookID).update({
      is_book_available: false,
    });
    //Change issued book number for student
    db.collection("students")
      .doc(studentID)
      .update({
        books_issued: firebase.firestore.FieldValue.increment(1),
      });
    //Update local state
    this.setState({
      bookID: "",
      studentID: "",
    });
  };
  initBookReturn = (bookID, studentID, bookName, studentName) => {
    //Add a transaction
    db.collection("transactions").add({
      book_id: bookID,
      student_id: studentID,
      book_name: bookName,
      student_name: studentName,
      transaction_type: "return",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    //Change book status
    db.collection("books").doc(bookID).update({
      is_book_available: true,
    });
    //Change issued book number for student
    db.collection("students")
      .doc(studentID)
      .update({
        books_issued: firebase.firestore.FieldValue.increment(-1),
      });
    //Update local state
    this.setState({
      bookID: "",
      studentID: "",
    });
  };
  addBookDetails = (bookID) => {
    bookID = bookID.trim();
    db.collection("books")
      .doc(bookID)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            bookName: doc.data().book_details.book_name,
          });
        });
      });
  };
  addStudentDetails = (studentID) => {
    studentID = studentID.trim();
    db.collection("students")
      .doc(studentID)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            studentName: doc.data().student_details.student_name,
          });
        });
      });
  };
}

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
  lowerContainer: {
    flex: 0.5,
    alignItems: "center",
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF",
    margin: 10,
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
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#0A0101",
  },
  Img: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  appIcon: {
    width: 100,
    height: 100,
  },
  appName: {
    width: 375,
    height: 95,
  },
};
