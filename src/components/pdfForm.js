import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button, Row, Col, Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

const PdfForm = ({
  togglePdfModal,
  previewPdf,
  updatePdfData,
  pdfData,
  generatePdf,
}) => {
  const { register, errors, setValue, watch } = useForm({ defaultValues: pdfData, mode: "onChange" });

  useEffect(() => {
    const data = { ...watch() };
    updatePdfData(data);
  }, [JSON.stringify(watch())])

  return (
    <Form>
      <Row>
        <Col md={12}>
          <FormGroup as={Row} controlId="pdf-blurb">
            <FormLabel column md={2} sm={3} className="text-secondary">Blurb</FormLabel>
            <Col md={10} sm={9}>
              <FormControl
                placeholder="Enter blurb (maximum 300 characters allowed)"
                name="blurb"
                as="textarea"
                rows={4}
                ref={register}
                onChange={e => {
                  if (e.target.value.length >= 300) {
                    const trimedValue = e.target.value.slice(0, 300);
                    setValue('blurb', trimedValue);
                  }
                }}
              />
              {watch("blurb") && watch("blurb").length >= 250 && <p className="form-error text-muted">{(300 - watch("blurb").length)} characters left</p>}
              {errors.blurb && <p className="form-error">{errors.blurb.message}</p>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup as={Row} controlId="pdf-footer">
            <FormLabel column md={2} sm={3} className="text-secondary">Footer</FormLabel>
            <Col md={10} sm={9}>
              <FormControl
                placeholder="Enter footer text (maximum 100 characters allowed)"
                name="footerText"
                ref={register}
                onChange={e => {
                  if (e.target.value.length >= 100) {
                    const trimedValue = e.target.value.slice(0, 100);
                    setValue('footerText', trimedValue);
                  }
                }}
              />
              {watch("footerText") && watch("footerText").length >= 70 && <p className="form-error text-muted">{(100 - watch("footerText").length)} characters left</p>}
              {errors.footerText && <p className="form-error">{errors.footerText.message}</p>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12} className="mt-4 mb-2">
          <h5 className="text-muted">Contact Information:</h5>
        </Col>
        <Col sm={12}>
          <FormGroup as={Row} controlId="pdf-phone">
            <FormLabel column md={2} sm={3} className="text-secondary">Phone</FormLabel>
            <Col md={10} sm={9}>
              <FormControl
                placeholder="Enter phone"
                name="phone"
                ref={register({
                  pattern: {
                    value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                    message: "Invalid value in phone number."
                  },
                  maxLength: {
                    value: 20,
                    message: "Maximum 20 characters allowed"
                  }
                })} onChange={e => {
                  if (e.target.value.length >= 20) {
                    const trimedValue = e.target.value.slice(0, 20);
                    setValue('phone', trimedValue);
                  }
                }}
              />
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </Col>
          </FormGroup>
        </Col>
        <Col sm={12}>
          <FormGroup as={Row} controlId="pdf-webSite">
            <FormLabel column md={2} sm={3} className="text-secondary">Web Site</FormLabel>
            <Col md={10} sm={9}>
              <FormControl
                placeholder="Enter web site"
                name="webSite"
                ref={register({
                  pattern: {
                    value: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                    message: "Invalid url in web site."
                  },
                  maxLength: {
                    value: 250,
                    message: "Maximum 250 characters limit"
                  }
                })}
                onChange={e => {
                  if (e.target.value.length >= 250) {
                    const trimedValue = e.target.value.slice(0, 2048);
                    setValue('webSite', trimedValue);
                  }
                }}
              />
              {errors.webSite && <p className="form-error">{errors.webSite.message}</p>}
            </Col>
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup as={Row} controlId="pdf-email">
            <FormLabel column md={2} sm={3} className="text-secondary">Email</FormLabel>
            <Col md={10} sm={9}>
              <FormControl
                placeholder="Enter email"
                name="email"
                type="email"
                ref={register({
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: "Invalid email address."
                  },
                  maxLength: {
                    value: 250,
                    message: "Maximum 250 characters limit"
                  }
                })}
                onChange={e => {
                  if (e.target.value.length >= 250) {
                    const trimedValue = e.target.value.slice(0, 250);
                    setValue('email', trimedValue);
                  }
                }}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <div className="button-container">
        <Button variant="primary" type="button" className="mx-2 mb-2" onClick={() => generatePdf()}>Generate</Button>
        <Button variant="primary" type="button" className="mx-2 mb-2" onClick={() => previewPdf(true)}>Preview</Button>
        <Button variant="secondary" type="button" className="mx-2 mb-2" onClick={() => togglePdfModal()}>Cancel</Button>
      </div>
    </Form>
  );
};

export default PdfForm;
