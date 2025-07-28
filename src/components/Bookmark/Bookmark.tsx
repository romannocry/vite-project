import React from "react";
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