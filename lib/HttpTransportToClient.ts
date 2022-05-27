import TypeSerializer from '@ulixee/commons/lib/TypeSerializer';
import ITransportToClient, { ITransportToClientEvents } from '../interfaces/ITransportToClient';
import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import '@ulixee/commons/lib/SourceMapSupport';
import * as QueryString from 'querystring';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import IApiHandlers from '../interfaces/IApiHandlers';

export default class HttpTransportToClient<IClientApiSpec extends IApiHandlers, IEventSpec = any>
  extends TypedEventEmitter<ITransportToClientEvents<IClientApiSpec>>
  implements ITransportToClient<IClientApiSpec, IEventSpec>
{
  constructor(private request: IncomingMessage, private response: ServerResponse) {
    super();
  }

  public send(message: any): Promise<void> {
    const res = this.response;

    try {
      res.writeHead(200, {
        'Content-Type': 'text/json',
      });
      res.end(TypeSerializer.stringify(message));
    } catch (err) {
      res.writeHead(500);
      res.end(err.toString());
    }
    return Promise.resolve();
  }

  public async readRequest(): Promise<void> {
    const req = this.request;

    const body: Buffer[] = [];
    for await (const chunk of req) {
      body.push(chunk);
    }
    const bodyText = Buffer.concat(body).toString();
    const url = new URL(req.url, 'http://localhost/');
    const command = url.pathname.replace(/\//g, '') as any;
    let args: any;
    if (req.headers['content-type'] === 'text/json') {
      args = TypeSerializer.parse(bodyText);
    } else {
      args = QueryString.parse(bodyText);
    }

    this.emit('message', { args, command } as any);
  }
}
