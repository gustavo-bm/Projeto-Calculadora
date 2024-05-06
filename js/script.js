// selecionando elementos do DOM (document object model), lembrando que a referência para o elemento no DOM é constante, mas o texto não
const previousOperationText = document.querySelector("#previous-operation");
const currentOperationText = document.querySelector("#current-operation");
const buttons = document.querySelectorAll("#buttons-container button");

// método construtor 
class Calculator {
  constructor(previousOperationText, currentOperationText) {
    this.previousOperationText = previousOperationText;
    this.currentOperationText = currentOperationText;
    this.currentOperation = "";
  }

  // adiciona um dígito à operação atual
  addDigit(digit) {
    // condição para que não seja adicionado mais de um ponto ao número, o que seria algebricamente errôneo
    if (digit === "." && this.currentOperationText.innerText.includes(".")) {
      return;
    }
    this.currentOperation += digit;
    this.updateScreen();
  }

  // processa todas as operações da calculadora
  processOperation(operation) {
    if (this.currentOperationText.innerText === "" && operation !== "C") {
      if (this.previousOperationText.innerText !== "") {
        this.changeOperation(operation);
      }
      return;
    }
    const [previous, current] = this.getCurrentAndPreviousValues();
    let operationValue;
    switch (operation) {
      case "+":
        operationValue = previous + current;
        break;
      case "-":
        operationValue = previous - current;
        break;
      case "*":
        operationValue = previous * current;
        break;
      case "/":
        operationValue = previous / current;
        break;
      case "DEL":
        this.processDelOperator();
        return;
      case "CE":
        this.processClearCurrentOperator();
        return;
      case "C":
        this.processClearOperator();
        return;
      case "=":
        operationValue = current;
        break;
      default:
        return;
    }
    this.updateScreen(operationValue, operation);
  }

  // atualiza a tela da calculadora
  updateScreen(operationValue = null, operation = null) {
    if (operationValue === null) {
      this.currentOperationText.innerText += this.currentOperation;
    } else {
      this.previousOperationText.innerText = `${operationValue} ${operation}`;
      this.currentOperationText.innerText = "";
    }
  }

  // altera a operação
  changeOperation(operation) {
    const mathOperations = ["*", "-", "+", "/"];
    if (mathOperations.includes(operation)) {
      this.previousOperationText.innerText =
        this.previousOperationText.innerText.slice(0, -1) + operation;
    }
  }

  // exclui um dígito da operação atual
  processDelOperator() {
    this.currentOperation = this.currentOperation.slice(0, -1);
  }

  // limpa a operação atual
  processClearCurrentOperator() {
    this.currentOperation = "";
  }

  // limpa tudo
  processClearOperator() {
    this.currentOperation = "";
    this.previousOperationText.innerText = "";
  }

  // processa uma operação de igual
  processEqualOperator() {
    const operation = this.previousOperationText.innerText.split(" ")[1];
    this.processOperation(operation);
  }

  // método get que fornece as strings convertidas para valores numéricos
  getCurrentAndPreviousValues() {
    return [
      +this.previousOperationText.innerText.split(" ")[0],
      +this.currentOperationText.innerText,
    ];
  }
}

// cria uma nova instância da classe Calculadora
const calc = new Calculator(previousOperationText, currentOperationText);

// adiciona ouvintes de eventos aos botões, para que a lógica ocorra a partir dos clicks do usuário
buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText;
    if (+value >= 0 || value === ".") {
      calc.addDigit(value);
    } else {
      calc.processOperation(value);
    }
  });
});
