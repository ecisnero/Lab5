// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const memeForm = document.getElementById('generate-meme');
const submitBtn = memeForm.querySelector('button');

const btnGroup = document.getElementById('button-group');
const clearBtn = btnGroup.children[0];
const readTextBtn = btnGroup.children[1];

const volGroup = document.getElementById('volume-group');

const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');

const topText = document.getElementById('text-top');
const botText = document.getElementById('text-bottom');
const imgInput = document.getElementById('image-input');

var synth = window.speechSynthesis;
const voiceSelection = document.getElementById('voice-selection');

//1 DONE
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  //canvas clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //toggling of buttons
  submitBtn.removeAttribute('disabled');
  clearBtn.setAttribute('disabled', "");
  readTextBtn.setAttribute('disabled', "");
  //filling of canvas context with black
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //drawing of uploaded image
  let imgFormat = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, imgFormat.startX, imgFormat.startY, imgFormat.width, imgFormat.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

//2 DONE
imgInput.addEventListener('change', () => {
  // load selected image
  let imgFile = imgInput.files[0];
  img.src = URL.createObjectURL(imgFile);
  //set image alt atr to file name
  img.alt = imgFile.name;
});

//3 DONE
memeForm.addEventListener('submit', (event) => {
  //prevent reloading of the page
  event.preventDefault();
  //generate the meme text
  ctx.textAlign = 'center';
  ctx.font = '50px sans-serif'
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.textBaseline = 'top';
  ctx.fillText(topText.value, canvas.width/2, 0, canvas.width);
  ctx.strokeText(topText.value, canvas.width/2, 0, canvas.width);
  ctx.textBaseline = 'bottom';
  ctx.fillText(botText.value, canvas.width/2, canvas.height, canvas.width);
  ctx.strokeText(botText.value, canvas.width/2, canvas.height, canvas.width);
  //toggle relevant buttons
  submitBtn.setAttribute('disabled', "");
  clearBtn.removeAttribute('disabled');
  readTextBtn.removeAttribute('disabled');
});

//4 DONE
clearBtn.addEventListener('click', () => {
  //clear the image and text
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //toggle relevant buttons
  submitBtn.removeAttribute('disabled');
  clearBtn.setAttribute('disabled', "");
  readTextBtn.setAttribute('disabled', "");
});

//5 DONE
readTextBtn.addEventListener('click', () => {
  //speak the text
  // prepare utterance
  let speech = topText.value + " " + botText.value;
  utterance.text = speech;
  //utter it
  synth.speak(utterance);
});
// speech dependencies
let voices = [];
var utterance = new SpeechSynthesisUtterance("");
// fill list withavailable voices DONE
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    voices = synth.getVoices();
    voiceSelection.removeAttribute('disabled')
    voiceSelection.querySelector("option").remove(0);
    for(let i = 0; i < voices.length; i++) {
      let option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
      if(voices[i].default) {
        option.textContent += ' -- DEFAULT --'
        option.setAttribute('selected', "");
        utterance.voice = voices[i];
      }
      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelection.appendChild(option);
    }
  };
}

//6 DONE
volGroup.addEventListener('input', () => {
  //update volume value
  let volume = volGroup.querySelector("input").value;
  utterance.volume = volume / 100;
  //change volume icon
  let volumeIcon = volGroup.querySelector("img");
  if(volume > 66) {
    volumeIcon.setAttribute("src", "icons/volume-level-3.svg")
  }
  else if( volume > 33) {
    volumeIcon.setAttribute("src", "icons/volume-level-2.svg")
  }
  else if( volume > 0) {
    volumeIcon.setAttribute("src", "icons/volume-level-1.svg")
  }
  else {
    volumeIcon.setAttribute("src", "icons/volume-level-0.svg")
  }
});

//Misc Event listeners
// speech selction
voiceSelection.addEventListener('input', () => {
  let selectedOpt = voiceSelection.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voices.length; i++) {
    if(voices[i].name === selectedOpt) {
      utterance.voice = voices[i];
    }
  }
});


