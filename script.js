

const counterCointainer = document.getElementById('counterContainer');  
let counter = document.getElementById('counter');
const playBtn = document.getElementById('play');
const startMenuContainer = document.querySelector('.start-menu-container');
const startMenu = document.querySelector('.start-menu');
const body = document.querySelector('body');
let questions = [];
const optionsLetters = ['a) ', 'b) ', 'c) ', 'd) '];
const wrongColor = '#ee4b4b';
const rightColor = '#10A37F';
let remainingQuestions = 10;

getQuestions();

async function getQuestions() {
    await fetch('./questions.json')
        .then(response => response.json())
        .then(response => questions = response);
}


playBtn.addEventListener('click', () => {
    counterCointainer.style.transform = 'translateY(0)';
    const questionContainer = createQuestionCard();
    // questionContainer.style.display = 'flex';
    const questionCard = questionContainer.querySelector('.question-card');
    activeTransition(startMenuContainer, startMenu, questionContainer, questionCard);
});

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

    body.appendChild(newQuestion);
    remainingQuestions--;
    currentQuestion = newQuestion;
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
            if (className === 'right-answer-animation') confetti();
            paintAllButtonsExcept(button, optionsButtons, rightAnswer);
            setTimeout(() => {
                transitionToNextCard(currentQuestion);
            }, 1000);
        });
    });
}

function transitionToNextCard(currentQuestion){
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
            counterCointainer.classList.add('change-counter');
        }, 500);
        counterCointainer.classList.remove('change-counter');
    }else{
        counterCointainer.style.transform = 'translateY(-20vh)';
    }
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



