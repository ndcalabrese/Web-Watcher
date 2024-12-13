import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import { HtmlDiffer } from 'html-differ';
import { getDiffText, logDiffText } from 'html-differ/lib/logger';
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
  const differ = new HtmlDiffer({
    ignoreAttributes: [
      'src'
    ],
    compareAttributesAsJSON: [],
    ignoreWhitespaces: true,
    ignoreComments: true,
    ignoreEndTags: false,
    ignoreDuplicateAttributes: false
  });
  const prevContent = fs.readFileSync(`${outputDir}/prev.txt`, 'utf8');
  const diff = differ.diffHtml(bodyContent, prevContent);
  const isEqual = differ.isEqual(bodyContent, prevContent);
  if (isEqual) {
    console.log(`No changes - ${dateTime}`);
  } else {
    console.log(`CHANGES DETECTED - ${dateTime}`);
    const diffText = getDiffText(
      diff,
      { charsAroundDiff: 80 }
    );
    fs.writeFileSync(
      `${outputDir}/diff_${dateTime}.txt`,
      JSON.stringify(diffText)
    );
    logDiffText(
      diff,
      { charsAroundDiff: 80 }
    );
    // send notification
  }
  fs.writeFileSync(
    `${outputDir}/prev.txt`,
    bodyContent
  );
} catch (err) {
  console.log(err);
  if (!fs.existsSync(outputDir)) {
    console.log('creating directory');
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      `${outputDir}/prev.txt`,
      bodyContent
    );
  }
}