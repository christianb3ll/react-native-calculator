import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity, Alert, addons } from 'react-native';
import { useState } from 'react';

// Get the window width and assign standard button width
const buttonWidth = Dimensions.get('window').width / 4;

export default function App() {
  // Setup the answer state
  const [answerValue, setAnswerValue] = useState(0);
 
  const [memoryValue, setMemoryValue] = useState(0);
  const [operatorValue, setOperatorValue] = useState(0);

  const [readyToReplace, setReadyToReplace] = useState(true);

  // Create a reusable button component
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

  function buttonPressed(btnValue){
    // check if value is a number
    if(!isNaN(btnValue)){
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

    // if operator
    // memoryValue to the answerValue. Set readyToReplace to true and set the operatorValue to the button operator
    if(isOperator(btnValue)){
      var currentValue = 0;
      if(operatorValue != 0){
        currentValue = calculateEquals();
      }

      // Set the value of memoryValue to be the operation result
      setMemoryValue(currentValue);
      setReadyToReplace(true);
      setOperatorValue(btnValue);
      
    

    }

    // if equals button
    if(btnValue == '='){
      
      setAnswerValue(calculateEquals());

      // reset values
      setMemoryValue(0);
      setReadyToReplace(true);
    }

    // if +/- button pressed se the value to positive/negative
    if(btnValue == '+/-'){
      // set the answerValue to be the positive/negative equivalent e.g. -5 becomes +5 and +5 becomes -5
      setAnswerValue(answerValue * -Math.sign(answerValue));
    }

    // if percentage button, calculate percentage
    if(btnValue == '%'){
      //  for the % functionality multiply the current value by 0.01
      setAnswerValue(answerValue * 0.01);
    }

    console.log(btnValue);
  }

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
      return number;
    } else {
      // Append value to the result screen
      return parseInt(answerValue.toString() + number.toString());
    }
  }

  function calculateEquals(){
    var previous = parseFloat(memoryValue);
    var current = parseFloat(answerValue);
    
    switch (operatorValue) {
      case '+':
        setAnswerValue(previous + current);
        return answerValue;
      case '-':
        setAnswerValue(previous - current);
        return answerValue;
      case 'X':
        setAnswerValue(previous * current);
        return answerValue;
      case '/':
        setAnswerValue(previous / current);
        return answerValue;
      default:
        
        break;
    }

    // Then use a switch operator to check if the operatorValue is of a specific type e.g. +,
    // if so set the answer value to previous + current substituting the correct operator.
    // Make sure to also return this value to stop the switch but also allow us to get the value when
    // calling which will come in handy later.
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
