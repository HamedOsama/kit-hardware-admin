import React from 'react'

interface ITableHeadProp {
  title: string
}
const TableHead = ({title} :ITableHeadProp ) => {
  return (
    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 whitespace-nowrap">
      <span>{title}</span>
    </th>
  )
}

export default TableHead