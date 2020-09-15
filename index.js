/* BASE */
const elements = {
    numbersBtns: document.querySelectorAll('.normal'),
    input: document.querySelector('.input-content'),
    removeBtn: document.querySelector('.remove'),
    operationsBtns: document.querySelectorAll('.operation'),
    equalBtn: document.querySelector('.submit'),
    memoryAdd: document.querySelector('#M-add'),
    memoryResult: document.querySelector('#MR'),
    memoryClear: document.querySelector('#MC')
};

const operationsArray = [];
const operationsResults = [];
let memory = [];

/*************************/
class Memory {
    constructor(result) {
        this.result = result;
        this.allResult = 0;
    }

    calculateAllResults() {
        memory.forEach(cur => {
            this.allResult += cur.result;
        });
    }

}
class Operation {
    constructor(operation) {
        this.operation = operation;
        this.floated = [];
        this.result = null;
    }

    addToArray() {
        operationsArray.push(this.operation);
    }

    parseFloat() {
        const operations = [];
        elements.operationsBtns.forEach(cur => {
            operations.push(cur.textContent);
        });
        operations.forEach(cur => {
            if (this.operation.startsWith(cur)) {
                if (cur !== '-' && cur !== '√') {
                    alert('You have to start with number!');
                    operationsArray.shift();
                    this.operation = '';
                }
            }
        });

        this.operation = this.operation.split('');

        this.operation.forEach((cur, index) => {
            const newType = parseFloat(cur);
            if (!isNaN(newType)) this.floated.push(newType);
            else this.floated.push(cur);
        });

        const loop = () => {
            this.floated.forEach((cur, index) => {
                if (!isNaN(cur)) {
                    if (!isNaN(this.floated[index + 1])) {
                        this.floated[index] = cur * 10 + this.floated[index + 1];
                        this.floated.splice(index + 1, 1)
                        return loop();
                    }
                }
            });
        }

        const dot = () => {
            this.floated.forEach((cur, index) => {
                if (this.floated[index + 1] === '.') {
                    const howManyZero = this.floated[index + 2].toString().length;
                    this.floated[index] += this.floated[index + 2] / 10 ** howManyZero;
                    this.floated.splice(index + 1, 1);
                    this.floated.splice(index + 1, 1);
                    return dot();
                }
            });
        }
        loop();
        dot();
    }

    checkIfOk() {
        if (this.floated[0] === '-') {
            this.floated.unshift(0);
        }
        if (this.floated.length === 1) {
            this.result = this.floated[0];
        }
        this.floated.forEach((cur, index) => {
            if (isNaN(cur) && isNaN(this.floated[index + 1])) {
                alert('You can not have 2 or more special charts abreast')
                operationsArray.shift();
                this.operation = '';
                this.floated = '';
            }
        });
    }

    calculator() {
        this.floated.forEach((cur, index) => {
            if (isNaN(cur)) {
                if (cur === '^') {
                    const result = Math.pow(this.floated[index - 1], this.floated[index + 1]);
                    this.floated[index] = result;
                    this.floated.splice(index - 1, 1);
                    this.floated.splice(index, 1);
                    this.result = result;

                    this.calculator();
                } else if (cur === '√') {
                    const result = Math.sqrt(this.floated[index + 1]);
                    this.floated[index] = result;
                    this.floated.splice(index + 1, 1);
                    this.result = result;
                    this.calculator();
                }

            }
        });
    }

    calculator2() {
        this.floated.forEach((cur, index) => {
            if (isNaN(cur)) {
                if (cur === '*') {
                    const result = this.floated[index - 1] * this.floated[index + 1]
                    this.floated[index] = result;
                    this.floated.splice(index - 1, 1);
                    this.floated.splice(index, 1);
                    this.result = result;
                    this.calculator2();
                } else if (cur === '/') {
                    const result = this.floated[index - 1] / this.floated[index + 1];
                    this.floated[index] = result;
                    this.floated.splice(index - 1, 1);
                    this.floated.splice(index, 1);
                    this.result = result;
                    this.calculator2();
                }

            }
        });
    }

    calculator3() {
        this.floated.forEach((cur, index) => {
            if (isNaN(cur)) {
                if (cur === '+') {
                    const result = this.floated[index - 1] + this.floated[index + 1];
                    this.floated[index] = result;
                    this.floated.splice(index - 1, 1);
                    this.floated.splice(index, 1);
                    this.result = result;
                    this.calculator3();
                } else if (cur === '-') {
                    const result = this.floated[index - 1] - this.floated[index + 1];
                    this.floated[index] = result;
                    this.floated.splice(index - 1, 1);
                    this.floated.splice(index, 1);
                    this.result = result;
                    this.calculator3();
                }
            }
        });
    }
}

const calculation = () => {
    const obj = new Operation(elements.input.textContent);
    obj.addToArray();
    clearInput();
    obj.parseFloat();
    obj.checkIfOk();
    obj.calculator();
    obj.calculator2();
    obj.calculator3();
    return obj.result;
};

const clearInput = () => {
    elements.input.textContent = '';
};

const displayOperations = () => {
    operationsArray.forEach((cur, index) => {
        const html = `<li><output class="operations">${cur}</output>=<output class="result">${operationsResults[index]}</output></li>`
        document.querySelector('.last-operations-ul').insertAdjacentHTML('beforeend', html);
        operationsArray.shift();
        operationsResults.shift();
    });

}
// GLOBAL CTRL

// 1. Add events on 0 - 9 btns and kaydown and operation btns
elements.numbersBtns.forEach(cur => {
    cur.addEventListener('click', () => {
        elements.input.textContent += cur.textContent;
    });

    document.querySelector('body').addEventListener('keydown', (key) => {
        if (key.key === cur.textContent) elements.input.textContent += key.key;
        else if (key.key === 'Backspace') clearInput();
    });
    //cur.textContent
});

// 2. Remove btn
elements.removeBtn.addEventListener('click', clearInput);

// 3. Equal btn

elements.equalBtn.addEventListener('click', e => {

    e.preventDefault();
    const result = calculation();
    operationsResults.push(result);
    elements.input.textContent = result;
    displayOperations();
});

// 4.memoryBtns

elements.memoryAdd.addEventListener('click', () => {
    const result = calculation();
    const obj = new Memory(result)
    memory.push(obj);
    obj.calculateAllResults();
    if (memory.length > 1) {
        memory.shift();
    }
});

elements.memoryClear.addEventListener('click', () => {
    memory = [];
});

elements.memoryResult.addEventListener('click', () => {
    if (memory.length !== 0) {
        const result = calculation();
        const resultWithMemory = memory[0].allResult + result;
        elements.input.textContent = resultWithMemory;
    } else if (memory.length === 0) alert('Memory is empty')


});






