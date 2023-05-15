export function LogTimeProcessing(
  target,
  name,
  descriptor: TypedPropertyDescriptor<any>,
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args) {
    const logger = this.logger
    if (!logger) {
      return originalMethod.apply(this, args)
    }

    const now = Date.now()
    const result = originalMethod.apply(this, args)

    const printLog = (msg = `Processing time ${name}`): void => {
      logger.debug({ ...args, processingTime: `${Date.now() - now} ms` }, msg)
    }

    if ('then' in result === false) {
      printLog()
      return result
    }

    return result
      .then((value) => {
        printLog()
        return value
      })
      .catch((err) => {
        printLog()
        throw err
      })
  }
}
