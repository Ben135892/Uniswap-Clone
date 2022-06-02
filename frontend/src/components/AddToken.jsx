import { useState } from "react";
import { isAddress } from "ethers/lib/utils";

import { abi as exchangeAbi } from "../Exchange.json";
import { abi as tokenAbi } from "../Token.json";
import { address as factoryAddress, abi as factoryAbi } from "../Factory.json";

import convertToEth from '../utils/convertToEth';
import getContract from '../utils/getContract';

import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AddToken = ({ allTokens, allExchanges, setAllTokens, setAllExchanges }) => {
    const [show, setShow] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [exchangeAddress, setExchangeAddress] = useState('');
    const [error, setError] = useState('');
    const [added, setAdded] = useState(false);
    
    const handleClose = () => {
        setShow(false);
        setError('');
        setTokenAddress('');
        setTokenSymbol('');
        setExchangeAddress('');
        setAdded(false);
    }
    const handleShow = () => setShow(true);

    const tokenChange = async (e) => {
        const tokenAddress = e.target.value;
        let symbol;
        setTokenAddress(tokenAddress);
        setTokenSymbol('');
        setAdded(false);

        if (!isAddress(tokenAddress)) {
            setError('Invalid token address');
            return;
        }
        try {
            const tokenContract = getContract(tokenAddress, tokenAbi);
            symbol = await tokenContract.symbol();
            setTokenSymbol(symbol);
        } catch(e) {
            setError('No token found');
            return;
        }

        const factoryContract = getContract(factoryAddress, factoryAbi);
        
        const exchange = await factoryContract.getExchange(tokenAddress);
        if (exchange.toString() == 0) {
            setError('No pool found');
            return;
        }
        setExchangeAddress(exchange);
        setError('');
    }

    const addToken = () => {
        setAdded(false);
        if (allTokens.map(token => token.address).includes(tokenAddress)) {
            setError('Token already added!');
            return;
        }
        const newAllTokens = [...allTokens, { address: tokenAddress, symbol: tokenSymbol }];
        const newAllExchanges = [...allExchanges, exchangeAddress];
        setAllTokens(newAllTokens);
        setAllExchanges(newAllExchanges);

        localStorage.setItem('allTokens', JSON.stringify(newAllTokens));
        localStorage.setItem('allExchanges', JSON.stringify(newAllExchanges));
        
        setAdded(true);
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Add Token</Button>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                <Modal.Title>Add Token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group className="mb-3">
                <Form.Label htmlFor="tokenAddress">Token Address</Form.Label>
                <Form.Control id="tokenAddress" placeholder="Address" value={tokenAddress} onChange={tokenChange} />
                </Form.Group>
                {error && <h3>{error}</h3>}
                {tokenSymbol && <h3>{tokenSymbol}</h3>}
                {added && <h3>Token added!</h3>}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button disabled={error != '' && tokenAddress != ''} variant="primary" onClick={addToken}>
                    Add Token
                </Button>
                </Modal.Footer>
            </Modal>
        </div>

        
    )
}

export default AddToken;