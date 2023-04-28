import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/atoms';

const Container = styled.footer`
  bottom: 0;
  width: 100%;
  height: 4rem;
  margin-top: 50px;
  padding: 0.5rem;
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-secondary-color);
  box-shadow: 0px -0.1rem 4px rgba(0, 0, 0, 0.08);
`;

const Copyright = styled.p`
  font-size: 12px;
  margin: 0;
`;

const GithubLink = styled.img`
  width: 25px;
  ${({ theme }) => theme === 'dark' && 'filter: invert(100%) brightness(120%)'};
`;

const Footer = () => {
  const theme = useRecoilValue(themeState);

  return (
    <Container>
      <a href="https://github.com/Team-Hoisting/mychelin-guide-frontend" target="_blank" rel="noreferrer noreopener">
        <GithubLink src="/images/github-logo.svg" alt="Github" theme={theme} />
      </a>
      <Copyright>Copyright © 2023 Team Hoisting All Rights Reserved</Copyright>
    </Container>
  );
};

export default Footer;
