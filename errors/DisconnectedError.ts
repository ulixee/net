import { CanceledPromiseError } from '@ulixee/commons/interfaces/IPendingWaitEvent';
import { registerSerializableErrorType } from '@ulixee/commons/lib/TypeSerializer';

export default class DisconnectedError extends CanceledPromiseError {
  public code = 'DisconnectedError';
  constructor(readonly host: string) {
    super(`This transport has been disconnected (host: ${host})`);
    this.name = 'DisconnectedError';
  }
}
registerSerializableErrorType(DisconnectedError);
