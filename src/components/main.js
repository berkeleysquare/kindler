import React, {useEffect, useState} from "react";
import { Tab } from '@mui/base/Tab';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { Tabs } from '@mui/base/Tabs';

import {fetchBooks} from './actions';
const resource = 'books_all';
const SORT_DATE = "Date";
const SORT_TITLE = "Title";
const SORT_AUTHOR = "Author";
const sortTypes = [SORT_DATE, SORT_TITLE, SORT_AUTHOR];

const sortBooks = (unsorted, type) => {
  switch (type) {
    case SORT_DATE:
      return unsorted.sort((a, b) => a.index - b.index);
    case SORT_TITLE:
      return unsorted.sort((a, b) => a.title.localeCompare(b.title));
    case SORT_AUTHOR:
      return unsorted.sort((a, b) => (a.authors[0] || '').localeCompare(b.authors[0]))
    default:
      return unsorted;
  }
}

const formatBook = b => <p key={'_book' + b.index}>
  <span style={{fontWeight: 600}}>{b.title + '  '}</span>
  <span style={{fontStyle: 'italic'}}>{(b.authors || [])[0]}</span>
</p>

const formatBooks = (unsorted, sortType) => {
  const books = sortBooks(unsorted, sortType);
  const getFirstLetter = sortType === SORT_DATE ? () => '' : 
    (sortType === SORT_TITLE ? (b) => (b.title[0] || '') : (b) => (b.authors[0] || '')[0] || '');
  const lines = [];
  let firstLetter = '';
    {books.forEach(element => {
      if (getFirstLetter(element).toUpperCase() !== firstLetter) {
        firstLetter = getFirstLetter(element).toUpperCase();
        lines.push(<h2 key={'_letter_' + firstLetter} style={{backgroundColor: '#AAA', color: 'white'}}>
          {firstLetter}
        </h2>);
      }
      lines.push(formatBook(element));
    })};
  return (<div>{lines}</div>);
};


function Main() {

    const [books, setBooks] = useState([]);
    const [sortType, setSortType] = useState(SORT_DATE);

    useEffect(() => {
      setBooks(fetchBooks(resource, setBooks));
    }, []);

    return (<div>
      <div>
          <Tabs selectionFollowsFocus
            value={sortType}
            onChange={(e, val) => setSortType(val)}
            variant="fullWidth">
              <TabsList>
              {sortTypes.map(g => (<Tab key={'_button_' + g} value={g}>{' Sort by ' + g}</Tab>))}
              </TabsList>
              {sortTypes.map(g => (<TabPanel key={'_panel_' + g} value={g}><h2>{g}</h2></TabPanel>))}
          </Tabs>
      </div>
      {formatBooks(books || [], sortType)}
    </div>
    );
}

export default Main;