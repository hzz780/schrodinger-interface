import { Modal } from 'antd';
import styles from './style.module.css';
import { useMount } from 'ahooks';
import { useState } from 'react';
import Image from 'next/image';

export default function Loading() {
  const [visible, setVisible] = useState(false);
  useMount(() => {
    setVisible(true);
  });
  return (
    <div className="bg-black opacity-60">
      <Modal
        className={styles.loading}
        open={visible}
        footer={null}
        closable={false}
        closeIcon={null}
      >
        <section className="flex flex-col justify-center items-center">
          <Image
            className={styles.loadingImg}
            src={require('assets/img/loading.svg').default}
            alt="loading"
            width={40}
            height={40}
          />
          <span className="mt-[12px] text-[#1A1A1A] text-[14px] leading-[20px] font-normal text-center">
            Enrollment in progress
          </span>
        </section>
      </Modal>
    </div>
  );
}
