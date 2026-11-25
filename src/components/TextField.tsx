import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react'

interface TextFieldProps {
  label: string
  name: string
  value: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  placeholder?: string
  error?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: FocusEvent<HTMLInputElement>) => void
}

export default function TextField({
  label,
  name,
  value,
  type = 'text',
  placeholder,
  error,
  required = false,
  min,
  max,
  step,
  onChange,
  onBlur,
}: TextFieldProps) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-bold text-[#333333]">
        {label} {required && <span className="text-[#b3261e">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onBlur={onBlur}
        className={`h-10 w-full border bg-white px-3 text-[13px] text-[#222222] outline-none placeholder:text-[#999999] focus:border-[#285d86] ${
          error ? 'border-[#b3261e] bg-[#fffafa]' : 'border-[#cccccc]'
        }`}
      />
      {error && <p className="mt-1 text-xs text-[#b3261e]">{error}</p>}
    </div>
  )
}