const relativeXpathTranscribeButton = '//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button/yt-touch-feedback-shape/div/div[2]'

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const transcriptBox = document.createElement('button');
transcriptBox.innerHTML = 'transcribe';
transcriptBox.className = 'transcribeBox';
transcriptBox.addEventListener('click', () => {
    setTimeout(() => {
        getElementByXpath(relativeXpathTranscribeButton).click()
    }, 1500)
});

const buttonContainer = document.createElement('div');
buttonContainer.className = 'buttonContainer';
buttonContainer.appendChild(transcriptBox);
buttonContainer.style.position = 'fixed';
buttonContainer.style.zIndex = 999;

const videoContainer = document.getElementById('movie_player');
videoContainer.appendChild(buttonContainer)
