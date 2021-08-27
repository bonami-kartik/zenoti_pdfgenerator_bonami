import React from 'react';
import { Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';


const SearchComponent = ({
  searchValue,
  onSearchChange,
}) => {

  const handleChange = (value) => {
    onSearchChange(value);
  }

  return <Form className="mb-2">
    <Form.Group as={Row} className="mb-0">
      <Col className="col-lg-80 align-self-center">
        <Form.Label className="align-self-center">Search:</Form.Label>
      </Col>
      <Col className="p-2" xl={4} md={8} sm={12}>
        <InputGroup className="form-group-appned">
          <Form.Control
            className="border-right-0"
            placeholder="Search here"
            value={searchValue}
            onChange={(e) => handleChange(e.target.value)}
          />
          <InputGroup.Append>
            <InputGroup.Text className={`search-icon  ${searchValue ? 'cursor-pointer' : ''}`}>
              <FontAwesomeIcon
                icon={!searchValue ? faSearch : faTimes}
                onClick={() => {
                  if (searchValue) {
                    onSearchChange("");
                  }
                }}
              />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Form.Group>
  </Form>
}

export default SearchComponent;