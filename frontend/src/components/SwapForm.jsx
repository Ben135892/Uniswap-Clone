import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

import getContract from "../utils/getContract";
import { abi } from '../Exchange.json';
import round from "../utils/round";

function SwapForm({ address, value1, value2, token1, token2, inputHandler, submitHandler, minAmount, setMinAmount }) {
    const [price, setPrice] = useState(0);
    const [hasReserves, setHasReserves] = useState(true);
    useEffect(() => {
        (async () => {
            const exchangeContract = getContract(address, abi);
            const reserves = await exchangeContract.getReserve();
            if (reserves.toString() == 0) {
                setHasReserves(false);
                setPrice(0);
                return;
            }
            if (token1 == 'ETH') {
                const price = await exchangeContract.getEthPrice();
                setPrice(price / 10000);
                
            } else {
                const price = await exchangeContract.getTokenPrice();
                setPrice(price / 10000);
                
            }
            setHasReserves(true);
        })();
    }, [value1, token1, token2, address]);

    return (
        <div>
            <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="token" >{token1}</Form.Label>
                <Form.Control autoComplete={"off"} value={value1} onChange={inputHandler} disabled={!hasReserves} placeholder="Amount" />
                <Form.Text className="text-muted">
                    {!hasReserves ? "No liquidity in pool" : `1 ${token1} = ${price} ${token2}`}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label className="token" >{token2}</Form.Label>
                <Form.Control value={round(value2)} disabled placeholder="Amount" />
                <Form.Text className="text-muted">
                    Mininum: {round(minAmount)}
                </Form.Text>
            </Form.Group>
            <Button className="button" variant="dark" onClick={submitHandler}>Swap</Button>
            </Form>
        </div>
    );
}

export default SwapForm;