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

const CreatePool = () => {
    const [show, setShow] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [error, setError] = useState('');
    const [added, setAdded] = useState(false);
    
    const handleClose = () => {
        setShow(false);
        setError('');
        setTokenAddress('');
        setTokenSymbol('');
        setAdded(false);
    }

    const handleShow = () => setShow(true);

    const tokenChange = async (e) => {
        const tokenAddress = e.target.value;
        setTokenAddress(tokenAddress);
        setTokenSymbol('');
        setAdded(false);

        if (!isAddress(tokenAddress)) {
            setError('Invalid token address');
            return;
        }
        try {
            const tokenContract = getContract(tokenAddress, tokenAbi);
            const symbol = await tokenContract.symbol();
            setTokenSymbol(symbol);
            setError('');
        } catch(e) {
            setError('No token found');
        }
    }

    const createPool = async () => {
        const factoryContract = getContract(factoryAddress, factoryAbi);
        const address = await factoryContract.getExchange(tokenAddress);
        if (address.toString() != 0) {
            setError('Pool already created!');
            return;
        }
        let transaction = await factoryContract.createExchange(tokenAddress);
        await transaction.wait();
        setAdded(true);
    }

    return (
        <div>
            <button onClick={handleShow}>Create Pool</button>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                <Modal.Title>Create Pool</Modal.Title>
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
                <Button disabled={error != '' && tokenAddress != ''} variant="primary" onClick={createPool}>
                    Create Pool
                </Button>
                </Modal.Footer>
            </Modal>
        </div>

        
    )
}

export default CreatePool;