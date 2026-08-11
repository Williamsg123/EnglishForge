console.log("Verbs loaded:", verbs.length);

function speak(text){

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";

    utterance.rate = 0.8;

    speechSynthesis.speak(utterance);

}

function addAudioButton(row, verbData){

    let oldButton = row.querySelector(".audio-btn");

    if(oldButton){
        oldButton.remove();
    }


    const button = document.createElement("button");

    button.textContent = "🔊";

    button.classList.add("audio-btn");


    button.onclick = () => {

        speak(
            verbData.verb + ". " +
            verbData.past + ". " +
            verbData.participle
        );

    };


    row.querySelector(".verb-name").appendChild(button);

   

}


// Seleccionamos los dos bloques
const blockOne = document.getElementById("block-one");
const blockTwo = document.getElementById("block-two");
const titleOne = document.getElementById("titleOne");
const titleTwo = document.getElementById("titleTwo");

const verbsPageTitle = document.getElementById("verbsPageTitle");

const practiceContainer = document.querySelector(".practice-container");

const nativeLabContainer = document.getElementById("nativeLabContainer");

const armyContainer = document.getElementById("armyContainer");

function showVerbs(){

    currentModule = "verbs";

    practiceContainer.style.display = "grid";

    nativeLabContainer.style.display = "none";

    armyContainer.style.display = "none";


    verbsButton.classList.add("active");

    nativeLabButton.classList.remove("active");

    armyEnglishButton.classList.remove("active");

}



function showNativeLab(){

    currentModule = "native";

    practiceContainer.style.display = "none";

    nativeLabContainer.style.display = "grid";

    armyContainer.style.display = "none";


    verbsButton.classList.remove("active");

    nativeLabButton.classList.add("active");

    armyEnglishButton.classList.remove("active");


    nativePage = 0;

loadNativeLab();

}



function showArmy(){

    currentModule = "army";

    practiceContainer.style.display = "none";

    nativeLabContainer.style.display = "none";

    armyContainer.style.display = "block";


    verbsButton.classList.remove("active");

    nativeLabButton.classList.remove("active");

    armyEnglishButton.classList.add("active");


    armyContainer.innerHTML = `
        <div class="army-coming-soon">
            Being Developed.
        </div>
    `;

}

/* ===========================
   NATIVE LAB V2
=========================== */

let nativePage = 0;

const nativePerPage = 10;


/* ===========================
   CARGAR PAGINA
=========================== */

function loadNativeLab(){

    const container =
        document.getElementById("nativeLabContainer");

    if(!container) return;


    const start =
        nativePage * nativePerPage;


    const pageItems =
        nativeLab.slice(
            start,
            start + nativePerPage
        );


    let leftColumn = `
        <div class="native-column">
    `;


    let rightColumn = `
        <div class="native-column">
    `;


    pageItems.forEach((item, index)=>{

        const globalIndex =
            start + index;


        const card = `

            <div class="native-card">

                <div class="native-header">

                    <div class="native-title">

    <span>
        ${item.title}:
    </span>

    <span
        class="native-original"
        id="nativeOriginal-${globalIndex}">
    </span>

</div>

                    <button
                        class="native-audio"
                        onclick="playNativeAudio(${globalIndex})">

                        🔊

                    </button>

                </div>


                <textarea
                    class="native-writing-box"
                    id="nativeAnswer-${globalIndex}"
                    placeholder="Listen and write the paragraph...">
                </textarea>


            </div>

        `;


        if(index < 5){

            leftColumn += card;

        } else {

            rightColumn += card;

        }

    });


    leftColumn += `
        </div>
    `;


    rightColumn += `
        </div>
    `;


   container.innerHTML = `

<div class="native-section-header">

    <div class="native-status-left" id="nativeStatusLeft"></div>

    <div class="native-section-title">
        LISTENING & WRITING PRACTICE
    </div>

    <div class="native-status-right" id="nativeStatusRight"></div>

</div>

${leftColumn}
${rightColumn}

`;

    updateNativeCounter();

    const maxPage =
    Math.ceil(
        nativeLab.length /
        nativePerPage
    ) - 1;

prevButton.disabled = nativePage === 0;

nextButton.disabled = nativePage === maxPage;


}


/* ===========================
   CONTADOR
=========================== */

function updateNativeCounter(){

    const counter = document.getElementById("counter");

    if(!counter) return;


    const start = nativePage * nativePerPage + 1;

    const end = Math.min(
        start + nativePerPage - 1,
        nativeLab.length
    );


    counter.textContent =
        `${start}-${end} / ${nativeLab.length}`;

}


/* ===========================
   CHECK TODOS
=========================== */

