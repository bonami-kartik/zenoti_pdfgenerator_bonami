
import React from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const headerStyle = StyleSheet.create({
  header: {
    marginBottom: "5",
  },
  headerImage: {
    height: "180",
    width: "100%",
  },
  headerSubText: {
    marginTop: "10",
    fontSize: "12",
    fontWeight: "400",
    padding: "20",
    paddingBottom: "0",
    textAlign: "center",
    color: "#3B4040",
    height: "90",
  },
})

const countries = ["US", "Europe", "ANZ", "SEA", "Canada", "Middle East", "India", "UK"];

export const PageHeader = ({ pdfData, filter }) => (
  <View style={headerStyle.header} fixed render={({ pageNumber }) => {
    let imageUrl = pageNumber === 1 ?
      "/assets/pdf/pdf_header.jpg" :
      "/assets/pdf/pdf_sub_header.jpg";
    if (countries.includes(filter.country)) {
      imageUrl = pageNumber === 1 ?
        `/assets/pdf/${filter.country}/Banner_${filter.country}.png` :
        "/assets/pdf/pdf_sub_header.jpg";
      if (filter.vertical) {
        imageUrl = pageNumber === 1 ?
          `/assets/pdf/${filter.country}/Banner_${filter.country}_${filter.vertical}.png` :
          "/assets/pdf/pdf_sub_header.jpg";
      }
    }
    return <View>
      <Image
        cache={true}
        style={{ ...headerStyle.headerImage, height: pageNumber === 1 ? "140" : "50" }}
        src={imageUrl}
      />
      {pageNumber === 1 && <Text style={headerStyle.headerSubText}>{pdfData.blurb}</Text>}
    </View>
  }}>
  </View>
)

const footerStyle = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: "0",
    left: "0",
    width: "100%",
    marginTop: "10",
  },
  footerBlock: {
    color: '#ffffff',
    position: "relative",
    marginTop: "20",
    fontSize: "12",
  },
  footerImage: {
    height: "60",
    objectFit: "cover",
    width: "100%",
  },
  footerTextBlock: {
    color: '#ffffff',
    position: "absolute",
    top: "10",
    left: "0",
    width: "100%",
  },
  footerMainText: {
    textAlign: "center",
    paddingHorizontal: "30",
    marginBottom: "5",
  },
  footerInfoBlock: {
    display: 'flex',
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginTop: "10",
    marginBottom: "10"
  },
  footerInfoText: {
    fontSize: "9",
    marginHorizontal: "10",
    alignSelf: "center",
  },
  footerInfoSaperator: {
    width: "1",
    height: "10",
    alignSelf: "center",
    backgroundColor: "white",
  },
})


export const PageFooter = ({ pdfData, height, email, webSite, footerText, footerTextHeight }) => {
  return (
    <View style={footerStyle.footer} fixed render={() => {
      return <View style={footerStyle.footerBlock}>
        <Image cache={true} style={{ ...footerStyle.footerImage, height: height }} src="/assets/pdf/pdf_footer.jpg" />
        <View style={footerStyle.footerTextBlock}>
          <Text
            hyphenationCallback={50}
            fixed
            style={{ ...footerStyle.footerMainText }}
            render={({ pageNumber, totalPages }) => {
              return pageNumber === totalPages ? footerText : ""
            }}></Text>
          <View
            style={{ ...footerStyle.footerInfoBlock, marginTop: `${footerTextHeight}` }}
            fixed>
            <Text style={footerStyle.footerInfoText}>{pdfData.phone}</Text>
            <View style={footerStyle.footerInfoSaperator}></View>
            <Text style={footerStyle.footerInfoText}>{email}</Text>
            <View style={footerStyle.footerInfoSaperator}></View>
            <Text style={footerStyle.footerInfoText}>{webSite}</Text>
          </View>
        </View>
      </View >
    }}>
    </View >
  )
}
