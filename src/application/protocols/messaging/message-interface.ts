export interface MessageRabbitMQInterface {
  publishToQueue<T>(Message: T): Promise<T>
  receiveFromQueue<T>(Message: T): Promise<T>
}