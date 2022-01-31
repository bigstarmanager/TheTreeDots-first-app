import fs from 'fs';
import path from 'path';
import utils from 'util';
import puppeteer from 'puppeteer';
import hdb from 'handlebars';

const { NODE_ENV, IMAGES, IMAGES_UAT } = process.env;

const readFile = utils.promisify(fs.readFile);

/**
 * Reference: https://medium.com/@hardeek.sharma/converting-html-template-to-pdf-using-nodejs-2eff0247b50
 */
class PDF {
  browser: any = null;
  templateName: string;
  /**
   *
   * @param {string} templateName
   * @param {puppeteer.Browser} browser
   */
  constructor(templateName: string, browser = null) {
    this.browser = browser;
    this.templateName = templateName;

    hdb.registerHelper('times', function (n, block) {
      let accum = '';
      for (let i = 0; i < n; ++i) accum += block.fn(i);
      return accum;
    });
  }
  async getTemplateHtml(): Promise<string> {
    const templatePath = path.resolve('./src/types/utils/pdf/template', this.templateName + '.html');
    const isExist = fs.existsSync(templatePath);
    if (!isExist) {
      throw new Error('Template does not exists');
    }

    const file = await readFile(templatePath, { encoding: 'utf8' });
    return file;
  }
  /**
   * @returns {PDF}
   */
  async startPuppeteer(): Promise<any> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    this.browser = browser;
    return this;
  }

  async closePuppeteer(): Promise<void> {
    await this.browser.close();
  }
  parseHtml(rawHtml: string, data: any): string {
    const template = hdb.compile(rawHtml);
    return template(data);
  }
  async generatePDF(
    data: any,
    options: any = {
      format: 'A4',
      margin: {
        top: '20px',
        left: '20px',
        right: '20px',
        bottom: '20px'
      }
    },
    output = 'buffer'
  ) {
    const content = await this.getTemplateHtml();
    const parsedHtml = this.parseHtml(content, data);
    const page = await this.browser.newPage();
    await page.setContent(parsedHtml, {
      waitUntil: 'networkidle0'
    });

    if (output === 'base64') {
      const pdfBuffer = await page.pdf(options);
      await page.close();

      const pdfBase64 = pdfBuffer.toString('base64');
      return pdfBase64;
    }

    if (output === 'buffer') {
      const pdfBuffer = await page.pdf(options);
      await page.close();

      return pdfBuffer;
    }
  }
}

export default PDF;
