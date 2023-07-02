import classNames from 'classnames';
import styles from './Content.module.css';
import { Category, BaseItem, ViewMode } from '../../types';
import OldCard from './OldCard';
import GridItem from './GridItem';
import { Fragment } from 'react';
import generateColorsArray from '../../utils/generateColorsArray';
import { Link } from 'react-router-dom';

interface Props {
  selectedViewMode: ViewMode;
  categoriesList: string[];
  categories: Category[];
  items: BaseItem[];
  categories_overridden?: string[];
  onClickItem: (item: BaseItem) => void;
}

const Content = (props: Props) => {
  const sortItems = (items: BaseItem[]): BaseItem[] => {
    return items.sort((a: BaseItem, b: BaseItem) => {
      return (
        (a.featured && a.featured.order ? a.featured.order : 1000) -
        (b.featured && b.featured.order ? b.featured.order : 1000)
      ); // Items with undefined order are last
    });
  };

  const colorsList = generateColorsArray(props.categoriesList.length);

  return (
    <>
      {props.categoriesList.map((cat: string, index: number) => {
        const category = props.categories.find((c: Category) => c.name === cat);
        const isOverriden = props.categories_overridden !== undefined && props.categories_overridden.includes(cat);

        if (category === undefined) return null;

        return (
          <div key={`cat_${cat}`} className="d-flex flex-row">
            <div
              className={classNames(
                'text-white border border-3 border-white fw-semibold p-2 border-end-0 py-5',
                styles.catTitle,
                { 'border-bottom-0': index !== 0 }
              )}
              style={{ backgroundColor: colorsList[index] }}
            >
              <div className="d-flex flex-row align-items-start justify-content-end">
                <div>{cat}</div>

                <div>
                  <Link
                    to="/guide"
                    className={`btn btn-link text-white opacity-75 px-0 p-0 mt-2 ${styles.btnIcon} ${styles.btnInCatTitle}`}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 16 16"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.5 2H9l-.35.15-.65.64-.65-.64L7 2H1.5l-.5.5v10l.5.5h5.29l.86.85h.7l.86-.85h5.29l.5-.5v-10l-.5-.5zm-7 10.32l-.18-.17L7 12H2V3h4.79l.74.74-.03 8.58zM14 12H9l-.35.15-.14.13V3.7l.7-.7H14v9zM6 5H3v1h3V5zm0 4H3v1h3V9zM3 7h3v1H3V7zm10-2h-3v1h3V5zm-3 2h3v1h-3V7zm0 2h3v1h-3V9z"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="row g-0 w-100">
              {category.subcategories.map((subcat: string, subcatIndex: number) => {
                const sortedItems: BaseItem[] = sortItems(
                  props.items.filter((item: BaseItem) => item.category === cat && item.subcategory === subcat)
                );

                return (
                  <Fragment key={`subcat_${subcat}`}>
                    {(() => {
                      switch (props.selectedViewMode) {
                        case ViewMode.Grid:
                          return (
                            <div
                              className={classNames(
                                'col-12 col-xl d-flex flex-column border border-3 border-white border-start-0',
                                { 'border-top-0': index !== 0 },
                                { 'border-bottom-0': (subcatIndex === 0 || isOverriden) && index === 0 },
                                { 'col-xl-12': subcatIndex === 0 || isOverriden }
                              )}
                            >
                              <div
                                className={`d-flex align-items-center text-white justify-content-center text-center px-2 w-100 fw-semibold ${styles.subcatTitle}`}
                                style={{ backgroundColor: colorsList[index] }}
                              >
                                <div className={styles.ellipsis}>{subcat}</div>
                                <div>
                                  <Link
                                    to="/guide"
                                    className={`btn btn-link text-white opacity-75 px-2 ${styles.btnIcon}`}
                                  >
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      strokeWidth="0"
                                      viewBox="0 0 16 16"
                                      height="1em"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.5 2H9l-.35.15-.65.64-.65-.64L7 2H1.5l-.5.5v10l.5.5h5.29l.86.85h.7l.86-.85h5.29l.5-.5v-10l-.5-.5zm-7 10.32l-.18-.17L7 12H2V3h4.79l.74.74-.03 8.58zM14 12H9l-.35.15-.14.13V3.7l.7-.7H14v9zM6 5H3v1h3V5zm0 4H3v1h3V9zM3 7h3v1H3V7zm10-2h-3v1h3V5zm-3 2h3v1h-3V7zm0 2h3v1h-3V9z"
                                      ></path>
                                    </svg>
                                  </Link>
                                </div>
                              </div>
                              <div className={`flex-grow-1 ${styles.itemsContainer}`}>
                                <div className={styles.items}>
                                  {sortedItems.map((item: BaseItem) => {
                                    return (
                                      <GridItem
                                        item={item}
                                        key={`item_${item.name}`}
                                        borderColor={colorsList[index]}
                                        onClick={props.onClickItem}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        case ViewMode.Card:
                          return (
                            <div
                              className={classNames(
                                'col-12 d-flex flex-column border border-3 border-white border-start-0',
                                { 'border-top-0': index !== 0 },
                                { 'border-bottom-0': subcatIndex === 0 && index === 0 }
                              )}
                            >
                              <div
                                className={`d-flex align-items-center text-white justify-content-center text-center fw-semibold px-2 w-100 ${styles.subcatTitle}`}
                                style={{ backgroundColor: colorsList[index] }}
                              >
                                <div className={styles.ellipsis}>{subcat}</div>
                                <div>
                                  <Link
                                    to="/guide"
                                    className={`btn btn-link text-white opacity-75 px-2 ${styles.btnIcon}`}
                                  >
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      strokeWidth="0"
                                      viewBox="0 0 16 16"
                                      height="1em"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.5 2H9l-.35.15-.65.64-.65-.64L7 2H1.5l-.5.5v10l.5.5h5.29l.86.85h.7l.86-.85h5.29l.5-.5v-10l-.5-.5zm-7 10.32l-.18-.17L7 12H2V3h4.79l.74.74-.03 8.58zM14 12H9l-.35.15-.14.13V3.7l.7-.7H14v9zM6 5H3v1h3V5zm0 4H3v1h3V9zM3 7h3v1H3V7zm10-2h-3v1h3V5zm-3 2h3v1h-3V7zm0 2h3v1h-3V9z"
                                      ></path>
                                    </svg>
                                  </Link>
                                </div>
                              </div>
                              <div className={`flex-grow-1 d-flex flex-wrap ${styles.itemsContainer}`}>
                                {sortedItems.map((item: BaseItem) => {
                                  return <OldCard item={item} key={`item_${item.name}`} onClick={props.onClickItem} />;
                                })}
                              </div>
                            </div>
                          );
                      }
                    })()}
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Content;