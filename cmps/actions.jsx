
export function Actions({positiveCaption='Approve',positiveAction, negativeCaption='Cancle', negativeAction}){
    return (
        <section className="actions">
            <button onClick={positiveAction}>{positiveCaption}</button>
            <button onClick={negativeAction} >{negativeCaption}</button>
        </section>
    )
}