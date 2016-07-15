$(document).ready(function(){
  var startNewCalculation = true;

  $('#ac').on('click',function(){
    $('#result').val('');
  });
  $('#ce').on('click',function(){
    if(startNewCalculation){
      $('#result').val('');
    }else{
      var result = $('#result').val();
      result = result.substr(0,result.length-1);
      $('#result').val(result);
    }
  });
  $('#mod').on('click',function(){
    appendValue('%');
  });
  $('#divide').on('click',function(){
    appendValue('/');
  });
  $('#multiply').on('click',function(){
    appendValue('*');
  });
  $('#minus').on('click',function(){
    appendValue('-');
  });
  $('#add').on('click',function(){
    appendValue('+');
  });
  $('#equals').on('click',function(){
    compute();
  });
  $('#ans').on('click',function(){
    compute();
  });
  $('#period').on('click',function(){
    appendValue('.');
  });
  $('#one').on('click',function(){
    appendValue(1);
  });
  $('#two').on('click',function(){
    appendValue(2);
  });
  $('#three').on('click',function(){
    appendValue(3);
  });
  $('#four').on('click',function(){
    appendValue(4);
  });
  $('#five').on('click',function(){
    appendValue(5);
  });
  $('#six').on('click',function(){
    appendValue(6);
  });
  $('#seven').on('click',function(){
    appendValue(7);
  });
  $('#eight').on('click',function(){
    appendValue(8);
  });
  $('#nine').on('click',function(){
    appendValue(9);
  });
  $('#zero').on('click',function(){
    appendValue(0);
  });

  function appendValue(value){

    var currentValue = startNewCalculation===true && /[/,*,\-,+]/.test(value)===false? "" : $('#result').val();

    //Validate the string
    if(isNaN(value)){
      //Non-numeric character can't be the first character
      if(currentValue.length===0){
        if(/[/,*,+,\-]/.test(value)){
          currentValue = '0';
        }else{
          return;
        }
      }

      //Non-numeric characters can't follow each other
      var endingCharacter = currentValue.substr(currentValue.length-1);
      if(isNaN(endingCharacter)){
        return;
      }

      //We can't have two '.' in the same number
      if(value==='.'){
        var currentValueArray = currentValue.split('');
        currentValueArray.reverse();
        for(i=0;i<currentValueArray.length;i++){
          if(isNaN(currentValueArray[i])){
            if(currentValueArray[i]==='.'){
              return;
            }
            break;
          }
        }
      }
    }

    currentValue += value;
    $('#result').val(currentValue);
    startNewCalculation = false;
  }

  function compute(){
    var result = $('#result').val();

    if(isNaN(result.substr(result.length-1))){
      result = result.substr(0,result.length-1)
    }
    //BO-DMAS
    //Division-Multiplication
    result = executeOperation(result,['/','*']);

    //Addition-Subtraction
    result = executeOperation(result,['+','-']);

    $('#result').val(result);
    startNewCalculation = true;
  }

  function executeOperation(input,operations){
    while(input.indexOf(operations[0])!==-1 || input.indexOf(operations[1])!==-1){
      var index = 0;
      var operation ='';
      var operator1Index = input.indexOf(operations[0]);
      var operator2Index = input.indexOf(operations[1]);

      if(operator1Index===-1){
        index = operator2Index;
        operation =operations[1];
      }else if(operator2Index===-1){
        index=operator1Index;
        operation = operations[0];
      }else{
        index = operator1Index<operator2Index?operator1Index:operator2Index;
        operation = operator1Index<operator2Index?operations[0]:operations[1];
      }
      
      if(index===0){ //Meaning that you are dealing with a negative number such as -9,-88
        var operatorsCount =0;
        for(i=0;i<input.length;i++){
          if(/[/,*,\-,+]/.test(input.charAt(i))===true){
            operatorsCount++;
            if(operatorsCount===2){
              index = i;
              break;
            }
          }
        }
        
        if(operatorsCount===1){
          break;
        }
        
      }
      var inputArray = input.split('');
      
      //First number
      var firstNumberIndex=index-1;
      var firstNumberArray =[];
      var firstNumberStart =0;
      for(i=firstNumberIndex;i>=0;i--){
        if(isNaN(inputArray[i]) && inputArray[i]!='.' && inputArray[i]!='-'){
          break;
        }
        firstNumberArray.unshift(inputArray[i]);
        firstNumberStart=i;
        
        if(inputArray[i]==='-') break;
      }

      var firstNumber = +firstNumberArray.join('');

      //Second number
      var secondNumberIndex = index+1;
      var secondNumberArray =[];
      var secondNumberEnd =0;
      for(i=secondNumberIndex;i<inputArray.length;i++){
        if(isNaN(inputArray[i]) && inputArray[i]!='.'){
          break;
        }
        secondNumberArray.push(inputArray[i]);
        secondNumberEnd=i;
      }

      var secondNumber = +secondNumberArray.join('')

      var operationResult=0;
      switch(operation){
        case '/':
          operationResult=firstNumber/secondNumber;
          break;
        case '*':
          operationResult=firstNumber*secondNumber;
          break;
        case '+':
          operationResult=firstNumber+secondNumber;
          break;
        case '-':
          operationResult=firstNumber-secondNumber;
          break;
      }

      inputArray[firstNumberStart]=operationResult;
      inputArray.splice(firstNumberStart+1,secondNumberEnd-firstNumberStart);
      input = inputArray.join('');
    }

    var finalResult = input;
    return finalResult;
  }
});