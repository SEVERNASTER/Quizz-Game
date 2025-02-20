

const counterContainer = document.getElementById('counterContainer');
let counter = document.getElementById('counter');
let totalQuestionsLabel = document.getElementById('gameTotalQuestions');
const loadingBarContainer = document.getElementById('loadingBarContainer');
const loadingBar = document.getElementById('loadingBar');
const playBtn = document.getElementById('play');
const categoryBtn = document.getElementById('category');
const difficultyBtn = document.getElementById('difficulty');
const startMenuContainer = document.querySelector('.start-menu-container');
const startMenu = document.querySelector('.start-menu');
const smFlipContainer = document.querySelector('.start-menu-flip-container');
const catOptionItems = document.querySelectorAll('.category-item');
const diffButtons = document.querySelectorAll('.diff-button');
const body = document.querySelector('body');
const fsTitle = document.querySelector('.fs-title-container');
const conicGraphic = document.querySelector('.conic-graphic');
const fsAssertedQuestions = document.getElementById('fsAssertedQuestions');
const fsTotalQuestions = document.getElementById('fsTotalQuestions');
const finalPhrase = document.querySelector('.final-phrase');
const finalPhraseParagraph = document.getElementById('finalPhrase');
const finalScreenWrapper = document.querySelector('.final-screen-wrapper');
const finalScreen = document.querySelector('.final-screen');
const fsAnimationContainer = document.querySelector('.fs-animation-container');
const fsButtons = document.querySelectorAll('.fs-button');
const againBtn = document.getElementById('againBtn');
const fsMenuBtn = document.getElementById('fsMenuBtn');
let questions = [];
let categoryName = 'Cultura General';
let currentLevel = 'Facil';
const optionsLetters = ['a) ', 'b) ', 'c) ', 'd) '];
const wrongColor = '#ee4b4b';
const rightColor = '#10A37F';
let currentCard = null;
let currentDimensions = null;
let intervalID = null;
let questionTime = 10;
let time = questionTime;// en segundos
const totalQuestions = 10;
let remainingQuestions = totalQuestions;
let assertedQuestions = 0;

getQuestions();

async function getQuestions() {
    let jsonFileName = '';
    let level = '';
    switch (categoryName) {
        case 'Cultura General':
            jsonFileName = 'general';
            break;
        case 'Fisica':
            jsonFileName = 'physics';
            break;
        case 'Geografia':
            jsonFileName = 'geography';
            break;
        case 'Reino Animal':
            jsonFileName = 'animals';
            break;
        case 'Programacion':
            jsonFileName = 'programming';
            break;
        case 'Mitologia Griega':
            jsonFileName = 'greek';
            break;
        case 'Cuerpo Humano':
            jsonFileName = 'humanBody';
            break;
        case 'Quimica':
            jsonFileName = 'chemical';
            break;
        case 'Razonamiento':
            jsonFileName = 'thinking';
            break;
        default:
            console.log(`The category ${jsonFileName} doesn't exist`);
            break;
    }

    switch (currentLevel) {
        case 'Facil':
            level = 'easy';
            questionTime = 10;
            break;
        case 'Normal':
            level = 'medium';
            questionTime = 8;
            break;
        case 'Dificil':
            level = 'hard';
            questionTime = 6;
            break;
        default:
            console.log(`The level ${level} doesn't exist`);
            break;
    }

    time = questionTime;
    document.documentElement.style.setProperty('--question-time', `${questionTime}s`);
    console.log(time);

    console.log(level + " " + jsonFileName);

    await fetch(`./questions/${level}/${jsonFileName}.json`)
        .then(response => response.json())
        .then(response => questions = response);
}

playBtn.addEventListener('click', () => {

    showInvisibleStartMenuMask();
    setCounterAndLoadingBar();
    restartLoadingBar();
    const questionContainer = createQuestionCard();
    const questionCard = questionContainer.querySelector('.question-card');
    activeTransition(startMenuContainer, startMenu, questionContainer, questionCard);
    setTimeout(() => {
        activeCountDown();
        hideInvisibleStartMenuMask();
    }, 3000);
});

