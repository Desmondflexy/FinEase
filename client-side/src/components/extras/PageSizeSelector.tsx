export function PageSizeSelector(props: { onLimitChange: (limit: number) => void }) {
    const { onLimitChange } = props;
    return (
        <div className="pg-size">
            <label htmlFor="pg-size">Size: </label>
            <select name="pg-size" id="pg-size" onChange={e => onLimitChange(+e.target.value)}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    )
}