import puppeteer, { Browser, Page } from 'puppeteer';
import { PuppeteerScreenRecorder, PuppeteerScreenRecorderOptions } from 'puppeteer-screen-recorder';
import path from 'path';
import { URL } from 'url';

export async function recordVideo(urlOrPath: string): Promise<string> {
  // Simply replace .html with .mp4 - TODO NOT GOOD, PASS IN OUTPUT FILE DIRECTORY
  const outputFileName: string = urlOrPath.replace('html_snapshots', 'videos').replace('.html', '.mp4');
  
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ['--window-size=1920,1080']
  });
  
  const page: Page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const config: PuppeteerScreenRecorderOptions = {
    followNewTab: true,
    fps: 30,
    ffmpeg_Path: null,
    videoFrame: {
      width: 1920,
      height: 1080
    },
    aspectRatio: '16:9'
  };
  
  const recorder = new PuppeteerScreenRecorder(page, config);
  
  try {
    await recorder.start(outputFileName);
    
    const url: string = urlOrPath.startsWith('http') 
      ? urlOrPath
      : `file://${path.resolve(urlOrPath)}`;

    const navigateUrl = new URL(url);
    navigateUrl.searchParams.set('replay', 'true');
    await page.goto(navigateUrl.toString());
    
    console.log(`Recording started for ${url}`);
    console.log(`Output will be saved to: ${outputFileName}`);
    
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const checkCompletion = setInterval(() => {
          // Type assertion for window properties
          //@ts-ignore
          const currentIndex = (window as any).currentIndex as number;
          //@ts-ignore
          const snapshots = (window as any).snapshots as any[];
          
          if (currentIndex === snapshots.length - 1) {
            clearInterval(checkCompletion);
            resolve();
          }
        }, 1000);
      });
    });
    
    await recorder.stop();
    console.log(`Recording completed: ${outputFileName}`);
    
  } catch (error) {
    console.error(`Error recording ${urlOrPath}:`, error);
    throw error;
  } finally {
    await browser.close();
  }
  
  return outputFileName;
}

// TODO some day:
// Module usage example:
// recordVideo('./dev/html_snapshots/two-file-complex-edits-example-0.html')
//   -> Creates: two-file-complex-edits-example-0.mp4

// CLI implementation
// if (require.main === module) {
//   const urlOrPath = process.argv[2];
//   if (!urlOrPath) {
//     console.error('Please provide a path to the IDE HTML file');
//     process.exit(1);
//   }
  
//   recordVideo(urlOrPath)
//     .then((outputFile: string) => {
//       console.log('Recording saved to:', outputFile);
//       process.exit(0);
//     })
//     .catch((err: Error) => {
//       console.error('Error during recording:', err);
//       process.exit(1);
//     });
// }