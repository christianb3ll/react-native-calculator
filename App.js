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
      <View>
        <View style={styles.buttonShadow}></View>
        <TouchableOpacity 
          style={props.btnStyles}
          onPress={()=> buttonPressed(props.btnValue)}
        >
          <Text style={styles.buttonText}>{props.btnValue}</Text>
        </TouchableOpacity>
      </View>
      
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

    // if point button, add decimal point
    // point is treated as an operator as it functions in much the same way
    if(btnValue == '.'){
      console.log('Point pressed');
      // console.log(parseFloat(answerValue.toString() + '.5'));
      // setAnswerValue(parseFloat(answerValue.toString() + '.0'));
      setAnswerValue(parseFloat(answerValue.toString() + '.' + memoryValue.toString()));
    }

    console.log(btnValue);
  }

  // Deterrmine if button value is an operator and return true/false
  function isOperator(value){
    if(value == '+' ||
       value == '-' ||
       value == 'X' ||
       value == '/' ||
       value == '.'){
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
        <View style={styles.resultContainer}>
          <View style={styles.operator}>
            {operatorValue == 0 ? '' : <Text style={styles.operatorText}>{operatorValue}</Text>}
          </View>
          <View style={styles.result}>
            <Text style={styles.resultText}>{answerValue}</Text>
          </View>
        </View>
        {/* Calculator window */}
        <View style={styles.calculatorContainer}>
          {/* Draw lines to seperate the buttons */}
          <View style={styles.borderLine}></View>
          <View style={styles.borderLineVertical}></View>

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
    backgroundColor: '#e0e0e0'
  },
  calculatorContainer: {
    flex: 2,
  },
  resultContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: '#c0ccc9'
  },
  operator: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 10,
  },
  operatorText: {
    fontSize: 24,
    color: '#c0ccc9',
    backgroundColor: '#3f4d49',
  },
  result: {
    flex: 2,
    justifyContent: 'center',
    margin: 10,
  },
  resultText: {
    color: '#3f4d49',
    fontSize: 60,
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    width: buttonWidth -20,
    height: buttonWidth -20,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    shadowColor: "#8d8d8d",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 6,
  },
  buttonShadow: {
    position: "absolute",
    backgroundColor: "#e0e0e0",
    margin: 10,
    width: buttonWidth -20,
    height: buttonWidth -20,
    borderRadius: 10,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: -20,
      height: -20,
    },
    shadowOpacity: 1.0,
    shadowRadius: 30,
    elevation: 12,
  },
  wideButton: {
    width: buttonWidth * 2 - 20
  },
  grayButton: {
    backgroundColor: '#c4c4c4'
  },
  blueButton: {
    backgroundColor: '#c7e2ed'
  },
  buttonText: {
    fontSize: 24, 
  },
  borderLine: {
    position: 'absolute',
    top: buttonWidth,
    left: 10,
    height: 2,
    width: buttonWidth*4 -20,
    backgroundColor: '#c1c1c1',
  },
  borderLineVertical: {
    position: 'absolute',
    top: 10,
    right: buttonWidth,
    width: 2,
    height: buttonWidth*5 -20,
    backgroundColor: '#c1c1c1',
  }

});
