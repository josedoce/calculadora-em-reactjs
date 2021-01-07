const validadorCalc = /^([0-9]|-|\+|\*|\/|\.)*$/;

const keyboard = [
    7,8,9,'/','C',
    4,5,6,'*','Del',
    1,2,3,'-','Ad',
    0,'.','+','='
];

const adKey = [
    '(',')','Hist','Up','AC'
];

const Header = () => <div className='header'>Calculadora</div>;

const Button = ({value, onClick, className}) => {
    return (
        <button
            onClick={() => {
                onClick(value);
            }}
            className={className}>
            {value}
        </button>
    );
}

const Calculator = () => {

    const [display, setDisplay] = React.useState('');

    const [erro, setErro] = React.useState();

    const [showAd, toggleAd] = React.useState(false);

    const [history, setHistory] = React.useState([]);

    const [showHist, setHist] = React.useState(false);

    const histRef = React.useRef();

    React.useEffect(()=>{
        if(erro){
            setErro();
        }
    }, [display]);

    React.useEffect(()=>{
        if(history.length > 2 && showHist){
            histRef.current.scrollTop = histRef.current.scrollHeight;
            histRef.current.backgroundColor = '#202020';
        }
    }, [history.length, showHist]);

    const doTheMath = () => {
        try {

            const result = eval(display);

            setHistory([].concat(history, {
                calculation: display,
                result
            }));
            setDisplay(`${result}`);
        } catch (error) {
            setErro('Expressão invalida!')
        }
    }

    const doTheDelete = () => {
        setDisplay('');
    }

    const handleClick = (value) => {
        switch (value) {
            case '=':
                doTheMath();
                break;
            case 'C':
                doTheDelete();
                break;
            case 'Del':
                setDisplay(display.substring(0, display.length - 1));
                break;
            case 'Ad':
                toggleAd(!showAd);
                setHist(!showHist);
                break;
            case 'Hist':
                setHist(!showHist);
                break;
            case 'AC':
                setDisplay('');
                setHistory([]);
                break;
            case 'Up':

                const lastIndex = history.length-1;

                if(lastIndex > -1){

                    const newDisplay = history[lastIndex].calculation;

                    const newHistory = history.slice(0, lastIndex);

                    setDisplay(newDisplay);
                    setHistory(newHistory);
                }
                break;
            default:
                setDisplay(`${display}${value}`);
        }
    }
    const buildButtonKey = value => {

        const span2Class = value === 0 ? 'span2' : '';

        const primaryClass = isNaN(value) ? 'primary': '';

        return (
            <Button 
                key={value} 
                value={value}
                onClick={handleClick}
                className={`${span2Class} ${primaryClass}`}
            />    
        )
    }
    return (
    <div className='calculator'>
        {showHist && (
            <div ref={histRef} className='history'>
                {history.map(({calculation, result},index)=>(
                    <p key={index}>
                        {`${calculation} = ${result}`}
                    </p>
                ))}
            </div>
        )}
        <input
            type='text'
            className='display'
            value={display}
            onChange={(event)=>{
                const {value} = event.target;
                if(validadorCalc.test(value)){
                    setDisplay(event.target.value)
                }
                
            }}
            onKeyPress={(event)=>{
                if(event.key === 'Enter'){
                    doTheMath();
                }else if(event.key.toLowerCase() === 'c'){
                    setDisplay('');
                }
            }}
            />
           
        {erro && (<p className='error'>{erro}</p>)}
        {showAd && (
            <div className='keyboard'>
                {adKey.map(buildButtonKey)}
            </div>
        )}
        
        <div className='keyboard'>
            {keyboard.map(buildButtonKey)}
        </div>
    </div>
    );
}

const App = () => {
    return(
        <div>
            <Header />
            <Calculator />
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);