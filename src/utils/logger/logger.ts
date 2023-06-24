import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, metadata, colorize } = format;
import path from "path";

//Logger output Format for file(error messages)
const logFormat = printf(({ level, label, timestamp, ...meta }) => {
  return `[${level}] ${timestamp} ${label}: ${JSON.stringify(meta)}`;
});
//Logger output Format for console(info,warn,error messages)
const consoleFormat = printf(({ level, label, timestamp, message }) => {
  return `[${level}] ${timestamp} ${label}: ${message}`;
});
const logger = createLogger({
  transports: [
    //Console - Log all level
    new transports.Console({
      format: combine(
        colorize({ all: <boolean>false, level: <boolean>true }),
        consoleFormat
      ),
    }),
    //File - Log error
    new transports.File({
      level: "error" as string,
      filename: path.join(__dirname, "logger.log") as string,
      format: logFormat,
    }),
  ],
  format: combine(
    label({ label: "Scissors-Logger" }),
    timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
    logFormat
  ),
});

export default logger;
