import { createLogger, format, transports} from "winston";
import path from "path";
const { combine, timestamp, printf } = format;

interface CustomLogInfo {
  timestamp: string;
  level: string;
  message: string;
  file: string;
  line: number;
}

const customFormat = printf((info) => {
  const { timestamp, level, message, file, line } = info;
  return `${timestamp} [${level}] ${file}:${line} - ${message}`;
});

const logger = createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(timestamp(), customFormat),
    }),
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.File({
      filename: "./logs/combined.log",
      level: "info",
      format: combine(timestamp(), format.json()),
    }),
  ],
});

function logWithLocation(level: string, message: string): void {
  const stack = new Error().stack?.split("\n")[2];
  const matched = stack?.match(/at (?:.*\()?(.*):(\d+):\d+\)?/);
  const file = path.relative(process.cwd(), matched![1]);
  const line = parseInt(matched![2]);

  logger.log({
    level,
    message,
    file,
    line,
  });
}

export default logWithLocation;
