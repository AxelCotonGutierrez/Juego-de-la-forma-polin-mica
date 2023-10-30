// Axel Cotón Gutiérrez Copyright 2023

// Variables globales para el número máximo de ceros y representación de potencias de 10
let maxZeros = 3;
let naturalRepresentation = true; // Variable para representación de potencias de 10 como números naturales
let currentQuestion = null;

// Función para generar una pregunta de descomposición polinómica
function generatePolynomialQuestion() {
    // Genera un número aleatorio entre 1 y 10^maxZeros
    const maxNumber = Math.pow(10, maxZeros +1) - 1;
    const number = Math.floor(Math.random() * maxNumber) + 1;

    // Construye la pregunta completa
    const question = `Descompón el número ${formatNumberWithSpaces(number)} en su forma polinómica:`;

    // Crea un objeto pregunta y respuesta
    const answer = number.toString().split("").map(Number);
    return { question, answer };
}

// Función para dar formato al número con espacios de mil
function formatNumberWithSpaces(number) {
    // Convierte el número a una cadena
    const numberStr = number.toString();

    // Si el número tiene cuatro cifras, no separamos con espacios
    if (numberStr.length === 4) {
        return numberStr;
    }

    // Divide la cadena en grupos de tres cifras desde el final
    const groups = [];
    let i = numberStr.length;
    while (i > 0) {
        groups.push(numberStr.slice(Math.max(0, i - 3), i));
        i -= 3;
    }

    // Une los grupos con espacios y devuelve el resultado
    return groups.reverse().join(' ');
}

// Función para mostrar una nueva pregunta
function displayQuestion() {
    currentQuestion = generatePolynomialQuestion();
    questionText.innerHTML = currentQuestion.question;
    result.textContent = "";
    checkAnswerButton.disabled = false;
    nextQuestionButton.style.display = "none";

    // Crear inputs para las cifras significativas
    userAnswerContainer.innerHTML = "";
    for (let i = 0; i < currentQuestion.answer.length; i++) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.required = true;
        input.classList.add("input-digit");
        userAnswerContainer.appendChild(input);
        if (i < currentQuestion.answer.length - 1) {
            if (!naturalRepresentation) {
                userAnswerContainer.appendChild(document.createTextNode(" × 10"));
                const exponent = currentQuestion.answer.length - 1 - i;
                
                if (exponent !== 1) {
                    userAnswerContainer.appendChild(document.createElement("sup")).textContent = exponent;
                }
                
                userAnswerContainer.appendChild(document.createTextNode(" + "));
            } else {
                const exponent = currentQuestion.answer.length - 1 - i; // Calcula el exponente
            
                let exponentStr;
                if (exponent === 0) {
                    exponentStr = "";
                } else if (exponent === 1) {
                    exponentStr = "10";
                } else {
                    exponentStr = formatNumberWithSpaces(Math.pow(10, exponent)); // Formatea el exponente con espacios de mil
                }
            
                userAnswerContainer.appendChild(document.createTextNode(` × ${exponentStr}`));
                userAnswerContainer.appendChild(document.createTextNode(" + "));
            
                
            }
        }
    }
}

// Función para mostrar la siguiente pregunta
function nextQuestion() {
    displayQuestion();
}

// Función para comprobar la respuesta del usuario
function checkAnswer() {
    const userResponse = Array.from(userAnswerContainer.querySelectorAll("input")).map(input => parseInt(input.value));
    const correctAnswer = currentQuestion.answer;

    const formattedCorrectAnswer = formatCorrectAnswer(correctAnswer, naturalRepresentation);

    if (arraysAreEqual(userResponse, correctAnswer)) {
        result.textContent = "¡Respuesta Correcta!";
        result.style.color = "green";
    } else {
        result.innerHTML = "Respuesta Incorrecta. La respuesta correcta es " + formattedCorrectAnswer;
        result.style.color = "red";
    }

    checkAnswerButton.disabled = true;
    nextQuestionButton.style.display = "block";
}

// Función para formatear la respuesta correcta como se muestra en la pregunta
function formatCorrectAnswer(correctAnswer, naturalRepresentation) {
    const formattedAnswer = [];
    for (let i = 0; i < correctAnswer.length; i++) {
        const digit = correctAnswer[i];
        if (!naturalRepresentation) {
            formattedAnswer.push(`${digit}`);
            const exponent = currentQuestion.answer.length - 1 - i;
            if (exponent > 1) {
              formattedAnswer.push(` × 10<sup>${exponent}</sup>`);
            } else if (exponent === 1) {
              formattedAnswer.push(" × 10");
            }
        } else {
            const multiplier = Math.pow(10, currentQuestion.answer.length - 1 - i);
            const formattedMultiplier = formatNumberWithSpaces(multiplier);
            formattedAnswer.push(`${digit} × ${formattedMultiplier}`);
        }
        
        if (i < correctAnswer.length - 1) {
            formattedAnswer.push(" + ");
        }
    }
    return formattedAnswer.join("");
}


// Escucha el evento de cambio en los radios de selección de ceros
const radioButtons = document.getElementsByName("maxZeros");
for (const radioButton of radioButtons) {
    radioButton.addEventListener("change", function () {
        maxZeros = parseInt(this.value);
        displayQuestion();
        checkAnswerButton.disabled = false; // Habilitar el botón "Comprobar" después de cambiar las unidades
    });
}

// Escucha el evento de cambio en la representación de potencias de 10
const powerRepresentationRadioButtons = document.getElementsByName("powerRepresentation");
for (const radioButton of powerRepresentationRadioButtons) {
    radioButton.addEventListener("change", function () {
        naturalRepresentation = this.value === "natural";
        displayQuestion();
    });
}

// Elementos HTML
const questionText = document.getElementById("question-text");
const checkAnswerButton = document.getElementById("check-answer");
const result = document.getElementById("result");
const nextQuestionButton = document.getElementById("next-question");
const userAnswerContainer = document.getElementById("user-answer-container");

// Mostrar la primera pregunta
displayQuestion();

// Eventos de los botones
checkAnswerButton.addEventListener("click", checkAnswer);
nextQuestionButton.addEventListener("click", nextQuestion);

// Función para comparar dos arreglos
function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
