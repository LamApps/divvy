export const DifferenceCard = (
    props: {
        image: string,
        description: string,
        title: string
    }
) => {
    return (
        <div className="card">
            <div className="card-image">
                <img src={props.image} alt={"Divvy is "+props.title} className="img-fluid" />
            </div>
            <div className="card-body">
                <div style={{marginTop: -10}}>
                    <h3 className="heading-sm" style={{color: '#656565'}}>Divvy is</h3>
                    <h3 className="heading-sm">{props.title}</h3>
                </div>
                <p>{props.description}</p>
            </div>
        </div>
    );
};
  