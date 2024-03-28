import { createWorker } from 'tesseract.js';


const recognizeImage = async (imageUrl) => {
    const worker = await createWorker('eng');

    // await worker.load();
    // await worker.loadLanguage('eng');
    // await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(imageUrl);
    // console.log(text);'
    await worker.terminate();
    return text;
};

export default recognizeImage;


// import { createWorker } from 'tesseract.js';

// (async (imageUrl) => {
//     const worker = await createWorker('eng');
//     const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
//     console.log(ret.data.text);
//     await worker.terminate();
// })();