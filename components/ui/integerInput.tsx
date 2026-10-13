import { ChangeEvent, KeyboardEvent } from "react"
import { Input } from "./input"

type IntegerInputProps = {
  value: string | number
  min: number
  max?: number
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

function IntegerInput({
  value,
  min,
  max,
  onChange,
  className,
  placeholder,
}: IntegerInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ]

    if (allowedKeys.includes(e.key)) return

    if (!/^\d$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    let inputValue = e.target.value

    // Chỉ giữ số
    inputValue = inputValue.replace(/\D/g, "")

    // Cho phép rỗng
    if (inputValue === "") {
      onChange("")
      return
    }

    const numberValue = Number(inputValue)

    // Nhỏ hơn min
    if (numberValue < min) {
      onChange("")
      return
    }

    // Lớn hơn max
    if (max !== undefined && numberValue > max) {
      onChange(String(max))
      return
    }

    onChange(inputValue)
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={value}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
    />
  )
}

export default IntegerInput