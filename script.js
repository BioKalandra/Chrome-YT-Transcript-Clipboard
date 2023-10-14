const SNACKBAR_ID = 'snackbar';
const CONTENT_ID = 'content';

/**
 * Creates the snackbar initially
 */
function createSnackbar() {
    setTimeout(() => {
        const snackBar = document.createElement('div')
        snackBar.id = SNACKBAR_ID
        //snackBar.innerHTML = 'init1234'
        const videoContainer = document.getElementById(CONTENT_ID);
        if (!videoContainer) {
            console.error('container not found :(')
        } else {
            videoContainer.appendChild(snackBar)
        }
    }, 1500)
}

/**
 * extracts the transcription, if the transcript window is already opened
 */
function getTranscription() {
    const transcriptDivs = document.getElementsByClassName(
        'segment-text style-scope ytd-transcript-segment-renderer'
    );

    if (transcriptDivs.length === 0) {
        sendMessageToSnackbar("transcript not found", false)
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
    var snackbarItem = document.getElementById(SNACKBAR_ID);

    snackbarItem.innerHTML = message
    success ? snackbarItem.style.color = 'lightgreen' : snackbarItem.style.color = 'red'

    // Add the "show" class to DIV
    snackbarItem.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        snackbarItem.className = snackbarItem.className.replace("show", "");
    }, 3000);
}

createSnackbar()

const relativeXpathTranscribeButton = '//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button/yt-touch-feedback-shape/div/div[2]'

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const transcriptBox = document.createElement('button');
transcriptBox.innerHTML = 'transcribe';
transcriptBox.className = 'transcribeBox';

transcriptBox.addEventListener('click', () => {
    setTimeout(() => {
        let elementByXpath = getElementByXpath(relativeXpathTranscribeButton)
        if (elementByXpath) {
            elementByXpath.click()
            setTimeout(() => {
                console.error(getTranscription())
            }, 1500)


            //sendMessageToSnackbar('success :)', 'green')
        } else {
            sendMessageToSnackbar('fail', false)
        }
    }, 1500)
});

const buttonContainer = document.createElement('div');
buttonContainer.className = 'buttonContainer';
buttonContainer.appendChild(transcriptBox);
buttonContainer.style.position = 'fixed';
buttonContainer.style.zIndex = "999";

const videoContainer = document.getElementById('movie_player');
videoContainer.appendChild(buttonContainer)