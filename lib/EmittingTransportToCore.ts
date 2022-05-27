import '@ulixee/commons/lib/SourceMapSupport';
import ITypedEventEmitter from '@ulixee/commons/interfaces/ITypedEventEmitter';
import ITransportToCore, { ITransportToCoreEvents } from '../interfaces/ITransportToCore';
import { TypedEventEmitter } from '@ulixee/commons/lib/eventUtils';
import IApiHandlers from '../interfaces/IApiHandlers';
import ICoreRequestPayload from '../interfaces/ICoreRequestPayload';

export default class EmittingTransportToCore<ApiHandlers extends IApiHandlers = any, Events = any>
  extends TypedEventEmitter<
    ITransportToCoreEvents<ApiHandlers, Events> & {
      outbound: ICoreRequestPayload<ApiHandlers, any>;
    }
  >
  implements
    ITransportToCore<ApiHandlers, Events>,
    ITypedEventEmitter<
      ITransportToCoreEvents<ApiHandlers, Events> & {
        outbound: ICoreRequestPayload<ApiHandlers, any>;
      }
    >
{
  host = 'direct';
  isConnected = true;

  send(message: ICoreRequestPayload<ApiHandlers, any>): Promise<void> {
    this.emit('outbound', message);
    return Promise.resolve();
  }
}
