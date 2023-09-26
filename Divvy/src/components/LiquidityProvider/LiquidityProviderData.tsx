export const LiquidityProviderData = (props: { textContext: string, percentage: string, data: string }) => {
    return (
        <div style={{width:'100%', textAlign:'right', fontSize: "0.8rem"}}>
            {
                props.percentage === '' ?
                <p className="text-primary">{props.textContext}:</p>
                :
                <p className="text-primary">{props.textContext}: <span style={{color: "#16c57c"}}>{props.percentage}</span> </p>
            }
            <h3><span style={{fontSize: "1.6rem", fontWeight: 800}}>{props.data}</span></h3>
        </div>
    );
}