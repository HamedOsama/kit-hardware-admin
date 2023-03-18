import React, { FC } from 'react'
import s from './Quantity.module.css'
import { Cross, Plus, Minus } from '@components/icons'
import cn from 'clsx'
export interface QuantityProps {
  value: number
  increase: () => any
  decrease: () => any
  handleRemove: React.MouseEventHandler<HTMLButtonElement>
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  max?: number
}

const Quantity: FC<QuantityProps> = ({
  value,
  increase,
  decrease,
  handleChange,
  handleRemove,
  max = 6,
}) => {
  return (
    <div className="flex flex-row h-9">
      <button type='button' aria-label='delete' className={s.actions} onClick={handleRemove}>
        <Cross width={20} height={20} />
      </button>
      <label className="w-full border-accent-2 border ml-2">
        <input
          aria-label='quantity'
          className={s.input}
          onChange={(e) =>
            Number(e.target.value) < max + 1 ? handleChange(e) : () => {}
          }
          value={value}
          type="number"
          max={max}
          min="0"
          readOnly
        />
      </label>
      <button
        type='button' 
        aria-label='decrease'
        onClick={decrease}
        className={s.actions}
        style={{ marginLeft: '-1px' }}
        disabled={value <= 1}
      >
        <Minus width={18} height={18} />
      </button>
      <button
        type="button"
        aria-label='increase'
        onClick={increase}
        className={cn(s.actions)}
        style={{ marginLeft: '-1px' }}
        disabled={value < 1 || value >= max}
      >
        <Plus width={18} height={18} />
      </button>
    </div>
  )
}

export default Quantity
