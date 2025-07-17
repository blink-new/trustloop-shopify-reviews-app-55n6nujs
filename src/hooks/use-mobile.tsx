import { useMediaQuery } from 'react-responsive';

export function useMobile() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return isMobile;
}