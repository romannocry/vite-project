import React from "react";
import Masonry from 'react-masonry-component';
import { Card, CardHeader, CardBody, CardFooter, Container } from "reactstrap";
import templates from "./templates.json";
import styles from "./Bookmark.module.css";
import InfoBanner from "./InfoBanner";

interface BookmarkItem {
  label: string;
}

interface Bookmark {
  type: string;
  data: BookmarkItem[];
  tags: string[];
}

interface Template {
  id: string;
  label: string;
  bookmarks: Bookmark[];
  parent: string;
}

const breakpointColumnsObj = {
  default: 6,
  1200: 3,
  800: 2,
  500: 1,
};

const Bookmark: React.FC = () => {
  const template: Template = templates.templates[0];
  
  return (
    <>
    <InfoBanner message="Saved successfully!" type="error" />
    <Container style={{backgroundColor:'rgb(249,249,249)', margin:0,width:'100%',maxWidth:'100%',justifyContent:'center'}}>
    <Masonry
      className={''} // default ''
      elementType={'div'} // default 'div'
      options={{
        transitionDuration: 300,
        gutter: 1,
      }}
      disableImagesLoaded={false} // default false
      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
  >
  {template.bookmarks.map((bookmark, index) => {

    return (
    <div className={styles.container} key={index}>
      <div className={`${styles.box} ${styles.phone}`}>SR</div>
      <div className={styles.label}>{bookmark.type.toUpperCase().slice(0, 3)}</div>
    </div>
    )
  })}

  </Masonry>
  </Container>
  <Container style={{backgroundColor:'rgb(249,249,249)', margin:0,width:'100%',maxWidth:'100%',justifyContent:'center'}}>
  <Masonry
      className={''} // default ''
      elementType={'div'} // default 'div'
      options={{
        transitionDuration: 300,
        gutter: 1,
      }}
      disableImagesLoaded={false} // default false
      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
  >
  
  {template.bookmarks.map((bookmark, index) => {
        //const isSingleItem = bookmark.data.length === 1;
        return (
          <Card
            key={index}
            className={`${styles.card} ${false ? styles.singleCard : ""}`}
          >
            {!false && (
              <CardHeader className={styles.cardHeader}>
                {bookmark.type.toUpperCase()} – Tags: {bookmark.tags.join(", ")}
              </CardHeader>
            )}
            <CardBody className={styles.cardBody}>
              <ul>
                {bookmark.data.map((item, i) => (
                  <li key={i}>{item.label}</li>
                ))}
              </ul>
            </CardBody>
            {!false && <CardFooter className={styles.cardFooter}>xx</CardFooter>}
          </Card>
        );
      })}
        </Masonry>

  </Container>
    </>




  );
};

export default Bookmark;


/*

  <div className={styles.grid}>
  <div className={styles.gridItem}></div>
  <div className={styles.gridItemSmall}></div>
  <div className={styles.gridItemSmall}></div>
  <div className={styles.gridItemSmall}></div>
  <div className={styles.gridItemSmall}></div>
  <div className={styles.gridItem}></div>
  <div className={styles.gridItem}></div>
  </div>
      {template.bookmarks.map((bookmark, index) => {
        const isSingleItem = bookmark.data.length === 1;
        return (
          <Card
            key={index}
            className={`${styles.card} ${isSingleItem ? styles.singleCard : ""}`}
          >
            {!isSingleItem && (
              <CardHeader className={styles.cardHeader}>
                {bookmark.type.toUpperCase()} – Tags: {bookmark.tags.join(", ")}
              </CardHeader>
            )}
            <CardBody className={styles.cardBody}>
              <ul>
                {bookmark.data.map((item, i) => (
                  <li key={i}>{item.label}</li>
                ))}
              </ul>
            </CardBody>
            {!isSingleItem && <CardFooter className={styles.cardFooter}>xx</CardFooter>}
          </Card>
        );
      })}*/