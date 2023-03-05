import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import * as cocoSsd from '@tensorflow-models/coco-ssd';

import imageURL from './image1.jpg';
import image2URL from './image2.jpg';

let modelPromise;

window.onload = () => modelPromise = cocoSsd.load();

const button = document.getElementById('toggle');
button.onclick = () => {
  image.src = image.src.endsWith(imageURL) ? image2URL : imageURL;
};

const upload = document.getElementById('upload');
upload.onchange = async (event) => {
    const model = await modelPromise;
    model.dispose();
    modelPromise = cocoSsd.load();
    const file = event.srcElement.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
};

const select = document.getElementById('base_model');
select.onchange = async (event) => {
  const model = await modelPromise;
  model.dispose();
  modelPromise = cocoSsd.load(
      {base: event.srcElement.options[event.srcElement.selectedIndex].value});
};

const image = document.getElementById('image');
image.src = imageURL;

const runButton = document.getElementById('run');
runButton.onclick = async () => {
  const model = await modelPromise;
  console.log('model loaded');
  console.time('predict1');
  const result = await model.detect(image);
  console.timeEnd('predict1');

  const c = document.getElementById('canvas');
  c.width = image.width;
  c.height = image.height;

  const context = c.getContext('2d');

  context.clearRect(0, 0, c.width, c.height);
  context.drawImage(image, 0, 0, c.width, c.height);
  context.font = '20px "uni sans", "Helvetica Neue", Helvetica, Arial, sans-serif';

  console.log('number of detections: ', result.length);
  for (let i = 0; i < result.length; i++) {
    context.beginPath();
    context.rect(...result[i].bbox);
    context.lineWidth = 1;
    context.strokeStyle = '#7289da';
    context.fillStyle = '#282b30';
    context.stroke();
    context.fillText(
        result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
        result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
  }
};