import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { searchInputState } from '../../recoil/atoms';
import { fetchSearchedStores } from '../../api/stores';
import { useDebounce, useOnClickOutside } from '../../hooks';

const Container = styled.div`
  position: relative;
`;

const SearchForm = styled.form`
  position: relative;
  display: flex;
`;

const Bar = styled.input`
  width: ${({ width }) => width};
  height: 40px;
  border-radius: 20px;
  border: 1px solid var(--border);
  padding: 15px;
  background-color: var(--bg-color);
  color: var(--font-color);

  :focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  background-color: #d21312;
  position: relative;
  right: 35px;
  top: 5px;
  padding: 7px;
  height: 30px;
  width: 30px;
  border-radius: 30px;
  cursor: pointer;

  :focus {
    outline: none;
  }
`;

const SearchIcon = styled(AiOutlineArrowRight)`
  color: #fff;
`;

const Dropdown = styled.ul`
  list-style-type: none;
  padding: 5px;
  display: flex;
  width: 500px;
  max-height: 350px;
  flex-direction: column;
  position: absolute;
  top: 30px;
  border: 1px solid #ababab;
  border-radius: 15px;
  background-color: var(--bg-secondary-color);
  overflow-y: scroll;
`;

const DropdownResult = styled.li`
  padding: 10px;
  font-size: 18px;
  border-bottom: 0.5px solid #e8e8e8;

  :hover {
    color: var(--primary-color);
  }

  :focus {
    outline: 1px solid #e8e8e8;
    color: var(--primary-color);
  }
`;

const SearchBar = ({
  hasDropdown,
  inputRef,
  width = '500px',
  submitHandler = null,
  placeholder = '맛집을 검색해보세요!',
  defaultValue = '',
}) => {
  const [dropdownStores, setDropdownStores] = React.useState([]);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const dropdownRef = useOnClickOutside(() => setOpenDropdown(false));
  const setSearchInput = useSetRecoilState(searchInputState);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSearchSubmit = async () => {
    const userSearch = inputRef.current.value.trim();

    if (!userSearch) return;

    setSearchInput(userSearch);
    if (pathname !== '/') navigate('/');

    setOpenDropdown(false);
  };

  const handleSearchChange = async e => {
    const userSearch = e.target.value.trim();

    if (!userSearch) {
      setOpenDropdown(false);
      setSearchInput(null);

      return;
    }

    const fetched = await fetchSearchedStores(userSearch);

    setOpenDropdown(true);
    setDropdownStores(fetched);
  };

  const debouncedSearchHandler = useDebounce(handleSearchChange, 330);

  const handleRefocus = e => {
    if (e.target.value.trim()) {
      debouncedSearchHandler(e);
    }
  };

  const alterFocus = (e, storeId) => {
    e.preventDefault();

    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Tab' && e.key !== 'Enter') return;

    if (e.key === 'Enter') {
      navigate(`/store/${storeId}`);

      setOpenDropdown(false);
    }

    if (e.key === 'ArrowUp') {
      if (document.activeElement.previousElementSibling) document.activeElement.previousElementSibling.focus();
      else document.activeElement.parentElement.lastElementChild.focus();
    }

    if (e.key === 'ArrowDown' || e.key === 'Tab') {
      if (document.activeElement.nextElementSibling) document.activeElement.nextElementSibling.focus();
      else document.activeElement.parentElement.firstElementChild.focus();
    }
  };

  return (
    <Container>
      <SearchForm
        onSubmit={e => {
          e.preventDefault();

          if (submitHandler) submitHandler();
          else handleSearchSubmit();
        }}>
        <Bar
          width={width}
          placeholder={placeholder}
          ref={inputRef}
          defaultValue={defaultValue}
          onChange={debouncedSearchHandler}
          onFocus={handleRefocus}
        />
        <SearchButton>
          <SearchIcon />
        </SearchButton>
      </SearchForm>
      {hasDropdown && openDropdown && (
        <Dropdown ref={dropdownRef}>
          {dropdownStores.map(({ storeName, storeId }) => (
            <DropdownResult key={storeName} tabIndex="0" onKeyDown={e => alterFocus(e, storeId)}>
              <Link to={`/store/${storeId}`}>
                <div>{storeName}</div>
              </Link>
            </DropdownResult>
          ))}
        </Dropdown>
      )}
    </Container>
  );
};

export default SearchBar;
