import Link from 'next/link';

function BlogArticle() {
  return (
    <>
      <div className="blog-title">
        <img
          className="profile-pic"
          src="/blank-profile-picture-973460_1280.webp"
          alt="profile"
        />
        <div>
          <p>
            Written by:{' '}
            <Link href="/author/howard-lorum-wu">Howard Lorum Wu</Link> on December 18, 2022
          </p>
          <h1 style={{ width: '100%' }}>What is WhoDo</h1>
          <img src="/sample-1.jpeg" alt="sample" style={{ maxWidth: '100%' }} />
          <h4>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            vel tortor pharetra diam porta rhoncus non id nibh. Aliquam vitae
            tortor tristique, accumsan ligula quis, fermentum leo. In non sapien
            non tortor blandit efficitur. In ligula justo, feugiat nec tellus
            sed, consectetur ultrices magna. In cursus, mauris et porta
            ultrices, libero nunc bibendum odio, eu facilisis enim turpis id
            lorem. Phasellus massa ipsum, hendrerit vitae metus quis, efficitur
            sodales purus. Etiam rutrum hendrerit ex, ut congue ex auctor non.
            Sed interdum orci dui, nec porttitor enim malesuada nec. Proin nibh
            orci, porta feugiat cursus a, fringilla a nisl. Fusce euismod
            consequat sapien, eu rutrum odio.
          </h4>
        </div>
      </div>
    </>
  );
}

export default function Blog() {
  return (
    <div style={{ overflowY: 'auto', maxHeight: '90vh' }}>
      <h1>WhoDo Blog</h1>
      <h3>All things WhoDo - Updates/News/Random Musings</h3>
      <br />
      <br />
      <div className="columnContainer">
        <div style={{ maxWidth: '1200px', display: 'flex' }}>
          <div className="column">
            <BlogArticle />
          </div>
          <div className="blog-links-column">
            <h3>New To WhoDo</h3>
            <div className="whodo-links">
              <ul>
                <li><a href="#">How To Get Set Up</a></li>
                <li><a href="#">Contributing to WhoDo</a></li>
                <li><a href="#">Microcontracting and WhoDo</a></li>
              </ul>
            </div>
            <div>
              <h3>Blog Posts</h3>
              <div className="whodo-links">
                <ul>
                  <li><a href="#">Our Philosophy On Mentorship and Giving Back</a></li>
                  <li><a href="#">"WhoDo" We Look To Mentor</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
