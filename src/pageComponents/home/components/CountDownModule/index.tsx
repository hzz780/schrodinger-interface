import { useCountDown } from 'ahooks';
import styles from './style.module.css';

export default function CountDownModule({ targetDate }: { targetDate: Date }) {
  const [countdown, formattedRes] = useCountDown({
    targetDate,
  });
  return (
    <div className="flex gap-[4px] items-center">
      <span className={styles.timeText}>{formattedRes.days}</span>
      <span className={styles.timeType}>D</span>
      <span className={styles.timeText}>{formattedRes.hours}</span>
      <span className={styles.timeType}>H</span>
      <span className={styles.timeText}>{formattedRes.minutes}</span>
      <span className={styles.timeType}>M</span>
      <span className={styles.timeText}>{formattedRes.seconds}</span>
      <span className={styles.timeType}>S</span>
    </div>
  );
}
