import envs from '@main/envs';
import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import pino, { Logger } from 'pino';
import { ILoggerDataDTO } from './DTO/ILoggerDataDTO';

type IParseLoggerInputToPinoFormatParams<Payload, Type> = {
  message: string;
  loggerData?: ILoggerDataDTO<Payload, Type>;
};

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  readonly instance: Logger;
  readonly envs: any;

  constructor() {
    super();
    this.envs = envs();
    this.instance = pino({
      level: this.envs.LOGGER_LEVEL || 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: false,
        },
      },
    });
  }

  private parseLoggerInputToPinoFormat<Payload, Type>({
    message,
    loggerData,
  }: IParseLoggerInputToPinoFormatParams<Payload, Type>) {
    const { payload } = loggerData ?? {};

    return {
      msg: message,
      payload,
    };
  }

  log<Payload>(
    message: any,
    ...optionalParams: Array<ILoggerDataDTO<Payload, 'log'> | string>
  ): void {
    let loggerData: ILoggerDataDTO<Payload, 'log'> | undefined;
    let tag: string | undefined;

    if (typeof optionalParams[optionalParams.length - 1] === 'string') {
      tag = optionalParams.pop() as string;
    }
    if (optionalParams.length > 0) {
      loggerData = optionalParams[0] as ILoggerDataDTO<Payload, 'log'>;
    }

    this.instance.info(
      this.parseLoggerInputToPinoFormat<Payload, 'log'>({
        loggerData,
        message,
      }),
      tag,
    );
  }

  error<Payload>(
    message: any,
    ...optionalParams: [...any, string?, string?]
  ): void {
    let loggerData: ILoggerDataDTO<Payload, 'error'> | undefined;
    let tag: string | undefined;

    if (typeof optionalParams[optionalParams.length - 1] === 'string') {
      tag = optionalParams.pop() as string;
    }
    if (optionalParams.length > 0) {
      loggerData = optionalParams[0] as ILoggerDataDTO<Payload, 'error'>;
    }

    this.instance.error(
      this.parseLoggerInputToPinoFormat<Payload, 'error'>({
        loggerData,
        message,
      }),
      tag,
    );
  }

  warn<Payload>(
    message: any,
    ...optionalParams: [...any, string?, string?]
  ): void {
    let loggerData: ILoggerDataDTO<Payload, 'warn'> | undefined;
    let tag: string | undefined;

    if (typeof optionalParams[optionalParams.length - 1] === 'string') {
      tag = optionalParams.pop() as string;
    }
    if (optionalParams.length > 0) {
      loggerData = optionalParams[0] as ILoggerDataDTO<Payload, 'warn'>;
    }

    this.instance.warn(
      this.parseLoggerInputToPinoFormat<Payload, 'warn'>({
        loggerData,
        message,
      }),
      tag,
    );
  }

  debug<Payload>(
    message: any,
    ...optionalParams: [...any, string?, string?]
  ): void {
    let loggerData: ILoggerDataDTO<Payload, 'debug'> | undefined;
    let tag: string | undefined;

    if (typeof optionalParams[optionalParams.length - 1] === 'string') {
      tag = optionalParams.pop() as string;
    }
    if (optionalParams.length > 0) {
      loggerData = optionalParams[0] as ILoggerDataDTO<Payload, 'debug'>;
    }

    this.instance.debug(
      this.parseLoggerInputToPinoFormat<Payload, 'debug'>({
        loggerData,
        message,
      }),
      tag,
    );
  }
}