function showInvisibleStartMenuMask() {
    startMenu.classList.add('show-invisible-mask');
}

function hideInvisibleStartMenuMask() {
    startMenu.classList.remove('show-invisible-mask');
}


function setCounterAndLoadingBar() {
    counterContainer.style.transform = 'translateY(0)';
    loadingBarContainer.style.transform = 'translateY(0)';
    totalQuestionsLabel.innerText = `${totalQuestions}`;
    // setTimeout(() => {
    //     loadingBar.classList.add('active-loading-bar');
    // }, 3000);
}

// ERROR BUG FIX IT
function activeCountDown() {
    intervalID = setInterval(() => {
        if (time < 1) {
            clearInterval(intervalID);

            setInterrogationMarks(currentCard.querySelector('.question-card'), currentDimensions);
            setTimeout(() => {
                console.log('preguntas restantes: ', remainingQuestions);
                transitionToNextCard(currentCard);
                restartLoadingBar();
                if (remainingQuestions > 0) {
                    console.log(time);

                    time = questionTime;
                    console.log(time);

                    setTimeout(() => {
                        activeCountDown();
                    }, 3000);
                }
            }, 2000);
        } else {
            time--;
        }
    }, 1000);
}

function activeTransition(outtingElementContainer, outtingElement, incomingElementContainer, incomingElement) {
    incomingElementContainer.style.display = 'flex';
    outtingElementContainer.style.transition = '3s';
    outtingElement.style.transition = '2s';
    setTimeout(() => {
        incomingElementContainer.style.transform = 'translateX(0)';
        incomingElement.style.scale = '1';
    }, 100);

    outtingElement.style.scale = '.3';
    outtingElementContainer.style.position = 'absolute';
    outtingElementContainer.style.transform = 'translateX(-100vw)';

    setTimeout(() => {
        outtingElementContainer.style.display = 'none';
        outtingElementContainer.style.transform = 'translateX(0)';
        outtingElement.style.scale = '1';
        outtingElementContainer.style.position = 'static';
    }, 3000);
}

function createQuestionCard() {
    const question = questions.splice(Math.floor(Math.random() * questions.length), 1)[0];
    // const question = questions[0];
    let newQuestion = document.createElement('div');
    newQuestion.className = 'question-container';
    newQuestion.innerHTML = `
        <div class="question-card">
            <div class="question-card-title">
                <h2>${question.question}</h2>
            </div>
            <div class="question-options-wrapper">
                <div class="question-options-container">
                    <!-- Aqui van las opciones -->
                </div>
            </div>
        </div>
    `;


    addOptionsToCard(newQuestion.querySelector('.question-options-container'), question);
    checkAnswer(newQuestion.querySelector('.question-options-container')
        .querySelectorAll('.question-option'),
        question.answer,
        newQuestion
    );

    setTimeout(() => {
        currentCard = newQuestion;
        currentDimensions = currentCard.querySelector('.question-card').getBoundingClientRect()
    }, 1000);

    body.appendChild(newQuestion);
    remainingQuestions--;
    return newQuestion;
}

function addOptionsToCard(optionsContainer, question) {
    let newButton;
    let span;
    const randomPos = generateShuffledArray();
    for (let i = 0; i < question.options.length; i++) {
        newButton = document.createElement('button');
        newButton.className = 'question-option';
        span = document.createElement('span');
        span.innerText = question.options[randomPos[i]];
        newButton.innerHTML = `
            ${optionsLetters[i]}
        `;
        newButton.appendChild(span);
        // console.log(span.innerText);
        optionsContainer.appendChild(newButton);
    }
}

function generateShuffledArray() {
    let numbers = [0, 1, 2, 3];

    // Algoritmo de Fisher-Yates para mezclar el arreglo
    for (let i = numbers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers;
}

// le tenemos que pasar el id, hasta este momento ningun contenedor tiene ese id
particlesJS("start-menu", {
    particles: {
        number: { value: 100 }, // Cantidad de partículas
        size: { value: 4 }, // Tamaño de las partículas
        move: { speed: 3 }, // Velocidad de movimiento
        color: { value: "#fff" }, // Color de las partículas
        line_linked: {
            enable: true, // Activa las líneas
            distance: 150, // Distancia máxima para conectar partículas
            color: "#ffffff", // Color de las líneas
            opacity: 0.8, // Opacidad de las líneas
            width: 2 // Aumenta el grosor de las líneas
        }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: "grab" } } // Efecto al pasar el mouse
    }
});



