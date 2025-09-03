
export function TextSize({value, size}){
    switch (size){
        case 'h1': return <h1>{value}</h1>
        case 'h2': return <h2>{value}</h2>
        case 'h3': return <h3>{value}</h3>
        case 'h4': return <h4>{value}</h4>
    }

}