import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

import getContract from "../utils/getContract";
import { abi } from '../Exchange.json';

function SwapForm({ address, value1, value2, token1, token2, inputHandler, submitHandler }) {
    const [price, setPrice] = useState('');
    const [hasReserves, setHasReserves] = useState(true);

    useEffect(() => {
        (async () => {
            const exchangeContract = getContract(address, abi);
            const reserves = await exchangeContract.getReserve();
            if (reserves.toString() == 0) {
                setHasReserves(false);
                setPrice('0');
                return;
            }
            setHasReserves(true);
            if (token1 == 'ETH') {
                const price = await exchangeContract.getEthPrice();
                setPrice(price / 1000);
            } else {
                const price = await exchangeContract.getTokenPrice();
                setPrice(price / 1000);
            }
        })();
    }, [value1, token1, token2, address]);

    return (
        <div>
            <Form>
            {!hasReserves && <h2>No Reserves, cannot swap!</h2>}
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>{token1}</Form.Label>
                <Form.Control value={value1} onChange={inputHandler} disabled={!hasReserves} placeholder="Amount" />
                <Form.Text className="text-muted">
                    {price && `1 ${token1} = ${price} ${token2}`}
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>{token2}</Form.Label>
                <Form.Control value={value2} disabled placeholder="Amount" />
            </Form.Group>
            <Button variant="dark" onClick={submitHandler}>Swap</Button>
            </Form>
        </div>
    );
}

export default SwapForm;