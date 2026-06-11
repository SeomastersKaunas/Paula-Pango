// LT homepage — reuses main Home component; locale detected from /lt/ path via useLocalePath
export { default } from '../index';

export async function getServerSideProps() {
  return { props: {} };
}
