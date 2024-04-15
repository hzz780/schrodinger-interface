import { Input, IInputProps } from 'aelf-design';
import { ReactComponent as SearchIcon } from 'assets/img/search.svg';

export default function CommonSearch(props: Omit<IInputProps, 'prefix'>) {
  return <Input {...props} prefix={<SearchIcon />} />;
}
