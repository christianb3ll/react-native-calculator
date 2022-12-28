import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity, Alert, addons } from 'react-native';
import { useState } from 'react';

// Get the window width and assign standard button width
const buttonWidth = Dimensions.get('window').width / 4;

export default function App() {
  // Setup the answer state
  const [answerValue, setAnswerValue] = useState(0);
  
  // Stores a value in memory
  const [memoryValue, setMemoryValue] = useState(0);
  // Stores the current operator
  const [operatorValue, setOperatorValue] = useState(0);
  // Determines if screen value is to be replaced
  const [readyToReplace, setReadyToReplace] = useState(true);

  // Create a reusable calculator button component
  function CalcButton(props) {
    return(
      <TouchableOpacity 
        style={props.btnStyles}
        onPress={()=> buttonPressed(props.btnValue)}
      >
        <Text style={styles.buttonText}>{props.btnValue}</Text>
      </TouchableOpacity>
    );
  }

  // Called on button press
  function buttonPressed(btnValue){
    // check if value is a number
    if(!isNaN(btnValue)){
      // Determine if number should replace or append to screen
      setAnswerValue(handleNumber(btnValue));
    }

    // if clear button pressed
    if(btnValue == 'C'){
      // reset all values
      setAnswerValue(0);
      setMemoryValue(0);
      setOperatorValue(0);
      setReadyToReplace(true);
    }

    // if button value is an operator
    if(isOperator(btnValue)){
      // Initialise currentValue variable
      var currentValue = answerValue;

      // check if there is a current operation
      if(operatorValue != 0){
        // calcualte the current operation
        currentValue = calculateEquals();
      }

      // Set the value of memoryValue to be the operation result
      setMemoryValue(currentValue);

      setReadyToReplace(true);
      setOperatorValue(btnValue);
    }

    // if equals button
    if(btnValue == '='){
      // Calculate Equals
      calculateEquals();

      // reset values
      setMemoryValue(0);
      setReadyToReplace(true);
    }

    // if +/- button pressed set the value to positive/negative
    if(btnValue == '+/-'){
      setAnswerValue(answerValue * -Math.sign(answerValue));
    }

    // if percentage button, calculate percentage
    if(btnValue == '%'){
      setAnswerValue(answerValue * 0.01);
    }

    console.log(btnValue);
  }

  // Deterrmine if button value is an operator and return true/false
  function isOperator(value){
    if(value == '+' ||
       value == '-' ||
       value == 'X' ||
       value == '/'){
        return true;
    }
    return false;
  }

  function handleNumber(number){
    // Check if value on screen should be replaced
    if(readyToReplace){
      setReadyToReplace(false);
      // return number unchanged
      return number;
    } else {
      // Append number to previous value on screen
      return parseInt(answerValue.toString() + number.toString());
    }
  }

  function calculateEquals(){
    // initialise previous and current value variables
    var previous = parseFloat(memoryValue);
    var current = parseFloat(answerValue);

    console.log('Memory Value: ' + memoryValue);
    console.log('Answer Value: ' + answerValue);
    console.log('Operator: ' + operatorValue);
    
    switch (operatorValue) {
      case '+':
        // ADDITION
        setAnswerValue(previous + current);
        return answerValue;
      case '-':
        // SUBTRACTION
        setAnswerValue(previous - current);
        return answerValue;
      case 'X':
        // MULTIPLICATION
        setAnswerValue(previous * current);
        return answerValue;
      case '/':
        // DIVISION
        setAnswerValue(previous / current);
        return answerValue;
      default:
        // No calculation performed
        console.log('No Operand');
        return answerValue;
        break;
    }
  }

  // Create the App view
  return (
   <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Results Window */}
        <Text style={styles.result}>{answerValue}</Text>
        <View style={styles.row}>
          <CalcButton btnStyles={[styles.button, styles.grayButton]} btnValue='C' />
          <CalcButton btnStyles={[styles.button, styles.grayButton]} btnValue='+/-' />
          <CalcButton btnStyles={[styles.button, styles.grayButton]} btnValue='%' />
          <CalcButton btnStyles={[styles.button, styles.blueButton]} btnValue='/' />
        </View>

        <View style={styles.row}>
          <CalcButton btnStyles={styles.button} btnValue={7} />
          <CalcButton btnStyles={styles.button} btnValue={8} />
          <CalcButton btnStyles={styles.button} btnValue={9} />
          <CalcButton btnStyles={[styles.button, styles.blueButton]} btnValue='X' />
        </View>

        <View style={styles.row}>
          <CalcButton btnStyles={styles.button} btnValue={4} />
          <CalcButton btnStyles={styles.button} btnValue={5} />
          <CalcButton btnStyles={styles.button} btnValue={6} />
          <CalcButton btnStyles={[styles.button, styles.blueButton]} btnValue='-' />
        </View>

        <View style={styles.row}>
          <CalcButton btnStyles={styles.button} btnValue={1} />
          <CalcButton btnStyles={styles.button} btnValue={2} />
          <CalcButton btnStyles={styles.button} btnValue={3} />
          <CalcButton btnStyles={[styles.button, styles.blueButton]} btnValue='+' />
        </View>

        <View style={styles.row}>
          <CalcButton btnStyles={[styles.button, styles.wideButton]} btnValue={0} />
          <CalcButton btnStyles={styles.button} btnValue='.' />
          <CalcButton btnStyles={[styles.button, styles.blueButton]} btnValue='=' />
        </View>
        <StatusBar style="light content" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    alignItems: 'bottom',
    justifyContent: 'flex-end',
  },
  result: {
    flex: 1,
    color: 'white',
    fontSize: 48,
    margin: '10%',
    textAlign: 'right',
    backgroundColor: 'red'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'grey'
  },
  button: {
    backgroundColor: '#4a4a4a',
    // margin: '10%',
    width: buttonWidth,
    height: buttonWidth,
    borderRadius: 4,
  },
  wideButton: {
    width: buttonWidth*2
  },
  grayButton: {
    backgroundColor: '#c4c4c4'
  },
  blueButton: {
    backgroundColor: 'blue'
  },
  buttonText: {
    color: 'white'
  }
});
