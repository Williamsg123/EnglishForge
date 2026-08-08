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

const practiceContainer = document.querySelector(".practice-container");

const nativeLabContainer = document.getElementById("nativeLabContainer");

const armyContainer = document.getElementById("armyContainer");

function showVerbs(){

     currentModule = "verbs";

    practiceContainer.style.display = "grid";

    nativeLabContainer.style.display = "none";

    armyContainer.style.display = "none";

}



function showNativeLab(){

    currentModule = "native";

    practiceContainer.style.display = "none";

    nativeLabContainer.style.display = "block";

    armyContainer.style.display = "none";

     loadNativeLab();
}



function showArmy(){

     currentModule = "army";

    practiceContainer.style.display = "none";

    nativeLabContainer.style.display = "none";

    armyContainer.style.display = "block";

}

function loadNativeLab(){

let html = `

<h3>
NATIVE LAB 1 / ${nativeLab.length}
</h3>

`;


nativeLab.forEach((item)=>{

html += `

<div class="native-card">


<h2 class="native-title">

${item.title}

<button class="audio-btn" onclick="speak(\`${item.paragraph}\`)">

🔊

</button>

</h2>


<div
id="nativeAnswer"
class="native-textarea"
contenteditable="true">

Write your paragraph here...

</div>


</div>

`;

});


nativeLabContainer.innerHTML = html;


}


function checkNativeLab(){

   const answer = document
    .getElementById("nativeAnswer")
    .innerText
    .trim();


    const original = nativeLab[0].paragraph;



    let status;


    if(compareNativeText(answer, original)){

    status = `
        <h3 class="correct">
            Correct ✅
        </h3>
    `;


    } else {

        status = `
            <h3 class="wrong">
                Check your paragraph ⚠️
            </h3>
        `;

    }



    const oldResult = document.querySelector(".native-result");

    if(oldResult){

        oldResult.remove();

    }



    const result = document.createElement("div");

    result.classList.add("native-result");


  result.innerHTML = `

${status}


<h3>
Original text:
</h3>


<p class="original-text">
${original}
</p>

`;

document.getElementById("nativeAnswer").innerHTML =
highlightNativeErrors(answer, original)

    nativeLabContainer.appendChild(result);


    console.log("User wrote:", answer);


}

function compareNativeText(userText, originalText){


    let cleanUser = userText
        .toLowerCase()
        .replace(/[.,!?;:"']/g, "")
        .trim();


    let cleanOriginal = originalText
        .toLowerCase()
        .replace(/[.,!?;:"']/g, "")
        .trim();



    const replacements = [

        ["got up", "woke up"],

        ["don't", "do not"],

        ["didn't", "did not"],

        ["can't", "cannot"],

        ["won't", "will not"]

    ];



    replacements.forEach(pair => {

        cleanUser = cleanUser.replace(pair[0], pair[1]);

    });



    return cleanUser === cleanOriginal;


}

function findNativeDifferences(userText, originalText){

    const userWords = userText.split(" ");
    const originalWords = originalText.split(" ");

    let result = "";


    userWords.forEach((word, index)=>{


        let originalWord = originalWords[index] || "";


        if(
            word.toLowerCase().replace(/[.,!?]/g,"") !==
            originalWord.toLowerCase().replace(/[.,!?]/g,"")
        ){

            result += `
            <span class="native-error">
                ${word}
            </span> `;

        } else {

            result += word + " ";

        }


    });


    return result;

}

function markNativeErrors(userText, originalText){


    const userWords = userText.split(" ");

    const originalWords = originalText.split(" ");


    let result = "";


    userWords.forEach((word, index)=>{


        if(originalWords[index]){


            if(
                word.toLowerCase() !== 
                originalWords[index].toLowerCase()
            ){

                result += `
                <span class="error-mark">
                    ${word}
                </span> `;

            } 
            else {

                result += word + " ";

            }


        } else {


            result += `
            <span class="error-mark">
                ${word}
            </span> `;


        }


    });


    return result;


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
    row.dataset.id = index + 11;
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

    let start = (currentPage - 1) * 20;


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


    for(let i = 0; i < 10; i++){

   rowsOne[i].querySelector(".verb-name").textContent =
   formatText(verbs[start + i].spanish);

    addAudioButton(rowsOne[i], verbs[start + i]);

}


    for(let i = 0; i < 10; i++){

    rowsTwo[i].querySelector(".verb-name").textContent =
    formatText(verbs[start + 10 + i].spanish);

    addAudioButton(rowsTwo[i], verbs[start + 10 + i]);

}

    titleOne.textContent = 
`VERBS ${start + 1} - ${start + 10}`;


titleTwo.textContent = 
`VERBS ${start + 11} - ${start + 20}`;

    console.log("Página cargada:", currentPage);

    prevButton.disabled = currentPage === 1;

nextButton.disabled = currentPage === Math.ceil(verbs.length / 20);

}


loadVerbsPage();

nextButton.addEventListener("click", () => {

    if(currentPage < Math.ceil(verbs.length / 20)){

        currentPage++;

        loadVerbsPage();

    }

});


prevButton.addEventListener("click", () => {

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

    let start = (currentPage - 1) * 20;

    console.log("Página actual:", currentPage);
console.log("Inicio:", start);
console.log("Verbo que debería revisar:", verbs[start]);


    rowsOne.forEach((row, index) => {

        checkRow(row, verbs[start + index]);

    });


    rowsTwo.forEach((row, index) => {

    checkRow(row, verbs[start + 10 + index]);



    });


}); 

resetButton.addEventListener("click", () => {


    const allInputs = document.querySelectorAll("input");

    const allSpans = document.querySelectorAll(".answer-box span");


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


    console.log("RESET COMPLETO");


});



// =========================
// NATIVE LAB ERROR ENGINE
// =========================

function highlightNativeErrors(userText, originalText){

 return userText;

}
