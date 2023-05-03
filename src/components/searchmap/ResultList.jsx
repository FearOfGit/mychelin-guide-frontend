import React from 'react';
import styled from 'styled-components';

import { useQuery } from '@tanstack/react-query';
import { ResultItem, ResultItemOnHover } from '.';

import { fetchIsRegisteredByStoreIds } from '../../api/stores';
import { Loader } from '../common';

const List = styled.ul`
  margin: auto;
  padding: 5px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ResultItemContainer = styled.li`
  position: relative;
  width: 100%;
  overflow: hidden;
  transition: 0.2s ease-in-out;

  ${props =>
    props.selected &&
    `
      border-bottom: 1px solid var(--primary-color);
      scale: 1.02;
    `}

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

const ZeroResultText = styled.span`
  color: white;
  font-size: 20px;
`;

const ResultList = ({ keyword, result, curPage, drawMarkers, clickedIdx }) => {
  const { data: resultList, isLoading } = useQuery({
    queryKey: ['isRegistered', keyword, curPage],
    queryFn: fetchIsRegisteredByStoreIds(result.map(({ id }) => id)),
    select(data) {
      return result.map((store, idx) => ({ store, isRegistered: data[idx] }));
    },
  });

  if (isLoading) return <Loader />;

  drawMarkers(resultList);

  return (
    <List>
      {resultList?.length !== 0 ? (
        resultList?.map(({ store, isRegistered }, idx) => (
          <ResultItemContainer key={store.id} selected={clickedIdx === idx}>
            <ResultItemOnHover
              storeId={store.id}
              storeName={store.place_name}
              isRegistered={isRegistered}
              address={store.road_address_name}
              phoneNumber={store.phone}
              x={store.x}
              y={store.y}
            />
            <ResultItem
              key={store.id}
              currentIdx={String.fromCharCode(idx + 65)}
              storeName={store.place_name}
              address={store.road_address_name}
              phoneNumber={store.phone}
            />
          </ResultItemContainer>
        ))
      ) : (
        <ZeroResultText>검색 결과가 없습니다.</ZeroResultText>
      )}
    </List>
  );
};

export default ResultList;
