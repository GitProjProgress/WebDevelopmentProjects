let mainBtn = document.querySelector('.mainBtn');
let passDisplay = document.querySelector('[data-passwordDisplay]');
let upperCase = document.querySelector('#UpperCase');
let lowerCase = document.querySelector('#LowerCase');
let Numbers = document.querySelector('#Numbers');
let Symbols = document.querySelector('#Symbols');
let slider = document.querySelector('[data-Slider]');
let passLength = document.querySelector('[data-passLength]');
let strengthIndicator = document.querySelector('[data-strengthIndicator]');
let copyButton = document.querySelector('[data-copyButton]');
let copyMsg = document.querySelector('[data-passCopied]');
let symbolSet = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let activeCheckBoxCount = 0;
let password = "";
let funcarr = [];

function setPassToActiveCount() {
    
    activeCheckBoxCount = 0;
    funcarr.length = 0;
    if(upperCase.checked) {
        activeCheckBoxCount++;
        funcarr.push(getRandomUpper);
    }
        
    if(lowerCase.checked) {
        activeCheckBoxCount++;
        funcarr.push(getRandomLower);
    }
        
    if(Numbers.checked) {
        activeCheckBoxCount++;
        funcarr.push(getRandomNum);
    }
        
    if(Symbols.checked) {
        activeCheckBoxCount++;
        funcarr.push(getRandomSymbols);
    }
        

    // password length should not be less than number of active checkboxes
    if(slider.value < activeCheckBoxCount) {
        slider.value = activeCheckBoxCount;
        passLength.innerText = slider.value;
    }
}

function getRandomInt(min,max) {
    return Math.floor(Math.random()*(max-min))+min;
}

function getRandomNum() {
    return getRandomInt(0,9);
}

function getRandomUpper() {
    return String.fromCharCode(getRandomInt(65,91));
}

function getRandomLower() {
    return String.fromCharCode(getRandomInt(97,123));
}

function getRandomSymbols() {
    return symbolSet[getRandomInt(0,symbolSet.length)];

}

function getPassword() {
    let str = "";

    // for compulsory password chars
    for(let i = 0; i < funcarr.length; i++) {
        str += funcarr[i]();
    }

    // for uncompulsory remaining password chars
    for(let i = 0; i < slider.value - activeCheckBoxCount; i++) {
        str += funcarr[getRandomInt(0,funcarr.length)]();
    }

    // shuffle characters
    let sliced =  Array.from(str); //str.split('');
    for(let j = sliced.length; j > 0; j--) {
        let rand = getRandomInt(0,j);
        let temp = sliced[j];
        sliced[j] = sliced[rand];
        sliced[rand] = temp;
    }
    str = sliced.join('');
    return str;
}

// update strength UI
function setStrength() {

    if(!activeCheckBoxCount) {
        let color = '#ccc';
        strengthIndicator.style.backgroundColor = color;
        strengthIndicator.style.boxShadow = `box-shadow: 0px 0px 12px 1px ${color}`;
    }

    else if(password.length > 8 && activeCheckBoxCount === 4) {
        strengthIndicator.style.cssText = 'box-shadow: 1px 1px 5px 2.5px rgb(71, 219, 71), -1px -1px 5px 2.5px rgb(71, 219, 71); background-color: #0f0;';
    }

    else if((password.length >= 6 && password.length <= 8 && activeCheckBoxCount === 4) || (password.length > 8 && activeCheckBoxCount >= 2 && activeCheckBoxCount < 4)) {
        strengthIndicator.style.cssText = 'box-shadow: 1px 1px 5px 2.5px rgb(221, 221, 71), -1px -1px 5px 2.5px rgb(221, 221, 71); background-color: #ff0;';
    }

    else {
        strengthIndicator.style.cssText = 'box-shadow: 1px 1px 5px 2.5px rgb(228, 41, 41), -1px -1px 5px 2.5px rgb(228, 41, 41); background-color: #f00;';
    }
}

// Event listener on slider
slider.addEventListener('input',() => {
    passLength.innerText = slider.value;
    let bgImageWidthPercent = ((slider.value)*100)/(slider.max);
    slider.style.cssText = `background-size: ${bgImageWidthPercent}%`;
});

async function notifyCopied() {
    try{
        if(password !== "") {
            await navigator.clipboard.writeText(password);
            copyMsg.innerText = 'Copied!!';
            copyMsg.classList.add('active');
            setTimeout(() => {
                copyMsg.classList.remove('active');
            },1200);
        }
        
    }
    catch(e){
        copyMsg.innerText = 'Copy Failed';
        copyMsg.classList.add('active');
        setTimeout(() => {
            copyMsg.classList.remove('active');
        },2000);
    }
}

// Event Listener on copied
copyButton.addEventListener('click',() => {
    notifyCopied();
});

// Event Listener on Generate Button
mainBtn.addEventListener('click',() => {

    setPassToActiveCount();

    // Check how many checkBoxes are checked
        if(!activeCheckBoxCount) {
            setStrength();
            password = "";
            passDisplay.value=password;
            return;
        }
            
        else {
            password = getPassword();
            setStrength();
            passDisplay.value = password;
        }

});