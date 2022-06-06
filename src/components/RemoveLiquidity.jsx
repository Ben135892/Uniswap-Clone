import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { ethers } from "ethers";
import { abi as exchangeAbi } from '../Exchange.json';
import getContract from "../utils/getContract";

function RemoveLiquidity({ exchangeAddress, getUserInfo, getPoolInfo }) {
    const [tokens, setTokens] = useState('');

    const onTokenChange = (e) => {
        setTokens(e.target.value);
    }

    const removeLiquidity = async () => {
        const contract = getContract(exchangeAddress, exchangeAbi);
        const tokenAmount = ethers.utils.parseUnits(tokens, "ether");
        const transaction = await contract.removeLiquidity(tokenAmount);
        await transaction.wait();

        await getUserInfo();
        await getPoolInfo();
    }

    return (
        <div>
            <Form>
                <h2>Remove Tokens</h2>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>LP Tokens: </Form.Label>
                <Form.Control autoComplete={"off"} value={tokens} onChange={onTokenChange} placeholder="Amount" />
            </Form.Group>
            <Button className="button" variant="dark" onClick={removeLiquidity}>Remove Liquidity</Button>
            </Form>
        </div>
    );
}

export default RemoveLiquidity;