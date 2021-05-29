import BounceLoader from 'react-spinners/BounceLoader';

const Loading = () => {
    return (
        <center style={{display: "grid", placeItems: "center", height: "100vh"}}>
            <div>
                <BounceLoader size={60} color={'#1393EE'} />
            </div>
        </center>
    );
};

export default Loading;