function checkNativeLab(){

    const start = nativePage * nativePerPage;

    const pageItems = nativeLab.slice(
        start,
        start + nativePerPage
    );


    const leftErrors = [];
    const rightErrors = [];


    pageItems.forEach((item,index)=>{

        const globalIndex = start + index;


        const textarea =
            document.getElementById(
                `nativeAnswer-${globalIndex}`
            );


        const originalDisplay =
            document.getElementById(
                `nativeOriginal-${globalIndex}`
            );


        if(!textarea) return;


        const answer = textarea.value;

        const original = item.paragraph;


        originalDisplay.textContent =
            original;


        const correct =
            compareNativeText(
                answer,
                original
            );


        if(!correct){

            if(index < 5){

                leftErrors.push(item.title);

            } else {

                rightErrors.push(item.title);

            }


            console.log(
                highlightNativeErrors(
                    answer,
                    original
                )
            );

        }

    });


    const leftStatus =
        document.getElementById(
            "nativeStatusLeft"
        );


    const rightStatus =
        document.getElementById(
            "nativeStatusRight"
        );


    if(leftStatus){

        if(leftErrors.length === 0){

            leftStatus.textContent =
                "All paragraphs are correct ✓";

            leftStatus.className =
                "native-status-left correct";

        } else {

            leftStatus.textContent =
                "Review: " +
                leftErrors.join(", ");

            leftStatus.className =
                "native-status-left wrong";

        }

    }


    if(rightStatus){

        if(rightErrors.length === 0){

            rightStatus.textContent =
                "All paragraphs are correct ✓";

            rightStatus.className =
                "native-status-right correct";

        } else {

            rightStatus.textContent =
                "Review: " +
                rightErrors.join(", ");

            rightStatus.className =
                "native-status-right wrong";

        }

    }

}


/* ===========================
   COMPARAR TEXTO
=========================== */

function compareNativeText(
    userText,
    originalText
){

    const cleanUser =
        userText
            .toLowerCase()
            .trim();


    const cleanOriginal =
        originalText
            .toLowerCase()
            .trim();


    return cleanUser === cleanOriginal;

}


/* ===========================
   AUDIO
=========================== */

function playNativeAudio(index){

    const item =
        nativeLab[index];


    if(!item) return;


    const speech =
        new SpeechSynthesisUtterance(
            item.paragraph
        );


    speech.lang = "en-US";

    speech.rate = 0.9;

    speech.pitch = 1;


    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
        speech
    );

}


/* ===========================
   SIGUIENTE PAGINA
=========================== */

function nextNativePage(){

    const maxPage =
        Math.ceil(
            nativeLab.length /
            nativePerPage
        ) - 1;


    if(nativePage < maxPage){

        nativePage++;

        loadNativeLab();

    }

}


/* ===========================
   PAGINA ANTERIOR
=========================== */

function previousNativePage(){

    if(nativePage > 0){

        nativePage--;

        loadNativeLab();

    }

}

/* ===========================
   CORRECCION DE ERRORES
=========================== */

function highlightNativeErrors(
    userText,
    originalText
){

    /*
     * Esta función será reemplazada
     * por el comparador avanzado.
     *
     * Aquí vamos a detectar:
     *
     * - espacios extras
     * - espacios faltantes
     * - letras
     * - palabras
     * - comas
     * - puntos
     * - signos
     */

    return userText;

}

