import React from 'react'
import { EMAIL_DOMAINS } from "../constants";

const EmailAutocomplete = ({email}) => (
    <>
       <datalist id={"email"}>
           {EMAIL_DOMAINS.map((domain) => <option value={`${email}@${domain}`} />)}
       </datalist>
    </>
)

export default EmailAutocomplete;