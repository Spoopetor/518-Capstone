import { React, useState } from 'react';
import { Container, Image, Row, Col, Dropdown} from 'react-bootstrap';
import { SignedIn, SignedOut, UserButton, useUser} from '@clerk/clerk-react'
import useSWR from 'swr';

const countryCodes = [
  "none",
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN",
  "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA",
  "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BM",
  "BN", "BO", "BR", "BS", "BT", "BW", "BY", "BZ",
  "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM",
  "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE",
  "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER",
  "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA",
  "GB", "GD", "GE", "GG", "GH", "GI", "GL", "GM", "GN",
  "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK",
  "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN",
  "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE",
  "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ",
  "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV",
  "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML",
  "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV",
  "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI",
  "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE",
  "PF", "PG", "PH", "PK", "PL", "PN", "PR", "PS", "PT",
  "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB",
  "SC", "SD", "SE", "SG", "SH", "SI", "SK", "SL", "SM",
  "SN", "SO", "SR", "SS", "ST", "SV", "SY", "SZ", "TC",
  "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
  "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY",
  "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS",
  "YE", "YT", "ZA", "ZM", "ZW"
];

const backendFetcher = async (url) => {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export default function Profile() {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const { isLoaded, isSignedIn, user } = useUser();

    const [selectedCountry, setSelectedCountry] = useState("none");

    const syncCountry = (fetchedData) => {
        if (fetchedData?.country) {
            setSelectedCountry(fetchedData.country);
        }
    };

    const { data, error, isLoading } = useSWR(
        user?.id ? `${backendURL}/api/user/${user.id}` : null, 
        backendFetcher, 
        {
            onSuccess: syncCountry
        }
    );

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    if (!isSignedIn) {
        return <h2>Sign in to view profile.</h2>;
    }

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error loading profile data: {error.message}</h2>;
    }

    

    const selectCountry = (eventKey => {
        setSelectedCountry(eventKey);
        fetch(`${backendURL}/api/user/country/${user.id}/${eventKey}`, {
            method: 'PUT',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update country');
            }
            return response.json();
        })
        .then(updatedUser => {
            console.log('Country updated successfully:', updatedUser);
        })
        .catch(error => {
            console.error('Error updating country:', error);
        });
    })

    return <Container fluid className="mx-4"> 
        <Row className="justify-content-center"> 
            <SignedOut> 
            <Col md={6}> 
                <h1>Sign in to view profile.</h1> 
            </Col> 
            </SignedOut> 
            <SignedIn> 
            <Row className="justify-content-center">
                <Col md={3}> 
                <div className="d-flex align-items-center"> 
                    <div className="p-3"> 
                    <Image src={data.imageUrl} alt="User Avatar" roundedCircle style={{ width: '80px', height: '80px' }}></Image> 
                    </div> 
                    <h1>{data.name}</h1> 
                </div> 
                </Col>
                <Col md={3}> 
                <div className="d-flex align-items-center"> 
                    <span className="p-3">
                        {selectedCountry !== "none" ? <Image src={`https://flagsapi.com/${selectedCountry}/flat/64.png`} alt={`${selectedCountry} Flag`}/> : <Image src="./src/assets/earth.png" alt={`Earth`} style={{width: '64px', height: '64px'}}/>}
                    </span>
                    <Dropdown onSelect={selectCountry}>
                    <Dropdown.Toggle variant="success" id="dropdown-country">
                        {selectedCountry === "none" ? "Select Country" : selectedCountry}
                    </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {countryCodes.map((code) => (
                            <Dropdown.Item key={code} eventKey={code}>
                                <Container flex>
                                    <span className="p-1">
                                        {code !== "none" ? <Image src={`https://flagsapi.com/${code}/flat/32.png`} alt={`${code} Flag`}/> : <Image src="./src/assets/earth.png" alt={`Earth`} style={{width: '32px', height: '32px'}}/>}
                                    </span>
                                    <b>{code === "none" ? "Earth" : code}</b>
                                </Container> 
                            </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div> 
                </Col> 
            </Row>
            </SignedIn> 
        </Row> 
        </Container>
    
}