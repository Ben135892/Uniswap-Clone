import { useState } from "react";
import Form from "react-bootstrap/Form";

const SelectToken = ({ allTokens, index, setIndex, getUserInfo }) => {
    const tokenChange = (e) => {
        setIndex(e.target.value);
        console.log("finished set");
    }
    return (
        <Form.Select size="sm" value={index} onChange={tokenChange} aria-label="Default select example">
        {
            allTokens.map((token, index) => {
                return (
                    <option key={token.address} value={index}>
                        {token.symbol}
                    </option>
                )
            })
        }
      </Form.Select>
    )
}

export default SelectToken