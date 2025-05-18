import React from 'react';
import styles from './DashboardHeader.module.css';

const DEFAULT_TASKS = [
  'Добавить 3 новых товара',
  'Сделать 5 расчетов',
  'Проанализировать прибыль',
];

export default function DashboardHeader({ user, goal = 100000, progress = 0, tasks }) {
  const displayName = user?.displayName || '';
  const tasksList = tasks || DEFAULT_TASKS;
  return (
    <div className={styles['dashboard-welcome']}>
      <div className={styles['welcome-block']}>
        <div className={styles['welcome-title']}>
          Добро пожаловать{displayName ? ',' : ''} <span className={styles['welcome-accent']}>{displayName && displayName + '!'}</span>
        </div>
        <div className={styles['progress-bar-area']}>
          <span className={styles['goal-inline']}>
            <span className={styles['goal-label']}>Цель:</span>
            <span className={styles['goal-value']}>{goal.toLocaleString()}₽</span>
            <span className={styles['progress-percent']}>{progress}%</span>
          </span>
          <div className={styles['progress-bar']}>
            <div className={styles['progress-bar-fill']} style={{width: `${progress}%`}} />
            <div className={styles['progress-bar-value']} style={{left: `${progress}%`}}>{progress}% выполнено</div>
          </div>
        </div>
      </div>
      <div className={styles['plan-block']}>
        <div className={styles['plan-title']}>📅 План на неделю</div>
        <ul className={styles['plan-list']}>
          {tasksList.map((task, i) => (
            <li key={i} className={styles['plan-item']}>
              <label className={styles['plan-checkbox-label']}>
                <input type="checkbox" className={styles['plan-checkbox']} />
                {task}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
