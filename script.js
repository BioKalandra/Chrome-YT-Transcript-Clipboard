const SNACKBAR_ID = 'snackbar';
const CONTENT_ID = 'content';
const TIMEOUT = 150;
const MAX_TRIES_ASYNC = 50;
const MSG_TRANSCRIPT_NOT_FOUND = 'transcript not found'
const MSG_TRANSCRIPT_FOUND = 'transcript copied to clipboard'
const RELATIVE_X_PATH_TRANSCRIPT_BUTTON = '//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button/yt-touch-feedback-shape/div/div[2]'
const RELATIVE_X_PATH_BURGER_SHOW_TRANSCRIPT_BUTTON = '//*[@id="items"]/ytd-menu-service-item-renderer[5]/tp-yt-paper-item/yt-formatted-string'

let startTime;

/**
 * Creates the snackbar initially
 */
function createSnackbar() {
    setTimeout(() => {
        const snackBar = document.createElement('div')
        snackBar.id = SNACKBAR_ID

        const videoContainer = document.getElementById(CONTENT_ID);

        if (!videoContainer) {
            console.error('container not found :(')
        } else {
            videoContainer.appendChild(snackBar)
        }

    }, 2500)
}

/**
 * create snackbar
 */
createSnackbar()

/**
 * extracts the transcription, if the transcript window is already opened
 */
function getTranscription() {
    const transcriptDivs = document.getElementsByClassName(
        'segment-text style-scope ytd-transcript-segment-renderer'
    );

    if (transcriptDivs.length === 0) {
        return false
    }

    let transcript = [];

    for (let i = 0; i < transcriptDivs.length; i++) {
        transcript.push(transcriptDivs[i].innerHTML.trim());
    }

    for (let j = 10; j < transcript.length; j += 10) {
        transcript.splice(j, 0, '<br><br>');
    }

    return transcript.join('. ');
}

/**
 * Publishes a message in the snackbar and adjusts the color
 * @param message string
 * @param success boolean
 */
function sendMessageToSnackbar(message, success) {
    // Get the snackbar DIV
    const snackbarItem = document.getElementById(SNACKBAR_ID);

    snackbarItem.innerHTML = `${message} - ${getCurrentTime()}`
    snackbarItem.innerHTML = `${message}`
    success ? snackbarItem.style.color = 'lightgreen' : snackbarItem.style.color = 'red'

    // Add the "show" class to DIV
    snackbarItem.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        snackbarItem.className = snackbarItem.className.replace("show", "");
    }, 3000);
}

/**
 * return the time required in seconds
 * @returns {number}
 */
function getCurrentTime() {
    return (Date.now() - startTime) / 1000
}

/**
 * waits the amount of ms
 * @param ms
 * @returns {Promise<unknown>}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * find element in Dom, performs clicks if found
 * @param xpath
 * @param maxAttempts
 * @param currentAttempt
 * @param successMessage
 * @param errorMessage
 * @returns {Promise<Awaited<Node>>}
 */
async function findElementAndClick(xpath, maxAttempts, currentAttempt, successMessage, errorMessage ) {
    await findElement(xpath, maxAttempts, currentAttempt, successMessage, errorMessage, true)
}

/**
 *
 * @param xpath
 * @param maxAttempts
 * @param currentAttempt
 * @param successMessage
 * @param errorMessage
 * @param click decides if the found element should be clicked
 * @returns {Promise<Awaited<Node>>}
 */
async function findElement(xpath, maxAttempts, currentAttempt, successMessage, errorMessage, click = false) {
    if (currentAttempt >= maxAttempts) {
        sendMessageToSnackbar(errorMessage, false);
        return Promise.reject('max attempts reached')
    }

    const elementByXpath = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (elementByXpath) {
        if(click) {
            elementByXpath.click()
        }
        return Promise.resolve(elementByXpath)
    } else {
        // Element not found, retry after a delay
        await delay(TIMEOUT);
        await findElementAndClick(xpath, maxAttempts, currentAttempt + 1, MSG_TRANSCRIPT_FOUND, MSG_TRANSCRIPT_NOT_FOUND);
    }
}

/**
 * Function that can be called multiple times to retry getting the transcript
 * @param maxAttempts
 * @param currentAttempt
 * @param successMessage
 * @param errorMessage
 * @returns {Promise<boolean>}
 */
async function findTranscript(maxAttempts, currentAttempt, successMessage, errorMessage = 0) {
    if (currentAttempt >= maxAttempts) {
        sendMessageToSnackbar(errorMessage, false);
        return false;
    }

    const transcription = getTranscription();
    if (transcription) {
        await navigator.clipboard.writeText(transcription);
        sendMessageToSnackbar(successMessage, true);
    } else {
        // Element not found, retry after a delay
        await delay(TIMEOUT);
        await findTranscript(maxAttempts, currentAttempt + 1, MSG_TRANSCRIPT_FOUND, MSG_TRANSCRIPT_NOT_FOUND);
    }
}

/**
 * Entrypoint, a click on the button
 */
//todo fix me or find another solution
findElement(RELATIVE_X_PATH_BURGER_SHOW_TRANSCRIPT_BUTTON, MAX_TRIES_ASYNC, 0, 'init','fail').then((data) => {
    data.removeEventListener('click', () => {})
    data.addEventListener('click',  async () => {
        startTime = Date.now()
        await findElementAndClick(RELATIVE_X_PATH_TRANSCRIPT_BUTTON, MAX_TRIES_ASYNC, 0, MSG_TRANSCRIPT_FOUND, MSG_TRANSCRIPT_NOT_FOUND); // Retry up to 5 times
        await findTranscript(MAX_TRIES_ASYNC, 0, MSG_TRANSCRIPT_FOUND, MSG_TRANSCRIPT_NOT_FOUND)
    })
})

