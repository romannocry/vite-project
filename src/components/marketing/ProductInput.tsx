import React from "react"

type Props = {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  placeholder?: string
}

function ProductInput({ value, onChange, disabled = false, placeholder = "Enter product name" }: Props){
    return (
        <input
            className="mp-product-input"
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}

export default ProductInput