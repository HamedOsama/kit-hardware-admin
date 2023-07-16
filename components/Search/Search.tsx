import Input from '@components/Input/Input'
import { FC } from 'react'

interface SearchProps {
  setValue: (value: string) => void
  value: string
}

const Search: FC<SearchProps> = ({ setValue, value }) => {

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return <div className="container py-4 md:px-3 lg:px-4 mt-4 mx-auto">
    <Input
      placeholder='Product Name'
      label=''
      name='search'
      type='text'
      value={value}
      onChange={onChangeHandler}
    />
  </div>
}

export default Search