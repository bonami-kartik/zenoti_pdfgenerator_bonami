import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faFileAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, ModalBody, ModalTitle } from "react-bootstrap";

const BulkUploadFeature = ({
  show,
  toggleModal,
  upload,
  uploadFlag,
  verticalOption,
  areaOption,
  regionOption,
  pillarOption,
  businessAreaOption,
  competitorOption,
}) => {
  const [files, setFiles] = useState(null);
  const [fileError, setFileError] = useState([]);
  const [showInstruction, toggleInstruction] = useState(true);
  const areaList = areaOption.map((opt) => opt.value) || [];
  const verticalList = verticalOption.map((opt) => opt.value) || [];
  const regionList = regionOption.map((opt) => opt.value) || [];
  const pillarList = pillarOption.map((opt) => Object.keys(opt.value)) || [];
  const businessAreaList = businessAreaOption.map((opt) => opt.value) || [];
  const competitorList = competitorOption.map((opt) => opt.value) || [];
  const instructionList = [
    {
      field: "feature",
      name: "Feature field",
      maxChar: 150,
    },
    {
      field: "description",
      name: "Description field",
      maxChar: 800,
    },
    {
      field: "unique_to_zenoti",
      name: "Unique to Zenoti",
      maxChar: 0,
      valueExample: "TRUE/FALSE",
    },
    {
      field: "business_impact",
      name: "Business Impact",
      maxChar: 300,
    },
    {
      field: "area",
      name: "Area field",
      maxChar: 0,
      dropdwon: areaList,
      singlevalueExample: "Online booking",
    },
    {
      field: "vertical",
      name: "Vertical field",
      maxChar: 0,
      dropdwon: verticalList,
      singlevalueExample: "Spa",
      mutliValueExample: "Fitness;Salon;Spa",
    },
    {
      field: "region",
      name: "Region field",
      maxChar: 0,
      dropdwon: regionList,
      singlevalueExample: "US",
      mutliValueExample: "UK;US;Europe",
    },
    {
      field: "brand_pillars",
      name: "Pillar field",
      maxChar: 0,
      dropdwon: pillarList,
      singlevalueExample: "elevate cx",
      mutliValueExample: "elevate cx;automate",
    },
    {
      field: "business_area",
      name: "Business Area field",
      maxChar: 0,
      dropdwon: businessAreaList,
      singlevalueExample: "manage_by_business",
      mutliValueExample: "manage_by_business;manage_by_clients",
    },
    {
      field: "competitors",
      name: "Compare With field",
      maxChar: 0,
      dropdwon: competitorList,
      singlevalueExample: "booker",
      mutliValueExample: "booker;mbo;salonbiz;millennium/meevo",
    },
    {
      field: "themes",
      name: "Themes",
      maxChar: 0,
      valueExample: "TRUE/FALSE",
    },
    {
      field: "small_biz",
      name: "Available for Small Business",
      maxChar: 0,
      valueExample: "TRUE/FALSE",
    },
  ];
  const validProperties = {
    unique_to_zenoti: ["TRUE", "FALSE"],
    area: areaList,
    verticals: verticalList,
    region: regionList,
    feature: { maxLength: 150 },
    description: { maxLength: 800 },
    business_impact: { maxLength: 300 },
    multiple: ["verticals"],
    string: ["feature", "description", "business_impact"],
    dropdwon: ["unique_to_zenoti", "area", "verticals", "region", "brand_pillars"],
  };
  const validHeaders = [
    "feature",
    "area",
    "description",
    "business_impact",
    "verticals",
    "region",
    "unique_to_zenoti",
    "brand_pillars",
  ];
  const requiredColumns = [
    "feature",
    "description",
    "area",
    "verticals",
    "region",
    "brand_pillars",
  ];

  function CSVToArray(strData, strDelimiter) {
    strDelimiter = strDelimiter || ",";
    var objPattern = new RegExp( // Delimiters.
      "(\\" +
        strDelimiter +
        "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        strDelimiter +
        "\\r\\n]*))",
      "gi"
    );
    var arrData = [[]];
    var arrMatches = null;
    while ((arrMatches = objPattern.exec(strData))) {
      var strMatchedDelimiter = arrMatches[1];
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        arrData.push([]);
      }

      var strMatchedValue;
      if (arrMatches[2]) {
        strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
      } else {
        strMatchedValue = arrMatches[3];
      }
      arrData[arrData.length - 1].push(strMatchedValue);
    }
    return arrData;
  }

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        let errors = rejectedFiles[0].errors;
        if (errors.length > 0) {
          setFileError(errors);
          setFiles(null);
        }
      }
      if (acceptedFiles.length > 0) {
        setFiles(acceptedFiles[0]);
        setFileError([]);
        var reader = new FileReader();
        reader.onload = function () {
          var rows = CSVToArray(`${reader.result}`);
          var headerList = rows[0];
          var headerError = [];

          validHeaders.forEach((r) => {
            if (!headerList.includes(r)) {
              headerError.push({
                code: `missing-column-${r}`,
                message: `Column "${r}" is missing in uploaded .csv file.`,
              });
            }
          });
          rows.forEach((row, i) => {
            if (row && row.length > 1 && i !== 0) {
              row.forEach((r, j) => {
                if (r.indexOf("�") >= 0) {
                  r = r.replace(/\�/g, "-");
                }
                var colName = headerList[j];
                var propertiesObj = validProperties[headerList[j]];
                if (r && propertiesObj) {
                  if (
                    validProperties.string.includes(colName) &&
                    propertiesObj.maxLength
                  ) {
                    if (propertiesObj.maxLength < r.length) {
                      headerError.push({
                        code: `max-length-${i}-${j}`,
                        message: `Maximum characters limit exceeded in column ${colName} at line ${i}.`,
                      });
                    }
                  } else if (
                    validProperties.dropdwon.includes(colName) &&
                    !validProperties.multiple.includes(colName) &&
                    /^.*[;].*$/.test(r)
                  ) {
                    headerError.push({
                      code: `invalid-value-${i}-${j}`,
                      message: `Only single value in column ${colName} at line ${i}.`,
                    });
                  } else if (
                    validProperties.dropdwon.includes(colName) &&
                    validProperties.multiple.includes(colName) &&
                    /^.*[;].*$/.test(r)
                  ) {
                    var rowValues = r.split(";");
                    rowValues.forEach((v, k) => {
                      if (!propertiesObj.includes(v)) {
                        headerError.push({
                          code: `invalid-value-${i}-${j}-${k}`,
                          message: `Invalid value "${v}" in column ${colName} at line ${i}.`,
                        });
                      }
                    });
                  } else if (!propertiesObj.includes(r)) {
                    headerError.push({
                      code: `invalid-value-${i}-${j}`,
                      message: `Invalid value "${r}" in column ${colName} at line ${i}.`,
                    });
                  }
                }
                if (requiredColumns.includes(colName) && !r) {
                  headerError.push({
                    code: `max-length-${i}-${j}`,
                    message: `Column "${colName}" is required to create new feature error at line ${i}.`,
                  });
                }
              });
            }
          });
          setFileError(headerError);
        };
        reader.readAsText(acceptedFiles[0]);
      }
    },
    [validProperties]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".csv",
    onDrop,
    minSize: 0,
    multiple: false,
  });

  const onUploadHandle = () => {
    upload(files);
  };

  const toggle = () => {
    setFiles(null);
    setFileError([]);
    toggleInstruction(true);
    toggleModal();
  };

  useEffect(() => {
    if (show) {
      setFiles(null);
      setFileError([]);
      toggleInstruction(true);
    }
  }, [show]);

  return (
    <>
      <Modal show={show} size="lg" centered onHide={() => toggle()}>
        <Modal.Header closeButton>
          <ModalTitle className="px-4">
            Bulk Upload {showInstruction ? " Instruction" : ""}
          </ModalTitle>
        </Modal.Header>
        <ModalBody>
          {showInstruction ? (
            <div className="mt-2">
              <h5 className="ml-4 mb-3 header-text">
                Uploaded csv file columns must be in below formats
              </h5>
              <ul>
                {instructionList.map((fld) => (
                  <li key={fld.field}>
                    <div className="field-instruction">
                      <span className="field-name">
                        {`${fld.name}: `}
                        {fld.maxChar ? (
                          <span className="field-info-value">
                            {`(max character limit -  ${fld.maxChar})`}
                          </span>
                        ) : null}
                      </span>
                      {(fld.dropdwon || fld.valueExample) && (
                        <span className="field-info">
                          <span className="field-info-title">
                            Availble values:
                          </span>
                          <span className="field-info-value">
                            {fld.dropdwon
                              ? `(${fld.dropdwon.join(", ")})`
                              : fld.valueExample}
                          </span>
                        </span>
                      )}
                      {fld.singlevalueExample && (
                        <span className="field-info">
                          <span className="field-info-title">
                            Single value sample:
                          </span>
                          <span className="field-info-value">
                            {fld.singlevalueExample}
                          </span>
                        </span>
                      )}
                      {fld.mutliValueExample && (
                        <span className="field-info">
                          <span className="field-info-title">
                            Multiple value sample:
                          </span>
                          <span className="field-info-value">
                            {fld.mutliValueExample}
                          </span>
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div className="upload-file">
                {!files ? (
                  <div
                    {...getRootProps({
                      className: "upload-file-container",
                    })}
                  >
                    <div className="upload-container">
                      <FontAwesomeIcon
                        icon={faCloudUploadAlt}
                        size="5x"
                        className="upload-icon mr-1"
                        title="Upload"
                      />
                      <input
                        className="upload-file-input"
                        {...getInputProps()}
                      />
                    </div>
                    <div>
                      {isDragActive ? (
                        <p className="upload-text">Drop the files here ...</p>
                      ) : (
                        <p className="upload-text">
                          Drag 'n' drop files here, or click to select files
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="show-file-container">
                    <div className="documnet-container">
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="document-icon"
                        size="8x"
                      />
                      <Button
                        className="trash-button"
                        onClick={() => {
                          setFiles(null);
                          setFileError([]);
                        }}
                      >
                        <FontAwesomeIcon
                          className="trash-icon"
                          icon={faTrashAlt}
                          size="sm"
                          title="Delete"
                        />
                      </Button>
                    </div>
                    <p className="file-name">{`${files.name}`}</p>
                  </div>
                )}
              </div>
              {fileError.length > 0 &&
                fileError.map((error) => (
                  <p key={error.code} className="text-center form-error">
                    {error.message}
                  </p>
                ))}
            </>
          )}
          <div className="button-container mt-5 mb-3">
            {showInstruction && (
              <a
                className="text-decoration-none text-white"
                href="/assets/sample/99 Reasons Data Upload - V2.csv"
                download="99 Reasons Data Upload - V2.csv"
              >
                <Button variant="primary" type="button" className="mx-2">
                  Download Sample
                </Button>
              </a>
            )}
            {!showInstruction && (
              <Button
                variant="primary"
                type="button"
                className="mx-2"
                disabled={fileError.length > 0 || !files || uploadFlag}
                onClick={() => {
                  onUploadHandle();
                }}
              >
                Upload
              </Button>
            )}
            <Button
              variant="secondary"
              type="button"
              className="mx-2"
              onClick={() => toggleInstruction(!showInstruction)}
            >
              {showInstruction ? "Next" : "Back"}
            </Button>
            {!showInstruction && (
              <Button
                variant="secondary"
                type="button"
                className="mx-2"
                onClick={() => toggle()}
              >
                Cancel
              </Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default BulkUploadFeature;
