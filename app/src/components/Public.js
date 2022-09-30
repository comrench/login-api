import { Link } from 'react-router-dom';

const Public = () => {
  const content = (
    <section className='public'>
      <header>
        <h1>
          Welcome to <span className='nowrap'>Simple Tracking App</span>
        </h1>
      </header>
      <main className='public__main'>
        <p>
          Located in Beautiful Downtown Foo City, Simple Tracking App provides a
          trained staff ready to meet your body needs
        </p>
        <address className='public__addr'>
          Simple Tracking App <br />
          555 Foo Drive <br />
          Foo City, CA 12345 <br />
          <a href='tel:+9999999999'>(555) 555=5555</a>
        </address>
        <br />
        <p>Owner: Foo Bar</p>
      </main>
      <footer>
        <Link to='/login'>Employee Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
