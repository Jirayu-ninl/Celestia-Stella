import { requestContext } from '../requestContext'
import type { Logger, LoggerConfiguration } from './lib/definition'
import PinoLogger from './lib/pino.logger'

export class AdvLogger implements Logger {
  private _underlyingLogger: Logger | null = null

  private _getInitializeLogger(): Logger {
    this.configureLogger({}, false)
    // biome-ignore lint/style/noNonNullAssertion: <fix later>
    return this._underlyingLogger!
  }

  configureLogger(
    configuration: Partial<LoggerConfiguration>,
    overrideIfExists = true,
  ): void {
    if (this._underlyingLogger === null || overrideIfExists === true) {
      this._underlyingLogger = new PinoLogger(
        configuration.level || 'info',
        configuration.prettyPrint || false,
      )
    }
  }

  resetLogger() {
    this._underlyingLogger = null
  }

  debug(message: string, metadata?: object): void {
    this._getInitializeLogger().debug(
      message,
      AdvLogger._insertContextIntoMetadata(metadata),
    )
  }

  error(message: string, metadata?: object): void {
    this._getInitializeLogger().error(
      message,
      AdvLogger._insertContextIntoMetadata(metadata),
    )
  }

  info(message: string, metadata?: object): void {
    // If never initialized, the set default configuration
    this._getInitializeLogger().info(
      message,
      AdvLogger._insertContextIntoMetadata(metadata),
    )
  }

  warning(message: string, metadata?: object): void {
    this._getInitializeLogger().warning(
      message,
      AdvLogger._insertContextIntoMetadata(metadata),
    )
  }

  private static _insertContextIntoMetadata(
    metadata?: object,
  ): object | undefined {
    const currentContext = requestContext().getStore()

    // Doing this to avoid merging objects...
    if (currentContext == null) {
      return metadata
    }

    if (metadata == null) {
      return currentContext
    }

    // Metadata would override the current context
    return { ...currentContext, ...metadata }
  }
}

export const advLogger = new AdvLogger()
