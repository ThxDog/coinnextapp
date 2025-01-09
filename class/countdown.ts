export class CountdownTimer {
  private totalTime: number;
  private intervalId: NodeJS.Timeout | null;

  constructor(totalSeconds: number) {
    this.totalTime = totalSeconds;
    this.intervalId = null;
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  start() {
    this.intervalId = setInterval(() => {
      if (this.totalTime <= 0) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        console.log("Time's up!");
      } else {
        this.totalTime--;
        console.log(this.formatTime(this.totalTime));
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  reset(totalSeconds: number) {
    this.stop();
    this.totalTime = totalSeconds;
    this.start();
  }
}

// Exemplo de uso
const countdown = new CountdownTimer(3600); // 1 hora = 3600 segundos
countdown.start();
