import winston from "winston";
import path from "path";

class Logger {
  private static logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }) => {
        // Get stack trace and find the actual caller
        const stack = new Error().stack;

        // Traverse the stack to fetch the correct caller frame
        const callerFrame = stack
          ?.split("\n")
          .slice(3)
          .find((line) => {
            return !(line.includes("Logger.") || line.includes("node_modules"));
          });

        let location: string = "unknown location";

        if (callerFrame) {
          // Extract the full path, line number, and column from the stack trace
          const fullPathMatch = callerFrame.match(/^.*\((.*):(\d+):(\d+)\).*$/);

          if (fullPathMatch) {
            let fullPath = fullPathMatch[1];
            const lineNumber = fullPathMatch[2];
            const columnNumber = fullPathMatch[3];

            // Resolve relative path from project root
            const projectRoot = path.resolve(process.cwd()); // Root of the project
            fullPath = fullPath.replace(projectRoot + "/", ""); // Remove absolute path up to project root

            location = `${fullPath}:${lineNumber}:${columnNumber}`;
          }
        }

        const logMessage = `${timestamp} [${level}] (${location}): ${message}`;
        // console.log(logMessage);
        return logMessage;
      }),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
    ],
  });

  // Log an INFO level message
  public static INFO(msg: string, obj?: object): void {
    const logMessage = obj ? `${msg} | Data: ${JSON.stringify(obj)}` : msg;
    Logger.logger.info(logMessage);
  }

  // Log a DEBUG level message
  public static DEBUG(msg: string, obj?: object): void {
    const logMessage = obj ? `${msg} | Data: ${JSON.stringify(obj)}` : msg;
    Logger.logger.debug(logMessage);
  }

  // Log a WARN level message
  public static WARN(msg: string, obj?: object): void {
    const logMessage = obj ? `${msg} | Data: ${JSON.stringify(obj)}` : msg;
    Logger.logger.warn(logMessage);
  }

  // Log an ERROR level message
  public static ERROR(msg: string, obj?: object): void {
    const logMessage = obj ? `${msg} | Data: ${JSON.stringify(obj)}` : msg;
    Logger.logger.error(logMessage);
  }
}

export default Logger;
