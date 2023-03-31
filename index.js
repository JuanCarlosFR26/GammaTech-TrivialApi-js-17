// Proyecto API - Quiz
// En este proyecto crearéis un pequeño juego de preguntas y respuestas, como el Trivial o el Kahoot.

// Para ello, usaremos The Trivia API, una API que contiene miles de preguntas y respuestas sobre distintos temas.

// Es requisito obligatorio el usar git branching en este proyecto, con al menos una rama main, develop y una rama por cada colaborador.


// Requisitos
// El proyecto tendrá, al menos, dos páginas de HTML:
// index.html, que será la págian de carga. Contendrá el nombre de la App y un botón Start que redirigirá a quiz.html.
// quiz.html, que será la página donde se muestren las preguntas.
// Habrá 10 preguntas por cada partida.
// Sólo se mostrará 1 pregunta a la vez en la página, con sus 4 respuestas posibles.
// Cuando se haga click en una respuesta, se mostrará si ésta es correcta o no. Si es incorrecta, se informará al usuario de cuál era la respuesta correcta.
// Cuando se responda, aparecerá un botón de Next, que permitirá pasar a la siguiente pregunta.
// Cuando se finalicen las 10 preguntas, se mostrará al usuario su puntuación, junto con un botón New Quiz que permite empezar un nuevo juego y un botón Home que devuelve a index.html.
// Iteraciones
// Lo primero es lo primero: cread el repositorio, añadid a los colaboradores y organizad las ramas.
// La funcionalidad principal del proyecto es el quiz mismo, por lo que es lo primero que hay que terminar. Se deben mostrar las preguntas y validar las respuestas.
// Una vez se haya conseguido eso, el siguiente paso es llevar la cuenta de la puntuación del usuario y mostrarla al final.
// Llegados a este punto, la aplicación es funcional, por lo que es el momento de dar los estilos y dejarla presentable.
// The Trivia API permite buscar preguntas por categorías. En esta iteración deberéis crear, en index.html un menú que permita seleccionar entre al menos 4 categorías. Cuando se haga click sobre el botón de Start, aparecerán 10 preguntas exclusivamente de esa categoría.
// La última iteración consiste en llevar la cuenta de todas las puntuaciones de todos los usuarios, y mostrarlas ordenadas de mayor a menor, junto con la fecha en la que se consiguieron. Crea una página nueva de HTML, llamada results.html, y muestra la lista en dicha página. Se debe poder acceder a esa página desde index.html (junto al botón de Start) y al finalizar el quiz (cuando se muestra su puntuación al usuario, se le debe de dar la posibilidad de visitar la página de puntuaciones).


const container = document.querySelector('.quiz-container');


// Asyn / Await con la API
const quizApi = async () => {
    const response = await fetch('https://the-trivia-api.com/api/questions?limit=10&categories=society_and_culture')
    const data = await response.json();
    return data;
}

const getMetaData = async() => {
  const data = await quizApi();
  console.log(data);

  localStorage.setItem('questions', JSON.stringify(data));

}

getMetaData();

function question() {
  const questions = JSON.parse(localStorage.getItem('questions'));

  let count = 0;
  let userPoints = 0;

  function paintQuestions() {
    const questionTitle = document.createElement('h3')
    questionTitle.innerText = (count + 1) + '- ' + questions[count].question;
    const questionCategory = document.createElement('p')
    questionCategory.innerText = 'Category: ' + questions[count].category;
    const arrAnswers = questions[count].incorrectAnswers.concat(questions[count].correctAnswer).sort(() => Math.random() -0.5);
    const answersList = document.createElement('ul')

    answersList.style.display = 'flex';
    answersList.style.flexDirection = 'row';
    answersList.style.alignItems = 'center';
    answersList.style.justifyContent = 'space-evenly';
    answersList.style.width = '700px';
    answersList.style.height = '200px';
    answersList.style.gap = '40px';

    questionTitle.style.fontSize = '30px';
    questionTitle.style.textAlign = 'center';

    questionCategory.style.fontSize = '20px';

    const prove = document.createElement('button');
    const next = document.createElement('button');

    prove.classList.add('prove');
    prove.innerText = 'Prove';
    next.classList.add('next')
    next.innerText = 'Next';

    container.appendChild(questionTitle);
    container.appendChild(questionCategory);

    arrAnswers.forEach(answer => {
      const answerLi = document.createElement('li')
      const answerButton = document.createElement('button')

      answerLi.style.height = '80px';

      answerButton.classList.add('answer');

      answerButton.innerText = answer;
      answerLi.appendChild(answerButton);
      answersList.appendChild(answerLi)
      container.appendChild(answersList)

      answerButton.addEventListener('click', () => {
        let userAnswer = answerButton.innerText;
        answerButton.classList.remove('answer');
        answerButton.classList.add('answerSelect')

        console.log(userAnswer);

        prove.addEventListener('click', () => {
          if(userAnswer === questions[count].correctAnswer) {
            const correct = document.createElement('div');
            correct.classList.add('correct')
            correct.innerText = 'Correct!';
            container.appendChild(correct);
            setTimeout(function() {
              correct.remove();
            }, 2000)
            container.appendChild(next);
            userPoints++;
          } else {
            const incorrect = document.createElement('div');
            incorrect.classList.add('incorrect');
            incorrect.innerText = 'Incorrect!';
            container.appendChild(incorrect);
            setTimeout(function() {
              incorrect.remove();
            }, 2000)
            container.appendChild(next);
          }

          next.addEventListener('click', () => {
            container.innerHTML = '';
            count++;
            console.log(userPoints);
            if(count === 10) {
              localStorage.removeItem('questions');
              container.innerHTML = '';
              const finish = document.createElement('div');
              finish.classList.add('finish');
              finish.innerText = `El quiz ha terminado. Tu puntuación es de: ${userPoints}`;
              container.appendChild(finish);
              const home = document.createElement('a');
              home.href = './index.html';
              home.innerText = 'Home';
              home.classList.add('home');

              container.appendChild(home);

              const reload = document.createElement('button');
              reload.innerText = 'Nuevo Quiz';
              reload.classList.add('reload');

              container.appendChild(reload);

              reload.addEventListener('click', () => {
                location.reload();
                question()
              })

            } else {
              paintQuestions();
            }
          })

        })
      })
    })
    container.appendChild(prove);
  }

  paintQuestions();
}

question()