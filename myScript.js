// Declaring all global variables required for the code
var critdiff = 12;

var WISCdecision = document.getElementById('FSGFCheckbox545');
var WISCfeedback = document.getElementById('GENERALTEXT66');
// Set up a text for user to indicate that score is needed the view results
WISCfeedback.innerHTML = '<b> Score Not Calculated </b>';

var VCSS = document.getElementById('Assessment_SpLD__c.VC_SS_or_Equiv_from_Similarities__c');
var PRSS = document.getElementById('Assessment_SpLD__c.PR_SS_or_Equiv_from_Vis_Puzz__c');
var WMSS = document.getElementById('Assessment_SpLD__c.WM_standard_score__c');
var letterSS = document.getElementById('Assessment_SpLD__c.Letter_Naming_Standard_Score__c');
var objectSS = document.getElementById('Assessment_SpLD__c.Object_Naming_Standard_Score__c');

// Score needs to be declared globally otherwise this snippet won't work
var score = null;

// In this example i have used a form to enter score value.
// Remove if score detemined other way.
var scoreInput = document.getElementById('submitScore');

// Generated an array of objects to save the basis score and data
const BASISDATA = [
    {
        id: 'Assessment_SpLD__c.VC_SS_or_Equiv_from_Similarities__c',
        critMet: null,
        name: 'VCSS',
        value: null,
    },
    {
        id: 'Assessment_SpLD__c.PR_SS_or_Equiv_from_Vis_Puzz__c',
        critMet: null,
        name: 'PRSS',
        value: null,
    },
    {
        id: 'Assessment_SpLD__c.WM_standard_score__c',
        critMet: null,
        name: 'WMSS',
        value: null,
    },
    {
        id: 'Assessment_SpLD__c.Letter_Naming_Standard_Score__c',
        critMet: null,
        name: 'letterSS',
        value: null,
    },
    {
        id: 'Assessment_SpLD__c.Object_Naming_Standard_Score__c',
        critMet: null,
        name: 'objectSS',
        value: null,
    },
];

// FUNCTIONS

// This functions saves the inout data from basis fields
// It is also able to trigger the runWISCCheck().
// Triggers runWISCCheck() only if score has a value other than null.
// Requires score to be a global value.

function saveBasisValue(e){
    let eventId = e.target.id;
    let newValue = (e.target.value === "")? null : parseInt(e.target.value);
    for (let object of BASISDATA){
        if(object.id === eventId){
            object.value = newValue;
        }
    }
    if (score!=null){
        runWISCCheck();
    }
}

// A function that initiates runWISC
// This could be removed when intergrating to the code
// Instead call runWISCCheck() from the score determining function
function saveScore(e){
    e.preventDefault();
    score = parseInt(document.getElementById("new-score").value);
    runWISCCheck();
}

// Function determining if VCSS, PRSS & WMSS values have been given.
// Returns true if all 3, VCSS, PRSS & WMSS, values are present.
// Returns false if any of VCSS, PRSS & WMSS values are null.
function basisDataPresent(dataArray){
    let dataPresent = true;
    for (let object of dataArray){
        if((object.name === 'VCSS' || object.name === 'PRSS' || object.name === 'WMSS') && object.value === null){
            dataPresent = false;
            break
        }
    }
    return dataPresent;
}

// WISC function returns true or false
// True if difference is larger than critdiff.
// False if difference is smaller than critdiff.
function WISC(score, basis, critdiff){
    let difference = (basis - score);
    if( difference > critdiff){
        return true
    } else {
        return false
    }
}

// WISC feedback function renders feedback to user.
// Requires an example of one true basis object as argument.
// Undefined argument value renders'criteria not met''criteria not met' message and no check box is ticked.
// In any other case renders 'criteria met' message and the check box is ticked.
function RenderWISCFeedBack(trueValue){
    trueValue === undefined ? (
        WISCfeedback.innerHTML = '<b>CRITERIA NOT MET</b>',
        WISCdecision.checked = false
    ) : (
        WISCfeedback.innerHTML = '<b>CRITERIA MET</b>',
        WISCdecision.checked = true
    )
}

// The coordinator function for checking WISC
// Ensures that basisDataPresent retunrs true,
// Before calling WISC and render feedback function.
// IF basisDataPresent returns false an error message will be retunred for the user.
function runWISCCheck(){
    console.log(BASISDATA);
    if(basisDataPresent(BASISDATA)){
        for (let basisObj of BASISDATA){
            if (basisObj.value === null){
                continue;
            }
            data = basisObj.value;
            result = WISC(score, data, critdiff);
            console.log(result)
            basisObj.critMet = result;
        }
        let trueValue = BASISDATA.find((basisObj)=> basisObj.critMet === true );
        RenderWISCFeedBack(trueValue);
     } else {
        return WISCfeedback.innerHTML = 
        "<span id='error-message'> Please ensure VCSS && PRSS && WMSS are completed! </span>"
     }
}

//Event Listeners

// In this example I decided to add an submit form for getting a score.
// If this snippet is integrated on to a code with score detemining function
// this should be removed.
scoreInput.addEventListener("submit", saveScore);

// A event listener that calls saveBasisValue every time data is iput on the field.
VCSS.addEventListener("input", saveBasisValue);
PRSS.addEventListener("input", saveBasisValue);
WMSS.addEventListener("input", saveBasisValue);
letterSS.addEventListener("input", saveBasisValue);
objectSS.addEventListener("input", saveBasisValue);