import React, {useRef, useMemo, useEffect, useState, useCallback} from 'react';
import { Modal, ModalBody, ModalTitle, Button } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';

import PdfForm from './pdfForm';
import PdfPreivew from './pdfPreview';
import { Loader } from '../common';
import {logDownloadEvent} from "../api/api";

const blurbSecondCountries = ["UK", "Europe", "India", "ANZ"]
const blurbSecond = "4 out of 5 of the world's most recognised beauty and wellness brands trust only Zenoti. Why? Based on your needs, I've listed a few of the many hundreds of reasons. No other software offers such powerful solutions.";

const defaultData = {
  blurb: "4 out of 5 of the world's most recognized beauty and wellness brands trust only Zenoti. Why? Based on your needs, I've listed a few of the many hundreds of reasons. No other software offers such powerful solutions.",
  phone: "877-481-7634",
  webSite: "www.zenoti.com",
  email: "sales@zenoti.com",
  footerText: "Get Started Today!",
};

const defaultColumns = [
  { headerName: "Feature", field: "title", flex: 3, minWidth: "30%", headerImageWidth: 70, maxChar: 20 },
  { headerName: "Description", field: "description", flex: 4, minWidth: "45%", headerImageWidth: 160, maxChar: 40 },
  { headerName: "Business Impact", field: "business_benefits", flex: 2, minWidth: "25%", headerImageWidth: 130, maxChar: 20 },
];

const PdfModal = (props) => {
  const {
    pdfModal,
    togglePdfModal,
    gridObj,
    filter,
    sortObj,
    selectedRows
  } = props;
  const [showPreview, tooglePreview] = useState(false);
  const [pdfData, setPdfData] = useState({ ...defaultData });
  const [loadingPdf, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const downloadBtn = useRef();
  const renderBtn = useRef();
  const [tableData, setTableData] = useState({
    data: [],
    columns: [...defaultColumns],
    sort: null
  });

  const previewPdf = (show) => {
    tooglePreview(!showPreview);
    setLoading(show);
  }

  const toggle = () => {
    togglePdfModal(null);
    tooglePreview(false);
    setPdfData({ ...defaultData });
    setLoading(false);
    setPdfUrl("");
    setTableData({
      data: [],
      columns: [...defaultColumns],
      sort: null
    });
  }

  const renderPdf = ({ url, loading }) => {
    if (!showPreview) {
      downloadBtn.current.click();
      setLoading(false);
    } else {
      setPdfUrl(url);
      setLoading(loading);
    }
  }

  const sendSelectedFeaturesToBackend = useCallback(() => {
    try{
      if(selectedRows && selectedRows.length){
        const data = selectedRows.map(row => ({
          title: row.title,
          template_id: row.id,
          country: row.country,
        }));

         logDownloadEvent(data);
      }
    }catch (e) {}
  },[selectedRows]);

  const generatePdf = () => {
    setLoading(true);
    sendSelectedFeaturesToBackend();
  }

  const generatePdfInsidePreview = () =>{
    tooglePreview(!showPreview);
    generatePdf();
  }

  useEffect(() => {
    setPdfData(prevData => ({
      ...prevData,
      blurb: filter.country && blurbSecondCountries.includes(filter.country) ? blurbSecond : defaultData.blurb
    }))
  }, [filter.country])

  useEffect(() => {
    if (gridObj) {
      let columns = [...defaultColumns];
      let data = [...selectedRows];
      const showNoteCol = data.filter(d => d.note).length > 0 || false;
      if (!showNoteCol) { columns = columns.filter(c => c.field !== "note") }
      if (sortObj) {
        data = data.sort((a, b) => {
          if (a[sortObj.colId].trim() < b[sortObj.colId].trim()) {
            return sortObj.sort === "asc" ? -1 : 1;
          }
          if (a[sortObj.colId].trim() > b[sortObj.colId].trim()) {
            return sortObj.sort === "asc" ? 1 : -1;
          }
          return 0;
        })
      }
      let group = data.reduce((r, a) => {
        r[a.area] = [...r[a.area] || [], a];
        return r;
      }, {});
      setTableData({
        data,
        columns,
        sort: sortObj,
        group: group
      })
    }
  }, [JSON.stringify(selectedRows), JSON.stringify(sortObj), pdfModal])

  const PDFComp = useMemo(() => {
    const defaultObj = {
      ...defaultData,
      blurb: filter.country && blurbSecondCountries.includes(filter.country) ? blurbSecond : defaultData.blurb
    }
    const pdfDataObj = { ...pdfData };
    Object.keys(pdfDataObj).map(key => { if (!pdfDataObj[key]) { pdfDataObj[key] = defaultObj[key]; } });
    return (
      loadingPdf && <>
        <Button ref={renderBtn} className="d-none"
          onClick={(e) => renderPdf(JSON.parse(e.target.innerHTML))}
        >Render</Button>
        <PDFDownloadLink
          className="d-none"
          document={<PdfPreivew pdfData={pdfDataObj} columns={tableData.columns} data={tableData.data} filter={filter} tableData={tableData} />}
          fileName="zenoti_data.pdf"
        >
          {(props) => {
            const { loading } = props;
            if (!loading) {
              setTimeout(() => {
                renderBtn.current.innerHTML = JSON.stringify(props);
                renderBtn.current.click();
              }, 10)
            }
            return (<>
              <Button ref={downloadBtn} variant="primary" type="button" className="mx-2">{loading ? 'Loading pdf...' : 'Download'}</Button>
            </>)
          }}
        </PDFDownloadLink>
      </>)
  }
    , [loadingPdf, JSON.stringify(pdfData)]);

  return <>
    <Modal show={pdfModal} size="lg" centered onHide={() => toggle()}>
      <Modal.Header closeButton>
        <ModalTitle className="px-4">{showPreview ? 'Preview PDF' : 'Generate PDF'}</ModalTitle>
      </Modal.Header>
      <ModalBody>
        <Loader loading={loadingPdf} loadingText={showPreview ? "Loading preview..." : "Generating pdf..."}>
          {!showPreview && <div className="px-5">
            <PdfForm
              togglePdfModal={toggle}
              previewPdf={previewPdf}
              generatePdf={generatePdf}
              updatePdfData={(data) => { setPdfData(prevData => ({ ...prevData, ...data })) }}
              gridObj={gridObj}
              pdfData={pdfData}
              columns={tableData.columns}
              data={tableData.data}
              filter={filter}
            />
          </div>}
          {PDFComp}
          {showPreview && <div>
            <div style={{ width: "100%", height: "600px" }}>
              {pdfUrl && <object data={pdfUrl + "#toolbar=0"} type="application/pdf" width="100%" height="600px">
                <p>Your web browser doesn't have a PDF plugin.</p>
                <p> Instead you can <a href={pdfUrl}>click here to download the PDF file.</a></p>
              </object>}
            </div>
            <div className="button-container">
              <Button variant="primary" type="button" className="mx-2" onClick={generatePdfInsidePreview}>Download</Button>
              <Button variant="secondary" type="button" className="mx-2" onClick={() => previewPdf(false)}>Back</Button>
            </div>
          </div>}
        </Loader>
      </ModalBody>
    </Modal>
  </>
}

export default PdfModal;