function checkAnswer(optionsButtons, rightAnswer, currentQuestion) {
    optionsButtons.forEach(button => {
        button.addEventListener('click', () => {
            let className = button.querySelector('span').innerText === rightAnswer ?
                'right-answer-animation' :
                'wrong-answer-animation';
            button.classList.add(className);
            if (className === 'right-answer-animation') {
                confetti({
                    particleCount: 150,
                    spread: 70
                });
                assertedQuestions++;
            }
            paintAllButtonsExcept(button, optionsButtons, rightAnswer);
            setTimeout(() => {
                transitionToNextCard(currentQuestion);
            }, 1000);

            currentQuestion.querySelector('.question-card').classList.add('unable-question-insivible');

            // setTimeout(() => {
            //     time = 1;
            //     activeCountDown();
            // }, 3000);

            clearInterval(intervalID);
            time = questionTime;
            if (remainingQuestions > 0) {
                setTimeout(() => {
                    activeCountDown();
                }, 3000);
            }

            restartLoadingBar();
        });
    });
}

function restartLoadingBar() {//para restaurar la carga de la barra
    loadingBar.classList.remove('active-loading-bar');
    loadingBar.classList.add('reaload-loading-bar');
    setTimeout(() => {
        loadingBar.classList.add('active-loading-bar');
        loadingBar.classList.remove('reaload-loading-bar');
    }, 3500);
}

function transitionToNextCard(currentQuestion) {//crea la siguiente carta de pregunta automaticamente
    if (remainingQuestions > 0) {
        const currentQuestionCard = currentQuestion.querySelector('.question-card');
        const newQuestion = createQuestionCard();
        const newQuestionCard = newQuestion.querySelector('.question-card');

        activeTransition(currentQuestion,
            currentQuestionCard,
            newQuestion,
            newQuestionCard
        );
        setTimeout(() => {
            counter.innerText = parseInt(counter.innerText) + 1;
            counterContainer.classList.add('change-counter');
        }, 500);
        counterContainer.classList.remove('change-counter');
    } else {
        clearInterval(intervalID);
        finalPhrase.textContent = '';
        finalPhrase.style.opacity = '0';
        generateFinalPhrase();
        hideLoadingBar();
        showFinalScreen();
    }
}

function hideLoadingBar() {
    counterContainer.style.transform = 'translateY(-20vh)';
    loadingBarContainer.style.transform = 'translateY(-25vh)';
    // loadingBar.classList.remove('active-loading-bar');
    // loadingBar.classList.add('reaload-loading-bar');
    // setTimeout(() => {
    // }, 1000);
}

function paintAllButtonsExcept(targetButton, buttons, rightAnswer) {
    buttons.forEach(button => {
        if (button != targetButton) {
            button.style.opacity = button.querySelector('span').innerText === rightAnswer ?
                '1' : '.5';
            button.style.border = button.querySelector('span').innerText === rightAnswer ?
                'solid 3px #fff' : 'dashed 3px #fff';
            button.style.background = button.querySelector('span').innerText === rightAnswer ?
                rightColor : 'linear-gradient(45deg, #B91A73, #F6400F)';
            button.style.scale = button.querySelector('span').innerText === rightAnswer ?
                '1' : '.8';
        }
    });
}
function setInterrogationMarks(card, dimensions) {

    let svg = '';
    // const dimensions = card.getBoundingClientRect();

    let horizontalItems = 3;
    let verticalItems = 2;
    let posX = dimensions.width / (horizontalItems * 3);
    let posY = dimensions.height / (verticalItems * 5);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            svg = createInterrogationSVG();
            randomPosition(svg);
            svg.style.transition = '1s';
            svg.style.transform = 'rotate(0deg)';
            svg.style.scale = '0';
            card.appendChild(svg);
            setSVGPosition(svg, posX, posY);
            posX += dimensions.width / horizontalItems;
        }
        posX = dimensions.width / (horizontalItems * 3);
        posY += dimensions.height / verticalItems;
    }
    activeTransitionSVG(card);
    currentCard.querySelector('.question-card').classList.add('unable-question');
}

