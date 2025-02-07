const display=document.getElementById("display");
//добавить текст кнопки на экран
function addToDisplay(value){
    if(display.value===0){
        display.value=value;
    }else{
        display.value+=value
    }
}
//вернуть строку в начальное состояние
function clearDisplay(){
    display.value="";
}
const buttons=document.querySelectorAll(".numbers, .operators");
buttons.forEach((button)=>{
    button.addEventListener("click", (event)=>{
        const buttonVal=event.target.textContent;
        if(buttonVal===","){
            addToDisplay('.');
        }else if(buttonVal==="()"){
            putParentheses();
        }else{
            addToDisplay(buttonVal);
        }

    })
})
function putParentheses(){
    const lastChar=display.value.slice(-1);
    let openBr=0;
    for(let i=0;i<display.value.length;i++){
        if(display.value[i]==='('){
            openBr++;
        }else if(display.value[i]===')'){
            openBr--;
        }
    }
    const isLastCharOperator = ["+", "-", "*", "/", "^", ""].includes(lastChar);
    if(isLastCharOperator){
        addToDisplay("(");
    }else if(!isLastCharOperator&&openBr!==0 &&(lastChar!=="" && !'+-*^/('.includes(lastChar))){
        addToDisplay(")");
    }
}
const actionButtons=document.querySelectorAll(".action");
actionButtons.forEach((button)=>{
    button.addEventListener("click", (event)=>{
        const buttonVal=event.target.textContent;
        if (buttonVal==="C"){
            clearDisplay();
        }else if(buttonVal==="="){
            display.value=calculate(display.value);
        }
    })
})

//основная функция вычисления
function calculate(expression){
    expression = expression.replace(/×/g, '*');
    expression = expression.replace(/÷/g, '/');
    expression = expression.replace(/,/g, '.');

    const values=[];
    const operators=[];
    const partitions=division(expression);
    partitions.forEach(part=>{
        if (!isNaN(part) && part.trim()!==''){
            values.push(parseFloat(part));
        }else if(part==='('){
            operators.push(part);
        }else if(part===')'){
            while(operators.length>0 && operators[operators.length-1]!=='('){
                const operator=operators.pop();
                const operand2=values.pop();
                const operand1=values.pop();
                values.push(applyOperator(operand1,operand2,operator))
            }
            operators.pop();
        }else {
            while(operators.length>0 && getPriority(operators[operators.length-1])>=getPriority(part)){
                const operator=operators.pop();
                const operand2=values.pop();
                const operand1=values.pop();
                values.push(applyOperator(operand1,operand2,operator));
            }
            operators.push(part);
        }
    })
    while (operators.length > 0) {
        const operator = operators.pop();
        const operand2 = values.pop();
        const operand1 = values.pop();
        values.push(applyOperator(operand1, operand2, operator));
    }
    return values.pop();
}
function getPriority(operator){
    if(operator==='+' || operator==='-'){
        return 1;
    }else if(operator==='*' || operator==='/'){
        return 2;
    }else if(operator==='^'){
        return 3;
    }
    return 0;
}
function applyOperator(operand1,operand2,operator){
    switch(operator){
        case '+': return operand1+operand2;
        case '-': return operand1-operand2;
        case '*': return operand1*operand2;
        case '/': 
        if (operand2===0) return 'Error';
        return operand1/operand2;
        case '^': return Math.pow(operand1,operand2);
        default: return 0;
    }
}

//разделение на элементы
function division(expression){
    const partitions=[];
    let currentPart='';
    for(let i=0; i<expression.length;i++){
        const char=expression[i];
        if(char===' '){
            continue;
        }
        if(char==='-' && (i===0 ||expression[i-1]==='(')){
            currentPart+=char;
        }else if('+-*^/()'.includes(char)){
            if (currentPart){
                partitions.push(currentPart);
                currentPart='';
            }
            partitions.push(char);
        }else{
            currentPart+=char;//сбор числа
        }
    }
    if(currentPart){
        partitions.push(currentPart);
    }
    return partitions;
}
//const expression="3 + 57 * ( 2 - 8 )";
//console.log(division(expression));