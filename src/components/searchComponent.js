import React from "react";
import { Form, InputGroup, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const SearchComponent = ({ searchValue, onSearchChange }) => {
  const handleChange = (value) => {
    onSearchChange(value);
  };

  return (
    <Form className="mb-2 steps_Search w-100">
      <Form.Group as={Row} className="mb-1">
        <Col className="p-2" xl={12} md={12} sm={12}>
          <InputGroup className="form-group-appned outerBorder">
            <Form.Control
              className="border-right-0 leftouterBorder"
              placeholder="Search here"
              value={searchValue}
              onChange={(e) => handleChange(e.target.value)}
              style={{ height: "62px" }}
            />
            <InputGroup.Append>
              <InputGroup.Text
                className={`search-icon  ${
                  searchValue ? "cursor-pointer" : ""
                } rightouterBorder`}
              >
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
  );
};

export default SearchComponent;