function activeTransitionSVG(card) {
    const svgList = card.querySelectorAll('.interrogation-mark');
    setTimeout(() => {
        svgList.forEach(svg => {
            svg.style.transform = `rotate(${randomDegree()}deg)`;
            svg.style.scale = `${randomScale()}`;
        });
    }, 50);
}

function setSVGPosition(svg, posX, posY) {
    svg.style.position = 'absolute';
    svg.style.left = posX;
    svg.style.top = posY;

}

function randomPosition(svg) {
    const currentTop = parseInt(svg.style.top) || 0;
    const currentLeft = parseInt(svg.style.left) || 0;

    switch (Math.floor(Math.random() * 4) + 1) {
        case 1: // top
            svg.style.top = `${currentTop - 20}px`;
            break;
        case 2: // bottom
            svg.style.top = `${currentTop + 20}px`;
            break;
        case 3: // left
            svg.style.left = `${currentLeft - 20}px`;
            break;
        case 4: // right
            svg.style.left = `${currentLeft + 20}px`;
            break;
    }
}

function randomDegree() {//entre -35 y 35 grados
    return Math.round(Math.random() * (35 - (-35))) - 35;
}

function randomScale() {
    return (Math.random() * 0.6) + 0.6;
}


function createInterrogationSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "interrogation-mark");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "128");
    svg.setAttribute("height", "128");
    svg.setAttribute("viewBox", "0 0 24 24");

    // Crear el elemento <path>
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "#ffffff");
    path.setAttribute("d", "M14.6 8.075q0-1.075-.712-1.725T12 5.7q-.725 0-1.312.313t-1.013.912q-.4.575-1.088.663T7.4 7.225q-.35-.325-.387-.8t.237-.9q.8-1.2 2.038-1.862T12 3q2.425 0 3.938 1.375t1.512 3.6q0 1.125-.475 2.025t-1.75 2.125q-.925.875-1.25 1.363T13.55 14.6q-.1.6-.513 1t-.987.4t-.987-.387t-.413-.963q0-.975.425-1.787T12.5 11.15q1.275-1.125 1.688-1.737t.412-1.338M12 22q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22");

    // Añadir el <path> dentro del <svg>
    svg.appendChild(path);
    return svg;
}

// final screen code

function showFinalScreen() {
    let timeout = 800;
    if (assertedQuestions < 3) {
        timeout = 1500;
    } else if (assertedQuestions < 5) {
        timeout = 1000;
    }

    fsTotalQuestions.innerText = `${totalQuestions}`;
    fsAssertedQuestions.innerText = '0';
    finalScreenWrapper.style.transform = 'translateY(0)';
    setTimeout(() => {
        fsAnimationContainer.style.scale = '1';
        fsAnimationContainer.style.opacity = '1';
        setTimeout(() => {
            let progressEnd = 360 * (assertedQuestions / totalQuestions);
            let currentProgress = 0;
            let aux = 360 / totalQuestions;// 360 entre el numero de preguntas
            let i = 1;
            let fontSize = 43;
            let progress = setInterval(() => {
                conicGraphic.style.background = `
                    conic-gradient(
                        #FF33A1 0deg ${currentProgress}deg,
                        transparent ${currentProgress}deg 360deg
                    )`;
                currentProgress += 1;
                if (currentProgress >= aux) {
                    fsAssertedQuestions.innerText = `${i}`;
                    fsAssertedQuestions.style.fontSize = `${fontSize}px`;
                    fontSize += 4;
                    i++;
                    aux += 360 / totalQuestions;//360 entre el numero de preguntas
                }
                if (currentProgress >= progressEnd + 2) {// +2 para que se vea completo, hay margen de error
                    clearInterval(progress);
                    fsAssertedQuestions.style.fontSize = '40px';
                    setTimeout(() => {
                        fsTitle.style.transform = 'translateY(0)';
                        conicGraphic.style.transform = 'translateY(0)';
                        finalPhrase.style.display = 'block';
                        setTimeout(() => {
                            finalPhrase.style.opacity = '1';
                            finalPhrase.style.scale = '1';
                            setTimeout(() => {
                                finalScreen.classList.add('active-final-screen-animation');
                                animateFSButtons();
                            }, 1000);
                        }, 100);
                    }, 500);
                    // finalScreenWrapper.style.display = 'none';
                }
            }, 5);
        }, 700);
    }, timeout);
}

