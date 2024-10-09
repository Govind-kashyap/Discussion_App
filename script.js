let right = document.getElementById('right');
let submit = document.getElementById('submit');
let rightpanel = document.getElementById('rightpanel');
let newquestion = document.getElementById('new-question');
let idnumber = 1;

newquestion.addEventListener('click', () => {
    right.style.display = 'block';
    rightpanel.style.display = 'none';
});

var responsediv = document.createElement('div');
responsediv.classList.add('mainresponse');

// Load questions and responses on page load
window.onload = () => {
    renderQuestions();
    renderResponses();
};

function submitResponse() {
    var entername = document.getElementById('nam');
    var textcontent = document.getElementById('comment');
    let val = entername.value;
    let textval = textcontent.value;

    if (val.trim() === '' || textval.trim() === '') {
        alert("Enter the response");
    } else {
        const currentQuestionId = rightpanel.getAttribute('data-current-question-id');
        const responses = JSON.parse(localStorage.getItem('responses')) || {};

        if (!responses[currentQuestionId]) {
            responses[currentQuestionId] = [];
        }

        responses[currentQuestionId].push({
            name: val,
            comment: textval
        });

        localStorage.setItem('responses', JSON.stringify(responses));

        renderResponsesForQuestion(currentQuestionId);

        entername.value = '';
        textcontent.value = '';
    }
}

function showrightpanel(subjectText, questionText, questionId) {
    right.style.display = 'none';
    rightpanel.style.display = 'block';
    rightpanel.setAttribute('data-current-question-id', questionId);

    rightpanel.innerHTML = "<h1> Question </h1>";

    var questionText2 = document.createElement('div');
    questionText2.classList.add('quetext');

    var subjectText2 = document.createElement('h3');
    subjectText2.classList.add('subjectText');
    subjectText2.textContent = subjectText;

    var paraText2 = document.createElement('p');
    paraText2.classList.add('questionText');
    paraText2.textContent = questionText;

    questionText2.appendChild(subjectText2);
    questionText2.appendChild(paraText2);
    rightpanel.appendChild(questionText2);

    let responseForm = document.createElement('form');
    responseForm.innerHTML = `
        <button type="button" onclick="resbonfun()" class="resbtn1">Resolve</button>
        <p class="res">Add Your Response </p>
        <input type="text" class="inpbox" id="nam" name="name" placeholder="Enter Name"><br><br>
        <textarea id="comment" class="inpbox1" name="comment" rows="6" cols="50" placeholder="Enter Comment" ></textarea><br>
        <button type="button" onclick="submitResponse()" class="resbtn">Submit</button>
    `;

    rightpanel.appendChild(responseForm);

    renderResponsesForQuestion(questionId);
}

function addQuestionToLeftPanel(subjectText, questionText, questionId) {
    const left = document.getElementById('left');

    const question = document.createElement('div');
    question.classList.add('question');
    question.setAttribute("id", "idnumber-" + questionId);

    const subject = document.createElement('h3');
    subject.innerHTML = subjectText;

    const para = document.createElement('p');
    para.innerHTML = questionText;

    question.appendChild(subject);
    question.appendChild(para);
    left.appendChild(question);

    question.addEventListener('click', () => {
        showrightpanel(subjectText, questionText, questionId);
    });
}

function renderQuestions() {
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    questions.forEach((questionData, index) => {
        addQuestionToLeftPanel(questionData.subject, questionData.text, index);
    });
}

function renderResponses() {
    const responses = JSON.parse(localStorage.getItem('responses')) || {};
    const currentQuestionId = rightpanel.getAttribute('data-current-question-id');

    if (currentQuestionId !== null) {
        renderResponsesForQuestion(currentQuestionId);
    }
}

function renderResponsesForQuestion(questionId) {
    responsediv.innerHTML = '';
    const responses = JSON.parse(localStorage.getItem('responses')) || {};
    const responsesForQuestion = responses[questionId] || [];

    responsesForQuestion.forEach(response => {
        var newresponse = document.createElement('div');
        newresponse.classList.add('new-res');

        var resposetext = document.createElement('h3');
        resposetext.textContent = response.name;

        var resposecontent = document.createElement('p');
        resposecontent.textContent = response.comment;

        newresponse.appendChild(resposetext);
        newresponse.appendChild(resposecontent);
        responsediv.appendChild(newresponse);
    });

    rightpanel.appendChild(responsediv);
}

submit.addEventListener('click', () => {
    const inputbox = document.getElementById('input-box').value;
    const textquestion = document.getElementById('text-question').value;

    if (inputbox.trim() === '' || textquestion.trim() === '') {
        alert("Enter the Question");
    } else {
        const questions = JSON.parse(localStorage.getItem('questions')) || [];

        questions.push({
            subject: inputbox,
            text: textquestion
        });

        localStorage.setItem('questions', JSON.stringify(questions));

        addQuestionToLeftPanel(inputbox, textquestion, questions.length - 1);

        // Clear input
        document.getElementById('input-box').value = '';
        document.getElementById('text-question').value = '';
    }
});


function resbonfun() {

    const currentQuestionId = rightpanel.getAttribute('data-current-question-id');

    // Get the responses from localStorage
    const responses = JSON.parse(localStorage.getItem('responses')) || {};

    if (responses[currentQuestionId]) {
        delete responses[currentQuestionId];
    }

    // Save the updated responses back to localStorage
    localStorage.setItem('responses', JSON.stringify(responses));


    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    if (questions[currentQuestionId]) {
        questions.splice(currentQuestionId, 1);
        localStorage.setItem('questions', JSON.stringify(questions));
    }

    const questionElement = document.getElementById('idnumber-' + currentQuestionId);
    if (questionElement) {
        questionElement.remove();
    }

    rightpanel.style.display = 'none';
    right.style.display = 'block';
    
    alert("The question and its responses have been resolved and removed.");
    
}
