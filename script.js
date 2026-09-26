const checkButton = document.querySelector(".check");
const words = document.querySelectorAll(".words button");
const answers = document.querySelectorAll(".answers button");
const feedback = document.querySelector(".feedback");

let selectedWord = null;
let selectedAnswer = null;

let pairs = [];


// Выбираем испанское слово

words.forEach(function(word) {

    word.addEventListener("click", function() {

        if (word.classList.contains("paired")) {
            return;
        }

        selectedWord = word;

        words.forEach(function(button) {
            if (!button.classList.contains("paired")) {
                button.classList.remove("selected");
            }
        });

        word.classList.add("selected");

        createPair();

    });

});


// Выбираем перевод

answers.forEach(function(answer) {

    answer.addEventListener("click", function() {

        if (answer.classList.contains("paired")) {
            return;
        }

        selectedAnswer = answer;

        answers.forEach(function(button) {
            if (!button.classList.contains("paired")) {
                button.classList.remove("selected");
            }
        });

        answer.classList.add("selected");

        createPair();

    });

});


// Создаём пару

function createPair() {

    if (selectedWord && selectedAnswer) {

        pairs.push({
            wordButton: selectedWord,
            answerButton: selectedAnswer,
            word: selectedWord.dataset.word,
            answer: selectedAnswer.dataset.answer
        });

        selectedWord.classList.remove("selected");
        selectedAnswer.classList.remove("selected");

        selectedWord.classList.add("paired");
        selectedAnswer.classList.add("paired");

        selectedWord = null;
        selectedAnswer = null;

        updateCheckButton();
    }

}


// Активируем COMPROBAR только после 4 пар

function updateCheckButton() {

    if (pairs.length === words.length) {
        checkButton.classList.add("ready");
        checkButton.disabled = false;
    }

}


// Проверяем все ответы

checkButton.addEventListener("click", function() {

    let allCorrect = true;

    pairs.forEach(function(pair) {

        if (pair.word === pair.answer) {

            pair.wordButton.classList.add("correct-pair");
            pair.answerButton.classList.add("correct-pair");

        } else {

            pair.wordButton.classList.add("wrong-pair");
            pair.answerButton.classList.add("wrong-pair");

            allCorrect = false;
        }

    });


    if (allCorrect) {

        feedback.innerHTML =
            "✦ ¡Perfecto! Ya tienes todo listo para el viaje.";

        feedback.className = "feedback correct";

    } else {

        feedback.innerHTML =
            "Algunas palabras se han perdido por el camino. Inténtalo otra vez.";

        feedback.className = "feedback wrong";
    }

});
// ==============================
// TASK 02 — AIRPORT
// ==============================

const airportQuestions =
    document.querySelectorAll(".airport-question");

const airportCheck =
    document.querySelector(".airport-check");

const airportFeedback =
    document.querySelector(".airport-feedback");


let airportAnswers = {};


// Выбираем ответ

airportQuestions.forEach(function(question) {

    const questionNumber =
        question.dataset.question;

    const options =
        question.querySelectorAll(".options button");


    options.forEach(function(option) {

        option.addEventListener("click", function() {

            // Убираем выбор с других вариантов
            // этого же вопроса

            options.forEach(function(button) {
                button.classList.remove("selected-option");
            });


            // Выбираем новый

            option.classList.add("selected-option");


            // Запоминаем ответ

            airportAnswers[questionNumber] = option;


            updateAirportCheck();

        });

    });

});


// Активируем кнопку только после 3 ответов

function updateAirportCheck() {

    if (
        Object.keys(airportAnswers).length ===
        airportQuestions.length
    ) {

        airportCheck.disabled = false;

    }

}


// Проверяем

airportCheck.addEventListener("click", function() {

    let allCorrect = true;


    Object.values(airportAnswers).forEach(
        function(answer) {

            if (answer.dataset.correct === "true") {

                answer.classList.add("correct-option");

            } else {

                answer.classList.add("wrong-option");

                allCorrect = false;

            }

        }
    );


    if (allCorrect) {

        airportFeedback.innerHTML =
            "✦ ¡Buen viaje! Has leído correctamente tu tarjeta de embarque.";

        airportFeedback.className =
            "airport-feedback correct";

    } else {

        airportFeedback.innerHTML =
            "Hay algún problema con el viaje. Revisa la tarjeta de embarque.";

        airportFeedback.className =
            "airport-feedback wrong";

    }

});
// ==============================
// TASK 03 — ITINERARY
// ==============================

const itineraryList =
    document.querySelector(".itinerary-list");

const itineraryCards =
    document.querySelectorAll(".itinerary-card");

const itineraryCheck =
    document.querySelector(".itinerary-check");

const itineraryFeedback =
    document.querySelector(".itinerary-feedback");

let draggedCard = null;


// Начинаем перетаскивать карточку

itineraryCards.forEach(function(card) {

    card.addEventListener("dragstart", function() {

        draggedCard = card;

        card.classList.add("dragging");

    });


    card.addEventListener("dragend", function() {

        card.classList.remove("dragging");

        draggedCard = null;

    });

});


