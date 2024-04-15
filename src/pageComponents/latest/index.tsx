import { Layout } from 'antd';
import List from './components/List';

export default function Latest() {
  return (
    <Layout className="py-12">
      <Layout className="w-full main:w-[1360px] mx-auto gap-10">
        <List />
      </Layout>
    </Layout>
  );
}
