import React from 'react';
import styled from 'styled-components';
import { StoreItem, Loader } from '../components/common';
import { StoreItemOnHover, Categories, ScrollObserver, NoResultMessage } from '../components/main';
import { useFetchStores } from '../hooks';

const StoresContainer = styled.div`
  padding: 20px;
`;

const TopStoresContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RestStoresContainer = styled.div`
  margin-top: 20px;
  grid-gap: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const StoreItemContainer = styled.div`
  overflow: hidden;
  height: 350px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 30px;
  position: relative;
  transition: 0.1s ease-in-out;

  :hover {
    scale: 1.02;
  }

  :hover > main {
    transition: 0.1s ease-in-out;
    background-color: rgba(0, 0, 0, 0.8);

    div {
      display: flex;
    }

    img {
      display: block;
    }
  }
`;

let displayedStores = { topThree: [], remaining: [] };

const MainPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useFetchStores();

  if (!isLoading) {
    const searchedStores = data.pages.flat();

    const topThree = searchedStores.splice(0, 3);
    const remaining = searchedStores;

    displayedStores = { topThree, remaining };
  }

  return (
    <>
      <Categories />
      {isLoading ? <Loader /> : null}
      {!isLoading && displayedStores.topThree.length ? (
        <StoresContainer>
          <TopStoresContainer>
            {displayedStores.topThree.map(({ storeId, storeName, imgUrl, votesByCategory }) => (
              <StoreItemContainer key={storeId}>
                <StoreItemOnHover storeId={storeId} />
                <StoreItem key={storeId} storeName={storeName} imgUrl={imgUrl} votesByCategory={votesByCategory} />
              </StoreItemContainer>
            ))}
          </TopStoresContainer>
          <RestStoresContainer>
            {displayedStores.remaining.map(({ storeId, storeName, imgUrl, votesByCategory }) => (
              <StoreItemContainer key={`${Math.random() * Math.random()}_${storeId}`}>
                <StoreItemOnHover storeId={storeId} />
                <StoreItem storeName={storeName} imgUrl={imgUrl} votesByCategory={votesByCategory} />
              </StoreItemContainer>
            ))}
          </RestStoresContainer>
          {hasNextPage && <ScrollObserver fetchNextPage={fetchNextPage} />}
        </StoresContainer>
      ) : (
        <NoResultMessage />
      )}
    </>
  );
};

export default MainPage;