// Определяем, куда вставить карточку

itineraryList.addEventListener("dragover", function(event) {

    event.preventDefault();

    const afterElement =
        getDragAfterElement(
            itineraryList,
            event.clientY
        );


    if (afterElement == null) {

        itineraryList.appendChild(draggedCard);

    } else {

        itineraryList.insertBefore(
            draggedCard,
            afterElement
        );

    }

});


// Ищем ближайшую карточку

function getDragAfterElement(container, y) {

    const draggableElements =
        [
            ...container.querySelectorAll(
                ".itinerary-card:not(.dragging)"
            )
        ];


    return draggableElements.reduce(
        function(closest, child) {

            const box =
                child.getBoundingClientRect();

            const offset =
                y - box.top - box.height / 2;


            if (
                offset < 0 &&
                offset > closest.offset
            ) {

                return {
                    offset: offset,
                    element: child
                };

            } else {

                return closest;

            }

        },

        {
            offset: Number.NEGATIVE_INFINITY
        }

    ).element;

}


// ==============================
// CHECK ROUTE
// ==============================

itineraryCheck.addEventListener("click", function() {

    const currentCards =
        [...itineraryList.querySelectorAll(".itinerary-card")];

    let allCorrect = true;


    currentCards.forEach(function(card, index) {

        card.classList.remove(
            "correct-step",
            "wrong-step"
        );

        const step = Number(card.dataset.step);
        const expectedStep = index + 1;

        if (step === expectedStep) {

            card.classList.add("correct-step");

        } else {

            card.classList.add("wrong-step");

            allCorrect = false;
        }

    });


    if (allCorrect) {

        itineraryFeedback.textContent =
            "✦ MAD → BCN · ¡Ruta completada! Sofía está lista para viajar.";

        itineraryFeedback.className =
            "itinerary-feedback correct";



    } else {

        itineraryFeedback.textContent =
            "La ruta todavía tiene algunos problemas. Cambia el orden e inténtalo otra vez.";

        itineraryFeedback.className =
            "itinerary-feedback wrong";
    }

});
// ==============================
// TASK 04 — MY TRIP
// ==============================

const destinationButtons =
    document.querySelectorAll(".destination-options button");

const transportButtons =
    document.querySelectorAll(".transport-options button");

const accommodationButtons =
    document.querySelectorAll(".accommodation-options button");

const durationButtons =
    document.querySelectorAll(".duration-options button");

const activityButtons =
    document.querySelectorAll(".activity-options button");

const createTripButton =
    document.querySelector(".create-trip");

const travelResult =
    document.querySelector(".travel-result");


let trip = {
    destination: null,
    code: null,
    transport: null,
    accommodation: null,
    duration: null,
    activities: []
};


// ==============================
// SINGLE CHOICE
// ==============================

function setupSingleChoice(buttons, property) {

    buttons.forEach(function(button) {

        button.addEventListener("click", function() {

            // Убираем прошлый выбор
            buttons.forEach(function(otherButton) {
                otherButton.classList.remove("trip-selected");
            });

            // Запоминаем новый выбор
            button.classList.add("trip-selected");
            trip[property] = button.dataset.value;


            // ==============================
            // DESTINATION
            // ==============================

            if (property === "destination") {

                const code =
                    button.querySelector(".choice-code");

                trip.code = code.textContent;

                updateTravelMap(trip.code);
                updateTransportOptions(trip.code);
            }


            // ==============================
            // TRANSPORT
            // ==============================

            if (property === "transport") {

                const mapTransport =
                    document.querySelector(".map-transport");

                mapTransport.textContent =
                    "···· " +
                    trip.transport.toUpperCase() +
                    " ····";
            }


            updateTripButton();

        });

    });

}
// ==============================
// TRANSPORT AVAILABILITY
// ==============================

function updateTransportOptions(code) {

    transportButtons.forEach(function(button) {

        const transport = button.dataset.value;

        // Сначала разрешаем всё
        button.disabled = false;
        button.classList.remove("transport-disabled");


        // Buenos Aires и México:
        // только самолёт

        if (
            (code === "BUE" || code === "MEX") &&
            transport !== "avión"
        ) {
            button.disabled = true;
            button.classList.add("transport-disabled");
        }

    });


    // Если уже был выбран неподходящий транспорт —
    // сбрасываем его

    if (
        (code === "BUE" || code === "MEX") &&
        trip.transport &&
        trip.transport !== "avión"
    ) {

        trip.transport = null;

        transportButtons.forEach(function(button) {
            button.classList.remove("trip-selected");
        });

        const mapTransport =
            document.querySelector(".map-transport");

        mapTransport.textContent = "············";
    }

}


setupSingleChoice(
    destinationButtons,
    "destination"
);

setupSingleChoice(
    transportButtons,
    "transport"
);

setupSingleChoice(
    accommodationButtons,
    "accommodation"
);

setupSingleChoice(
    durationButtons,
    "duration"
);


// ==============================
// ACTIVITIES — MAXIMUM 2
// ==============================

activityButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const activity =
            button.dataset.value;


        // Si ya está seleccionada, la quitamos

        if (button.classList.contains("trip-selected")) {

            button.classList.remove("trip-selected");

            trip.activities =
                trip.activities.filter(
                    function(item) {
                        return item !== activity;
                    }
                );

        }

        // Si todavía no tenemos dos
        else if (trip.activities.length < 2) {

            button.classList.add("trip-selected");

            trip.activities.push(activity);

        }


        updateTripButton();

    });

});


// ==============================
// ENABLE CREATE BUTTON
// ==============================

function updateTripButton() {

    let completed = 0;

    if (trip.destination) completed++;
    if (trip.transport) completed++;
    if (trip.accommodation) completed++;
    if (trip.duration) completed++;

    if (trip.activities.length === 2) {
        completed++;
    }


    // PROGRESS

    const progressCount =
        document.querySelector(".progress-count");

    const progressFill =
        document.querySelector(".progress-fill");

    const progressMessage =
        document.querySelector(".progress-message");

    const tripProgress =
        document.querySelector(".trip-progress");


    progressCount.textContent =
        completed + " / 5";

    progressFill.style.width =
        (completed / 5) * 100 + "%";


    // ALL READY

    if (completed === 5) {

        createTripButton.disabled = false;

        tripProgress.classList.add("complete");

        progressMessage.textContent =
            "¡Listo para viajar!";

    } else {

        createTripButton.disabled = true;

        tripProgress.classList.remove("complete");

        progressMessage.textContent =
            "Completa tus decisiones para continuar.";
    }

}


// ==============================
// CREATE TRAVEL CARD
// ==============================

createTripButton.addEventListener(
    "click",
    function() {

        document.querySelector(
            ".result-destination"
        ).textContent = trip.destination;


        document.querySelector(
            ".result-code"
        ).textContent = trip.code;


        document.querySelector(
            ".result-transport"
        ).textContent = trip.transport;


        document.querySelector(
            ".result-accommodation"
        ).textContent = trip.accommodation;


        document.querySelector(
            ".result-duration"
        ).textContent = trip.duration;


        // Creamos el texto para speaking

        const speakingText =
            "Quiero viajar a " +
            trip.destination +
            ". Voy a viajar en " +
            trip.transport +
            " y voy a alojarme en " +
            trip.accommodation +
            ". El viaje va a durar " +
            trip.duration +
            ". Durante el viaje quiero " +
            trip.activities[0] +
            " y " +
            trip.activities[1] +
            ".";


        document.querySelector(
            ".speaking-text"
        ).textContent = speakingText;


        // Mostramos la tarjeta

        travelResult.classList.remove("hidden");


        // Bajamos automáticamente hasta el resultado

        travelResult.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
);
/* ==============================
   INTERACTIVE MAP
   ============================== */

function updateTravelMap(code) {

    const mapDestination =
        document.querySelector(".map-destination");

    const mapPoints =
        document.querySelectorAll(".map-point");

    /* убираем прошлую подсветку */

    mapPoints.forEach(function(point) {
        point.classList.remove("active-destination");
    });


    /* меняем код маршрута */

    mapDestination.textContent = code;


    /* находим нужный город */

    let activePoint = null;

    if (code === "BCN") {
        activePoint =
            document.querySelector(".barcelona");
    }

    if (code === "BUE") {
        activePoint =
            document.querySelector(".buenos-aires");
    }

    if (code === "MEX") {
        activePoint =
            document.querySelector(".mexico");
    }


    /* подсвечиваем его */

    if (activePoint) {
        activePoint.classList.add(
            "active-destination"
        );
        

/* запускаем маленькую анимацию заново */

requestAnimationFrame(function() {
    requestAnimationFrame(function() {
        route.classList.add("visible");
    });
});
    }
}
/* ==============================
   SHOW ROUTE AFTER TRANSPORT
   ============================== */

function updateMapRoute() {

    const route =
        document.querySelector(".dynamic-route");

    const plane =
        document.querySelector(".route-plane");

    /* маршрут показываем только когда
       выбраны И город, И транспорт */

    if (!trip.code || !trip.transport) {
        route.classList.remove("visible");
        return;
    }


    /* BARCELONA */

    if (trip.code === "BCN") {
        route.style.width = "8%";
        route.style.transform = "rotate(-25deg)";
    }


    /* MÉXICO */

    if (trip.code === "MEX") {
        route.style.width = "43%";
        route.style.transform = "rotate(172deg)";
    }


    /* BUENOS AIRES */

    if (trip.code === "BUE") {
        route.style.width = "42%";
        route.style.transform = "rotate(132deg)";
    }


    /* транспорт */

    if (trip.transport === "avión") {
        plane.textContent = "✈︎";
    }

    if (trip.transport === "tren") {
        plane.textContent = "◆";
    }

    if (trip.transport === "coche") {
        plane.textContent = "●";
    }


    route.classList.remove("visible");

    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            route.classList.add("visible");
        });
    });
}