function highlightDifferences(userText, originalText){


    const userWords = userText
        .replace(/[.,!?;:"']/g, "")
        .split(" ");


    const originalWords = originalText
        .replace(/[.,!?;:"']/g, "")
        .split(" ");



    let result = "";



    userWords.forEach(word => {


        let found = originalWords.some(originalWord =>

            word.toLowerCase() === originalWord.toLowerCase()

        );


        if(found){

            result += word + " ";

        }

        else{

            result += `
            <span class="wrong-word">
                ${word}
            </span> `;

        }


    });



    return result;

}


// Buscamos las filas de cada bloque
const rowsOne = blockOne.querySelectorAll(".verb-row");
const rowsTwo = blockTwo.querySelectorAll(".verb-row");

// Asignar números automáticamente a cada fila

rowsOne.forEach((row, index) => {
    row.dataset.id = index + 1;
});


rowsTwo.forEach((row, index) => {
    row.dataset.id = index + 13;
});

console.log("Filas bloque 1:", rowsOne.length);

const checkButton = document.getElementById("checkBtn");
const resetButton = document.getElementById("resetBtn");
const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");

const verbsButton = document.getElementById("verbsBtn");
const nativeLabButton = document.getElementById("nativeLabBtn");
const armyEnglishButton = document.getElementById("armyEnglishBtn");


let currentPage = 1;

let currentModule = "verbs";


// Cargar verbos 1 - 10

function formatText(text){

    return text.charAt(0).toUpperCase() + 
           text.slice(1).toLowerCase();

}
function loadVerbsPage(){

    let start = (currentPage - 1) * 24;


    rowsOne.forEach((row)=>{

    row.querySelectorAll("input").forEach(input=>{
        input.value="";
    });


    row.querySelectorAll("span").forEach(span=>{
        span.textContent="";
        span.classList.remove("correct");
        span.classList.remove("wrong");
    });

});


rowsTwo.forEach((row)=>{

    row.querySelectorAll("input").forEach(input=>{
        input.value="";
    });


    row.querySelectorAll("span").forEach(span=>{
        span.textContent="";
        span.classList.remove("correct");
        span.classList.remove("wrong");
    });

});


    for(let i = 0; i < 12; i++){

   rowsOne[i].querySelector(".verb-name").textContent =
   formatText(verbs[start + i].spanish);

    addAudioButton(rowsOne[i], verbs[start + i]);

}


    for(let i = 0; i < 12; i++){

    rowsTwo[i].querySelector(".verb-name").textContent =
    formatText(verbs[start + 12 + i].spanish);

    addAudioButton(rowsTwo[i], verbs[start + 12 + i]);

}

   titleOne.textContent = "";

titleTwo.textContent = "";

verbsPageTitle.textContent =
`VERBS ${Math.min(start + 24, verbs.length)} OF ${verbs.length}`;

    console.log("Página cargada:", currentPage);

    prevButton.disabled = currentPage === 1;

nextButton.disabled = currentPage === Math.ceil(verbs.length / 24);

}


loadVerbsPage();

showVerbs();

nextButton.addEventListener("click", () => {

    if(currentModule === "native"){

        nextNativePage();

        return;

    }


    if(currentPage < Math.ceil(verbs.length / 24)){

        currentPage++;

        loadVerbsPage();

    }

});


prevButton.addEventListener("click", () => {

console.log("CURRENT MODULE:", currentModule);

    if(currentModule === "native"){

        previousNativePage();

        return;

    }


    if(currentPage > 1){

        currentPage--;

        loadVerbsPage();

    }

});

verbsButton.addEventListener("click", () => {

    showVerbs();

});


nativeLabButton.addEventListener("click", () => {

    showNativeLab();

});


armyEnglishButton.addEventListener("click", () => {

    showArmy();

});



function checkRow(row, verbData) {

    const inputs = row.querySelectorAll("input");
    const spans = row.querySelectorAll("span");


    const answers = [
        verbData.verb,
        verbData.past,
        verbData.participle
    ];


    let correct = true;


   inputs.forEach((input, index) => {

    const userAnswer = input.value.trim().toLowerCase();


    spans[index].textContent = formatText(answers[index]);

    if(verbData.example){

    let example = row.querySelector(".verb-example");

    if(!example){

        example = document.createElement("span");

        example.classList.add("verb-example");

        row.appendChild(example);

    }

    example.textContent = verbData.example;

}


    // Campo vacío
    if (userAnswer === "") {

        input.classList.remove("wrong");
        input.classList.remove("correct");

        return;

    }


    // Correcto
    if (userAnswer === answers[index].toLowerCase()){

    spans[index].classList.remove("wrong");
    spans[index].classList.add("correct");

} 


// Incorrecto
else {

    spans[index].classList.remove("correct");
    spans[index].classList.add("wrong");

    correct = false;

}

});


    return correct;

}



checkButton.addEventListener("click", () => {

    console.log("CHECK PRESIONADO");

    if(currentModule === "native"){

    checkNativeLab();

    return;

}

    console.log("Filas bloque 1:", rowsOne.length);
console.log("Filas bloque 2:", rowsTwo.length);
console.log("Página:", currentPage);

    let start = (currentPage - 1) * 24;

    console.log("Página actual:", currentPage);
console.log("Inicio:", start);
console.log("Verbo que debería revisar:", verbs[start]);


    rowsOne.forEach((row, index) => {

        checkRow(row, verbs[start + index]);

    });


    rowsTwo.forEach((row, index) => {

    checkRow(row, verbs[start + 12 + index]);



    });


}); 

resetButton.addEventListener("click", () => {

    if(currentModule === "native"){

        nativePage = 0;

        loadNativeLab();

        return;

    }


    nativePage = 0;

    currentPage = 1;

    loadVerbsPage();

    const allInputs =
        document.querySelectorAll("input");

    const allSpans =
        document.querySelectorAll(
            ".answer-box span"
        );


    allInputs.forEach(input => {

        input.value = "";

        input.classList.remove("wrong");
        input.classList.remove("correct");

    });


    allSpans.forEach(span => {

        span.textContent = "";

        span.classList.remove("wrong");
        span.classList.remove("correct");

    });


});



// =========================
// NATIVE LAB ERROR ENGINE
// =========================

function highlightNativeErrors(userText, originalText){

 return userText;

}
