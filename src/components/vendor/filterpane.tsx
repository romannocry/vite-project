interface FilterPaneProps {
    value: string,
    onFilterChange: (filterText: string) => void
}

export default function FilterPane({ value, onFilterChange }: FilterPaneProps) {
    return (
        <div>
            <input
                type="text"
                placeholder="Filter..."
                value={value}
                onChange={(e) => onFilterChange(e.currentTarget.value)}
            />
        </div>
    )
}