function animateFSButtons() {
    fsButtons.forEach(button => {
        button.classList.add('active-fs-button-animation');
        setTimeout(() => {
            button.style.scale = '1';
        }, 1000);
    });
}


//add event to the category options

categoryBtn.addEventListener('click', async function () {
    smFlipContainer.classList.add('flip-categories');
});

catOptionItems.forEach(item => {
    item.addEventListener('click', () => {
        smFlipContainer.classList.remove('flip-categories');
        categoryName = item.querySelector('h3').textContent;
        getQuestions();
    })
});

difficultyBtn.addEventListener('click', () => {
    smFlipContainer.classList.add('flip-diff');
})

// add event to the difficulty buttons

diffButtons.forEach(button => {
    button.addEventListener('click', () => {
        smFlipContainer.classList.remove('flip-diff');
        currentLevel = button.textContent;
        getQuestions();
    })
});


// Again button code

againBtn.addEventListener('click', () => {
    const lasCardQuestion = currentCard;
    restartGameVariables();
    setTimeout(() => {//para dar tiempo a que se hagan los cambios en las variables
        finalScreenWrapper.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            setCounterAndLoadingBar();
            restartLoadingBar();
            const questionContainer = createQuestionCard();
            const questionCard = questionContainer.querySelector('.question-card');
            activeTransition(lasCardQuestion, lasCardQuestion.querySelector('.question-card'), questionContainer, questionCard);
            setTimeout(() => {
                restartFinalScreen();
                activeCountDown();
            }, 3000);
        }, 500);
    }, 100);
});

// async function generateFinalPhrase() {
//     try {
//         const response = await fetch(`/generar-frase?assertedQuestions=${assertedQuestions}&totalQuestions=${totalQuestions}`);
//         const generatedPhrase = await response.text();
//         finalPhrase.textContent = generatedPhrase;
//     } catch (error) {
//         console.error('Error al obtener la frase:', error);
//     }
// }

async function generateFinalPhrase() {
    try {
        const response = await fetch(`/api/generate-phrase?assertedQuestions=${assertedQuestions}&totalQuestions=${totalQuestions}&category=${categoryName}&level=${currentLevel}`);
        const generatedPhrase = await response.text();
        finalPhrase.textContent = generatedPhrase;
        console.log(generatedPhrase);
    } catch (error) {
        console.error('Error al obtener la frase:', error);
    }
}


// Final Screen buttons code

fsMenuBtn.addEventListener('click', () => {
    restartFinalScreen();
    currentCard.style.display = 'none';
    startMenuContainer.style.display = 'flex';
    restartGameVariables();
});

function restartFinalScreen() {
    finalScreenWrapper.style.transform = 'translateY(-100%)';
    setTimeout(() => {
        finalScreenWrapper.style.transition = 'none';
        finalScreenWrapper.style.transform = 'translateY(100%)';
        fsAnimationContainer.style.opacity = '0';
        fsAnimationContainer.style.scale = '.5';
        fsAssertedQuestions.innerText = '0';
        conicGraphic.style.background = `
                conic-gradient(
                    #FF33A1 0deg 0deg,
                    transparent 0deg 360deg)`;
        fsTitle.style.transform = 'translateY(80%)';
        conicGraphic.style.transform = 'translateY(30%)';
        setTimeout(() => {
            finalScreenWrapper.style.transition = '1s ease-in-out';
        }, 100);
    }, 1000);
}

function restartGameVariables() {
    remainingQuestions = totalQuestions;
    questionTime = 12;
    time = questionTime;
    currentCard = null;
    currentDimensions = null;
    intervalID = null;
    assertedQuestions = 0;
    counter.innerHTML = '1';
}







