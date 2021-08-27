import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { PageHeader, PageFooter } from "./pdf/pdfComponent";

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: "/assets/fonts/OpenSans-Regular.ttf" },
    { src: "/assets/fonts/OpenSans-Bold.ttf" }
  ]
});

const pageStyle = StyleSheet.create({
  page: {
    paddingBottom: 60,
    position: "relative",
    fontFamily: "Open Sans"
  },
  pageNumber: {
    position: 'absolute',
    color: "#FFFFFF",
    fontSize: "10",
    bottom: 10,
    right: 10,
  },
})

const tableStyle = StyleSheet.create({
  table: {
    display: "table",
    padding: "20",
    color: "#3B4040"
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    paddingTop: "10",
    paddingBottom: "10",
    paddingHorizontal: "8",
    flex: 1,
    minWidth: "12%",
  },
  tableHeaderCol: {
    minWidth: "12%",
    flex: 1,
  },
  tableHeaderCell: {
    position: "relative",
    width: "100%",
  },
  tableHeaderCellImage: {
    height: "20",
    borderRadius: "20",
  },
  tableHeaderCellIcon: {
    width: "16",
    height: "16",
    marginRight: "2",
    borderRadius: "20",
  },
  headerCellText: {
    textAlign: "center",
    marginRight: "10",
  },
  tableHeaderCellContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: "2",
    left: "12",
    width: "80%",
    fontSize: '11',
  },
  textWhite: {
    color: "#FFFFFF",
  },
  cellText: {
    color: "#414141",
  },
  noteTitleText: {
    fontSize: "11",
  },
  tableCell: {
    fontSize: "9",
    display: "flex",
    flexDirection: "row",
  },
  tableCellText: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

function wordWrap(str, maxWidth) {
  var newLineStr = "\n";
  var res = '';
  var found;
  while (str.length > maxWidth) {
    found = false;
    // Inserts new line at first whitespace of the line
    for (var i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('');
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join('');
      str = str.slice(maxWidth);
    }

  }

  return res + str;
}

function testWhite(x) {
  var white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
};

const textWhiteHeader = ['title', 'business_benefits'];

const PdfPreivew = (pdfProps) => {
  const { pdfData = {}, columns = [], data = [], filter } = pdfProps;
  let email = pdfData.email;
  let webSite = pdfData.webSite;
  let footerText = pdfData.footerText;
  let multiLine = 0;
  let maxChar = 40;
  let footerHeight = 60;
  let footerTextHeight = 20;
  if ((email.length > 40 && webSite.length < 40) || email.length < 40 && webSite.length > 40) { maxChar = 60; }
  if (email.length > maxChar) {
    multiLine = multiLine > Math.ceil(email.length / maxChar) ? multiLine : Math.ceil(email.length / maxChar);
    email = wordWrap(email, maxChar);
  }
  if (webSite.length > maxChar) {
    multiLine = multiLine > Math.ceil(webSite.length / maxChar) ? multiLine : Math.ceil(webSite.length / maxChar);
    webSite = wordWrap(webSite, maxChar);
  }
  if (multiLine) { footerHeight = footerHeight + multiLine * 10; }
  if (pdfData.footerText.replace(/ /g, '').length > 55) {
    footerHeight = footerHeight + 16;
    footerTextHeight = footerTextHeight + 15;
  }

  return (
    <Document>
      <Page size="A4" wrap style={{ ...pageStyle.page, paddingBottom: `${footerHeight}` }}>
        <PageHeader pdfData={pdfData} filter={filter} />
        <View style={{ ...tableStyle.table }} fixed>
          <View style={{ ...tableStyle.tableRow }} >
            {columns.map((col, i) => {
              const headerBackgruondUrl = `/assets/pdf/header_${col.field}.png`;
              const headerIconUrl = i === 0 ? '/assets/pdf/header_icon_title.png' : '/assets/pdf/header_icon.png';
              let headerStyle = {
                ...tableStyle.tableHeaderCell
              };
              let headertextColor = textWhiteHeader.includes(col.field) ? tableStyle.textWhite : {};
              return (
                <View key={i} style={{ ...tableStyle.tableHeaderCol, flex: col.flex, minWidth: col.minWidth }}>
                  <View style={headerStyle}>
                    <Image style={{ ...tableStyle.tableHeaderCellImage, width: "90%", marginHorizontal: i % 2 !== 0 ? "10" : "5", }} src={headerBackgruondUrl} />
                    <View style={{ ...tableStyle.tableHeaderCellContent, left: i % 2 !== 0 ? "12" : "7", }}>
                      <Image style={tableStyle.tableHeaderCellIcon} src={headerIconUrl} />
                      <Text style={{ ...tableStyle.headerCellText, ...headertextColor, width: "90%" }}>{col.headerName}</Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
        <View>
          {Object.keys(pdfProps.tableData.group).map((areaGrp, index) => {
            const bgColor = index % 2 === 0 ? "#F7EAEE" : "#FBF3EB";
            const titleColor = index % 2 === 0 ? "#CC809C" : "#CCA24A";
            const data = pdfProps.tableData.group[areaGrp] || [];
            return <View key={areaGrp} style={{ ...tableStyle.table, paddingTop: "1", paddingBottom: "10" }} break={false}>
              {data.map((row, i) => {

                return <View key={i} style={{ ...tableStyle.tableRow, flexWrap: "wrap" }} break={false}>
                  {i == 0 && <Text
                    break
                    style={{
                      color: titleColor,
                      padding: "8",
                      backgroundColor: bgColor,
                      borderRadius: "10",
                      fontSize: "13",
                      fontWeight: "bold",
                      width: "100%",
                      borderBottom: "2 solid #FFFFFF",
                      marginBottom: "2"
                    }}>
                    {areaGrp}
                  </Text>}
                  {columns.map((col, j) => {
                    let cellText = Array.isArray(row[col.field]) ? row[col.field].join(", ") : row[col.field];
                    let textColor = tableStyle.cellText;
                    if (cellText && cellText.indexOf("\t") >= 0) { cellText = cellText.replace(/\t/g, "   "); }
                    let noteImageHeight = 35;
                    let noteText = row.note ? row.note.trim() : "";
                    if (noteText) {
                      noteImageHeight = noteImageHeight + Math.ceil(noteText.length / 40) * 10;
                    }
                    if (noteText.indexOf("\n") >= 0) {
                      noteImageHeight = noteImageHeight + (noteText.match(/\n/g).length * 10);
                    }

                    return (
                      <View key={j} break style={{
                        ...tableStyle.tableCol,
                        flex: col.flex,
                        minWidth: col.minWidth,
                        backgroundColor: j % 2 == 0 ? bgColor : "",
                        borderTopLeftRadius: i === 0 ? "10" : "0",
                        borderTopRightRadius: i === 0 ? "10" : "0",
                        borderBottomLeftRadius: i + 1 === data.length ? "10" : "0",
                        borderBottomRightRadius: i + 1 === data.length ? "10" : "0",
                        borderBottom: i + 1 !== data.length ? "1 dashed #bebebe" : "",
                        paddingBottom: i + 1 !== data.length ? "15" : "8",
                      }}>
                        <View style={tableStyle.tableCell} wrap break>
                          <View wrap break style={tableStyle.tableCellText}>
                            <Text hyphenationCallback={col.maxChar} style={{
                              ...textColor,
                              paddingHorizontal: "7",
                            }}>
                              {cellText}
                            </Text>
                            {col.field === "description" && row.note ? (
                              <View style={{ position: "relative", marginTop: "10", height: noteImageHeight }}>
                                <Image style={{ width: "100%", height: "100%", borderRadius: "12" }} src="assets/pdf/note_background.png" />
                                <View style={{ position: "absolute", top: "0", left: "0", width: "100%", paddingHorizontal: "7" }}>
                                  <Text style={{ ...tableStyle.cellText, marginTop: "5", marginBottom: "5", width: "100%" }}>Notes</Text>
                                  <Text hyphenationCallback={50} style={{ ...tableStyle.cellText, }}>
                                    {noteText ? (noteText.indexOf("\t") >= 0 ? noteText.replace(/\t/g, "   ") : noteText) : ""}
                                  </Text>
                                </View>
                              </View>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    )
                  })}
                  {i + 1 !== data.length && columns.map((col, j) => {
                    let bgColorStyle = {
                      backgroundColor: j % 2 == 0 ? bgColor : "",
                      flex: col.flex,
                      height: "900%",
                      minWidth: col.minWidth,
                      maxHeight: Math.ceil(data[i + 1].description.length / 40) * 13 + 30,
                    }
                    if (i + 2 === data.length) {
                      bgColorStyle = {
                        ...bgColorStyle,
                        maxHeight: Math.ceil(data[i + 1].description.length / 40) * 10,
                      }
                    }
                    return <View key={j}
                      style={bgColorStyle}
                      break>
                    </View>
                  })}
                </View>
              })}
            </View>
          })}
        </View>
        <PageFooter pdfData={pdfData} height={`${footerHeight}`} email={email} webSite={webSite} footerText={footerText} footerTextHeight={footerTextHeight} />
        <Text style={pageStyle.pageNumber} render={({ pageNumber }) => {
          return (`${pageNumber}`)
        }} fixed />
      </Page>
    </Document >
  );
};

export default PdfPreivew;
