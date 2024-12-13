import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import { format } from 'date-fns';

const URL = process.env.TARGET_URL;
const outputDir = 'output';

let resp;

const makeCall = async () => {
  try {
    resp = axios.get(URL);
  } catch (err) {
    if (resp.message) {
      console.log(resp.message);
    } else {
      console.log(err)
    }
  }
  return resp;
}

const dateTime = format(new Date(), 'yyyy-MM-dd-hh-mm');
const htmlData = (await makeCall()).data;
const dom = new JSDOM(htmlData);
const bodyContent = dom.window.document.body.innerHTML;

try {
  fs.writeFileSync(
    `${outputDir}/${dateTime}`,
    bodyContent
  );
} catch (err) {
  console.log('creating directory');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    `${outputDir}/${dateTime}`,
    bodyContent
  );
}
