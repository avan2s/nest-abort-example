import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('foo')
  getHello(@Res() res: Response) {
    const line = 'John,Doe,20\n';
    const numLines = 5000000;
    let linesSent = 0;

    // Create a readable stream that generates lines of data on the fly
    const dataStream = new Readable({
      read() {
        if (linesSent === numLines) {
          console.log('end the stream');
          // End the stream when all data has been sent
          this.push(null);
        } else {
          // Generate a new line of data and push it to the stream
          linesSent++;
          this.push(line);
          console.log(linesSent);
        }
      },
    });

    res.on('close', () => {
      console.log(`client closed connection`);
      dataStream.destroy();
    });

    // Send the response with a content type of text/plain
    res.setHeader('Content-Type', 'text/plain');

    // Pipe the data stream to the response stream
    dataStream.pipe(res);
  }
}
