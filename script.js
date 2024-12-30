

const counterContainer = document.getElementById('counterContainer');
let counter = document.getElementById('counter');
const loadingBarContainer = document.getElementById('loadingBarContainer');
const loadingBar = document.getElementById('loadingBar');
const playBtn = document.getElementById('play');
const startMenuContainer = document.querySelector('.start-menu-container');
const startMenu = document.querySelector('.start-menu');
const body = document.querySelector('body');
const conicGraphic = document.querySelector('.conic-graphic');
const againBtn = document.getElementById('againBtn');
const assertedQuestionsLabel = document.getElementById('assertedQuestions');
const finalPhrase = document.querySelector('.final-phrase');
const finalScreenWrapper = document.querySelector('.final-screen-wrapper');
let questions = [];
const optionsLetters = ['a) ', 'b) ', 'c) ', 'd) '];
const wrongColor = '#ee4b4b';
const rightColor = '#10A37F';
let remainingQuestions = 10;
let currentCard = null;
let currentDimensions = null;
let intervalID = null;
let time = 10;
let assertedQuestions = 7;

getQuestions();

async function getQuestions() {
    await fetch('./questions.json')
        .then(response => response.json())
        .then(response => questions = response);
}


playBtn.addEventListener('click', () => {
    setCounterAndLoadingBar();
    const questionContainer = createQuestionCard();
    // questionContainer.style.display = 'flex';
    const questionCard = questionContainer.querySelector('.question-card');
    activeTransition(startMenuContainer, startMenu, questionContainer, questionCard);
});

function setCounterAndLoadingBar() {
    counterContainer.style.transform = 'translateY(0)';
    loadingBarContainer.style.transform = 'translateY(0)';
    setTimeout(() => {
        activeCountDown();
        loadingBar.classList.add('active-loading-bar');
    }, 3000);
}

function activeCountDown() {
    intervalID = setInterval(() => {
        if (time <= 1) {
            clearInterval(intervalID);
            setInterrogationMarks(currentCard.querySelector('.question-card'), currentDimensions);
            setTimeout(() => {
                console.log('preguntas restantes: ', remainingQuestions);
                transitionToNextCard(currentCard);
                restartLoadingBar();
                if (remainingQuestions >= 0) {
                    time = 10;
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
    }, 3000);
}

function createQuestionCard() {
    // const question = questions.splice(Math.floor(Math.random() * questions.length), 1)[0];
    const question = questions[1];
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
    for (let i = 0; i < question.options.length; i++) {
        newButton = document.createElement('button');
        newButton.className = 'question-option';
        span = document.createElement('span');
        span.innerText = question.options[i];
        newButton.innerHTML = `
            ${optionsLetters[i]}
        `;
        newButton.appendChild(span);
        // console.log(span.innerText);
        optionsContainer.appendChild(newButton);
    }
}

function checkAnswer(optionsButtons, rightAnswer, currentQuestion) {
    optionsButtons.forEach(button => {
        button.addEventListener('click', () => {
            let className = button.querySelector('span').innerText === rightAnswer ?
                'right-answer-animation' :
                'wrong-answer-animation';
            button.classList.add(className);
            if (className === 'right-answer-animation') {
                confetti();
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
            time = 10;
            setTimeout(() => {
                activeCountDown();
            }, 3000);

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
        hideLoadingBar();
    }
}

function hideLoadingBar() {
    counterContainer.style.transform = 'translateY(-20vh)';
    loadingBarContainer.style.transform = 'translateY(-25vh)';
}

function paintAllButtonsExcept(targetButton, buttons, rightAnswer) {
    buttons.forEach(button => {
        if (button != targetButton) {
            button.style.backgroundColor = button.querySelector('span').innerText === rightAnswer ?
                rightColor : wrongColor;
            button.style.border = 'solid 3px #000'
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

againBtn.addEventListener('click', () => {
    let progressEnd = 360 * (assertedQuestions / 10);
    let currentProgress = 0;
    let aux = 360 / 10;// 360 entre el numero de preguntas
    let i = 1;
    let fontSize = 43;
    let progress = setInterval(() => {
        conicGraphic.style.background = `
        conic-gradient(
            #FF33A1 0deg ${currentProgress}deg,
            transparent ${currentProgress}deg 360deg
        )`;
        currentProgress += 1;
        if(currentProgress >= aux){
            assertedQuestionsLabel.innerText = `${i}`;
            assertedQuestionsLabel.style.fontSize = `${fontSize}px`;
            fontSize += 4;
            i++;
            aux += 360 / 10;//360 entre el numero de preguntas
        }
        if(currentProgress >= progressEnd + 2){// +2 para que se vea completo, hay margen de error
            clearInterval(progress);
            assertedQuestionsLabel.style.fontSize = '40px';
            setTimeout(() => {
                conicGraphic.style.transform = 'translateY(0)';
                finalPhrase.style.display = 'block';
                setTimeout(() => {
                    finalPhrase.style.opacity = '1';
                    finalPhrase.style.scale = '1';
                }, 100);
            }, 500);
            // finalScreenWrapper.style.display = 'none';
        }
    }, 5);
});



